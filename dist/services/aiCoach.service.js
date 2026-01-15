import redis from "../config/redis.js";
import { TestSession } from "../models/TestSession.js";
import { getAICoachInsights } from "./ai.service.js";
export const generateCoachInsights = async (userId) => {
    const cacheKey = `ai:coach:${userId}`;
    // 1️⃣ Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return {
            cached: true,
            insights: JSON.parse(cached)
        };
    }
    // 2️⃣ Fetch latest 5 submitted tests
    const sessions = await TestSession.find({
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .sort({ submittedAt: -1 })
        .limit(5)
        .populate("questionBankId", "title totalQuestions")
        .lean();
    if (sessions.length < 2) {
        return {
            cached: false,
            insights: [
                {
                    tag: "on-track",
                    message: "Complete more tests to unlock personalized AI coaching insights."
                }
            ]
        };
    }
    // 3️⃣ Shape minimal AI input
    const aiInput = sessions.map(s => {
        const timeTaken = s.submittedAt && s.startedAt
            ? Math.ceil((new Date(s.submittedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)
            : 0;
        return {
            title: s.questionBankId?.title || "Unknown Test",
            score: s.score,
            totalMarks: s.questionBankId?.totalQuestions || 0,
            timeTaken,
            submittedAt: s.submittedAt
        };
    });
    // 4️⃣ Call AI
    const insights = await getAICoachInsights(aiInput);
    // 5️⃣ Cache result
    await redis.set(cacheKey, JSON.stringify(insights), {
        EX: 86400
    });
    return {
        cached: false,
        insights
    };
};
