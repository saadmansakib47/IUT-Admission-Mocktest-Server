import { Request, Response } from "express";
import { startTest, submitTest } from "../services/test.service.js";
import { TestSession } from "../models/TestSession.js";


export const startTestHandler = async (req: Request, res: Response) => {
    const { questionBankId } = req.body;
    const user = req.user as any;
    const userId = user?.userId || user?._id?.toString() || null;


    const { session, questions } = await startTest(userId, questionBankId);


    res.json({
        testSessionId: session._id,
        endsAt: session.endsAt,
        questions: (questions as any[]).map(q => ({
            questionId: q._id,
            stem: q.stem,
            options: q.options
        }))
    });
};


export const submitTestHandler = async (req: Request, res: Response) => {
    const { testSessionId } = req.params;
    const session = await TestSession.findById(testSessionId);

    //Invalid test session
    if (!session) {
        return res.status(404).json({ message: "Test session not found" });
    }


    // Auto-submit on timeout
    if (!session.submittedAt && session.endsAt && new Date() > session.endsAt) {
        const score = await submitTest(testSessionId);
        return res.json({ score, total: 100, autoSubmitted: true });
    }

    //Already submitted tests
    if (session.submittedAt) {
        return res.status(400).json({ message: "Test already submitted" });
    }


    const score = await submitTest(testSessionId);
    res.json({ score, total: 100, autoSubmitted: false });
};

