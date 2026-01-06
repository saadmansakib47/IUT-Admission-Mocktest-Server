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
        await AuthService.logoutUser(req.user.userId);
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
