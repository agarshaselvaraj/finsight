import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './Config/Mongodb';
import UserRouter from './Routes/User';
import ExpenseRouter from './Routes/Expense';
import CategoryRouter from './Routes/Category';
import IncomeRouter from './Routes/Income';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", UserRouter);
app.use("/expense", ExpenseRouter);
app.use("/category", CategoryRouter);
app.use("/income", IncomeRouter);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});