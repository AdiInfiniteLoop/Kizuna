import express from "express";
import authRouter from './routes/auth.route'
import messageRouter from './routes/message.route'
import { errorHandler } from "./controllers/globalErrorhandler";
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { app } from "./lib/socket";

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)

console.log('hererer11')
app.get('/', (req, res) => {
    res.send('Kizuna Backend Running...')
})
app.use(errorHandler)

//---server start logic ----
import dotenv from "dotenv"; // Load .env before anything else always
dotenv.config();
import {  server } from "./lib/socket";

import { connectDb } from "./lib/db.lib"

const port = process.env.DEV_PORT


//here
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
  connectDb()
});
