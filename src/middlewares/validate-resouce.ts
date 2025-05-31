import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { formatZodErrors } from "../utils/format-zod-errors";
import { BadRequestError } from "../utils/errors";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: any) {
      throw new BadRequestError("Validation failed", formatZodErrors(error));
    }
  };

export default validateResource;
