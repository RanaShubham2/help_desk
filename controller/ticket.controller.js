import { status } from "init";
import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import path from "path"
export async function createTicket(req, resp) {
    try {
        const { title, description, priority } = req.body
        if (!title || !description) {
            return resp.status(400).json({
                message: "Title and description required"
            });
        }
        // for responseDeadline and resolutionDeadline
        const now = new Date()
        let responseDeadline
        let resolutionDeadline

        if (priority === "low") {
            responseDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000)
            resolutionDeadline = new Date(now.getTime() + 72 * 60 * 60 * 1000)
        }
        if (priority === "medium") {
            responseDeadline = new Date(now.getTime() + 8 * 60 * 60 * 1000)
            resolutionDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        }
        if (priority === "high") {
            responseDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000)
            resolutionDeadline = new Date(now.getTime() + 8 * 60 * 60 * 1000)
        }
        if (priority === "urgent") {
            responseDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000)
            resolutionDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000)
        }

        // for auto-assign agent
         const agent = await Ticket.aggregate([
        {
            $match:{
                status:{
                    $nin:["resolved","closed"]
                }
            }
        },
        {
            $group:{
                _id:"$assignTo",
                openticket:{
                   $sum:1
                }
            }
        },
        {
            $sort:{
                openticket:1
            }
        }
     ])
     const leastlodedagent = agent[0]
     console.log(leastlodedagent);
     

        const ticket = await Ticket.create({
            title,
            description,
            priority,
            createdBy: req.user.id,
            attachments: req.file.path,
            responseDeadline,
            resolutionDeadline,
            assignTo: leastlodedagent ? leastlodedagent._id : null
        })
        resp.status(201).json({
            message: "Ticket created",
            data: ticket
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export async function getTicket(req, resp) {
    const query = {};

    if (req.user.role === "customer") {
        query.createdBy = req.user.id;
    }

    if (req.query.status) {
        query.status = req.query.status;
    }

    if (req.query.priority) {
        query.priority = req.query.priority;
    }

    const tickets = await Ticket.find(query);
    resp.status(200).json({
        count: tickets.length,
        data: tickets
    });
}

export async function getticketbyid(req, resp) {
    try {
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
        resp.status(200).json({
            data: ticket
        });
    } catch (error) {
        resp.status(200).json({
            data: ticket
        });
    }
}

export async function updatestatus(req, resp) {
    try {
        if (req.user.role === "customer") {
            return resp.status(403).json({
                message: "only admin and agent can update status"
            });
        }
        // const {status} = req.body
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            return resp.status(404).json({
                message: "Ticket not found"
            });
        }
        const currentStatus = ticket.status
        const paramStatus = req.params.status
        const allowedTransisions = {
            open: ["in_progress", "closed"],
            in_progress: ["waiting", "resolved", "open"],
            waiting: ["in_progress", "closed"],
            resolved: ["closed", "in_progress"],
            closed: []
        }
        const isallowed = allowedTransisions[currentStatus].includes(paramStatus)
        if (!isallowed) {
            return resp.status(400).json({
                message: `cannot move from ${currentStatus} to ${paramStatus}`
            })
        }
        ticket.status = paramStatus
        if (paramStatus === "resolved") {
            ticket.resolvedAt = new Date()
        }
        await ticket.save()
        resp.status(200).json({
            message: "Status updated",
            data: ticket
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export async function assignagent(req, resp) {
    try {
        if (req.user.role === "customer") {
            return resp.status(403).json({
                message: "only admin and agent can update status"
            });
        }
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            return resp.status(404).json({
                message: "Ticket not found"
            });
        }
        const { agentId } = req.body
        const agent = await User.findOne({ _id: agentId, role: "agent" })
        if (!agent) {
            return resp.status(404).json({
                message: "agent not found"
            });
        }
        ticket.assignTo = agentId
        ticket.save()
        resp.status(200).json({
            message: "agent assigned succesfully",
            data: ticket
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export async function deleteticket(req, resp) {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "only admin can delete tickets"
            });
        }
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            return resp.status(404).json({
                message: "Ticket not found"
            });
        }
        await Ticket.findByIdAndDelete(req.params.id)

        resp.status(200).json({
            message: "ticket deleted succesfully",
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

// auto assign agent
export const auto_asign = async (req, resp) => {
    //  const agent = await User.find({role:"agent"})
    //  if(agent.length===0){
    //     return null
    //  }
    
}