import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ApiError } from "../../utils";
import { AuthRepository } from "./auth.repository";
import { TokenHelper } from "../../helpers/token.helpers";
import { EmailHelper } from "../../helpers/email.helper";

export const AuthService = {
  async register(fullName: string, email: string, password: string) {
    const exists = await AuthRepository.findByEmail(email);
    if (exists) throw new ApiError(409, "Email already registered.");

    const hashed = await bcrypt.hash(password, 12);
    const verificationToken = TokenHelper.generateVerificationCode();

    const user = await AuthRepository.create({
      fullName,
      email,
      password: hashed,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await EmailHelper.sendVerificationEmail(email, fullName, verificationToken);

    return user;
  },

  async verifyEmail(email: string, token: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "No user found.");

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new ApiError(410, "Verification code expired.");
    }

    if (user.verificationToken !== token)
      throw new ApiError(401, "Invalid verification code.");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await AuthRepository.saveUser(user);
  },

  async login(email: string, password: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.isVerified) throw new ApiError(403, "Verify your email first.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const refreshToken = TokenHelper.generateRefreshToken({
      _id: String(user._id),
      email,
    });
    const accessToken = TokenHelper.generateAccessToken({
      _id: String(user._id),
      email,
    });

    await AuthRepository.updateRefreshToken(String(user._id), refreshToken);

    return { user, accessToken, refreshToken };
  },

  async logout(userId: string) {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await AuthRepository.updateRefreshToken(String(user._id), undefined);
  },

  async getProfile(userId: string) {
    const user = await AuthRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  async refreshAccessToken(refreshToken: string) {
    const decoded = TokenHelper.verifyToken(
      refreshToken,
      String(process.env.REFRESH_TOKEN_SECRET)
    ) as { _id: string };

    if (!decoded?._id) throw new ApiError(403, "Invalid refresh token.");

    const user = await AuthRepository.findById(decoded._id);
    if (!user) throw new ApiError(404, "User not found");

    if (user.refreshToken !== refreshToken)
      throw new ApiError(403, "Refresh token mismatch.");

    const newAccessToken = TokenHelper.generateAccessToken({
      _id: String(user._id),
      email: user.email,
    });

    return newAccessToken;
  },

  async requestResetPassword(email: string, clientUrl: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await AuthRepository.saveUser(user);

    await EmailHelper.sendPasswordResetMail(
      `${clientUrl}/reset-password/${resetToken}`,
      email
    );
  },

  async resetPassword(userId: string, resetToken: string, newPassword: string) {
    const user = await AuthRepository.findByResetToken(userId, resetToken);
    if (!user) throw new ApiError(400, "Invalid or expired reset token");

    const hashed = await bcrypt.hash(newPassword, 12);

    return await AuthRepository.updatePassword(String(user._id), hashed);
  },
};
