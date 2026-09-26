import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserController from '../Controllers/User';
import UserService from '../Services/User';

vi.mock('../Services/User');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('UserController Unit Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    describe('register', () => {
        it('should return 400 if required fields are missing', async () => {
            mockReq = { body: { name: 'Alice', email: '' } };

            await UserController.register(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'name, email and password required' });
        });

        it('should return 409 if email is already registered', async () => {
            mockReq = { body: { name: 'Alice', email: 'alice@example.com', password: 'password123' } };
            vi.mocked(UserService.get).mockResolvedValue([{ _id: '1', email: 'alice@example.com' }] as any);

            await UserController.register(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already registered' });
        });

        it('should hash password and create user returning 201', async () => {
            mockReq = { body: { name: 'Alice', email: 'alice@example.com', password: 'password123' } };
            vi.mocked(UserService.get).mockResolvedValue([] as any);
            vi.mocked(bcrypt.hash).mockResolvedValue('hashed_pwd' as never);
            vi.mocked(UserService.add).mockResolvedValue({ _id: '123', name: 'Alice', email: 'alice@example.com' } as any);

            await UserController.register(mockReq as Request, mockRes as Response);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(UserService.add).toHaveBeenCalledWith({
                name: 'Alice',
                email: 'alice@example.com',
                password: 'hashed_pwd',
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User Created Successfully' });
        });

        it('should return 500 when service throws an error', async () => {
            mockReq = { body: { name: 'Alice', email: 'alice@example.com', password: 'password123' } };
            vi.mocked(UserService.get).mockRejectedValue(new Error('DB failure'));

            await UserController.register(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to register the user' });
        });
    });

    describe('login', () => {
        it('should return 400 when email or password is missing', async () => {
            mockReq = { body: { email: 'alice@example.com' } };

            await UserController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email and Password required' });
        });

        it('should return 401 if email is not found', async () => {
            mockReq = { body: { email: 'unknown@example.com', password: 'password123' } };
            vi.mocked(UserService.get).mockResolvedValue([] as any);

            await UserController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email Not Registered' });
        });

        it('should return 401 if password does not match', async () => {
            mockReq = { body: { email: 'alice@example.com', password: 'wrongpassword' } };
            vi.mocked(UserService.get).mockResolvedValue([
                { _id: '123', name: 'Alice', email: 'alice@example.com', password: 'hashed_pwd' },
            ] as any);
            vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

            await UserController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password is Invalid' });
        });

        it('should return 200 with user data and JWT token on valid credentials', async () => {
            mockReq = { body: { email: 'alice@example.com', password: 'correctpassword' } };
            vi.mocked(UserService.get).mockResolvedValue([
                { _id: '123', name: 'Alice', email: 'alice@example.com', password: 'hashed_pwd' },
            ] as any);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
            vi.mocked(jwt.sign).mockReturnValue('mocked_jwt_token' as any);

            await UserController.login(mockReq as Request, mockRes as Response);

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: '123' },
                'test_secret',
                { expiresIn: '1d' }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Login Successfully',
                user: {
                    name: 'Alice',
                    email: 'alice@example.com',
                    token: 'mocked_jwt_token',
                },
            });
        });

        it('should return 500 when exception occurs without hanging', async () => {
            mockReq = { body: { email: 'alice@example.com', password: 'correctpassword' } };
            vi.mocked(UserService.get).mockRejectedValue(new Error('Connection error'));

            await UserController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to login' });
        });
    });
});
