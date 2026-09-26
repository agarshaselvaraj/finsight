import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import IncomeController from '../Controllers/Income';
import IncomeService from '../Services/Income';

vi.mock('../Services/Income');

describe('IncomeController Unit Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    describe('add', () => {
        it('should return 400 if required fields are missing', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                body: { amount: 5000 },
            };

            await IncomeController.add(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
        });

        it('should return 201 on successful income creation', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                body: {
                    amount: 5000,
                    source: 'Salary',
                    incomeDate: '2026-09-01',
                    description: 'Monthly salary',
                },
            };
            const created = { _id: 'inc1', ...mockReq.body, userId: 'user_123' };
            vi.mocked(IncomeService.add).mockResolvedValue(created as any);

            await IncomeController.add(mockReq as Request, mockRes as Response);

            expect(IncomeService.add).toHaveBeenCalledWith({
                amount: 5000,
                source: 'Salary',
                incomeDate: '2026-09-01',
                description: 'Monthly salary',
                userId: 'user_123',
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Income added successfully',
                data: created,
            });
        });
    });

    describe('get', () => {
        it('should return 401 when userId is missing', async () => {
            mockReq = { user: undefined, query: {} };

            await IncomeController.get(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        it('should calculate totalincome and return list', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                query: { month: '2026-09' },
            };
            const mockList = [
                { _id: 'inc1', amount: 5000, source: 'Salary' },
                { _id: 'inc2', amount: 1500, source: 'Freelance' },
            ];
            vi.mocked(IncomeService.get).mockResolvedValue(mockList as any);

            await IncomeController.get(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Income fetched successfully',
                data: mockList,
                totalincome: 6500,
            });
        });
    });

    describe('deleteIncome', () => {
        it('should return 404 if deletedCount is 0', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'inc999' } };
            vi.mocked(IncomeService.deleteIncome).mockResolvedValue({ deletedCount: 0 } as any);

            await IncomeController.deleteIncome(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Income not found' });
        });

        it('should return 200 on successful delete', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'inc1' } };
            vi.mocked(IncomeService.deleteIncome).mockResolvedValue({ deletedCount: 1 } as any);

            await IncomeController.deleteIncome(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Income deleted successfully' });
        });
    });
});
