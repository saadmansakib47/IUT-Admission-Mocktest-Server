import { Schema, model } from "mongoose";


const QuestionSchema = new Schema(
    {
        subject: { type: String, enum: ["phy", "chem", "math", "eng"], required: true },
        stem: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        difficulty: { type: String, enum: ["easy", "medium", "hard"] },
        year: Number,
        source: { type: String, enum: ["prev_year", "practice"], required: true }
    },
    { timestamps: true }
);