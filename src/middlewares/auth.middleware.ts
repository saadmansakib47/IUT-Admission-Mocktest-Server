import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken;
    if (!token) return next();

    try {
        req.user = verifyAccessToken(token);
    } catch {
        // token expired → handled by refresh
    }

    next();
};
