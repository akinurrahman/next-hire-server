import { Router } from "express";
import { createUserHandler, verifyOtpHandler } from "../controllers/user.controllers";
import validateResource from "../middlewares/validate-resouce";
import { createUserSchema, verifyOtpSchema } from "../schema/user.schema";

const router = Router();

router
  .route("/register")
  .post(validateResource(createUserSchema), createUserHandler);

router.route("/verify-otp").post(validateResource(verifyOtpSchema), verifyOtpHandler);

export default router;
