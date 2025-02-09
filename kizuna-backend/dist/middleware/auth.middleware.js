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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_models_1 = __importDefault(require("../models/userModel.models"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const errorClass_utills_1 = require("../utils/errorClass.utills");
exports.protect = (0, catchAsync_utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!token) {
        return next(new errorClass_utills_1.ErrorClass('Unauthorized - No Token Provided', 401));
    }
    if (process.env.JWT_SECRET) {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new errorClass_utills_1.ErrorClass('Unauthorized - Invalid Token Provided', 401));
        }
        if (typeof decoded !== 'object' || !decoded || !('userId' in decoded)) {
            return next(new errorClass_utills_1.ErrorClass('Unauthorized - Invalid Token Provided', 401));
        }
        const user = yield userModel_models_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return next(new errorClass_utills_1.ErrorClass('No User available', 400));
        }
        req.user = user;
        next();
    }
}));
