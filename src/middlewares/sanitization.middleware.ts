import { Request, Response, NextFunction } from "express";
import { escape } from "lodash";

interface SanitizedRequest extends Request {
  sanitizedBody?: any;
  sanitizedQuery?: any;
  sanitizedParams?: any;
}

// Helper function to identify rich text fields
const isRichTextField = (fieldName: string): boolean => {
  const richTextFields = [
    "description",
    "content",
    "bio",
    "about",
    "summary",
    "details",
    "message",
    "comment",
    "notes",
    "requirements",
    "responsibilities",
  ];

  return richTextFields.some((field) =>
    fieldName.toLowerCase().includes(field)
  );
};

const sanitizeValue = (value: any, forceSanitize: boolean = false): any => {
  if (typeof value === "string") {
    if (forceSanitize) {
      return escape(value.trim());
    }
    return value.trim();
  }
  return value;
};

const sanitizeObject = (obj: any, forceSanitize: boolean = false): any => {
  if (typeof obj !== "object" || obj === null) {
    return sanitizeValue(obj, forceSanitize);
  }

  if (Array.isArray(obj)) {
    return obj.map((value) => sanitizeValue(value, forceSanitize));
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Check if this field should allow rich text
    const isRichText = isRichTextField(key);
    sanitized[key] = sanitizeValue(value, forceSanitize || !isRichText);
  }

  return sanitized;
};

const sanitizationMiddleware = (
  req: SanitizedRequest,
  res: Response,
  next: NextFunction
) => {
  // Sanitize request body
  if (req.body) {
    req.sanitizedBody = sanitizeObject(req.body, false); // false = don't sanitize rich text fields
  }

  // Sanitize query parameters (always sanitize these)
  if (req.query) {
    req.sanitizedQuery = sanitizeObject(req.query, true);
  }

  // Sanitize URL parameters (always sanitize these)
  if (req.params) {
    req.sanitizedParams = sanitizeObject(req.params, true);
  }

  next();
};

export default sanitizationMiddleware;
