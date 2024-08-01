import { Router } from "express";
import { authController } from "@/api/controllers";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

export { router as authRoutes };
