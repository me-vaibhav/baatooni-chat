import express from 'express'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../models/user.model.js'
import { sendVerificationEmail } from '../mailtrap/email.js'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'

export const signup = async(req,res)=>{
    const {confirmPassword,username,password,gender,email}=req.body
    try {
        if(password!==confirmPassword){return res.status(400).json({message:"password dont match"})}
        if(!email||!password||!username||!gender){
            throw new Error("fill em all")
        }
        const userAlreadyExists = await User.findOne({username})
        if(userAlreadyExists){
            return res.status(400).json({success:false,message:"User already exists"})
        } 
    
        const hashedPassword = await bcryptjs.hash(password,10)
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        // reset password k liye verification token bhi chaiye hoga
        const verificationToken= Math.floor(Math.random()*900000+100000).toString()
        const user = new User({
            email,
            password:hashedPassword,
            username,
            profilepic:gender==="male"?boyProfilePic:girlProfilePic,
            gender,
            verificationToken,
            verificationTokenExpiresAt: Date.now()+1000*60*15
        })

        //cookie bhi generate krna parega 
        //idhar cookie ka space  
        generateTokenAndSetCookie(user._id,res)

        //await sendVerificationEmail(process.env.TEST_MAIL,verificationToken)

        await user.save();

        res.status(201).json({
            success:true,
             message:"user created successfully",
             user:{
                ...user._doc,
                password:undefined,
             },})

    } catch (error) {
        res.status(400).json({success:false,test:"abc",message:error.message})
    }
}

export const login = async(req,res)=>{
    const {username,password}=req.body

    try {
        const user = await User.findOne({
            username
        }) 

        if(!user){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        // yaha pe ek naya token aur cookie dena tha
        //lekin for now lets skip that part
        generateTokenAndSetCookie(user._id,res)
        //same upar wala code dalde yaha

        res.status(200).json({
            success:true,
            message:"Logged in successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })

    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}

export const logout = async (req,res)=>{
    // yaha se cookietoken clear kr
    res.status(200).json({
        success:true,
        message:"Logged out succcessfully"
    })
}

export const verifyEmail=async (req,res)=>{
    const {code,email}=req.body
    try {
        const user = await User.findOne({
            email,
            verificationToken:code,
            verificationTokenExpiresAt:{$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or Expired Verification Code"})
        }
        user.isVerified=true
        user.verificationToken=undefined
        user.verificationTokenExpiresAt=undefined
        await user.save()

       // await sendWelcomeEmail(user.email,user.username) paid lagega dekhlo baki options aws ses , mailgun etc

       await sendWelcomeEmail(process.env.TEST_MAIL,user.username)

       res.status(200).json({
        success:true,
        message:"Email verified successfully",
        user : {
            ...user._doc,
            password:undefined,
        }
       })

    } catch (error) {
        return res.status(500).json({success:false,message: error.message})          
    }
}
// baki sara baad me krna for now lets move on with project