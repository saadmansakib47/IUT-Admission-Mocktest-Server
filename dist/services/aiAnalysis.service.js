import redis from "../config/redis.js";
import { getAIAnalysis } from "./ai.service.js";
export const getCachedTestAnalysis = async (testSessionId, analysisPayload) => {
    const cacheKey = `ai:test-analysis:${testSessionId}`;
    // 1️⃣ Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    // 2️⃣ Call AI
    const analysis = await getAIAnalysis(analysisPayload);
    // 3️⃣ Store cache (7 days)
    await redis.set(cacheKey, JSON.stringify(analysis), {
        EX: 60 * 60 * 24 * 7
    });
    return analysis;
};
