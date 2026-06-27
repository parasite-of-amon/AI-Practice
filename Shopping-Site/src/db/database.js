const path = require('path');
const fs = require('fs');
const duckdb = require('duckdb');

const isTest = process.env.NODE_ENV === 'test';
const DB_PATH = isTest
  ? ':memory:'
  : path.join(__dirname, '../../data/app.duckdb');

if (!isTest) {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

let _db = null;
let _conn = null;

function getConn() {
  if (!_db) {
    _db = new duckdb.Database(DB_PATH);
    _conn = _db.connect();
  }
  return _conn;
}

function query(sql, ...args) {
  return new Promise((resolve, reject) => {
    getConn().all(sql, ...args, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function execute(sql, ...args) {
  return new Promise((resolve, reject) => {
    getConn().run(sql, ...args, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

function execScript(sql) {
  if (!_db) getConn();
  return new Promise((resolve, reject) => {
    _db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function initDB() {
  getConn();

  await execScript(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY,
      name        VARCHAR NOT NULL,
      description VARCHAR DEFAULT '',
      price       DOUBLE  NOT NULL,
      category    VARCHAR DEFAULT 'general',
      brand       VARCHAR DEFAULT '',
      color       VARCHAR DEFAULT '',
      size_range  VARCHAR DEFAULT '',
      stock       INTEGER DEFAULT 100,
      is_new      BOOLEAN DEFAULT true,
      is_sale     BOOLEAN DEFAULT false,
      sale_price  DOUBLE,
      tags        VARCHAR DEFAULT '',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      id          INTEGER PRIMARY KEY,
      session_id  VARCHAR NOT NULL,
      product_id  INTEGER NOT NULL,
      quantity    INTEGER DEFAULT 1,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE SEQUENCE IF NOT EXISTS cart_seq START 1;
  `);

  const rows = await query('SELECT COUNT(*) AS cnt FROM products');
  if (Number(rows[0].cnt) === 0) await seedProducts();
}

async function seedProducts() {
  const products = [
    [1,  'Floral Wrap Dress',        'Elegant floral-print wrap dress with a tie waist',       89.99,  'womens',      'Calvin Klein',    'Floral Multi', 'XS–XL', 45,  1, 0, null, 'dress,floral,summer,wrap'],
    [2,  'Slim-Fit Blazer',          'Tailored single-button blazer in stretch fabric',         129.99, 'womens',      'Tommy Hilfiger',  'Navy',         'XS–XL', 30,  1, 0, null, 'blazer,jacket,formal,office'],
    [3,  'High-Rise Skinny Jeans',   'Five-pocket high-rise jeans in power-stretch denim',      59.99,  'womens',      "Levi's",          'Indigo',       '24–32', 80,  0, 0, null, 'jeans,denim,pants,casual'],
    [4,  'Cashmere V-Neck Sweater',  '100% pure cashmere ribbed-trim sweater',                  149.99, 'womens',      'Ralph Lauren',    'Ivory',        'XS–XL', 25,  0, 0, null, 'sweater,cashmere,knit,luxury'],
    [5,  'A-Line Midi Skirt',        'Pleated A-line midi skirt with elastic waistband',        79.99,  'womens',      'DKNY',            'Black',        'XS–XL', 60,  1, 0, null, 'skirt,midi,pleated,chic'],
    [6,  'Wide-Leg Trousers',        'High-waist pleated wide-leg trousers in crepe fabric',    94.99,  'womens',      'Anne Klein',      'Camel',        'XS–XL', 40,  1, 0, null, 'trousers,wide-leg,office,elegant'],
    [7,  'Classic Oxford Shirt',     'Non-iron pinpoint oxford button-down shirt',              89.99,  'mens',        'Brooks Brothers', 'White',        'S–XXL', 70,  0, 0, null, 'shirt,oxford,formal,work'],
    [8,  'Slim Chino Pants',         'Stretch slim-fit chino pants with 5-pocket styling',      49.99,  'mens',        'Dockers',         'Khaki',        '28–40', 90,  0, 1, 34.99,'chinos,pants,casual,sale'],
    [9,  'Wool Blend Overcoat',      'Double-faced wool blend overcoat with notch lapel',       249.99, 'mens',        'Calvin Klein',    'Charcoal',     'S–XXL', 20,  1, 0, null, 'coat,wool,overcoat,winter,outerwear'],
    [10, 'Piqué Polo Shirt',         'Classic fit piqué polo with embroidered logo',            79.99,  'mens',        'Ralph Lauren',    'Navy',         'S–XXL', 65,  0, 0, null, 'polo,shirt,casual,preppy'],
    [11, 'Athletic Jogger Pants',    'Tapered jogger pants with moisture-wicking fabric',       54.99,  'mens',        'Under Armour',    'Grey',         'S–XXL', 55,  0, 0, null, 'jogger,athletic,sport,gym'],
    [12, 'Stretch Denim Jacket',     'Classic trucker jacket in stretch denim with flex seams', 99.99,  'mens',        "Levi's",          'Medium Blue',  'S–XXL', 35,  1, 0, null, 'jacket,denim,casual,trucker'],
    [13, 'Chelsea Ankle Boots',      'Pull-on chelsea boots in burnished leather',              129.99, 'shoes',       'Steve Madden',    'Black',        '6–11',  30,  1, 0, null, 'boots,chelsea,ankle,leather'],
    [14, 'Air-Cushion Sneakers',     'Lightweight running sneakers with responsive cushioning', 109.99, 'shoes',       'Nike',            'White/Blue',   '5–14',  50,  1, 0, null, 'sneakers,running,sport,athletic'],
    [15, 'Strappy Block Heels',      'Open-toe strappy sandal with stable block heel',          89.99,  'shoes',       'Nine West',       'Nude',         '6–10',  40,  0, 1, 59.99,'heels,strappy,sandal,sale'],
    [16, 'Leather Penny Loafers',    'Hand-stitched leather penny loafers with leather lining', 149.99, 'shoes',       'Cole Haan',       'Cognac',       '7–13',  25,  0, 0, null, 'loafers,leather,classic,dress'],
    [17, 'Stan Smith Sneakers',      'Iconic low-top sneakers with perforated 3-Stripes',       79.99,  'shoes',       'Adidas',          'White/Green',  '5–13',  75,  0, 0, null, 'sneakers,canvas,casual,iconic'],
    [18, 'Pointed-Toe Pumps',        'Stiletto-heel pointed-toe pumps in patent leather',       84.99,  'shoes',       'Sam Edelman',     'Red',          '6–10',  35,  1, 0, null, 'pumps,heels,pointed,patent'],
    [19, 'Pebbled Leather Tote',     'Spacious tote in signature pebbled leather with zip top', 298.00, 'accessories', 'Coach',           'Saddle',       'One Size',15, 1, 0, null, 'tote,leather,bag,handbag,luxury'],
    [20, 'Printed Silk Scarf',       '100% silk twill scarf with hand-rolled edges',            68.00,  'accessories', 'Kate Spade',      'Multi',        'One Size',50, 0, 0, null, 'scarf,silk,accessory,gift'],
    [21, 'Classic Aviator Shades',   'Metal aviator sunglasses with UV400 polarized lenses',    154.00, 'accessories', 'Ray-Ban',         'Gold/Green',   'One Size',40, 0, 0, null, 'sunglasses,aviator,eyewear,polarized'],
    [22, 'Braided Leather Belt',     'Braided leather belt with antique brass buckle',           45.00,  'accessories', 'Tommy Hilfiger',  'Brown',        'S–XL',  60,  0, 1, 32.00,'belt,leather,braided,sale'],
    [23, 'Gold Hoop Earrings',       'Polished 18K gold-plated hoop earrings, 1.5" diameter',   38.00,  'accessories', 'Vince Camuto',    'Gold',         'One Size',70, 1, 0, null, 'earrings,gold,jewelry,hoops'],
    [24, 'Canvas Weekender Bag',     'Durable canvas travel bag with leather trim and feet',    89.99,  'accessories', 'Herschel',        'Navy',         'One Size',30, 0, 0, null, 'bag,canvas,travel,weekend,luggage'],
  ];

  for (const p of products) {
    await execute(
      `INSERT INTO products (id, name, description, price, category, brand, color, size_range, stock, is_new, is_sale, sale_price, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ...p
    );
  }
}

module.exports = { query, execute, initDB };
