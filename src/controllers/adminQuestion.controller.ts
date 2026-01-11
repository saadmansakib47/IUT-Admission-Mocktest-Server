import { Request, Response } from "express";
import { importCSVQuestions } from "../services/questionImport.service";

export const importQuestionsController = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "CSV file required" });
    }

    const result = await importCSVQuestions(req.file.path);

    res.status(201).json({
        message: "Questions imported successfully",
        ...result,
    });
};
