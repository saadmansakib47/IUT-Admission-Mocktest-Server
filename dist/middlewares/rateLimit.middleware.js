import rateLimit from "express-rate-limit";
export const RateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per IP per window
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    message: {
        error: "Too many attempts. Please try again after a minute.",
    },
});
