/**
 * auth.test.js — Integration tests for NeuroUX auth endpoints.
 * Uses supertest against the Express app with mocked Mongoose/bcrypt.
 * These tests verify the happy path and key error paths without hitting real MongoDB.
 */
const request = require('supertest');
const app = require('../src/app');

// --- Mock mongoose models so no real DB connection is needed ---
jest.mock('../src/models/User', () => {
  const mockUser = {
    _id: 'mock-user-id-123',
    name: 'Test User',
    email: 'test@neuroux.com',
    passwordHash: '$2a$10$hashedpwdmock',
    role: 'customer',
    isVerified: true,
    verificationToken: undefined,
    save: jest.fn().mockResolvedValue(true),
  };

  const MockUser = jest.fn().mockImplementation((data) => ({
    ...mockUser,
    ...data,
    save: jest.fn().mockResolvedValue(true),
  }));

  MockUser.findOne = jest.fn();
  return MockUser;
});

jest.mock('../src/services/emailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  sendVerificationEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  sendResetPasswordEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
}));


jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$hashedpwdmock'),
  compare: jest.fn(),
}));

const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

// Set JWT_SECRET for test environment
process.env.JWT_SECRET = 'neuroux-test-secret-key';
process.env.NODE_ENV = 'test';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne.mockResolvedValue(null); // no existing user by default
  });

  it('should register a new user and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@neuroux.com', password: 'Password123!' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registration successful/i);
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@neuroux.com' }); // simulate existing user

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@neuroux.com', password: 'Password123!' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@neuroux.com' }); // missing name and password

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  const mockUser = {
    _id: 'mock-user-id-123',
    name: 'Test User',
    email: 'test@neuroux.com',
    passwordHash: '$2a$10$hashedpwdmock',
    role: 'customer',
    isVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with correct credentials', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@neuroux.com', password: 'Password123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@neuroux.com');
    expect(res.body.user.role).toBe('customer');
  });

  it('should return 400 with wrong password', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@neuroux.com', password: 'WrongPassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });


  it('should return 400 if user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@nowhere.com', password: 'Password123!' });

    expect(res.statusCode).toBe(400);
  });
});
