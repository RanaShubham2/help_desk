import jwt from "jsonwebtoken"
export async function auth(req,resp,next) {
 try {
    const token = req.cookies.token
    // console.log(token);
    if(!token){
         return resp.status(401).json({
                message: "Please login"
            });
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    req.user = decode
    next()
 } catch (error) {
       resp.status(500).json({
            message: error.message
        });
 }   
}
