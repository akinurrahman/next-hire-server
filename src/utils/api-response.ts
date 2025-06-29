import { Response } from "express";
import { PaginatedResult } from "../types/pagination.types";

export const sendResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginatedResponse = <T>(
  res: Response,
  paginatedResult: PaginatedResult<T>,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
  });
};
