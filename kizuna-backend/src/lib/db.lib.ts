import mongoose from "mongoose";

const DB_URL = process.env.DB_CONNECTION_STRING

if(!DB_URL) {
    console.log('DB Connection String unavailable in environment variables');
    process.exit(1)
}

export const connectDb = async() => {
    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDb connected successfully')
    }
    catch(err) {
        console.log('MongoDb Connection Error')
    }
}