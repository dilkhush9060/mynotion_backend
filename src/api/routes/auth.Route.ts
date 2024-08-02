import { Router } from "express";
import { authController } from "@/api/controllers";
import { tokenMiddleware } from "../middlewares";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/email/send", authController.sendVerificationMail);
router.post(
  "/email/verify",
  tokenMiddleware,
  authController.emailVerificationComplete
);
router.post("/password/forgot", authController.forgotPassword);
router.post("/password/reset", tokenMiddleware, authController.resetPassword);

export { router as authRoutes };
