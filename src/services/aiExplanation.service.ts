import { TestSession } from "../models/TestSession.js";
import { Question } from "../models/Question.js";
import { getAIQuestionExplanation } from "./ai.service.js";
import redis from "../config/redis.js";

const EXPLANATION_TTL = 3600 * 24 * 30; // 30 days

export const explainQuestion = async (
    userId: string,
    testSessionId: string,
    questionId: string
) => {
    // 🔑 Redis cache key (test + question specific)
    const cacheKey = `ai:explain:${testSessionId}:${questionId}`;

    // 1️⃣ Check Redis first
    const cachedExplanation = await redis.get(cacheKey);
    if (cachedExplanation) {
        return {
            questionId,
            explanation: cachedExplanation,
            cached: true
        };
    }

    // 2️⃣ Fetch test session (ownership + completion check)
    const session = await TestSession.findOne({
        _id: testSessionId,
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    });

    if (!session) {
        throw new Error("Test session not found");
    }

    // 3️⃣ Verify question belongs to this test
    const answered = session.questions.find(
        q => q.questionId.toString() === questionId
    );

    if (!answered) {
        throw new Error("Question not part of this test");
    }

    // 4️⃣ Fetch question data
    const question = await Question.findById(questionId).lean();
    if (!question) {
        throw new Error("Question not found");
    }

    // 5️⃣ Call AI (MISS path)
    const explanation = await getAIQuestionExplanation({
        subject: question.subject,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answered.selectedAnswer || "Not answered"
    });

    // 6️⃣ Save explanation to Redis
    await redis.set(
        cacheKey,
        JSON.stringify(explanation),
        {
            EX: EXPLANATION_TTL
        }
    );

    // 7️⃣ Return response
    return {
        questionId,
        explanation,
        cached: false
    };
};
