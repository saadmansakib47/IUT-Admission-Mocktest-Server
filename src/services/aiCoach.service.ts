import { Types } from "mongoose";
import redis from "../config/redis.js";
import { TestSession } from "../models/TestSession.js";
import { getAICoachInsights } from "./ai.service.js";
import fs from "fs";
import path from "path";

interface IPopulatedTestSession {
    _id: Types.ObjectId;
    questionBankId: {
        _id: Types.ObjectId;
        title: string;
        totalQuestions: number;
    };
    score: number;
    status: string;
    startedAt: Date;
    submittedAt: Date | null;
}



export const generateCoachInsights = async (userId: string) => {
    const cacheKey = `ai:coach:${userId}`;

    // 1️⃣ Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        const parsed = JSON.parse(cached);
        // If the cached version is the fallback error, ignore it and refresh
        const isFallback = Array.isArray(parsed) && parsed.length === 1 && parsed[0].type === "warning" && parsed[0].message?.includes("trouble analyzing");

        if (!isFallback) {
            return {
                cached: true,
                insights: parsed
            };
        }
    }

    // 2️⃣ Fetch latest 5 submitted tests
    const sessions = await TestSession.find({
        userId,
        status: { $in: ["submitted", "auto-submitted"] }
    })
        .sort({ submittedAt: -1 })
        .limit(5)
        .populate("questionBankId", "title totalQuestions")
        .lean() as unknown as IPopulatedTestSession[];

    fs.appendFileSync("debug_ai.log", `[${new Date().toISOString()}] User ${userId} - Sessions found: ${sessions.length}\n`);

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

    fs.appendFileSync("debug_ai.log", `[${new Date().toISOString()}] AI Input: ${JSON.stringify(aiInput)}\n`);

    // 4️⃣ Call AI
    const insights = await getAICoachInsights(aiInput);

    // 5️⃣ Cache result (ONLY if it's not the fallback error message)
    const isFallback = insights.length === 1 && insights[0].type === "warning" && insights[0].message.includes("trouble analyzing");

    if (!isFallback) {
        await redis.set(
            cacheKey,
            JSON.stringify(insights),
            {
                EX: 86400
            }
        );
    }

    return {
        cached: false,
        insights
    };
};
