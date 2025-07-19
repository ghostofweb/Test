import express from "express"
import { login, refreshToken, signup, verifyOtp } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login)
userRouter.post("/verifyOtp",verifyOtp)
userRouter.post('/refresh-token', refreshToken);

userRouter.post("/dashboard",requireAuth,(req,res)=>{
    res.json({ message: `Welcome user ${req.userId}` });
})
export default userRouter;