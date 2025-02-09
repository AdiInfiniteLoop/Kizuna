"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
router.post('/signup', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.post('/verify-otp', auth_controller_1.verifyOTP);
router.put('/update-profile', auth_middleware_1.protect, auth_controller_1.updateProfile);
router.get('/check', auth_middleware_1.protect, auth_controller_1.checkAuth);
exports.default = router;
