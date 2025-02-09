"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.get('/users', auth_middleware_1.protect, message_controller_1.getUsersForSidebar);
router.get('/:id', auth_middleware_1.protect, message_controller_1.getAllMessages);
router.post('/send/:id', auth_middleware_1.protect, message_controller_1.sendMessage);
exports.default = router;
