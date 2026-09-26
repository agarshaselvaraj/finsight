import { Request, Response } from 'express';
import ExpenseService from '../Services/Expense';

const add = async (req: Request, res: Response) => {
    const { amount, category, description, date, paymentMethod } = req.body;
    const userId = req.user?.userId;
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

    const { month, category, limit, skip } = req.query;
    const userId = req.user?.userId;
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: UserId is required" });
        }

        let data;
        let totalexpense = 0;
        let categoryBreakdown = [];
        let totalRecords = 0;

        if (category === "true") {
            data = await ExpenseService.ExpenseSummary({ userId, month });
            console.log("Expense Summary:", JSON.stringify(data, null, 2));
            totalexpense = data?.[0]?.totalExpense?.[0]?.total || 0;
            categoryBreakdown = data?.[0]?.categoryBreakdown || [];


        } else {
            data = await ExpenseService.get({ userId, month, limit, skip });
            totalRecords = await ExpenseService.count({ userId, month });
            totalexpense = data.reduce((total: number, item: any) => total + item.amount, 0);
        }

        return res.status(200).json({ message: "Expenses fetched successfully", data, totalexpense, categoryBreakdown, totalRecords });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch expenses" });
    }
}
const getExpenseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id, userId };
        const data = await ExpenseService.get(criteria);
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({ message: "Expense data fetched successfully", data: Array.isArray(data) ? data[0] : data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch expense" });
    }

}
const deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id, userId };
        const data = await ExpenseService.deleteExpense(criteria);
        if (data.deletedCount === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
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
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }
    const { amount, category, description, date, paymentMethod } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Expense Id is required" });
    }
    try {
        const criteria: any = { _id: id, userId };
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
        if (data.matchedCount === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({ message: "Expense Updated Successfully", data });
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to Update expense" });
    }

}
const weeklyTrends = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { week } = req.query;
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        if (!week) {
            return res.status(400).json({ message: "Week is required" });
        }
        const data = await ExpenseService.weeklyTrends({ userId, week });
        return res.status(200).json({ message: "Weekly trends fetched successfully", data })
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to Fetch weekly trends", error })
    }

}
export default { add, getExpense, getExpenseById, deleteExpense, updateExpense, weeklyTrends };