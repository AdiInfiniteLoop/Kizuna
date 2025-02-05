import dotenv from "dotenv"; // Load .env before anything else always
dotenv.config();

import {app} from './index'
import { connectDb } from "./lib/db.lib"

const port = process.env.DEV_PORT

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  connectDb()
});
