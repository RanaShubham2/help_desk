import expree from "express"
import { auth } from "../midleware/auth.midleware.js"
import { addcomment, getcomment } from "../controller/comment.controller.js"
import upload from "../midleware/multer.midleware.js"
const crouter = expree.Router()

crouter.post("/:id/comments",auth,upload.single("file"),addcomment)
crouter.get("/:id/comments",auth,getcomment)
export default crouter
