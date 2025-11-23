import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { AuthController } from "./auth.controller";

const router = Router();

const {
  getProfile,
  login,
  logout,
  refreshAccessToken,
  registerUser,
  requestResetPassword,
  resetPassword,
  verifyEmail,
} = AuthController;

router.route("/register").post(registerUser);
router.route("/verify").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/me").get(authMiddleware, getProfile);
router.route("/refresh").get(authMiddleware, refreshAccessToken);
router.route("/forgot-password").post(requestResetPassword);
router.route("/reset-password").post(resetPassword);

export default router;
