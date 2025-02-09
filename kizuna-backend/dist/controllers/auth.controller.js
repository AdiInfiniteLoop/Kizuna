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
exports.verifyOTP = exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const errorClass_utills_1 = require("../utils/errorClass.utills");
const userModel_models_1 = __importDefault(require("../models/userModel.models"));
const generateJWT_utils_1 = require("../utils/generateJWT.utils");
const cloudinary_lib_1 = __importDefault(require("../lib/cloudinary.lib"));
const email_1 = require("../utils/email");
const generateOTP_1 = require("../utils/generateOTP");
const redis_1 = __importDefault(require("../lib/redis"));
exports.signup = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
        return next(new errorClass_utills_1.ErrorClass('All fields must be filled', 400));
    try {
        if (password.length < 8) {
            return next(new errorClass_utills_1.ErrorClass('A password must be atleast 8 characters', 400));
        }
        const existingUser = yield userModel_models_1.default.findOne({ email });
        if (existingUser) {
            return next(new errorClass_utills_1.ErrorClass('A user already exists with the provided email', 400));
        }
        const otp = (0, generateOTP_1.generateOTP)();
        const OTP_EXPIRY = 120; //2 mins 
        yield redis_1.default.setex(email, OTP_EXPIRY, otp);
        yield (0, email_1.sendEmail)({
            email: email,
            subject: "OTP for Signup",
            message: `Your OTP for registration is: ${otp}`
        });
        res.status(200).json({
            status: 'Success',
            message: 'OTP sent to your email. Please enter the OTP to verify.',
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return next(new errorClass_utills_1.ErrorClass(err.message, 500));
        }
        else {
            return next(new errorClass_utills_1.ErrorClass('An unknown error occurred', 500));
        }
    }
}));
exports.login = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        next(new errorClass_utills_1.ErrorClass('All fields must be filled', 400));
    try {
        if (password.length < 8) {
            return next(new errorClass_utills_1.ErrorClass('A password must be atleast 8 characters', 400));
        }
        const user = yield userModel_models_1.default.findOne({ email });
        if (!user) {
            return next(new errorClass_utills_1.ErrorClass('Invalid Credentials', 404));
        }
        (0, generateJWT_utils_1.generateJWT)(user._id, res);
        const isPasswordCorrect = yield user.comparePassword(password);
        if (!isPasswordCorrect) {
            return next(new errorClass_utills_1.ErrorClass('Invalid Credentials', 400));
        }
        res.status(200).json({
            status: 'Success',
            message: 'Logged In Successfully',
            data: user
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return next(new errorClass_utills_1.ErrorClass(err.message, 500));
        }
        else {
            return next(new errorClass_utills_1.ErrorClass('An error occured', 500));
        }
    }
    next();
}));
exports.logout = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //clear cookies
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ status: 'Success', message: 'Logged Out Successfully' });
    }
    catch (err) {
        if (err instanceof Error) {
            return next(new errorClass_utills_1.ErrorClass(err.message, 500));
        }
        else {
            return next(new errorClass_utills_1.ErrorClass('An error occured', 500));
        }
    }
    next();
}));
exports.updateProfile = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return next(new errorClass_utills_1.ErrorClass('Profile Pic is required', 400));
        }
        const uploadRes = yield cloudinary_lib_1.default.uploader.upload(profilePic);
        const updatedUser = yield userModel_models_1.default.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true });
        res.status(200).json({ status: 'Success', message: 'Image Uploaded Successfully', data: updatedUser });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error) {
            return next(new errorClass_utills_1.ErrorClass(err.message, 500));
        }
        else {
            return next(new errorClass_utills_1.ErrorClass('An unknown error occured', 500));
        }
    }
}));
exports.checkAuth = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(req.user);
    }
    catch (err) {
        console.log("Error occured in checkAuth controller");
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.verifyOTP = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new errorClass_utills_1.ErrorClass('Email and OTP must be provided', 400));
    }
    const cachedOTP = yield redis_1.default.get(email);
    if (cachedOTP !== otp) {
        return next(new errorClass_utills_1.ErrorClass('Invalid OTP or OTP has expired', 400));
    }
    const newUser = yield userModel_models_1.default.create(Object.assign(Object.assign({}, req.body), { emailVerified: true }));
    const token = (0, generateJWT_utils_1.generateJWT)(newUser._id, res);
    yield redis_1.default.del(email);
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
}));
