/**
 * checkout.test.js — Integration tests for NeuroUX checkout endpoint.
 * Tests POST /api/orders/checkout - the controller uses Cart.findOne().populate()
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

const mockProduct = {
  _id: 'mock-product-id-001',
  name: 'Neon Button',
  category: 'Basic UI',
  price: 299,
  isActive: true,
};

const mockSavedOrder = {
  _id: 'mock-order-id-001',
  userId: 'mock-customer-id',
  items: [{ productId: 'mock-product-id-001', name: 'Neon Button', price: 299, quantity: 1 }],
  totalAmount: 299,
  abVariant: 'variant_A',
  status: 'completed',
  toJSON: () => ({ _id: 'mock-order-id-001', status: 'completed', totalAmount: 299 }),
};

jest.mock('../src/models/Cart', () => {
  const MockCart = jest.fn();
  MockCart.findOne = jest.fn();
  return MockCart;
});

jest.mock('../src/models/Order', () => {
  const MockOrder = jest.fn().mockImplementation(() => ({
    ...mockSavedOrder,
    save: jest.fn().mockResolvedValue(mockSavedOrder),
  }));
  return MockOrder;
});

jest.mock('../src/models/Interaction', () => {
  const MockInteraction = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
  }));
  return MockInteraction;
});

jest.mock('../src/models/Product', () => ({
  findOne: jest.fn(),
}));

const Cart = require('../src/models/Cart');

describe('POST /api/orders/checkout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .send({ abVariant: 'variant_A' });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 when cart is null (cart not found)', async () => {
    // Cart.findOne().populate() returns null
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ abVariant: 'variant_A' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/empty/i);
  });

  it('should return 400 when cart has no items', async () => {
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        userId: 'mock-customer-id',
        items: [],
        save: jest.fn(),
      }),
    });

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ abVariant: 'variant_A' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/empty/i);
  });

  it('should complete checkout successfully with populated cart', async () => {
    const populatedCart = {
      userId: 'mock-customer-id',
      items: [{ productId: mockProduct, quantity: 1 }],
      save: jest.fn().mockResolvedValue(true),
    };

    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(populatedCart),
    });

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ abVariant: 'variant_A' });

    expect(res.statusCode).toBe(201);
  });
});
