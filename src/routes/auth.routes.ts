import { Router } from "express";
import {
    signup,
    signin,
    refresh,
    logout,
    forgotPassword,
} from "../controllers/auth.controller.js";

// rate limiter middleware
import { RateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * Rate-limited routes
 * 5 attempts / minute / IP
 */
router.post("/signup", RateLimiter, signup);


router.post("/signin", RateLimiter, signin);


router.post("/forgot-password", RateLimiter, forgotPassword);


/**
 * Non-rate-limited routes
 */
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
