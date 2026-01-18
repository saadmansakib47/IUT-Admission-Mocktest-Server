// src/controllers/aiCoach.controller.ts
import { generateCoachInsights } from "../services/aiCoach.service.js";
export const getCoachInsightsHandler = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.userId || user._id?.toString();
        if (!userId) {
            return res.status(401).json({ message: "User identity not found in token" });
        }
        const result = await generateCoachInsights(userId);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
