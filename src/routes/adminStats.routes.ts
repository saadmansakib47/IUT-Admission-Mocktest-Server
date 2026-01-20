import { Router } from "express";
import { getUserCount } from "../controllers/adminStats.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(isAdmin);

router.get("/users/count", getUserCount);

export default router;
