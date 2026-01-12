import { TestSession } from "../models/TestSession.js";
export const buildTestAnalysisPayload = async (userId, testSessionId) => {
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .populate("questions.questionId")
        .populate("questionBankId")
        .lean();
    if (!session)
        throw new Error("Test session not found");
    const subjectStats = {};
    const topicSignals = {};
    for (const q of session.questions) {
        const question = q.questionId;
        const subject = question.subject;
        subjectStats[subject] || (subjectStats[subject] = {
            correct: 0,
            wrong: 0,
            unanswered: 0
        });
        if (!q.selectedAnswer) {
            subjectStats[subject].unanswered++;
        }
        else if (q.selectedAnswer === question.correctAnswer) {
            subjectStats[subject].correct++;
        }
        else {
            subjectStats[subject].wrong++;
        }
        // naive topic inference (MVP)
        const keywords = question.stem.toLowerCase().split(" ");
        for (const k of keywords) {
            if (["gravity", "vector", "newton", "integration"].includes(k)) {
                topicSignals[k] || (topicSignals[k] = { wrong: 0, unanswered: 0 });
                if (!q.selectedAnswer)
                    topicSignals[k].unanswered++;
                else if (q.selectedAnswer !== question.correctAnswer)
                    topicSignals[k].wrong++;
            }
        }
    }
    const timeTakenMinutes = Math.ceil((new Date(session.submittedAt).getTime() -
        new Date(session.startedAt).getTime()) /
        60000);
    return {
        score: session.score,
        total: session.questionBankId.totalQuestions,
        timeTakenMinutes,
        totalTimeMinutes: session.questionBankId.duration,
        subjectStats,
        topicSignals
    };
};
