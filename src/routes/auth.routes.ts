import { Router } from "express";
import {
    signup,
    signin,
    refresh,
    logout,
    forgotPassword,
} from "../controllers/auth.controller.js";

// (Optional) rate limiter middleware
// import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * Rate-limited routes
 * 5 attempts / minute / IP
 */
// router.post("/signup", authRateLimiter, signup);
router.post("/signup", signup);

// router.post("/signin", authRateLimiter, signin);
router.post("/signin", signin);

// router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/forgot-password", forgotPassword);

/**
 * Non-rate-limited routes
 */
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
