import  {NextFunction, Request, Response}from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { ErrorClass } from "../utils/errorClass.utills";
import User, { UserInterface } from "../models/userModel.models";
import { generateJWT } from "../utils/generateJWT.utils";
import cloudinary from "../lib/cloudinary.lib";
import { sendEmail } from "../utils/email";
import { generateOTP} from "../utils/generateOTP";
import client from "../lib/redis";


export interface NRequest extends Request{
    user: UserInterface
}



export const signup = catchAsync(async (req: NRequest, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return next(new ErrorClass('All fields must be filled', 400));
    try {
        if (password.length < 8) {
            return next(new ErrorClass('A password must be atleast 8 characters', 400));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorClass('A user already exists with the provided email', 400));
        }


        const otp = generateOTP();
        const OTP_EXPIRY = 120;     //2 mins 
        await client.setex(email, OTP_EXPIRY, otp) 

        await sendEmail({
            email: email,
            subject: "OTP for Signup",
            message: `Your OTP for registration is: ${otp}`
        });

        res.status(200).json({
            status: 'Success',
            message: 'OTP sent to your email. Please enter the OTP to verify.',
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return next(new ErrorClass(err.message, 500));
        } else {
            return next(new ErrorClass('An unknown error occurred', 500));
        }
    }
});

export const login =  catchAsync(async(req: NRequest, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    if(!email || !password) next(new ErrorClass('All fields must be filled', 400))
    try {
        if(password.length < 8) {
            return next(new ErrorClass('A password must be atleast 8 characters', 400))
        }
        const user = await User.findOne({email});
        if(!user) {
            return next(new ErrorClass('Invalid Credentials', 404))
        }

        generateJWT(user._id, res);

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) {
            return next(new ErrorClass('Invalid Credentials', 400))
        }
        res.status(200).json(
            {
                status: 'Success',
                message: 'Logged In Successfully',
                data: user
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

export const logout =  catchAsync(async(req: NRequest, res: Response, next: NextFunction) => {
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

export const updateProfile = catchAsync(async(req: NRequest, res: Response, next: NextFunction) => {
    try {
        const {profilePic} =  req.body;
        const userId = req.user._id
        if(!profilePic) {
            return next(new ErrorClass('Profile Pic is required', 400))
        }
    
        const uploadRes = await cloudinary.uploader.upload(profilePic);
    
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadRes.secure_url}, {new: true})
    
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

export const checkAuth = catchAsync(async(req: NRequest, res: Response, next: NextFunction) => {
    try { 
        res.status(200).json(req.user)
    }
    catch(err) {
        console.log("Error occured in checkAuth controller");
        res.status(500).json({message: 'Internal Server Error'})
    }
})

export const verifyOTP = catchAsync(async (req: NRequest, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorClass('Email and OTP must be provided', 400));
    }
    
    const cachedOTP = await client.get(email)


    if (cachedOTP !== otp) {
        return next(new ErrorClass('Invalid OTP or OTP has expired', 400));
    }
    const newUser = await User.create({ ...req.body, emailVerified: true }); 
    const token = generateJWT(newUser._id, res);
    await client.del(email);

    res.status(200).json({
        status: 'Success',
        message: 'User successfully registered',
        data: {
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
            token,
        }
    });
});
