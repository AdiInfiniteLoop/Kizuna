"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorClass_utills_1 = require("../utils/errorClass.utills");
// Handle CastError for invalid ObjectId
const handleCastErrorDB = (err) => {
    const message = `Invalid ID: ${err.value}. Please provide a valid ObjectId.`;
    return new errorClass_utills_1.ErrorClass(message, 400);
};
// Handle Duplicate Key Error (MongoDB)
const handleDuplicateKey = (err) => {
    const field = Object.keys(err.keyValue)[0]; // Get the field name
    const value = err.keyValue[field]; // Get the duplicate value
    const message = `Duplicate field value: ${field} = '${value}' already exists in the database.`;
    return new errorClass_utills_1.ErrorClass(message, 400);
};
// Handle JWT Error (invalid token)
const handleJWTError = () => {
    return new errorClass_utills_1.ErrorClass("Invalid Token. Please log in again.", 401);
};
// Handle Token Expired Error (expired JWT)
const handleTokenExpiredError = () => {
    return new errorClass_utills_1.ErrorClass("Token has expired. Please log in again.", 401);
};
// Handle Validation Error
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message).join(", ");
    return new errorClass_utills_1.ErrorClass(`Validation Error: ${errors}`, 400);
};
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log error for debugging
    // Default error properties
    let error = Object.assign(Object.assign({}, err), { message: err.message });
    // Handle specific errors
    if (err.name === "CastError")
        error = handleCastErrorDB(err);
    if (err.code === 11000)
        error = handleDuplicateKey(err);
    if (err.name === "JsonWebTokenError")
        error = handleJWTError();
    if (err.name === "TokenExpiredError")
        error = handleTokenExpiredError();
    if (err.name === "ValidationError")
        error = handleValidationError(err);
    // Send response
    res.status(error.statusCode || 500).json({
        status: error.status || "error",
        message: error.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
