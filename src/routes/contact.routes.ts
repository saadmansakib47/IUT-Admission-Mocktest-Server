import { Router } from "express";
import { submitContactForm, getContactMessages } from "../controllers/contact.controller.js";
import { RateLimiter } from "../middlewares/rateLimit.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

// Public route
router.post("/", RateLimiter, submitContactForm);

// Admin route
router.get("/", authMiddleware, isAdmin, getContactMessages);

export default router;
