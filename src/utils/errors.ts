import { HTTP_STATUS } from "../constants/http-status";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: Record<string, string> | null;
  public readonly errorCode: string | null;

  constructor(
    message: string,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors: Record<string, string> | null = null,
    errorCode: string | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    errors: Record<string, string> | null = null
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errorCode: string | null = null) {
    super(message, HTTP_STATUS.UNAUTHORIZED, null, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}