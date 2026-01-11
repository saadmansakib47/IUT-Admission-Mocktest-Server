//Test Controller
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


export const answerQuestionHandler = async (req: Request, res: Response) => {
    const { testSessionId } = req.params;
    const { questionId, selectedAnswer } = req.body;
    const userId = (req.user as any)._id;

    const session = await TestSession.findById(testSessionId);
    if (!session) return res.status(404).json({ message: "Test session not found" });

    if (session.userId.toString() !== userId.toString())
        return res.status(403).json({ message: "Not your test session" });

    if (session.status !== "active") {
        return res.status(400).json({ message: "Cannot answer a submitted test" });
    }

    // find question in session
    const questionIndex = session.questions.findIndex(q => q.questionId.toString() === questionId);
    if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found in this session" });
    }

    // update selectedAnswer
    session.questions[questionIndex].selectedAnswer = selectedAnswer;

    await session.save();

    res.json({ message: "Answer saved" });
};


export const submitTestHandler = async (req: Request, res: Response) => {
    const { testSessionId } = req.params;

    const session = await TestSession.findById(testSessionId).populate("questions.questionId");

    if (!session) {
        return res.status(404).json({ message: "Test session not found" });
    }

    // Auto-submit on timeout
    if (!session.submittedAt && session.endsAt && new Date() > session.endsAt) {
        const score = await submitTest(testSessionId); // autoSubmit = true
        return res.json({ score, total: session.questions.length, autoSubmitted: true });
    }

    // Already submitted
    if (session.submittedAt) {
        return res.status(400).json({ message: "Test already submitted" });
    }

    const score = await submitTest(testSessionId);
    res.json({ score, total: session.questions.length, autoSubmitted: false });
};

