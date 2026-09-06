import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI!, {});
        console.log("Mongodb connected");
    }
    catch (error: any) {
        console.log(`Mongodb Error ${error.message}`)
    }
}
export default connectDB;