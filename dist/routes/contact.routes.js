import { Router } from "express";
import { submitContactForm } from "../controllers/contact.controller.js";
import { RateLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();
// Public route
router.post("/", RateLimiter, submitContactForm);
export default router;
