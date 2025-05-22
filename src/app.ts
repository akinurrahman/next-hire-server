import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import config from "config";
import connectDB from "./utils/connect";
import baseRouter from './routes'

const app = express();
app.use(express.json())



app.use("/", baseRouter)

const port = config.get<number>("PORT");
app.listen(port, async () => {
  connectDB();
});
