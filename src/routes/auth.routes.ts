import { Router } from "express";
import { createUserHandler, resendOtpHandler, verifyOtpHandler } from "../controllers/user.controllers";
import validateResource from "../middlewares/validate-resouce";
import { createUserSchema, resendOtpSchema, verifyOtpSchema } from "../schema/user.schema";

const router = Router();

router
  .route("/register")
  .post(validateResource(createUserSchema), createUserHandler);

router.route("/verify-otp").post(validateResource(verifyOtpSchema), verifyOtpHandler);
router.route("/resend-otp").post(validateResource(resendOtpSchema), resendOtpHandler);

export default router;
