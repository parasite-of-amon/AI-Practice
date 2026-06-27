jest.mock('../../src/models/products', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../../src/db/database', () => ({
  query: jest.fn(), execute: jest.fn(), initDB: jest.fn(),
}));

const request = require('supertest');
const app     = require('../../src/app');
const products = require('../../src/models/products');

const MOCK_PRODUCTS = [
  { id: 1, name: 'Floral Wrap Dress', brand: 'Calvin Klein', price: 89.99, category: 'womens' },
  { id: 7, name: 'Classic Oxford Shirt', brand: 'Brooks Brothers', price: 89.99, category: 'mens' },
];

beforeEach(() => jest.clearAllMocks());

describe('GET /api/products', () => {
  it('returns 200 with product array', async () => {
    products.findAll.mockResolvedValue(MOCK_PRODUCTS);
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.error).toBeNull();
  });

  it('passes search param to model', async () => {
    products.findAll.mockResolvedValue([MOCK_PRODUCTS[0]]);
    const res = await request(app).get('/api/products?search=dress');
    expect(res.status).toBe(200);
    expect(products.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'dress' })
    );
  });

  it('passes category param to model', async () => {
    products.findAll.mockResolvedValue([MOCK_PRODUCTS[1]]);
    await request(app).get('/api/products?category=mens');
    expect(products.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'mens' })
    );
  });

  it('passes sort param to model', async () => {
    products.findAll.mockResolvedValue(MOCK_PRODUCTS);
    await request(app).get('/api/products?sort=price-asc');
    expect(products.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'price-asc' })
    );
  });
});

describe('GET /api/products/:id', () => {
  it('returns 200 when product found', async () => {
    products.findById.mockResolvedValue(MOCK_PRODUCTS[0]);
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('returns 404 when product not found', async () => {
    products.findById.mockResolvedValue(null);
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
