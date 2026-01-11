import { verifyAccessToken } from "../utils/jwt.js";
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ message: "No authentication token found" });
    try {
        req.user = verifyAccessToken(token);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
