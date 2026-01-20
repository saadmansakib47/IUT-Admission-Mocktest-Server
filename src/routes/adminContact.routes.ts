import { Router } from "express";
import {
    getContactMessages,
    updateContactMessageStatus,
    deleteContactMessageController
} from "../controllers/contact.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(isAdmin);

router.get("/", getContactMessages);
router.patch("/:id", updateContactMessageStatus);
router.delete("/:id", deleteContactMessageController);

export default router;
