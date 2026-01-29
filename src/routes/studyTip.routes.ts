import { Router } from "express";
import * as studyTipController from "../controllers/studyTip.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

// Public route
router.get("/", studyTipController.fetchStudyTips);

// Admin routes
router.use(authMiddleware);
router.use(isAdmin);

router.post("/", studyTipController.addStudyTip);
router.put("/:id", studyTipController.editStudyTip);
router.delete("/:id", studyTipController.removeStudyTip);

export default router;
