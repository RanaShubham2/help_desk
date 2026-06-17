import express from "express"
import { auth } from "../midleware/auth.midleware.js"
import { assignagent, createTicket, deleteticket, getTicket, getticketbyid, updatestatus } from "../controller/ticket.controller.js"
import upload from "../midleware/multer.midleware.js"
import { getattachment } from "../controller/atachment.controller.js"
const trouter = express.Router()

trouter.post("/",auth,upload.single("file"),createTicket)
trouter.get("/",auth,getTicket)
trouter.get("/:id",auth,getticketbyid)
trouter.patch("/:id/status/:status",auth,updatestatus)
trouter.patch("/:id/assign",auth,assignagent)
trouter.delete("/:id",auth,deleteticket)
   

//for file upload

// trouter.post("/:id/attachment",auth,upload.single("file"),attachment)
trouter.get("/:id/attachment",auth,getattachment)
export default trouter