import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authController } from '../src/controllers/authController';
import User from '../src/models/User';
import jwt from '../src/utils/jwt';

vi.mock('../src/models/User');
vi.mock('../src/utils/jwt');

describe('Auth Controller - Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const mockUser = { email: 'test@example.com', password: 'Password123!' };
    User.findOne.mockResolvedValue(null);
    User.prototype.save = vi.fn().mockResolvedValue({ ...mockUser, _id: '123' });

    const req = { body: mockUser };
    const res = { 
      status: vi.fn().mockReturnThis(), 
      json: vi.fn() 
    };

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User registered successfully' }));
  });

  it('should return error if email already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' });
    
    const req = { body: { email: 'test@example.com', password: 'Password123!' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'An account with this email already exists.' }));
  });
});

describe('Auth Controller - Login', () => {
  it('should deny access for invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: 'wrong@example.com', password: 'WrongPassword1' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid email or password' }));
  });
});
