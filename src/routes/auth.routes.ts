import { Router } from "express";
import { createUserHandler } from "../controllers/user.controllers";
import validateResource from "../middlewares/validate-resouce";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.route("/register").post(validateResource(createUserSchema), createUserHandler);

export default router;
