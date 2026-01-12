import { Request, Response } from "express";
import { getTestReview } from "../services/testReview.service.js";

export const testReviewHandler = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        const userId = user?._id || user?.userId;
        const { testSessionId } = req.params;

        const review = await getTestReview(userId, testSessionId);

        res.json(review);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
