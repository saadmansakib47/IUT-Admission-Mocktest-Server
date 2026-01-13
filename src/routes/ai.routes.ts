import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { aiTestAnalysisHandler } from "../controllers/ai.controller.js";
import { explainQuestionHandler } from "../controllers/aiExplanation.controller.js";

const router = Router();

router.post(
    "/test-analysis/:testSessionId",
    authMiddleware,
    aiTestAnalysisHandler
);

router.post(
    "/explain-question/:testSessionId/:questionId",
    authMiddleware,
    explainQuestionHandler
);

export default router;
