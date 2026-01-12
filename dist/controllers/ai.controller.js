import { buildTestAnalysisPayload } from "../services/testAnalysisBuilder.service.js";
import { getAIAnalysis } from "../services/ai.service.js";
export const aiTestAnalysisHandler = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?.userId || user?._id?.toString();
        const { testSessionId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const analysisPayload = await buildTestAnalysisPayload(userId, testSessionId);
        const aiResponse = await getAIAnalysis(analysisPayload);
        res.json({
            analysis: aiResponse
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
