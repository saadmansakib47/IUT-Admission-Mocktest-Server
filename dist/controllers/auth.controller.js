import * as AuthService from "../services/auth.service.js";
import { verifyRefreshToken } from "../utils/jwt.js";
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};
const accessTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
};
const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
export const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.createUser(email.toLowerCase(), password);
    const { accessToken, refreshToken } = await AuthService.generateTokens(user.id, user.role);
    const username = user.email.split("@")[0];
    res
        .cookie("accessToken", accessToken, accessTokenCookieOptions)
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .status(201)
        .json({
        message: "Signup successful",
        user: {
            id: user.id,
            username,
            email: user.email,
            role: user.role,
        },
    });
};
export const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.authenticateUser(email.toLowerCase(), password);
    const { accessToken, refreshToken } = await AuthService.generateTokens(user.id, user.role);
    const username = user.email.split("@")[0];
    res
        .cookie("accessToken", accessToken, accessTokenCookieOptions)
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .json({
        message: "Signin successful",
        user: {
            id: user.id,
            username,
            email: user.email,
            role: user.role,
        },
    });
};
export const googleOAuthCallback = async (req, res) => {
    try {
        if (!req.user) {
            console.error("Google OAuth Error: req.user is undefined");
            return res.status(401).json({ message: "Authentication failed" });
        }
        const user = req.user;
        const userId = user._id?.toString() || user.userId;
        if (!userId) {
            console.error("Google OAuth Error: User ID not found in req.user", req.user);
            return res.status(401).json({ message: "Authentication failed" });
        }
        // Use AuthService.generateTokens for consistency (hashes refreshToken in DB)
        const { accessToken, refreshToken } = await AuthService.generateTokens(userId, user.role || "student");
        // set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
        // redirect to frontend
        const redirectUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/dashboard` : "http://localhost:3000/dashboard";
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error("Google OAuth Callback Error:", err);
        res.status(500).json({ message: "Google OAuth failed" });
    }
};
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(401);
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = await AuthService.rotateRefreshToken(payload.userId, refreshToken);
    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions).sendStatus(200);
};
export const logout = async (req, res) => {
    if (req.user) {
        const user = req.user;
        const userId = user.userId || user._id?.toString();
        if (userId) {
            await AuthService.logoutUser(userId);
        }
    }
    res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .sendStatus(200);
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    await AuthService.createResetToken(email.toLowerCase());
    res.sendStatus(200);
};
