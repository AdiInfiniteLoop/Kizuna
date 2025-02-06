import  {NextFunction, Request, Response}from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { ErrorClass } from "../utils/errorClass.utills";
import User, { UserInterface } from "../models/userModel.models";
import { generateJWT } from "../utils/generateJWT.utils";
import cloudinary from "../lib/cloudinary.lib";

interface NRequest extends Request{
    user: UserInterface
}

export const signup =  catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password) next(new ErrorClass('A fields must be filled', 400))
    try {
        if(password.length < 8) {
            return next(new ErrorClass('A password must be atleast 8 characters', 400))
        }
        const user = await User.findOne({email});
        if(user) {
            return next(new ErrorClass('A User already exists with the email', 400))
        }
        const newuser = await User.create(req.body)
        
        if( newuser) {
            const token = generateJWT(newuser._id, res)
            res.status(200).json({
                status: 'Success',
                message: 'User successfully created',
                data: {
                    email: newuser.email,
                    fullName: newuser.fullName,
                    profilePic: newuser.profilePic
                }
            })
        }
        else {
            return next(new ErrorClass('An unknown Error Occured', 500))
        }
    }
    catch(err: unknown) {
        
        if(err instanceof Error) {
            return next(new ErrorClass(err.message, 500))
        }
        else {
            return next(new ErrorClass('An error occured', 500))
        }
    }
    next()
})


export const login =  catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password) next(new ErrorClass('A fields must be filled', 400))
    try {
        if(password.length < 8) {
            return next(new ErrorClass('A password must be atleast 8 characters', 400))
        }
        const user = await User.findOne({email});
        if(!user) {
            return next(new ErrorClass('Invalid Credentials', 404))
        }

        //check password
        const token = generateJWT(user._id, res);

        const isPasswordCorrect = user.comparePassword(password);
        if(!isPasswordCorrect) {
            return next(new ErrorClass('Invalid Credentials', 400))
        }
        res.status(200).json(
            {
                status: 'Success',
                message: 'Logged In Successfully'
            }
        )
    }
    catch(err: unknown) {
        
        if(err instanceof Error) {
            return next(new ErrorClass(err.message, 500))
        }
        else {
            return next(new ErrorClass('An error occured', 500))
        }
    }
    next()
})

export const logout =  catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    //clear cookies
    try {
        res.cookie("jwt","", {maxAge:0});
        res.status(200).json({status: 'Success', message: 'Logged Out Successfully'})
    }
    catch (err : unknown) {
        if(err instanceof Error) {
            return next(new ErrorClass(err.message, 500))
        }
        else {
            return next(new ErrorClass('An error occured', 500))
        }
    }
    next()
})

//test later with frontend   
export const updateProfile = catchAsync(async(req: NRequest, res: Response, next: NextFunction) => {
    try {
        const {profilePic} =  req.body;
        const userId = req.user._id
        // res.send('ds')
        if(!profilePic) {
            return next(new ErrorClass('Profile Pic is required', 400))
        }
    
        const uploadRes = await cloudinary.uploader.upload(profilePic);
    
        const updatedUser = User.findByIdAndUpdate(userId, {profilePic: uploadRes.secure_url}, {new: true})
    
        res.status(200).json({status: 'Success', message: 'Image Uploaded Successfully', data: updatedUser})
    }
    catch(err: unknown) {
        console.log(err)
        if(err instanceof Error) {
            return next(new ErrorClass(err.message,500))
        }
        else {
            return next(new ErrorClass('An unknown error occured', 500))
        }
    }
})

export const checkAuth = (req: any, res: Response) => {
    try {
        res.status(200).json(req.user)
        // console.log(req.user)
    }
    catch(err) {
        console.log("Error occured in checkAuth controller");
        res.status(500).json({message: 'Internal Server Error'})
    }
}