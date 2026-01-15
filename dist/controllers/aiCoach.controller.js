// src/controllers/aiCoach.controller.ts
import { generateCoachInsights } from "../services/aiCoach.service.js";
export const getCoachInsightsHandler = async (req, res) => {
    const userId = req.user.id;
    const result = await generateCoachInsights(userId);
    res.json(result);
};
