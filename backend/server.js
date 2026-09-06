import express from 'express'
import connectDB from './Config/Mongodb.ts'
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import UserRouter from "./Routes/User.ts";
import ExpenseRouter from "./Routes/Expense.ts"
const app = express();
dotenv.config();
app.use(express.json());
app.use("/user", UserRouter);
app.use("/expense", ExpenseRouter);
const PORT = 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})