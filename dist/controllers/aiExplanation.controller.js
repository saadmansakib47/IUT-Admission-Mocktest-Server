import { explainQuestion } from "../services/aiExplanation.service.js";
export const explainQuestionHandler = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id || user.userId;
        const { testSessionId, questionId } = req.params;
        const result = await explainQuestion(userId, testSessionId, questionId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
