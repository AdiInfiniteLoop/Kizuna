import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose, { ObjectId } from "mongoose";

export const generateJWT = (userId: number | string |  mongoose.Types.ObjectId, res: Response): string => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevent XSS
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
