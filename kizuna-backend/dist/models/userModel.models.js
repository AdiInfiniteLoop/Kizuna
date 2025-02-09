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
const argon2_1 = __importDefault(require("argon2"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "An email must be present"],
        unique: [true, "A user already exists with this emailId"]
    },
    fullName: {
        type: String,
        required: [true, "A name must be provided"]
    },
    password: {
        type: String,
        minlength: [8, "A password should be of minimum 8 characters"]
    },
    profilePic: {
        type: String,
        default: ""
    },
    emailVerified: { type: Boolean, default: false },
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified)
            return next();
        try {
            if (this.password) {
                const hashedPassword = yield argon2_1.default.hash(this.password);
                this.password = hashedPassword;
            }
        }
        catch (err) {
            console.log('An error occured during hashing', err);
        }
        next();
    });
});
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const val = yield argon2_1.default.verify(this.password, candidatePassword);
        return val;
    });
};
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
