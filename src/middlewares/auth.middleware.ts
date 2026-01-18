import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        console.warn(`[AuthMiddleware] No accessToken found for ${req.method} ${req.url}`);
        return res.status(401).json({ message: "No authentication token found" });
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch (err: any) {
        console.error(`[AuthMiddleware] Token verification failed for ${req.method} ${req.url}:`, err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
