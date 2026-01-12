import { Types } from "mongoose";
import { TestSession } from "../models/TestSession.js";

interface IPopulatedQuestionBank {
    _id: Types.ObjectId;
    totalQuestions: number;
    duration: number;
}

interface IPopulatedQuestion {
    _id: Types.ObjectId;
    subject: string;
    stem: string;
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

export const buildTestAnalysisPayload = async (
    userId: string,
    testSessionId: string
) => {
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .populate("questions.questionId")
        .populate("questionBankId")
        .lean() as unknown as IPopulatedTestSession | null;

    if (!session) throw new Error("Test session not found");

    const subjectStats: any = {};
    const topicSignals: any = {};

    for (const q of session.questions as any[]) {
        const question = q.questionId;
        const subject = question.subject;

        subjectStats[subject] ||= {
            correct: 0,
            wrong: 0,
            unanswered: 0
        };

        if (!q.selectedAnswer) {
            subjectStats[subject].unanswered++;
        } else if (q.selectedAnswer === question.correctAnswer) {
            subjectStats[subject].correct++;
        } else {
            subjectStats[subject].wrong++;
        }

        // naive topic inference (MVP)
        const keywords = question.stem.toLowerCase().split(" ");
        for (const k of keywords) {
            if (["gravity", "vector", "newton", "integration"].includes(k)) {
                topicSignals[k] ||= { wrong: 0, unanswered: 0 };
                if (!q.selectedAnswer) topicSignals[k].unanswered++;
                else if (q.selectedAnswer !== question.correctAnswer)
                    topicSignals[k].wrong++;
            }
        }
    }

    const timeTakenMinutes = Math.ceil(
        (new Date(session.submittedAt!).getTime() -
            new Date(session.startedAt).getTime()) /
        60000
    );

    return {
        score: session.score,
        total: session.questionBankId.totalQuestions,
        timeTakenMinutes,
        totalTimeMinutes: session.questionBankId.duration,
        subjectStats,
        topicSignals
    };
};
