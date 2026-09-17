import { Request, Response } from 'express';
import ExpenseService from '../Services/Expense';

const add = async (req: Request, res: Response) => {
    const { amount, category, description, date, paymentMethod } = req.body;
    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }
    if (!amount || !category || !date || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const data = await ExpenseService.add({
            userId,
            amount,
            category,
            description,
            date,
            paymentMethod
        });
        return res.status(201).json({ message: "Expense Added Successfully", data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add expense" });
    }

}
const getExpense = async (req: Request, res: Response) => {
    const { month } = req.query;
    const userId = req.user?.userId || req.params.userId;
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: UserId is required" });
        }
        const data = await ExpenseService.get({ userId, month });
        const totalexpense = data.reduce((total, item) => total + item.amount, 0);


        return res.status(200).json({ message: "Expenses fetched successfully", data, totalexpense });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch expenses" });
    }
}
const getExpenseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id };
        if (userId) criteria.userId = userId;
        const data = await ExpenseService.get(criteria);
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({ message: "Expense data fetched successfully", data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch expense" });
    }

}
const deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id };
        if (userId) criteria.userId = userId;
        const data = await ExpenseService.deleteExpense(criteria);
        return res.status(200).json({ message: "Expense deleted successfully", data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete expense" });
    }

}
const updateExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { amount, category, description, date, paymentMethod } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id };
        if (userId) criteria.userId = userId;
        const data = await ExpenseService.updateExpense(
            criteria,
            {
                amount,
                category,
                description,
                date,
                paymentMethod
            }
        );
        return res.status(200).json({ message: "Expense Updated Successfully", data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to Update expense" });
    }

}
export default { add, getExpense, getExpenseById, deleteExpense, updateExpense };