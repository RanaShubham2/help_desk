import express from "express"
import { getme, login, register } from "../controller/auth.controller.js";
import { auth } from "../midleware/auth.midleware.js";
const router = express.Router()
router.post("/register",register)
router.post("/login",login)
router.get("/getme",auth,getme)
export default router
