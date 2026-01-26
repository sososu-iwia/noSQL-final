import express from "express";
import {
  login,
  register,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  otpSchema,
  registerSchema,
} from "../validations/auth.validation.js";

const authRouter = express.Router();

authRouter.post("/register", validateMiddleware(registerSchema), register);
authRouter.post("/login", validateMiddleware(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", authMiddleware, sendVerifyOtp);
authRouter.post(
  "/verify-account",
  validateMiddleware(otpSchema),
  authMiddleware,
  verifyEmail,
);
authRouter.post("/is-auth", authMiddleware, isAuthenticated);
authRouter.post("/send-reset-otp", validateMiddleware(otpSchema), sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
