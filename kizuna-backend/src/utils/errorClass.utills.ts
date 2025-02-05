export class ErrorClass extends Error {
    statusCode: number;
    status: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message
        this.statusCode = statusCode;
        this.status = "Error"
    }
}