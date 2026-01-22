import fs from "fs";
import csv from "csv-parser";
import { Question } from "../models/Question.js";
import { QuestionBank } from "../models/QuestionBank.js";
export const importCSVQuestions = async (filePath) => {
    const rows = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => rows.push(row))
            .on("end", resolve)
            .on("error", reject);
    });
    if (!rows.length) {
        throw new Error("CSV file is empty");
    }
    // Derive bank metadata from first row
    const { bankTitle, source, year, subject } = rows[0];
    const subjects = Array.from(new Set(rows.map(r => r.subject)));
    const bank = await QuestionBank.findOneAndUpdate({ title: bankTitle }, {
        title: bankTitle,
        type: source,
        year: year ? Number(year) : undefined,
        subjects,
        totalQuestions: rows.length,
    }, { upsert: true, new: true });
    let inserted = 0;
    let skipped = 0;
    for (const row of rows) {
        const options = [
            row.optionA,
            row.optionB,
            row.optionC,
            row.optionD,
        ];
        // Prevent exact duplicates
        const exists = await Question.exists({
            stem: row.stem,
            year: row.year ? Number(row.year) : undefined,
            source: row.source,
        });
        if (exists) {
            skipped++;
            continue;
        }
        await Question.create({
            subject: row.subject,
            stem: row.stem,
            options,
            correctAnswer: row.correctAnswer,
            difficulty: row.difficulty,
            year: row.year ? Number(row.year) : undefined,
            source: row.source,
            questionBankId: bank._id,
        });
        inserted++;
    }
    fs.unlinkSync(filePath); // cleanup uploaded file
    return {
        bankId: bank._id,
        totalRows: rows.length,
        inserted,
        skipped,
    };
};
