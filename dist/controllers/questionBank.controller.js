import { getQuestionBanks } from "../services/questionBank.service.js";
export const fetchQuestionBanks = async (req, res) => {
    const { type, subject } = req.query;
    const banks = await getQuestionBanks(type, subject);
    res.json(banks);
};
