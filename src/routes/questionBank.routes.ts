import { Router } from "express";
import { fetchQuestionBanks } from "../controllers/questionBank.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const questionBankRouter = Router();
questionBankRouter.get("/", authMiddleware, fetchQuestionBanks);