import { Server, Socket } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const userTOSocketMap: Record<string, string> = {};  

const io = new Server(server, {
    cors: {
        origin: [
            'http://192.168.1.6:5173' 
        ]
    }
});

export function getReceiverId(userId: string): string | undefined {
    return userTOSocketMap[userId];
}

io.on("connection", (socket: Socket) => {
    console.log("connected", socket.id);

    const userId = socket.handshake.query.userId as string;
    if (userId) {
        userTOSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userTOSocketMap));

    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
        if (userId) {
            delete userTOSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userTOSocketMap));
    });
});

export { io, app, server };
