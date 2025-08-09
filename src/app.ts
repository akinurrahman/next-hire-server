import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import config from "config";
import connectDB from "./config/connect";
import baseRouter from "./routes";
import errorHandler from "./middlewares/error-handler";
import requestLogger from "./middlewares/request-logger";
import sanitizationMiddleware from "./middlewares/sanitization.middleware";
import { FRONTEND_URL } from "./constants";
import cors from "cors";

const app = express();

// Security middleware
app.use(express.json({ limit: "10mb" })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Global sanitization middleware
app.use(sanitizationMiddleware);

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
