jest.mock('../../src/models/cart', () => ({
  getCart: jest.fn(),
  addItem: jest.fn(),
  updateQty: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
}));
jest.mock('../../src/db/database', () => ({
  query: jest.fn(), execute: jest.fn(), initDB: jest.fn(),
}));

const request = require('supertest');
const app     = require('../../src/app');
const cart    = require('../../src/models/cart');

const SID = 'test-session-xyz';
const MOCK_CART = [{ id: 1, product_id: 3, quantity: 2, name: 'Jeans', price: 59.99 }];

beforeEach(() => jest.clearAllMocks());

describe('GET /api/cart', () => {
  it('returns 400 without X-Session-ID header', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/session/i);
  });

  it('returns 200 with cart items', async () => {
    cart.getCart.mockResolvedValue(MOCK_CART);
    const res = await request(app).get('/api/cart').set('X-Session-ID', SID);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(MOCK_CART);
    expect(cart.getCart).toHaveBeenCalledWith(SID);
  });
});

describe('POST /api/cart', () => {
  it('returns 422 without product_id', async () => {
    const res = await request(app)
      .post('/api/cart').set('X-Session-ID', SID).send({});
    expect(res.status).toBe(422);
  });

  it('returns 201 on successful add', async () => {
    cart.addItem.mockResolvedValue(MOCK_CART);
    const res = await request(app)
      .post('/api/cart').set('X-Session-ID', SID).send({ product_id: 3, quantity: 1 });
    expect(res.status).toBe(201);
    expect(cart.addItem).toHaveBeenCalledWith(SID, 3, 1);
  });
});

describe('PUT /api/cart/:itemId', () => {
  it('returns 422 without quantity', async () => {
    const res = await request(app)
      .put('/api/cart/1').set('X-Session-ID', SID).send({});
    expect(res.status).toBe(422);
  });

  it('returns 200 on successful update', async () => {
    cart.updateQty.mockResolvedValue(MOCK_CART);
    const res = await request(app)
      .put('/api/cart/1').set('X-Session-ID', SID).send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(cart.updateQty).toHaveBeenCalledWith(SID, 1, 3);
  });
});

describe('DELETE /api/cart/:itemId', () => {
  it('returns 200 and updated cart', async () => {
    cart.removeItem.mockResolvedValue([]);
    const res = await request(app)
      .delete('/api/cart/1').set('X-Session-ID', SID);
    expect(res.status).toBe(200);
    expect(cart.removeItem).toHaveBeenCalledWith(SID, 1);
  });
});

describe('DELETE /api/cart', () => {
  it('clears entire cart', async () => {
    cart.clearCart.mockResolvedValue();
    const res = await request(app)
      .delete('/api/cart').set('X-Session-ID', SID);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns 400 without X-Session-ID on clear', async () => {
    const res = await request(app).delete('/api/cart');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/session/i);
  });
});

describe('POST /api/cart quantity default', () => {
  it('defaults quantity to 1 when not provided', async () => {
    cart.addItem.mockResolvedValue(MOCK_CART);
    const res = await request(app)
      .post('/api/cart').set('X-Session-ID', SID).send({ product_id: 5 });
    expect(res.status).toBe(201);
    expect(cart.addItem).toHaveBeenCalledWith(SID, 5, 1);
  });
});
