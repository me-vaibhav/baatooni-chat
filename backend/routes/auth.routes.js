import express from 'express'

import { logout,login,signup } from '../controllers/auth.controller.js'
const router = express.Router()

router.post("/login",login)
router.get("/logout",(req,res)=>{
    res.send("working total")
})
router.post("/logout",logout)
router.post("/signup",signup)

export default router