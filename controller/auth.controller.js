import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function register(req,resp) {
    try {
        const {name,email,password,role} = req.body
         if (!name || !email || !password) {
            return resp.status(400).json({
                message: "All fields are required"
            });
        }
        const existuser = await User.findOne({email})
         if (existuser) {
            return resp.status(400).json({
                message: "user already exists"
            });
        }
        const hashPass = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password:hashPass,
            role
        })
         resp.status(201).json({
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
          resp.status(500).json({
            message: error.message
        });
    }
}

export async function login(req,resp) {
    try {
        const {email,password} = req.body
         if (!email || !password) {
            return resp.status(400).json({
                message: "All fields are required"
            });
        }
        const user = await User.findOne({email})
        if(!user){
          return resp.status(404).json({
                message: "user not found"
            });   
        }
        const ismatch = await bcrypt.compare(password,user.password)
        if(!ismatch){
             return resp.status(400).json({
                message: "Invalid credentials"
            });
        }
     const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"})
        resp.cookie("token",token,{httpOnly:true})
       resp.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
    
}

export async function getme(req,resp) {
   try {
     const user = await User.findById(req.user.id).select("-password")
     resp.status(200).json({
         data:user
     })
   } catch (error) {
     resp.status(500).json({
            message: error.message
        });
   }
}


