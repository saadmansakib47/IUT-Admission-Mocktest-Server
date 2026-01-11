import { importCSVQuestions } from "../services/questionImport.service.js";
export const importQuestionsController = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "CSV file required" });
    }
    const result = await importCSVQuestions(req.file.path);
    res.status(201).json({
        message: "Questions imported successfully",
        ...result,
    });
};
