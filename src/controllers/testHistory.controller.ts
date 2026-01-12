import { Request, Response } from "express";
import { getTestHistory } from "../services/testHistory.service.js";

export const testHistoryHandler = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const { total, data } = await getTestHistory(userId, page, limit);

    res.json({
        page,
        limit,
        total,
        data
    });
};
