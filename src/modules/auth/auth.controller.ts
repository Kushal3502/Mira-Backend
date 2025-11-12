import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationCode,
  verifyToken,
} from "../../helpers/generateTokens";
import { sendVerificationEmail } from "../../helpers/sendVerificationMail";
import { ApiError, ApiResponse, asyncHandler } from "../../utils";
import { createUser, findUserByEmail, findUserById } from "./auth.service";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    // check if email already registered or not
    const isExists = await findUserByEmail(email);

    if (isExists)
      throw new ApiError(409, "Email already registered. Try Login instead.");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = generateVerificationCode();

    // create user
    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // send email
    await sendVerificationEmail(email, fullName, verificationToken);

    res.status(201).json(
      new ApiResponse(
        201,
        "A verification code has been sent to your email address.",
        {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
        }
      )
    );
  }
);

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.body;

  if (!email || !token)
    throw new ApiError(400, "Email and verification code are required.");

  const user = await findUserByEmail(email);

  if (!user) throw new ApiError(404, "No account found with this email.");

  if (
    user.verificationTokenExpiresAt &&
    user.verificationTokenExpiresAt < new Date()
  )
    throw new ApiError(
      410,
      "Verification code has expired. Please request a new one."
    );

  const isValid = user.verificationToken === token;

  if (!isValid) throw new ApiError(401, "Invalid verification code.");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "Email verified successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password are required.");

  const user = await findUserByEmail(email);

  if (!user) throw new ApiError(404, "User not found");

  if (!user.isVerified)
    throw new ApiError(403, "Please verify your email before logging in.");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const refreshToken = generateRefreshToken({ _id: String(user._id), email });
  const accessToken = generateAccessToken({ _id: String(user._id), email });

  user.refreshToken = refreshToken;
  await user.save();

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
      })
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const email = req.user?.email;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = undefined;
  await user.save();

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

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const email = req.user?.email;

  if (!userId) throw new ApiError(401, "Unauthorized request");

  const user = await findUserById(userId);

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(
    new ApiResponse(200, "User fetched successfully.", {
      _id: user._id,
      email,
    })
  );
});

export const setNewAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(401).json(new ApiResponse(401, "Unauthorized access."));

    const decodedToken = verifyToken(
      refreshToken,
      String(process.env.REFRESH_TOKEN_SECRET)
    ) as { _id: string };

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(403, "Invalid or expired refresh token.");
    }

    const user = await findUserById(decodedToken._id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.refreshToken !== refreshToken)
      throw new ApiError(403, "Refresh token mismatch.");

    const newAccessToken = generateAccessToken({
      _id: String(user._id),
      email: user.email,
    });

    res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  }
);
