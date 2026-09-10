import mongoose, { Schema, Document } from "mongoose";
interface ICategory extends Document {
    name: string,
    color: string,
    isSystem: boolean,
    userId: string,
    isActive: string



}
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true

    },
    isSystem: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }



}, { timestamps: true })
const Category = mongoose.model<ICategory>("Category", CategorySchema)
export default Category;