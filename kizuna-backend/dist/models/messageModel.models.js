"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export interface IMessage extends Document {
//   senderId: Types.ObjectId;
//   receiverId: Types.ObjectId;
//   text?: string;
//   image?: string;
//   createdAt: Date;
//   updatedAt: Date;
// } check this
const messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: String,
    image: String,
}, { timestamps: true });
exports.MessageModel = mongoose_1.default.model('MessageModel', messageSchema);
