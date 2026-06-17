
// User Management

import { status } from "init";
import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js"

// • GET /admin/users — List all users
export const getalluser = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const users = await User.find().select("-password")
        resp.status(201).json({
            message: "data fetched successfully",
            total: users.length,
            data: users
        })
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const updateuser = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const users = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!users) {
            return resp.status(403).json({
                message: "user not found"
            });
        }
        resp.status(200).json({
            message: "User updated",
            data: users
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const deleteuser = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        await User.findByIdAndDelete(req.params.id)
        resp.status(200).json({
            message: "User deleted succesfully",
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

// Analytics Endpoints

export const overview = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const totalticket = await Ticket.countDocuments()
        const opentickets = await Ticket.countDocuments({ status: "open" })
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const resolvedtoday = await Ticket.countDocuments({ status: "resolved", resolvedAt: { $gte: today } })

        // avg resolved time
        const resolveticket = await Ticket.find({ status: "resolved" })
        let totalhours = 0
        resolveticket.forEach(ticket => {
            const hour = (ticket.resolvedAt - ticket.createdAt) / (1000 * 60 * 60)
            totalhours += hour
        });
        let avgresolvetime = resolveticket.length > 0
            ? totalhours / resolveticket.length
            : 0;

        resp.status(200).json({
            message: "tickets overviews",
            "totalticket": totalticket,
            "open_tickets": opentickets,
            "resolved_today": resolvedtoday,
            "avg_resolution_time": avgresolvetime.toFixed(2) + " hours"
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const bystatus = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const data = await Ticket.aggregate([
            {
                $group: { _id: "$status", count: { $sum: 1 } }

            }
        ])
        resp.status(200).json(data);
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const byagent = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const data = await Ticket.aggregate([
            {
                $match: {
                    assignTo: {
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: "$assignTo",
                    tkt: { $sum: 1 }
                }
            }
        ])
        resp.status(200).json(data);
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}

export const slabreaches = async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                message: "Access denied"
            });
        }
        const tickets = await Ticket.find({
            resolutionDeadline: {
                $lt: new Date()
            },
            status: {
                $nin: ["resolved", "closed"]
            }
        })
        if(tickets.length<0){
          resp.status(200).json({
           message: "no records found which are breach sla"
        });
        }
        resp.status(200).json({
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
}