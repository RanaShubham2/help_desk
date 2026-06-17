import comment from "../models/comment.model.js";
import Ticket from "../models/ticket.model.js";
export const addcomment = async (req, resp) => {
    try {
        const { body, isinternal } = req.body
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            return resp.status(404).json({
                message: "Ticket not found"
            });
        }
        if (isinternal === true && req.user.role === "customer") {
            return resp.status(403).json({
                message: "customer cannot create internal note"
            });
        }
        const Comment = await comment.create({
            ticket: ticket._id,
            author: req.user.id,
            body,
            isinternal,
            attachments:req.file.path
        })
        // console.log(Comment);
        resp.status(201).json({
            message: "Comment added",
            data: Comment
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const getcomment = async (req, resp) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        return resp.status(404).json({
            message: "Ticket not found"
        });
    }
    if (req.user.role === "customer" && ticket.createdBy.toString() !== req.user.id) {
        return resp.status(403).json({
            message: "Access denied"
        });
    }
    let Comment
    if (req.user.role === "customer") {
        Comment = await comment.find({
            ticket: req.params.id,
            isinternal: false
        })
    }
    else {
        Comment = await comment.find({ ticket: req.params.id })
    }
    resp.status(201).json({
        message: "your Comments",
        total: Comment.length,
        data: Comment
    });

}

