import { Router } from "express";
import { fetchQuestionBanks } from "../controllers/questionBank.controller.js";


export const questionBankRouter = Router();
questionBankRouter.get("/", fetchQuestionBanks);