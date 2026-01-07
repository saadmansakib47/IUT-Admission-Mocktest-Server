import { Request, Response } from "express";
import { getQuestionBanks } from "../services/questionBank.service.js";


export const fetchQuestionBanks = async (req: Request, res: Response) => {
    const { type, subject } = req.query as any;
    const banks = await getQuestionBanks(type, subject);
    res.json(banks);
};