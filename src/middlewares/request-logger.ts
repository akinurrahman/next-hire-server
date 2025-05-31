import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const isNonEmptyObject = (obj: any) =>
  obj && Object.keys(obj).length > 0 && obj.constructor === Object;

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const parts: string[] = [];

    // Basic request info
    parts.push(`${req.method} ${req.originalUrl}`);
    parts.push(`${res.statusCode}`);
    parts.push(`${duration}ms`);
    parts.push(`IP: ${req.ip}`);

    // Optional: Params
    if (isNonEmptyObject(req.params)) {
      parts.push(`Params: ${JSON.stringify(req.params)}`);
    }

    // Optional: Query
    if (isNonEmptyObject(req.query)) {
      parts.push(`Query: ${JSON.stringify(req.query)}`);
    }

    // Optional: Body (only for methods that usually have body)
    if (
      ["POST", "PUT", "PATCH"].includes(req.method) &&
      isNonEmptyObject(req.body)
    ) {
      // You might want to redact sensitive fields here if needed
      parts.push(`Body: ${JSON.stringify(req.body)}`);
    }

    logger.info(parts.join(" | "));
  });

  next();
};

export default requestLogger;
