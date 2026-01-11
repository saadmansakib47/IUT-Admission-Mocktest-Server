import { Router } from "express";
import { importQuestionsController } from "../controllers/adminQuestion.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { csvUpload } from "../config/multer.js";

const adminQuestionRouter = Router();

adminQuestionRouter.post(
    "/questions/import",
    authMiddleware,
    isAdmin,
    csvUpload.single("file"),
    importQuestionsController
);

export default adminQuestionRouter;
