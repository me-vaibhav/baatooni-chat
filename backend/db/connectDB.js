import mongoose from "mongoose"
export const connectDB=async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`shit happened again `,error.message)
        process.exit(1)
    }
}