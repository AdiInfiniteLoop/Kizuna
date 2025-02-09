"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getAllMessages = exports.getUsersForSidebar = void 0;
const userModel_models_1 = __importDefault(require("../models/userModel.models"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const errorClass_utills_1 = require("../utils/errorClass.utills");
const cloudinary_lib_1 = __importDefault(require("../lib/cloudinary.lib"));
const messageModel_models_1 = require("../models/messageModel.models");
const socket_1 = require("../lib/socket");
// Function to get users for sidebar
exports.getUsersForSidebar = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        return next(new errorClass_utills_1.ErrorClass("User is not authenticated", 401));
    }
    const senderId = req.user._id;
    const filteredUser = yield userModel_models_1.default.find({ _id: { $ne: senderId } });
    if (!filteredUser) {
        return next(new errorClass_utills_1.ErrorClass('No User Found', 500));
    }
    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent all the users',
        data: filteredUser
    });
}));
// Function to get all messages between users
exports.getAllMessages = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        return next(new errorClass_utills_1.ErrorClass("User is not authenticated", 401));
    }
    const myId = req.user._id;
    const { id: receiverId } = req.params;
    if (!receiverId || receiverId.length !== 24) {
        return next(new errorClass_utills_1.ErrorClass("Invalid receiver ID", 400));
    }
    const allMessages = yield messageModel_models_1.MessageModel.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId }
        ]
    })
        .sort({ createdAt: 1 }) // Sort by oldest first
        .lean();
    if (!allMessages || allMessages.length < 1) {
        return res.status(204).json({
            status: "No Content",
            message: "No messages available",
            data: []
        });
    }
    res.status(200).json({
        status: "Success",
        message: "Successfully retrieved all messages",
        data: allMessages
    });
}));
// Function to send a message
exports.sendMessage = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, image } = req.body;
    if (!text && !image) {
        return next(new errorClass_utills_1.ErrorClass('No input available to send', 400));
    }
    if (!req.user || !req.user._id) {
        return next(new errorClass_utills_1.ErrorClass("User is not authenticated", 401));
    }
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    if (!receiverId || receiverId.length !== 24) {
        return next(new errorClass_utills_1.ErrorClass("Invalid receiver ID", 400));
    }
    let imageurl;
    if (image) {
        const uploadRes = yield cloudinary_lib_1.default.uploader.upload(image);
        imageurl = uploadRes.secure_url;
    }
    const newMessage = new messageModel_models_1.MessageModel({
        senderId,
        receiverId,
        text,
        image: imageurl,
    });
    // Save the message
    yield newMessage.save();
    // Emit the message to the receiver using socket.io
    const receiverSocketId = (0, socket_1.getReceiverId)(receiverId);
    if (receiverSocketId) {
        socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent the message',
        data: newMessage
    });
}));
