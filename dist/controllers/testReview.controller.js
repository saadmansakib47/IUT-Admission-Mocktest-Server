import { getTestReview } from "../services/testReview.service.js";
export const testReviewHandler = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?._id || user?.userId;
        const { testSessionId } = req.params;
        const review = await getTestReview(userId, testSessionId);
        res.json(review);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
