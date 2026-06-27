const { query } = require('../db/database');

async function findAll({ search = '', category = '', sort = 'featured' } = {}) {
  const conditions = [];
  const args = [];

  if (search) {
    conditions.push(`(LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(tags) LIKE ?)`);
    const like = `%${search.toLowerCase()}%`;
    args.push(like, like, like);
  }
  if (category && category !== 'all') {
    conditions.push(`category = ?`);
    args.push(category);
  }

  let sql = 'SELECT * FROM products';
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');

  const orderMap = {
    featured:   'is_new DESC, created_at DESC',
    'price-asc':  'COALESCE(sale_price, price) ASC',
    'price-desc': 'COALESCE(sale_price, price) DESC',
    newest:     'created_at DESC',
  };
  sql += ` ORDER BY ${orderMap[sort] || orderMap.featured}`;

  return query(sql, ...args);
}

async function findById(id) {
  const rows = await query('SELECT * FROM products WHERE id = ?', id);
  return rows[0] || null;
}

module.exports = { findAll, findById };
