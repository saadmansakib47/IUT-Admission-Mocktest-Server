import { TestSession } from "../models/TestSession.js";
export const getTestReview = async (userId, testSessionId) => {
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .populate("questionBankId", "title totalQuestions")
        .populate("questions.questionId")
        .lean();
    if (!session) {
        throw new Error("Test session not found or access denied");
    }
    const timeTakenMs = session.submittedAt && session.startedAt
        ? new Date(session.submittedAt).getTime() -
            new Date(session.startedAt).getTime()
        : 0;
    const questions = session.questions.map((q) => {
        const question = q.questionId;
        const isCorrect = q.selectedAnswer &&
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
