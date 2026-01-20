import { Router } from "express";
import {
    importQuestionsController,
    deleteQuestionBankController,
    updateQuestionBankController,
    downloadQuestionBankCSV
} from "../controllers/adminQuestion.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { csvUpload } from "../config/multer.js";

const adminQuestionRouter = Router();

adminQuestionRouter.use(authMiddleware);
adminQuestionRouter.use(isAdmin);

adminQuestionRouter.post(
    "/import",
    csvUpload.single("file"),
    importQuestionsController
);

adminQuestionRouter.delete("/bank/:id", deleteQuestionBankController);
adminQuestionRouter.patch("/bank/:id", csvUpload.single("file"), updateQuestionBankController);
adminQuestionRouter.get("/bank/:id/download", downloadQuestionBankCSV);

export default adminQuestionRouter;
