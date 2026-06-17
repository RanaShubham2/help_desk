import mongoose from "mongoose";
const ticketschema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "open", "in_progress", "waiting", "resolved", "closed"
        ],
        default: "open"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    attachments: [String],

    responseDeadline: {
        type: Date,
        default:null
    },

    resolutionDeadline: {
        type: Date,
        default:null
    },

    resolvedAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true }
)

const Ticket = mongoose.model("Ticket", ticketschema)
export default Ticket