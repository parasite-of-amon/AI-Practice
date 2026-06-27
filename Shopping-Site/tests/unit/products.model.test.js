jest.mock('../../src/db/database', () => ({
  query: jest.fn(),
  execute: jest.fn(),
  initDB: jest.fn(),
}));

const db = require('../../src/db/database');
const { findAll, findById } = require('../../src/models/products');

beforeEach(() => jest.clearAllMocks());

describe('products.findAll', () => {
  it('returns all products with no filters', async () => {
    const mockProducts = [{ id: 1, name: 'Floral Dress', category: 'womens' }];
    db.query.mockResolvedValue(mockProducts);

    const result = await findAll();
    expect(result).toEqual(mockProducts);
    expect(db.query).toHaveBeenCalledTimes(1);
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/SELECT \* FROM products/i);
    expect(sql).toMatch(/ORDER BY/i);
  });

  it('adds WHERE clause when search is provided', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ search: 'dress' });
    const [sql, ...args] = db.query.mock.calls[0];
    expect(sql).toMatch(/WHERE/i);
    expect(args).toEqual(expect.arrayContaining(['%dress%']));
  });

  it('filters by category', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ category: 'womens' });
    const [sql, ...args] = db.query.mock.calls[0];
    expect(sql).toMatch(/WHERE/i);
    expect(args).toContain('womens');
  });

  it('uses price-asc ORDER BY when sort=price-asc', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ sort: 'price-asc' });
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/ASC/i);
  });

  it('uses price-desc ORDER BY when sort=price-desc', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ sort: 'price-desc' });
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/DESC/i);
  });

  it('combines search + category filters', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ search: 'polo', category: 'mens' });
    const [sql, ...args] = db.query.mock.calls[0];
    expect(sql).toMatch(/WHERE/i);
    expect(sql).toMatch(/AND/i);
    expect(args).toContain('mens');
    expect(args).toContain('%polo%');
  });

  it('uses newest ORDER BY when sort=newest', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ sort: 'newest' });
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/created_at DESC/i);
  });

  it('falls back to featured order for unknown sort values', async () => {
    db.query.mockResolvedValue([]);
    await findAll({ sort: 'unknown-sort' });
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/is_new DESC/i);
  });
});

describe('products.findById', () => {
  it('returns the product when found', async () => {
    const mock = { id: 7, name: 'Oxford Shirt', brand: 'Brooks Brothers' };
    db.query.mockResolvedValue([mock]);
    const result = await findById(7);
    expect(result).toEqual(mock);
    expect(db.query.mock.calls[0][0]).toMatch(/WHERE id = \?/i);
  });

  it('returns null when product not found', async () => {
    db.query.mockResolvedValue([]);
    const result = await findById(999);
    expect(result).toBeNull();
  });
});
