import { Router } from "express";
import { startTestHandler, submitTestHandler } from "../controllers/test.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
export const testRouter = Router();
testRouter.post("/start", authMiddleware, startTestHandler);
testRouter.post("/:testSessionId/submit", authMiddleware, submitTestHandler);
