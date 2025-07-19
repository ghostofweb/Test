import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    target:String,
    otp:String,
    expiresAt:Date
})

const Otp = mongoose.model("Otp",otpSchema)
export default Otp