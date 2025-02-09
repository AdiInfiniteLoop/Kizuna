"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
exports.getReceiverId = getReceiverId;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const userTOSocketMap = {};
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            'http://192.168.1.6:5173'
        ]
    }
});
exports.io = io;
function getReceiverId(userId) {
    return userTOSocketMap[userId];
}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userTOSocketMap[userId] = socket.id;
    }
    io.emit('getOnlineUsers', Object.keys(userTOSocketMap));
    socket.on("disconnect", () => {
        if (userId) {
            delete userTOSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userTOSocketMap));
    });
});
