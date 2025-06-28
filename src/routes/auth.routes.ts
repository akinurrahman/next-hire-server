import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  resendOtpHandler,
  verifyOtpHandler,
  refreshTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controllers/user.controllers";
import validateResource from "../middlewares/validate-resouce";
import {
  createUserSchema,
  loginSchema,
  resendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schema/user.schema";
import { requireAuthentication } from "../middlewares/auth.middleware";

const router = Router();

router
  .post("/register", validateResource(createUserSchema), createUserHandler)
  .post("/verify-otp", validateResource(verifyOtpSchema), verifyOtpHandler)
  .post("/resend-otp", validateResource(resendOtpSchema), resendOtpHandler)
  .post("/login", validateResource(loginSchema), loginHandler)
  .post(
    "/refresh-token",
    validateResource(refreshTokenSchema),
    refreshTokenHandler
  )
  .post(
    "/forgot-password",
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
  )
  .post(
    "/reset-password",
    requireAuthentication,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
  )

export default router;
