import express from "express"
import morgan from "morgan"
import dotenv from "dotenv/config"
import cookieParser from "cookie-parser"
import { connectdb } from "./config/db.js"
import router from "./routes/auth.routes.js"
import trouter from "./routes/ticket.routes.js"
import crouter from "./routes/comment.routes.js"
import arouter from "./routes/admin.route.js"
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/auth",router)
app.use("/ticket",trouter)
app.use("/ticket",crouter)
app.use("/admin",arouter)
connectdb()
app.listen(process.env.PORT,()=>{
   console.log("server run on 3000"); 
})

