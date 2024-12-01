import express from "express"
import { getMessages, sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()
console.log("in message router")
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessage)

export default router