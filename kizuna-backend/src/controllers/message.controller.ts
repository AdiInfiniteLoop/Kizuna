import express, { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.models';
import { catchAsync } from '../utils/catchAsync.utils';
import { ErrorClass } from '../utils/errorClass.utills';
import { NRequest } from './auth.controller';
import cloudinary from '../lib/cloudinary.lib';
import { MessageModel } from '../models/messageModel.models';
import { getReceiverId, io } from '../lib/socket';

// Function to get users for sidebar
export const getUsersForSidebar = catchAsync(async (req: NRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
        return next(new ErrorClass("User is not authenticated", 401));
    }

    const senderId = req.user._id;

    const filteredUser = await User.find({ _id: { $ne: senderId } });

    if (!filteredUser) {
        return next(new ErrorClass('No User Found', 500));
    }

    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent all the users',
        data: filteredUser
    });
});

// Function to get all messages between users
export const getAllMessages = catchAsync(
    async (req: NRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user._id) {
            return next(new ErrorClass("User is not authenticated", 401));
        }

        const myId = req.user._id;
        const { id: receiverId } = req.params;

        if (!receiverId || receiverId.length !== 24) {
            return next(new ErrorClass("Invalid receiver ID", 400));
        }

        const allMessages = await MessageModel.find({
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
    }
);

// Function to send a message
export const sendMessage = catchAsync(async (req: NRequest, res: Response, next: NextFunction) => {
    const { text, image } = req.body;
    if (!text && !image) {
        return next(new ErrorClass('No input available to send', 400));
    }

    if (!req.user || !req.user._id) {
        return next(new ErrorClass("User is not authenticated", 401));
    }

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId || receiverId.length !== 24) {
        return next(new ErrorClass("Invalid receiver ID", 400));
    }

    let imageurl: string | undefined;
    if (image) {
        const uploadRes = await cloudinary.uploader.upload(image);
        imageurl = uploadRes.secure_url;
    }

    const newMessage = new MessageModel({
        senderId,
        receiverId,
        text,
        image: imageurl,
    });

    // Save the message
    await newMessage.save();

    // Emit the message to the receiver using socket.io
    const receiverSocketId = getReceiverId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent the message',
        data: newMessage
    });
});
