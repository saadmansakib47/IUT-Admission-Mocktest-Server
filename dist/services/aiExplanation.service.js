import { TestSession } from "../models/TestSession.js";
import { Question } from "../models/Question.js";
import { getAIQuestionExplanation } from "./ai.service.js";
export const explainQuestion = async (userId, testSessionId, questionId) => {
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    });
    if (!session)
        throw new Error("Test session not found");
    const answered = session.questions.find(q => q.questionId.toString() === questionId);
    if (!answered) {
        throw new Error("Question not part of this test");
    }
    const question = await Question.findById(questionId).lean();
    if (!question)
        throw new Error("Question not found");
    const explanation = await getAIQuestionExplanation({
        subject: question.subject,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answered.selectedAnswer || "Not answered"
    });
    return {
        questionId,
        explanation
    };
};
