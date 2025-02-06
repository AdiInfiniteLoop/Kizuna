import express, {Request,Response, NextFunction} from 'express'
import User from '../models/userModel.models'
import { catchAsync } from '../utils/catchAsync.utils'
import { ErrorClass } from '../utils/errorClass.utills';
import { NRequest } from './auth.controller';
import cloudinary from '../lib/cloudinary.lib';
import { MessageModel } from '../models/messageModel.models';


export const getUsersForSidebar = catchAsync(async(req: NRequest, res:Response, next: NextFunction) => {
    const senderId = req.user._id;
    const filteredUser  = await User.find({_id:  {$ne: senderId}}).lean()

    if(!filteredUser) {
        return next(new ErrorClass('No User Found', 500))
    }
    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent all the users',
        data: filteredUser
    })
})

export const getAllMessages = catchAsync(async(req: NRequest, res:Response, next: NextFunction) => {
    const myId = req.user._id;
    const {id: receiverId } = req.params;
    if(!receiverId) {
        return next(new ErrorClass('No receiver to get the messages', 404))
    }
    const allMessages = await User.find({
        $or:  [
            {senderId: myId},
            {receiverId: receiverId}
        ]
    }).lean()
    console.log(allMessages)
    if(!allMessages || allMessages.length < 1) {
        return next(new ErrorClass('No messages available', 400))  //204 for no data found
    }
    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent all the messages',
        data: allMessages
    })
    
})




export const sendMessage = catchAsync(async(req: NRequest, res:Response, next: NextFunction) => {
    const {text, image} = req.body;

    //how to detect emojis here?
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    
    let imageurl;
    if(image) {
        const uploadRes = await cloudinary.uploader.upload(image);
        imageurl = uploadRes.secure_url;
    }

    const newMessage = new MessageModel({
        senderId,
        receiverId,
        text,
        image: imageurl,
    })

    //socket.io here to implement

    await newMessage.save();
    res.status(200).json({
        status: 'Success',
        message: 'Successfully sent the message',
        data: newMessage
    })
    
})