import { Router } from "express";
import * as faqController from "../controllers/faq.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

// Public route
router.get("/", faqController.fetchFAQs);

// Admin routes
router.use(authMiddleware);
router.use(isAdmin);

router.post("/", faqController.addFAQ);
router.put("/:id", faqController.editFAQ);
router.delete("/:id", faqController.removeFAQ);

export default router;
