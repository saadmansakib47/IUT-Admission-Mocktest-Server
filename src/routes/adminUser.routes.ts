import { Router } from "express";
import { getAllUsers } from "../controllers/adminUser.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const adminUserRouter = Router();

adminUserRouter.get("/", authMiddleware, isAdmin, getAllUsers);

export default adminUserRouter;
