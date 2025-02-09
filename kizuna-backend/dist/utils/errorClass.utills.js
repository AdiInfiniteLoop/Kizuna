"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorClass = void 0;
class ErrorClass extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = "Error";
    }
}
exports.ErrorClass = ErrorClass;
