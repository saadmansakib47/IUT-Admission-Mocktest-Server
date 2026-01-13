import { Router } from "express";
import { answerQuestionHandler, startTestHandler, submitTestHandler, getTestSessionHandler } from "../controllers/test.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { RateLimiter } from "../middlewares/rateLimit.middleware.js";
import { testHistoryHandler } from "../controllers/testHistory.controller.js";
import { testReviewHandler } from "../controllers/testReview.controller.js";

export const testRouter = Router();

// Static and more specific routes first
testRouter.post("/start", authMiddleware, startTestHandler);
testRouter.get("/history", authMiddleware, testHistoryHandler);
testRouter.get("/history/:testSessionId", authMiddleware, testReviewHandler);

// Dynamic/Catch-all routes last
testRouter.get("/:testSessionId", authMiddleware, getTestSessionHandler);
testRouter.patch("/:testSessionId/answer", authMiddleware, answerQuestionHandler);
testRouter.post("/:testSessionId/submit", authMiddleware, RateLimiter, submitTestHandler);
