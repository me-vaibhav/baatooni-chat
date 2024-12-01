import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/connectDB.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import messageRoutes from './routes/message.routes.js'
const app = express()
dotenv.config()
app.use(cookieParser())
connectDB() //fucking clg wifi
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("working")
})
console.log("\n it starts here in server js ")
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)


app.listen(5000,()=>console.log("running on port 5000"))