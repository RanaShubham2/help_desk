import express from "express"
import { auth } from "../midleware/auth.midleware.js"
import { byagent, bystatus, deleteuser, getalluser, overview, slabreaches, updateuser } from "../controller/admin.controller.js"
const arouter = express.Router()

arouter.get("/users",auth,getalluser)
arouter.patch("/users/:id",auth,updateuser)
arouter.delete("/users/:id",auth,deleteuser)
arouter.get("/analytics/overview",auth,overview)
arouter.get("/analytics/bystatus",auth,bystatus)
arouter.get("/analytics/byagent",auth,byagent)
arouter.get("/analytics/sla-breaches",auth,slabreaches)
export default arouter