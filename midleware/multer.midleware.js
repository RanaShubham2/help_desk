import { error } from "console";
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    const allowedtype = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/plain"
    ]
    if (allowedtype.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new error("Only jpg, png, pdf, txt files are allowed"), false)
    }

}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
export default upload