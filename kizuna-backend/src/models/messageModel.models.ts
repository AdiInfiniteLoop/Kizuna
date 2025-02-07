import { Document, Types } from "mongoose";
import mongoose from "mongoose";
// export interface IMessage extends Document {
//   senderId: Types.ObjectId;
//   receiverId: Types.ObjectId;
//   text?: string;
//   image?: string;
//   createdAt: Date;
//   updatedAt: Date;
// } check this

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: String,
    image: String,
}, {timestamps: true})


export const MessageModel = mongoose.model('MessageModel', messageSchema)