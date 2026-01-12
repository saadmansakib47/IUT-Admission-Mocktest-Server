import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { aiTestAnalysisHandler } from "../controllers/ai.controller.js";
const router = Router();
router.post("/test-analysis/:testSessionId", authMiddleware, aiTestAnalysisHandler);
export default router;
