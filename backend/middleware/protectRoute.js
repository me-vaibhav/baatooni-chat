import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const protectRoute= async(req,res,next)=>{
    try {
        console.log("in protectroute")
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({error:"Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error:"Unauthorized - wrong cookie/jwt Provided"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            res.status(404).json({error:"User not found"})
        }

        req.user=user

        next()

    } catch (error) {
        console.log("Enter in protectRoute middleaware : ",error.message)
        res.status(500).json({error:"Internal server error."})
    }
}