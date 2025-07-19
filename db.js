import mongoose from "mongoose"

export const connectDb = ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected Sucessfully");
    } catch (error) {
        console.log("error came",error);
        process.exit(1);
    }
}