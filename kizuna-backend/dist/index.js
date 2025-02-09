"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const globalErrorhandler_1 = require("./controllers/globalErrorhandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const socket_1 = require("./lib/socket");
const limiter = (0, express_rate_limit_1.default)({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, try again in an hour',
});
socket_1.app.use('/api', limiter);
socket_1.app.use((0, helmet_1.default)());
socket_1.app.use((0, express_mongo_sanitize_1.default)());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
socket_1.app.use('/api/auth', auth_route_1.default);
socket_1.app.use('/api/messages', message_route_1.default);
socket_1.app.get('/', (_req, res) => {
    res.send('Kizuna Backend Running...');
});
socket_1.app.use(globalErrorhandler_1.errorHandler);
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const socket_2 = require("./lib/socket");
const db_lib_1 = require("./lib/db.lib");
const port = process.env.DEV_PORT;
socket_2.server.listen(port, () => {
    console.log(`Server started at port ${port}`);
    (0, db_lib_1.connectDb)();
});
