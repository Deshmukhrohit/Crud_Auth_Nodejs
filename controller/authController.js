import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js"

export const signup = async ( req, res)=>{
    try{
     const { name, email, password , address } = req.body;
     const userExist = await User.findOne({ email });
     if(userExist){
        return res.status(400).json({ message: "User already exists" });
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = new User({
        name, email , password: hashedPassword , address
     });
      const saveUser = await newUser.save();
      res.status(201).json({ message: "User registered successfully", data: saveUser});
    } catch(error){
        res.status(500).json({ error: "Internal Server error." });
    }
};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: "User NOT found."});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign({ id: user._id, name: user.name, email: user.email, address: user.address }, process.env.JWT_SECRET_ACCESS, { expiresIn: "1m" });
        const refreshToken = jwt.sign({ id: user._id, name: user.name,email: user.email, address: user.address }, process.env.JWT_SECRET_REFRESH, { expiresIn: "1h" });
        res.cookie("refreshToken",refreshToken, { httpOnly: true,secure: true, sameSite: "strict"});
        res.status(200).json({message:"Login successfull", accessToken });
    } catch(error){
        res.status(500).json({ error: "Internal Server error. "});
    }
};

export const refreshToken = ( req, res) => {
    const refreshToken = req.headers?.cookie?.split('refreshToken=')[1]?.split(';')[0];
console.log('Extracted token:', refreshToken);
    // const refreshToken = req.cookie.refreshToken;
    if(!refreshToken){
        return res.status(401).json({ message: "Access Denied. No refresh token provided."});
    }
    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

        const accessToken = jwt.sign({ user: decoded.id, name:decoded.name, email: decoded.email, address: decoded.address }, process.env.JWT_SECRET_ACCESS, { expiresIn: "1h"});
        res.status(200).json({ accessToken });
    } catch(error) {
        return res.status(400).json({ messages: "Invalid refresh token. "});
    }
}