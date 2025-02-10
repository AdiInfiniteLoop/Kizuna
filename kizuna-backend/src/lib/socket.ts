import { Server, Socket } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const userTOSocketMap: Record<string, string> = {};  
const io = new Server(server, {
    cors: {
        origin: [
            'https://kizuna-ten.vercel.app' 
        ],
        credentials: true
    }
});

export function getReceiverId(userId: string): string | undefined {
    return userTOSocketMap[userId];
}

io.on("connection", (socket: Socket) => {

    const userId = socket.handshake.query.userId as string;
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

export { io, app, server };
