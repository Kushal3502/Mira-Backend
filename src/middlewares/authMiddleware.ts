import { NextFunction, Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import { TokenHelper } from "../helpers/token.helpers";

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.header("Authorization")?.split(" ")[1] || req.cookies?.accessToken;

      if (!token)
        return res
          .status(401)
          .json(new ApiResponse(401, "Unauthorized access."));

      const decodedToken = TokenHelper.verifyToken(
        token,
        String(process.env.ACCESS_TOKEN_SECRET),
      ) as { _id: string; email: string };

      req.user = {
        _id: decodedToken._id,
        email: decodedToken.email,
      };

      next();
    } catch (error: any) {
      throw new ApiError(500, error.message);
    }
  },
);
