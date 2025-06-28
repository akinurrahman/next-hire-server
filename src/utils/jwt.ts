import jwt from "jsonwebtoken";
import config from "config";

interface TokenPayload {
  userId: string;
  email: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = config.get<string>("JWT_SECRET");
const NODE_ENV = config.get<string>("NODE_ENV");

const ACCESS_TOKEN_EXPIRY = NODE_ENV === "production" ? "15m" : "1h";
const REFRESH_TOKEN_EXPIRY = NODE_ENV === "production" ? "7d" : "1h";

export const generateTokens = (payload: TokenPayload): TokenResponse => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const verifyRefreshToken = (refreshToken: string): TokenPayload => {
  try {
    return jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};


export const generateResetPasswordToken = (email: string, expiresIn: number = 1000 * 60 * 10): string => {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn,
  });
};

export const verifyResetPasswordToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string };
  } catch (error) {
    throw new Error("Invalid reset password token");
  }
};