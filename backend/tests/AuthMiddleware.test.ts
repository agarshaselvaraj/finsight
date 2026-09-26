import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../Config/AuthMiddleware';

describe('AuthMiddleware Unit Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret';
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });

    it('should return 401 if Authorization header is missing', async () => {
        await authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is empty after Bearer prefix', async () => {
        mockReq.headers = { authorization: 'Bearer ' };

        await authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token is not present' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 if token verification fails', async () => {
        mockReq.headers = { authorization: 'Bearer invalid_token' };

        await authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to authenticate' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() and attach decoded payload to req.user for valid token', async () => {
        const payload = { userId: 'user_123', email: 'test@example.com' };
        const validToken = jwt.sign(payload, 'test_secret');
        mockReq.headers = { authorization: `Bearer ${validToken}` };

        await authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockReq.user).toMatchObject({ userId: 'user_123' });
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });
});
