import { Question } from "../models/Question.js";
import { TestSession } from "../models/TestSession.js";
import { QuestionBank } from "../models/QuestionBank.js";
export const startTest = async (userId, questionBankId) => {
    const bank = await QuestionBank.findById(questionBankId);
    if (!bank)
        throw new Error("Question bank not found");
    // One active test per bank per user (authenticated users only)
    if (userId) {
        const activeSession = await TestSession.findOne({
            userId,
            questionBankId,
            submittedAt: { $exists: false }
        });
        if (activeSession) {
            throw new Error("Active test already exists for this question bank");
        }
    }
    const questions = await Question.aggregate([
        { $match: { source: bank.type } },
        { $sample: { size: bank.totalQuestions } }
    ]);
    const now = new Date();
    const endsAt = new Date(now.getTime() + bank.duration * 60 * 1000);
    const session = await TestSession.create({
        userId: userId || undefined,
        questionBankId,
        questions: questions.map(q => ({ questionId: q._id })),
        startedAt: now,
        endsAt
    });
    return { session, questions };
};
export const submitTest = async (sessionId) => {
    const session = await TestSession.findById(sessionId).populate("questions.questionId");
    if (!session || session.submittedAt)
        throw new Error("Invalid session");
    let score = 0;
    session.questions.forEach((q) => {
        if (q.selectedAnswer === q.questionId.correctAnswer)
            score++;
    });
    session.score = score;
    session.submittedAt = new Date();
    await session.save();
    return score;
};
