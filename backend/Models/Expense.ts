import mongoose, { Schema, Document } from 'mongoose';
interface IExpense extends Document {
    userId: mongoose.Types.ObjectId,
    amount: number,
    category: mongoose.Types.ObjectId,
    description: string,
    date: Date,
    paymentMethod: string,
}
const ExpenseSchema = new Schema<IExpense>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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