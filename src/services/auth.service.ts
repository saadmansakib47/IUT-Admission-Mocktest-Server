import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export const createUser = async (
    username: string,
    email: string,
    password: string
) => {
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        username,
        email,
        passwordHash,
    });

    return user;
};

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    user.lastLoginAt = new Date();
    await user.save();

    return user;
};

export const generateTokens = async (userId: string, role: "student" | "admin") => {
    const payload = { userId, role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await User.findByIdAndUpdate(userId, {
        refreshTokenHash,
    });

    return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (
    userId: string,
    refreshToken: string
) => {
    const user = await User.findById(userId);
    if (!user || !user.refreshTokenHash) {
        throw new Error("Unauthorized");
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new Error("Unauthorized");

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken({
        userId: user.id,
        role: user.role,
    });

    return accessToken;
};

export const logoutUser = async (userId: string) => {
    await User.findByIdAndUpdate(userId, {
        refreshTokenHash: null,
    });
};

export const createResetToken = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) return; // prevent email enumeration

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 min
    await user.save();

    return token;
};
