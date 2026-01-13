import { Request, Response } from "express";
import { explainQuestion } from "../services/aiExplanation.service.js";

export const explainQuestionHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const user = req.user as any;
        const userId = user._id || user.userId;

        const { testSessionId, questionId } = req.params;

        const result = await explainQuestion(
            userId,
            testSessionId,
            questionId
        );

        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
