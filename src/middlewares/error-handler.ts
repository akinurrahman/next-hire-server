import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import logger from "../utils/logger";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
  });
};

export default errorHandler;
