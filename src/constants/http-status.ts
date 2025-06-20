export const HTTP_STATUS = {
  // Successful responses
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Redirection messages
  MOVED_PERMANENTLY: 301,
  FOUND: 302,

  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};


export const APP_NAME = "Next-Hire";
export const FRONTEND_URL = "http://localhost:3000";
export const SUPPORT_EMAIL = "support@nexthire.com";