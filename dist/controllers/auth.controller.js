import * as AuthService from "../services/auth.service.js";
import { verifyRefreshToken } from "../utils/jwt.js";
import { generateTokens } from "../utils/jwt.js";
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
        const user = req.user; // passport attaches user here
        // generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        // save refreshToken hash
        user.refreshTokenHash = refreshToken; // or hash it like in standard signup
        await user.save();
        // set cookies
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
        // redirect to frontend
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
    catch (err) {
        console.error(err);
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
