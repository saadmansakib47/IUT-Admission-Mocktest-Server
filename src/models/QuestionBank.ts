import { Schema, model, Document } from "mongoose";

export interface IQuestionBank extends Document {
    title: string;
    type: "prev_year" | "practice";
    year?: number;
    subjects: string[];
    totalQuestions: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionBankSchema = new Schema<IQuestionBank>(
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

export const QuestionBank = model<IQuestionBank>("QuestionBank", QuestionBankSchema);