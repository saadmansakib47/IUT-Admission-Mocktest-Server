import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ extends Document {
    question: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>("FAQ", FAQSchema);
