import mongoose, { Schema, Document } from 'mongoose';
interface IExpense extends Document {
    userId: string,
    amount: number,
    category: string,
    description: string,
    date: Date,
    paymentMethod: string,
}
const ExpenseSchema = new Schema<IExpense>({
    userId: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },
    date: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["cash", "card", "online"]
    }
}, { timestamps: true });
const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense;