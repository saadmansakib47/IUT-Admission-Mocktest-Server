import { Schema, model, Types } from "mongoose";
const TestSessionSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    questionBankId: { type: Types.ObjectId, ref: "QuestionBank", required: true },
    questions: [
        {
            questionId: { type: Types.ObjectId, ref: "Question" },
            selectedAnswer: String
        }
    ],
    startedAt: Date,
    endsAt: Date,
    submittedAt: Date,
    score: Number
}, { timestamps: true });
export const TestSession = model("TestSession", TestSessionSchema);
