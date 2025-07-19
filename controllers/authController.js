import jwt from "jsonwebtoken"
import User from "../models/User.js";
import { generateOtp, getExpiry } from "../utils/otp.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcrypt"

const generateToken = userId => jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"1h"})

export const signup = async(req,res)=>{
    try {
        const {name,email,mobile,password} = req.body;
        // Checking all the fields are there or not
        if (!name || !email || !mobile || !password)
        {
            return res.status(400).json({ message: 'All fields required' });
        }

        //check exisiting User
        const exisiting = await User.findOne({$or:[{email},{mobile}]});
        if(exisiting) return res.status(409).json({message:"User Already Exist"});

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating of user
        const user = await User.create({name,email,mobile,password:hashedPassword});
        const otp = generateOtp()

        // putting OTP in the otp model with email
        await Otp.create({
            target:email,
            otp,
            expiresAt: new Date(getExpiry())
        })
        console.log(`Signup OTP for ${email}: ${otp}`);

        res.json({
            message:"User created. Verify email given below (testing purposes only)",
            otp,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Signup failed"})
    }
}

export const login = async (req,res) =>{
    try{
        const { identifier, password } = req.body;
        const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        if(!user.isVerified){
            const otp = generateOtp();
            const target = identifier;

            await Otp.findOneAndUpdate(
             { target },
             { otp, expiresAt: new Date(getExpiry()) },
             { upsert: true }
        );
        
        console.log(`Login OTP for ${target}: ${otp}`);
        return res.status(401).json({
            message:`User not varified, verify with this new OTP ${otp}. This is only for testing purpose, in real we will send an email with otp`
        })
    }
    const token = generateToken(user._id);
    res.cookie('token', token, {httpOnly:true} )
    res.json({ message: 'Logged in successfully' });
    }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
    }
}

export const verifyOtp = async(req,res)=>{
    try {
    const { target, otp } = req.body;
    const record = await Otp.findOne({ target });

    if (!record) return res.status(400).json({ message: 'No OTP found' });
    if (record.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > record.expiresAt)
      return res.status(400).json({ message: 'OTP expired' });

    await User.findOneAndUpdate(
      { $or: [{ email: target }, { mobile: target }] },
      { isVerified: true }
    );

    await Otp.deleteOne({ target });

    res.json({ message: 'OTP verified. You can login now.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'OTP verification failed' });
    }
}

export const refreshToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.userId);
    res.cookie('token', newToken, { httpOnly: true });
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};