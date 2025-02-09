import express, { Request, Response } from "express";
import authRouter from './routes/auth.route'
import messageRouter from './routes/message.route'
import { errorHandler } from "./controllers/globalErrorhandler";
import cookieParser from 'cookie-parser'
import cors from 'cors'

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize'
import { app } from "./lib/socket";

const limiter = rateLimit({
  max: 500, 
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests from this IP, try again in an hour',
});


app.use('/api', limiter);
app.use(helmet());
app.use(mongoSanitize())

app.use(cookieParser())
app.use(express.json())
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://kizuna-ten.vercel.app/', 
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('CORS not allowed'), false); // Reject the request
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)


app.get('/', (_req, res) => {
    res.send('Kizuna Backend Running...')
})
app.use(errorHandler)
import dotenv from "dotenv";
dotenv.config();
import {  server } from "./lib/socket";
import { connectDb } from "./lib/db.lib"

const port = process.env.DEV_PORT


server.listen(port, () => {
  console.log(`Server started at port ${port}`);
  connectDb()
});
