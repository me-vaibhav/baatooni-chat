import { User } from "../models/user.model.js"

export const  getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId= req.user._id

        const allUsers = await User.find().select("-password -verificationToken -verificationTokenExpiresAt")
        //const allUsers = await User.find({_id:{$ne: loggedInUserId}})
        res.status(200).json(allUsers)


    } catch (error) {
        console.log("error in getuserforsidebar: ",error.message)
        res.status(500).json({error:"internal server error"})
    }
}