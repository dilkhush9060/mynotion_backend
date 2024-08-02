import { Router } from "express";
import { authController } from "@/api/controllers";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/email/send", authController.sendVerificationMail);

export { router as authRoutes };
