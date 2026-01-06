import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
    userId: string;
    role: "student" | "admin";
}

export const signAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
};

export const signRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

export const generateTokens = (user: { _id: any; role: string }) => {
    const payload = {
        userId: user._id.toString(),
        role: user.role as "student" | "admin",
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken };
};

