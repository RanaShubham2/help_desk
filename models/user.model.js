import mongoose from "mongoose";
const userschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "agent", "admin"],
        default: "customer"
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userschema)
export default User