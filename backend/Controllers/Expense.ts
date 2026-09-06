import expess, { Request, Response } from 'express';
import ExpenseService from '../Services/Expense.ts';
const add = async (req: Request, res: Response) => {
    const { userId, amount, category, description, date, paymentMethod } = req.body;
    if (!userId || !amount || !category || !date || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const data = await ExpenseService.add({
            userId,
            amount,
            category,
            description,
            date,
            paymentMethod
        })
        return res.status(200).json({ message: "Expense Added Successfully", data })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add expense" });
    }

}
const getExpense = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" })
        }
        const data = await ExpenseService.get({ userId });
        return res.status(200).json({ data });
    }
    catch (error: any) {
        console.log(error);
    }
}
const getExpenseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: " Expense Id is required" })
    }
    try {
        const data = await ExpenseService.get({ _id: id });
        return res.status(200).json({ message: "Expense data fetched successfully", data })
    }
    catch (error: any) {
        console.log(error);
    }

}
const deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: " Expense Id is required" })
    }
    try {
        const data = await ExpenseService.deleteExpense({ _id: id });
        return res.status(200).json({ message: "Expense deleted successfully" })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete expense" });
    }

}
const updateExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, category, description, date, paymentMethod } = req.body;
    if (!id) {
        return res.status(400).json({ message: " Expense Id is required" })
    }
    try {
        const data = await ExpenseService.updateExpense({
            _id: id
        },
            {
                amount,
                category,
                description,
                date,
                paymentMethod
            })
        return res.status(200).json({ message: "Expense Updated Successfully", data })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to Update expense" });
    }

}
export default { add, getExpense, getExpenseById, deleteExpense, updateExpense };