import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
    subject: "phy" | "chem" | "math" | "eng" | "physics" | "chemistry" | "mathematics" | "biology" | "english";
    stem: string;
    options: string[];
    correctAnswer: string;
    difficulty?: "easy" | "medium" | "hard";
    year?: number;
    source: "prev_year" | "practice";
    questionBankId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
    {
        subject: { type: String, enum: ["phy", "chem", "math", "eng", "physics", "chemistry", "mathematics", "biology", "english"], required: true },
        stem: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        difficulty: { type: String, enum: ["easy", "medium", "hard"] },
        year: Number,
        source: { type: String, enum: ["prev_year", "practice"], required: true },
        questionBankId: { type: Schema.Types.ObjectId, ref: "QuestionBank" }
    },
    { timestamps: true }
);

export const Question = model<IQuestion>("Question", QuestionSchema);
