import { Request, Response, NextFunction } from "express";

type AsyncHandlerFn<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = <T extends Request = Request>(fn: AsyncHandlerFn<T>) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
