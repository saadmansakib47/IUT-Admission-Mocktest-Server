import { Schema, model } from "mongoose";


const QuestionBankSchema = new Schema(
    {
        title: { type: String, required: true },
        type: { type: String, enum: ["prev_year", "practice"], required: true },
        year: Number,
        subjects: { type: [String], required: true },
        totalQuestions: { type: Number, default: 100 },
        duration: { type: Number, default: 120 }
    },
    { timestamps: true }
);


export const QuestionBank = model("QuestionBank", QuestionBankSchema);