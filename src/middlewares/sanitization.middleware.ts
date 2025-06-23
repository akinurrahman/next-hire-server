import { Request, Response, NextFunction } from "express";
import { escape } from "lodash";

interface SanitizedRequest extends Request {
  sanitizedBody?: Record<string, any>;
  sanitizedQuery?: Record<string, any>;
  sanitizedParams?: Record<string, any>;
}

const sanitizeValue = (value: any): any => {
  if (typeof value === "string") {
    return escape(value.trim());
  }
  return value;
};

const sanitizeObject = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((value) => sanitizeValue(value));
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
};

const sanitizationMiddleware = (
  req: SanitizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitize request body
    if (req.body) {
      req.sanitizedBody = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.sanitizedQuery = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.sanitizedParams = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default sanitizationMiddleware;
