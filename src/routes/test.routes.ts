import { Router } from "express";
import { answerQuestionHandler, startTestHandler, submitTestHandler } from "../controllers/test.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


export const testRouter = Router();


testRouter.post("/start", authMiddleware, startTestHandler);
testRouter.patch("/:testSessionId/answer", authMiddleware, answerQuestionHandler);
testRouter.post("/:testSessionId/submit", authMiddleware, submitTestHandler);