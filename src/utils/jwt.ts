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
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

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
