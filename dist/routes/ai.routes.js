import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { aiTestAnalysisHandler } from "../controllers/ai.controller.js";
import { explainQuestionHandler } from "../controllers/aiExplanation.controller.js";
import { getCoachInsightsHandler } from "../controllers/aiCoach.controller.js";
const router = Router();
router.post("/test-analysis/:testSessionId", authMiddleware, aiTestAnalysisHandler);
router.post("/explain-question/:testSessionId/:questionId", authMiddleware, explainQuestionHandler);
// Alias for singular (frontend might be calling this)
router.get("/coach-insight", authMiddleware, getCoachInsightsHandler);
export default router;
