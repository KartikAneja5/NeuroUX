/**
 * cart.test.js — Integration tests for NeuroUX cart endpoints.
 * Cart routes: GET /api/cart, POST /api/cart (add), PUT /api/cart (update)
 */
const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'neuroux-test-secret-key';
process.env.NODE_ENV = 'test';

const customerToken = jwt.sign(
  { id: 'mock-customer-id', role: 'customer' },
  'neuroux-test-secret-key',
  { expiresIn: '1h' }
);

// Mock declarations must be before any variable references used inside jest.mock factories
jest.mock('../src/models/Cart', () => {
  const MockCart = jest.fn().mockImplementation(() => ({
    userId: 'mock-customer-id',
    items: [],
    save: jest.fn().mockResolvedValue(true),
    populate: jest.fn().mockResolvedValue({ userId: 'mock-customer-id', items: [] }),
  }));
  MockCart.findOne = jest.fn();
  return MockCart;
});

jest.mock('../src/models/Product', () => ({
  findOne: jest.fn(),
}));

const Cart = require('../src/models/Cart');
const Product = require('../src/models/Product');

const mockProduct = {
  _id: 'mock-product-id-001',
  name: 'Neon Button',
  category: 'Basic UI',
  price: 299,
  isActive: true,
};

const populatedCartResult = {
  userId: 'mock-customer-id',
  items: [{ productId: mockProduct, quantity: 1 }],
};

describe('GET /api/cart', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return cart for authenticated user', async () => {
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(populatedCartResult),
    });

    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/cart (add to cart)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should add a product to cart and return 200', async () => {
    Product.findOne.mockResolvedValue(mockProduct);
    Cart.findOne.mockResolvedValue({
      userId: 'mock-customer-id',
      items: [],
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue(populatedCartResult),
    });

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'mock-product-id-001', quantity: 1 });

    expect(res.statusCode).toBe(200);
  });

  it('should return 400 when productId is missing', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/product id is required/i);
  });

  it('should return 404 when product does not exist in DB', async () => {
    Product.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'nonexistent-id' });

    expect(res.statusCode).toBe(404);
  });
});
