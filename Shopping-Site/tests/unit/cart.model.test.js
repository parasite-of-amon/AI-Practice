jest.mock('../../src/db/database', () => ({
  query: jest.fn(),
  execute: jest.fn(),
  initDB: jest.fn(),
}));

const db = require('../../src/db/database');
const { getCart, addItem, updateQty, removeItem, clearCart } = require('../../src/models/cart');

const SESSION = 'test-session-abc';

beforeEach(() => jest.clearAllMocks());

describe('cart.getCart', () => {
  it('queries cart items with JOIN for the given session', async () => {
    db.query.mockResolvedValue([]);
    await getCart(SESSION);
    const [sql, sid] = db.query.mock.calls[0];
    expect(sql).toMatch(/JOIN products/i);
    expect(sid).toBe(SESSION);
  });

  it('selects price, brand, category, and is_sale fields from products', async () => {
    db.query.mockResolvedValue([]);
    await getCart(SESSION);
    const [sql] = db.query.mock.calls[0];
    expect(sql).toMatch(/p\.price/);
    expect(sql).toMatch(/p\.brand/);
    expect(sql).toMatch(/p\.category/);
    expect(sql).toMatch(/p\.is_sale/);
  });
});

describe('cart.addItem', () => {
  it('updates quantity when item already in cart', async () => {
    const existingItem = { id: 10, session_id: SESSION, product_id: 1, quantity: 2 };
    db.query
      .mockResolvedValueOnce([existingItem]) // getItem
      .mockResolvedValueOnce([]);             // getCart
    db.execute.mockResolvedValue();

    await addItem(SESSION, 1, 1);
    const [updateSql] = db.execute.mock.calls[0];
    expect(updateSql).toMatch(/UPDATE cart_items SET quantity = quantity \+/i);
  });

  it('inserts new row when item not in cart', async () => {
    db.query
      .mockResolvedValueOnce([])  // getItem returns nothing
      .mockResolvedValueOnce([]); // getCart
    db.execute.mockResolvedValue();

    await addItem(SESSION, 5, 1);
    const [insertSql] = db.execute.mock.calls[0];
    expect(insertSql).toMatch(/INSERT INTO cart_items/i);
  });
});

describe('cart.updateQty', () => {
  it('deletes item when quantity <= 0', async () => {
    db.execute.mockResolvedValue();
    db.query.mockResolvedValue([]);
    await updateQty(SESSION, 10, 0);
    const [sql] = db.execute.mock.calls[0];
    expect(sql).toMatch(/DELETE FROM cart_items/i);
  });

  it('updates quantity when qty > 0', async () => {
    db.execute.mockResolvedValue();
    db.query.mockResolvedValue([]);
    await updateQty(SESSION, 10, 3);
    const [sql] = db.execute.mock.calls[0];
    expect(sql).toMatch(/UPDATE cart_items SET quantity/i);
  });
});

describe('cart.removeItem', () => {
  it('deletes the item and returns updated cart', async () => {
    db.execute.mockResolvedValue();
    db.query.mockResolvedValue([]);
    const result = await removeItem(SESSION, 10);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});

describe('cart.clearCart', () => {
  it('deletes all items for the session', async () => {
    db.execute.mockResolvedValue();
    await clearCart(SESSION);
    const [sql, sid] = db.execute.mock.calls[0];
    expect(sql).toMatch(/DELETE FROM cart_items WHERE session_id/i);
    expect(sid).toBe(SESSION);
  });
});
