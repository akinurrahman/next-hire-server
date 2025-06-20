import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import config from "config";
import connectDB from "./utils/connect";
import baseRouter from "./routes";
import errorHandler from "./middlewares/error-handler";
import requestLogger from "./middlewares/request-logger";

const app = express();
app.use(express.json());

app.use("/", requestLogger, baseRouter);

app.use(
  errorHandler as (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void
);

const port = config.get<number>("PORT");
app.listen(port, async () => {
  connectDB();
});
