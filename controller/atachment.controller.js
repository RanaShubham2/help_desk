// import comment from "../models/comment.model.js";
import Ticket from "../models/ticket.model.js"

// export const attachment = async (req,resp) => {
//   try {
//       const ticket = await Ticket.findById(req.params.id)
//       const Comment = await comment.findById(req.params.id)
//       if(!ticket){
//           return resp.status(404).json({
//                   message:
//                       "Ticket not found"
//               });
//       }
      
   
     
//   } catch (error) {
//       resp.status(500).json({
//             message:
//                 error.message
//         });
//   }
// }

export async function getattachment(req,res){

    const ticket = await Ticket.findById(req.params.id);
     if (req.user.role === "customer" && ticket.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Access denied"
        });
    }
    if(!ticket){
        return res.status(404).json({
            message:"Ticket not found"
        });
    }

    res.status(200).json({
        attachments:ticket.attachments
    });
}