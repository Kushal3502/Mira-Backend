import jwt from "jsonwebtoken";

interface JWTPayload {
  _id: string;
  email: string;
}

export const generateVerificationCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, String(process.env.REFRESH_TOKEN_SECRET), {
    expiresIn: "7d",
  });
};

export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};