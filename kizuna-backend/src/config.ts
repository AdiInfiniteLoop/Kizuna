import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"), 
});

export const config = {
  port: process.env.DEV_PORT,
};
