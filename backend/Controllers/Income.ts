import express, { Request, Response } from 'express';
import IncomeService from '../Services/Income';
const add = async (req: Request, res: Response) => {
    try {
        const { amount, source, description, incomeDate } = req.body;
        const userId = req.user?.userId;
        if (!amount || !source || !incomeDate) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const data = await IncomeService.add({ amount, source, description, incomeDate, userId });
        return res.status(201).json({ message: "Income added successfully", data })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add income" })

    }

}
const get = async (req: Request, res: Response) => {
    try {
        const { month } = req.query;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await IncomeService.get({ userId, month });
        const totalincome = data.reduce((total, item) => total + item.amount, 0);
        return res.status(200).json({ message: "Income fetched successfully", data, totalincome });


    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch income" })
    }


}
const deleteIncome = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Income id is required" })
        }
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await IncomeService.deleteIncome({ _id: id, userId });
        if (data.deletedCount === 0) {
            return res.status(404).json({
                message: "Income not found"
            });
        }
        return res.status(200).json({ message: "Income deleted successfully" });
    }
    catch (error: any) {
        return res.status(500).json({ message: "Failed to delete income" });
    }


}
const getIncomeId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Income Id is required" })
        }
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await IncomeService.getOne({ _id: id, userId });
        if (!data) {
            return res.status(404).json({
                message: "Income not found"
            });
        }
        return res.status(200).json({ message: "Income fetched successfully", data });
    }
    catch (error: any) {
        return res.status(500).json({ message: "Failed to fetch income" });
    }
}
const updateIncome = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Income Id is required" })
        }
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await IncomeService.updateIncome({ _id: id, userId }, req.body);
        if (data.matchedCount === 0) {
            return res.status(404).json({
                message: "Income not found"
            });
        }
        return res.status(200).json({ message: "Income updated successfully", data });
    }
    catch (error: any) {
        return res.status(500).json({ message: "Failed to update income" });
    }
}

export default { add, get, deleteIncome, getIncomeId, updateIncome };
