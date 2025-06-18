import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  resendOtpHandler,
  verifyOtpHandler,
  refreshTokenHandler,
} from "../controllers/user.controllers";
import validateResource from "../middlewares/validate-resouce";
import {
  createUserSchema,
  loginSchema,
  resendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from "../schema/user.schema";

const router = Router();

router
  .route("/register")
  .post(validateResource(createUserSchema), createUserHandler);

router
  .route("/verify-otp")
  .post(validateResource(verifyOtpSchema), verifyOtpHandler);
router
  .route("/resend-otp")
  .post(validateResource(resendOtpSchema), resendOtpHandler);
router.route("/login").post(validateResource(loginSchema), loginHandler);
router
  .route("/refresh-token")
  .post(validateResource(refreshTokenSchema), refreshTokenHandler);

export default router;
