import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  login,
  logout,
  me,
  registerUser,
  setNewAccessToken,
  verifyEmail,
} from "./auth.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/me").get(authMiddleware, me);
router.route("/refresh").get(authMiddleware, setNewAccessToken);

export default router;
