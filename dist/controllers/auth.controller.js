import * as AuthService from "../services/auth.service.js";
import { verifyRefreshToken } from "../utils/jwt.js";
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};
export const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.createUser(email.toLowerCase(), password);
    const { accessToken, refreshToken } = await AuthService.generateTokens(user.id, user.role);
    res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(201)
        .json({ message: "Signup successful" });
};
export const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.authenticateUser(email.toLowerCase(), password);
    const { accessToken, refreshToken } = await AuthService.generateTokens(user.id, user.role);
    res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({ message: "Signin successful" });
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
        res.cookie("accessToken", accessToken, { ...cookieOptions, sameSite: "none", secure: true });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, sameSite: "none", secure: true });
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
    res.cookie("accessToken", newAccessToken, cookieOptions).sendStatus(200);
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
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .sendStatus(200);
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    await AuthService.createResetToken(email.toLowerCase());
    res.sendStatus(200);
};
