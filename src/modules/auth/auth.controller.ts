import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../utils";
import { AuthService } from "./auth.service";

export const AuthController = {
  registerUser: asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    const user = await AuthService.register(fullName, email, password);

    res.status(201).json(
      new ApiResponse(201, "Verification code sent.", {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      })
    );
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const { email, token } = req.body;

    await AuthService.verifyEmail(email, token);

    res.status(200).json(new ApiResponse(200, "Email verified successfully"));
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await AuthService.login(
      email,
      password
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json(
        new ApiResponse(200, "Login successful", {
          _id: user._id,
          email,
          fullName: user.fullName,
        })
      );
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    await AuthService.logout(userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully"));
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await AuthService.getProfile(String(userId));

    res.status(200).json(
      new ApiResponse(200, "User fetched successfully.", {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      })
    );
  }),

  refreshAccessToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);

    res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  }),

  requestResetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.requestResetPassword(
      email,
      String(process.env.CLIENT_URL)
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Password reset link sent to your email."));
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { resetPasswordToken } = req.params;
    const { newpPassword } = req.body;
    const userId = req.user?._id;

    await AuthService.resetPassword(userId, resetPasswordToken, newpPassword);

    res
      .status(200)
      .json(
        new ApiResponse(200, "Password reset successfully. You can now log in.")
      );
  }),
};
