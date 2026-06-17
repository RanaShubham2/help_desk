import mongoose from "mongoose";
const commentschema = mongoose.Schema({
    ticket : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        required:true
    },
    author : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
         required:true
    },
    body:{
        type:String,
        required:true
    },
    isinternal:{
        type:Boolean,
        default:false
    },
    attachments:[String]
},
{timestamps:true}
)

const comment = mongoose.model("comment",commentschema)
export default comment