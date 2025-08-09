import config from "config";

export const ROLES = {
  RECRUITER : "recruiter",
  CANDIDATE: "candidate",
  ADMIN: "admin",
} as const;

export const APP_NAME = "Next-Hire";
const nodeEnv = config.get<string>("NODE_ENV");
export const FRONTEND_URL =
  nodeEnv === "development"
    ? "http://localhost:3000"
    : "https://nexthire.akinurrahman.com";
export const SUPPORT_EMAIL = "support@nexthire.com";