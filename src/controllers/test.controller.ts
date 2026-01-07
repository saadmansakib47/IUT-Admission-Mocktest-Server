import { Request, Response } from "express";
import { startTest, submitTest } from "../services/test.service.js";


export const startTestHandler = async (req: Request, res: Response) => {
    const { questionBankId } = req.body;
    const user = req.user as any;
    const userId = user?.userId || user?._id?.toString() || null;


    const { session, questions } = await startTest(userId, questionBankId);


    res.json({
        testSessionId: session._id,
        endsAt: session.endsAt,
        questions: questions.map(q => ({
            questionId: q._id,
            stem: q.stem,
            options: q.options
        }))
    });
};


export const submitTestHandler = async (req: Request, res: Response) => {
    const { testSessionId } = req.params;
    const score = await submitTest(testSessionId);
    res.json({ score, total: 100 });
};