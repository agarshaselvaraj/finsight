import express from 'express'
import cors from 'cors'
import connectDB from './Config/Mongodb.ts'
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import UserRouter from "./Routes/User.ts";
import ExpenseRouter from "./Routes/Expense.ts"
import CategoryRouter from "./Routes/Category.ts";
import IncomeRouter from "./Routes/Income.ts";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/user", UserRouter);
app.use("/expense", ExpenseRouter);
app.use("/category", CategoryRouter);
app.use("/income", IncomeRouter);
const PORT = 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})