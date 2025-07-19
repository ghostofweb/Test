import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import { connectDb } from "./db.js";
import { configDotenv } from "dotenv";
import userRouter from "./routes/userRouter.js";

configDotenv();
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
  console.error("Missing required environment variables");
  process.exit(1);
}
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

connectDb();

app.use("/api",userRouter)

app.get("/",(req,res)=>{
    res.send("Hello world");
})

app.listen(3000,()=>{
    console.log("Listening to the localhost 3000");

})