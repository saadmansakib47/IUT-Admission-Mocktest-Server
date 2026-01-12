import { TestSession } from "../models/TestSession.js";

export const getTestHistory = async (
    userId: string,
    page: number,
    limit: number
) => {
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
        TestSession.find({
            userId,
            status: { $in: ["submitted", "auto-submitted"] }
        })
            .populate("questionBankId", "title totalQuestions")
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        TestSession.countDocuments({
            userId,
            status: { $in: ["submitted", "auto-submitted"] }
        })
    ]);

    const data = sessions.map((s: any) => {
        const timeTakenMs =
            s.submittedAt && s.startedAt
                ? new Date(s.submittedAt).getTime() -
                new Date(s.startedAt).getTime()
                : 0;

        return {
            testSessionId: s._id,
            examName: s.questionBankId.title,
            score: s.score,
            total: s.questionBankId.totalQuestions,
            timeTakenMinutes: Math.ceil(timeTakenMs / (1000 * 60)),
            submittedAt: s.submittedAt,
            status: s.status
        };
    });

    return {
        total,
        data
    };
};
