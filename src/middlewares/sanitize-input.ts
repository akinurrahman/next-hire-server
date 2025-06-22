import { Request, Response, NextFunction } from "express";
import { sanitizeObject, SanitizationOptions } from "../utils/sanitizer";

/**
 * Global input sanitization middleware
 * Sanitizes all incoming request data (body, query, params) to prevent XSS and injection attacks
 */
export const sanitizeInput = (options?: SanitizationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Sanitize request body
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = sanitizeObject(req.body, options);
      }

      // Sanitize query parameters
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = sanitizeObject(req.query, options);
      }

      // Sanitize URL parameters
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = sanitizeObject(req.params, options);
      }

      next();
    } catch (error) {
      // If sanitization fails, return a 400 error
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: error instanceof Error ? error.message : "Sanitization failed",
      });
    }
  };
};

/**
 * Selective sanitization middleware for specific fields
 * Allows you to apply different sanitization rules to different parts of the request
 */
export const sanitizeSelective = (
  bodyFields?: string[],
  queryFields?: string[],
  paramFields?: string[],
  options?: SanitizationOptions
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Sanitize specific body fields
      if (bodyFields && req.body) {
        bodyFields.forEach((field) => {
          if (req.body[field]) {
            req.body[field] = sanitizeObject(req.body[field], options);
          }
        });
      }

      // Sanitize specific query fields
      if (queryFields && req.query) {
        queryFields.forEach((field) => {
          if (req.query[field]) {
            req.query[field] = sanitizeObject(req.query[field], options);
          }
        });
      }

      // Sanitize specific param fields
      if (paramFields && req.params) {
        paramFields.forEach((field) => {
          if (req.params[field]) {
            req.params[field] = sanitizeObject(req.params[field], options);
          }
        });
      }

      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: error instanceof Error ? error.message : "Sanitization failed",
      });
    }
  };
};

/**
 * Strict sanitization middleware with enhanced security
 * Applies more aggressive sanitization rules
 */
export const sanitizeStrict = () => {
  return sanitizeInput({
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 5000, // More restrictive length limit
  });
};

/**
 * Lenient sanitization middleware for content that may contain HTML
 * Useful for rich text content or admin panels
 */
export const sanitizeLenient = () => {
  return sanitizeInput({
    removeHtml: false, // Allow HTML
    removeScripts: true, // Still remove scripts
    escapeHtml: false, // Don't escape HTML
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 50000, // Higher length limit for content
  });
};
