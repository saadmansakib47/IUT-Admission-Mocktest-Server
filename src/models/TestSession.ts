import { Schema, model, Types } from "mongoose";

const TestSessionSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User", required: true },
        questionBankId: { type: Types.ObjectId, ref: "QuestionBank", required: true },

        // questions in this test session
        questions: [
            {
                questionId: { type: Types.ObjectId, ref: "Question", required: true },
                selectedAnswer: { type: String, default: null }, // initially null
                correct: { type: Boolean, default: false }      // calculated when submitted
            }
        ],

        startedAt: { type: Date, default: () => new Date() },
        endsAt: { type: Date },          // set when session is created
        submittedAt: { type: Date, default: null },

        score: { type: Number, default: 0 }, // default score 0
        status: {
            type: String,
            enum: ["active", "submitted", "auto-submitted"],
            default: "active"
        }
    },
    { timestamps: true }
);

export const TestSession = model("TestSession", TestSessionSchema);
