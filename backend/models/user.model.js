import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            trim: true, // Removes whitespace
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']        
        },
        password:{
            type:String,
            required:true,
            unique:true,
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
         gender:{
            type:String,
            enum:['male','female'],
            required:true,
        },
        profilepic:{
            type:String
        },
        verificationToken:String,
        verificationTokenExpiresAt:Date,
        resetPasswordToken:String,
        resetPasswordExpiresAt:Date,
    },{timestamps:true}
)

export const User= mongoose.model('User',userSchema)
