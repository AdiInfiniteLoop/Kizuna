import express from "express";
import authRouter from './routes/auth.route'
import { errorHandler } from "./controllers/globalErrorhandler";
export const app = express();

app.use(express.json())

app.use('/api/auth', authRouter)


app.use(errorHandler)