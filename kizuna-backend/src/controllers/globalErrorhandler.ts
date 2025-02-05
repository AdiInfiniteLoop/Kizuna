import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ErrorClass } from "../utils/errorClass.utills";

// Handle CastError for invalid ObjectId
const handleCastErrorDB = (err: any): ErrorClass => {
  const message = `Invalid ID: ${err.value}. Please provide a valid ObjectId.`;
  return new ErrorClass(message, 400);
};

// Handle Duplicate Key Error (MongoDB)
const handleDuplicateKey = (err: any): ErrorClass => {
  const field = Object.keys(err.keyValue)[0]; // Get the field name
  const value = err.keyValue[field]; // Get the duplicate value
  const message = `Duplicate field value: ${field} = '${value}' already exists in the database.`;
  return new ErrorClass(message, 400);
};

// Handle JWT Error (invalid token)
const handleJWTError = (): ErrorClass => {
  return new ErrorClass("Invalid Token. Please log in again.", 401);
};

// Handle Token Expired Error (expired JWT)
const handleTokenExpiredError = (): ErrorClass => {
  return new ErrorClass("Token has expired. Please log in again.", 401);
};

// Handle Validation Error
const handleValidationError = (err: any): ErrorClass => {
  const errors = Object.values(err.errors).map((el: any) => el.message).join(", ");
  return new ErrorClass(`Validation Error: ${errors}`, 400);
};

// Error handler middleware
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err); // Log error for debugging

  // Default error properties
  let error = { ...err, message: err.message };

  // Handle specific errors
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
  if (err.name === "ValidationError") error = handleValidationError(err);

  // Send response
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Internal Server Error",
  });
};
