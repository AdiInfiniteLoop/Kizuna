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
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


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
import ExpressMongoSanitize, { sanitize } from "express-mongo-sanitize";

const port = process.env.DEV_PORT


server.listen(port, () => {
  console.log(`Server started at port ${port}`);
  connectDb()
});
