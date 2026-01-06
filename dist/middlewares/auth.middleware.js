import { verifyAccessToken } from "../utils/jwt.js";
export const authMiddleware = (req, _res, next) => {
    const token = req.cookies.accessToken;
    if (!token)
        return next();
    try {
        req.user = verifyAccessToken(token);
    }
    catch {
        // token expired → handled by refresh
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map