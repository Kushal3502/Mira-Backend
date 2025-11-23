import jwt, { JwtPayload } from "jsonwebtoken";

interface JWTPayload {
  _id: string;
  email: string;
}

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is missing in environment variables`);
  return value;
};

export const TokenHelper = {
  generateVerificationCode: () => {
    return String(Math.floor(100000 + Math.random() * 900000));
  },

  generateRefreshToken: (payload: JWTPayload) => {
    const secret = getEnv("REFRESH_TOKEN_SECRET");
    return jwt.sign(payload, secret, { expiresIn: "7d" });
  },

  generateAccessToken: (payload: JWTPayload) => {
    const secret = getEnv("ACCESS_TOKEN_SECRET");
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  },

  verifyToken: <T>(token: string, secret: string): T => {
    return jwt.verify(token, secret) as T;
  },
};
