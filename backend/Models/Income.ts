import mongoose, { Schema, Document } from 'mongoose';
interface IIncome extends Document {

    userId: mongoose.Schema.Types.ObjectId,
    amount: number,
    source: string,
    description?: string,
    incomeDate: Date,

}
const IncomeSchema = new Schema<IIncome>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    incomeDate: {
        type: Date,
        required: true
    }

}, { timestamps: true });
const Income = mongoose.model<IIncome>("Income", IncomeSchema);
export default Income;