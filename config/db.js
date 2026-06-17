import mongoose from "mongoose";
export async function connectdb(req,resp) {
    try {
        await mongoose.connect(process.env.mongo_url)
        console.log("db connected");
    } catch (error) {
        console.log("database error:",error.message);
    }
}
