// src/controllers/aiCoach.controller.ts
import { generateCoachInsights } from "../services/aiCoach.service.js";

export const getCoachInsightsHandler = async (req: any, res: any) => {
    let userId: string | undefined;
    try {
        const user = req.user as any;
        userId = user.userId || user._id?.toString();

        if (!userId) {
            return res.status(401).json({ message: "User identity not found in token" });
        }

        const result = await generateCoachInsights(userId);
        console.log(`[AICoach] Insights generated for user ${userId}: ${result.insights.length} items (cached: ${result.cached})`);

        // Return only the insights array if that's what the frontend expects
        // Many frontends expect the array directly for mapping
        res.json(result.insights);
    } catch (err: any) {
        console.error(`[AICoach] Error for user ${userId || "unknown"}:`, err);
        res.status(500).json({ message: err.message });
    }
};

