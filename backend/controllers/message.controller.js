import e from "express"
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const sendMessage=async (req,res)=>{
    try {
        console.log("in msg controller")
        const {id:receiverId} =req.params
        const {message}=req.body
        const senderId = req.user._id

        let conversation= await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        if(!conversation){
            conversation= await Conversation.create({
                participants:[senderId,receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })


        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
       //await newMessage.save()
        //await conversation.save()

        await Promise.all([conversation.save(),newMessage.save()]) //both will run in parallel


        res.status(201).json(newMessage)

    } catch (error) {
        console.log("error in ssendcontroller: ",error.message)
        res.status(500).json({error:"internal server error"})
    }
}

export const getMessages=async (req,res)=>{
    try {
        const {id:userToChatId}= req.params
        const senderId=req.user._id

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChatId] }
        }) //.populate('messages')
        if(!conversation){
            conversation= await Conversation.create({
                participants:[senderId,userToChatId],
            })
        }

       let convo= await conversation.populate("messages")    //674c1242431646d0e0acd6f2
       //. console.log(convo.messages.message)
        res.status(200).json(convo)
        
    } catch (error) {
        console.log("error in get message ssendcontroller: ",error.message)
        res.status(500).json({error:"internal server error"})
    }
}