import { Types } from "mongoose";
import { TestSession } from "../models/TestSession.js";

interface IPopulatedQuestionBank {
    _id: Types.ObjectId;
    title: string;
    totalQuestions: number;
}

interface IPopulatedQuestion {
    _id: Types.ObjectId;
    subject: string;
    stem: string;
    options: string[];
    correctAnswer: string;
}

interface IPopulatedTestSession {
    _id: Types.ObjectId;
    questionBankId: IPopulatedQuestionBank;
    questions: {
        questionId: IPopulatedQuestion;
        selectedAnswer: string | null;
        correct?: boolean;
    }[];
    score: number;
    status: string;
    startedAt: Date;
    submittedAt: Date | null;
}

export const getTestReview = async (
    userId: string,
    testSessionId: string
) => {
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .populate("questionBankId", "title totalQuestions")
        .populate("questions.questionId")
        .lean() as unknown as IPopulatedTestSession | null;

    if (!session) {
        throw new Error("Test session not found or access denied");
    }

    const timeTakenMs =
        session.submittedAt && session.startedAt
            ? new Date(session.submittedAt).getTime() -
            new Date(session.startedAt).getTime()
            : 0;

    const questions = session.questions.map((q) => {
        const question = q.questionId;

        const isCorrect =
            q.selectedAnswer &&
            q.selectedAnswer === question.correctAnswer;

        return {
            questionId: question._id,
            subject: question.subject,
            stem: question.stem,
            options: question.options,
            selectedAnswer: q.selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect
        };
    });

    return {
        examName: session.questionBankId.title,
        score: session.score,
        total: session.questionBankId.totalQuestions,
        startedAt: session.startedAt,
        submittedAt: session.submittedAt,
        timeTakenMinutes: Math.ceil(timeTakenMs / (1000 * 60)),
        questions
    };
};
