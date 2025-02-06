import express from "express";
import authRouter from './routes/auth.route'
import { errorHandler } from "./controllers/globalErrorhandler";
import cookieParser from 'cookie-parser'


export const app = express();
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)


app.use(errorHandler)