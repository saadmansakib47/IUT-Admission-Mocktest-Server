import mongoose, { Schema, Document } from "mongoose";

export type StudyTipCategory = "Preparation" | "Subject-Wise" | "Time Management" | "Exam day";

export interface IStudyTip extends Document {
    title: string;
    subtitle?: string;
    content: string;
    category: StudyTipCategory;
    createdAt: Date;
    updatedAt: Date;
}

const StudyTipSchema = new Schema<IStudyTip>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Preparation", "Subject-Wise", "Time Management", "Exam day"],
        },
    },
    { timestamps: true }
);

export const StudyTip = mongoose.model<IStudyTip>("StudyTip", StudyTipSchema);
