import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import ExpenseController from '../Controllers/Expense';
import ExpenseService from '../Services/Expense';

vi.mock('../Services/Expense');

describe('ExpenseController Unit Tests', () => {
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
        it('should return 401 if userId is missing from auth token', async () => {
            mockReq = {
                user: undefined,
                body: { amount: 500, category: 'cat1', date: '2026-09-24', paymentMethod: 'card' },
            };

            await ExpenseController.add(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: User ID not found' });
        });

        it('should return 400 if required fields are missing', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                body: { amount: 500, category: '' },
            };

            await ExpenseController.add(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
        });

        it('should create expense and return 201 on valid payload', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                body: {
                    amount: 500,
                    category: 'cat1',
                    description: 'Groceries',
                    date: '2026-09-24',
                    paymentMethod: 'card',
                },
            };
            const createdExpense = { _id: 'exp1', ...mockReq.body, userId: 'user_123' };
            vi.mocked(ExpenseService.add).mockResolvedValue(createdExpense as any);

            await ExpenseController.add(mockReq as Request, mockRes as Response);

            expect(ExpenseService.add).toHaveBeenCalledWith({
                userId: 'user_123',
                amount: 500,
                category: 'cat1',
                description: 'Groceries',
                date: '2026-09-24',
                paymentMethod: 'card',
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expense Added Successfully',
                data: createdExpense,
            });
        });
    });

    describe('getExpense', () => {
        it('should return 401 if user is not authenticated', async () => {
            mockReq = { user: undefined, query: {} };

            await ExpenseController.getExpense(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        it('should return category breakdown when category=true', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                query: { month: '2026-09', category: 'true' },
            };
            const mockSummary = [
                {
                    totalExpense: [{ total: 1500 }],
                    categoryBreakdown: [{ categoryId: 'cat1', name: 'Food', color: '#FF0000', total: 1500 }],
                },
            ];
            vi.mocked(ExpenseService.ExpenseSummary).mockResolvedValue(mockSummary as any);

            await ExpenseController.getExpense(mockReq as Request, mockRes as Response);

            expect(ExpenseService.ExpenseSummary).toHaveBeenCalledWith({
                userId: 'user_123',
                month: '2026-09',
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expenses fetched successfully',
                data: mockSummary,
                totalexpense: 1500,
                categoryBreakdown: mockSummary[0].categoryBreakdown,
                totalRecords: 0,
            });
        });

        it('should return paginated list and total when category !== true', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                query: { month: '2026-09', limit: '10', skip: '0' },
            };
            const mockList = [
                { _id: 'exp1', amount: 500, category: 'Food' },
                { _id: 'exp2', amount: 1000, category: 'Travel' },
            ];
            vi.mocked(ExpenseService.get).mockResolvedValue(mockList as any);
            vi.mocked(ExpenseService.count).mockResolvedValue(2 as any);

            await ExpenseController.getExpense(mockReq as Request, mockRes as Response);

            expect(ExpenseService.get).toHaveBeenCalledWith({
                userId: 'user_123',
                month: '2026-09',
                limit: '10',
                skip: '0',
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expenses fetched successfully',
                data: mockList,
                totalexpense: 1500,
                categoryBreakdown: [],
                totalRecords: 2,
            });
        });
    });

    describe('getExpenseById', () => {
        it('should return 404 when expense is not found', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'exp999' } };
            vi.mocked(ExpenseService.get).mockResolvedValue([] as any);

            await ExpenseController.getExpenseById(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Expense not found' });
        });

        it('should return 200 with expense data when found', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'exp1' } };
            const expense = { _id: 'exp1', amount: 500, userId: 'user_123' };
            vi.mocked(ExpenseService.get).mockResolvedValue([expense] as any);

            await ExpenseController.getExpenseById(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expense data fetched successfully',
                data: expense,
            });
        });
    });

    describe('deleteExpense', () => {
        it('should return 404 when deletedCount is 0', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'exp1' } };
            vi.mocked(ExpenseService.deleteExpense).mockResolvedValue({ deletedCount: 0 } as any);

            await ExpenseController.deleteExpense(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Expense not found' });
        });

        it('should return 200 when deleted successfully', async () => {
            mockReq = { user: { userId: 'user_123' }, params: { id: 'exp1' } };
            vi.mocked(ExpenseService.deleteExpense).mockResolvedValue({ deletedCount: 1 } as any);

            await ExpenseController.deleteExpense(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expense deleted successfully',
                data: { deletedCount: 1 },
            });
        });
    });

    describe('updateExpense', () => {
        it('should return 404 when matchedCount is 0', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                params: { id: 'exp1' },
                body: { amount: 600 },
            };
            vi.mocked(ExpenseService.updateExpense).mockResolvedValue({ matchedCount: 0 } as any);

            await ExpenseController.updateExpense(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Expense not found' });
        });

        it('should return 200 when updated successfully', async () => {
            mockReq = {
                user: { userId: 'user_123' },
                params: { id: 'exp1' },
                body: { amount: 600, category: 'Food' },
            };
            vi.mocked(ExpenseService.updateExpense).mockResolvedValue({ matchedCount: 1, modifiedCount: 1 } as any);

            await ExpenseController.updateExpense(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Expense Updated Successfully',
                data: { matchedCount: 1, modifiedCount: 1 },
            });
        });
    });
});
