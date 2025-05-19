import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { HTTP_STATUS } from "../constants/http-status";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(error);
    }
  };

export default validate;
