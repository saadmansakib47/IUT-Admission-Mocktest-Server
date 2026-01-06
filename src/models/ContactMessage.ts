import { Schema, model, Document, Types } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    status: "new" | "read" | "replied" | "resolved";
    user?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        message: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["new", "read", "replied", "resolved"],
            default: "new",
        },
        user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    },
    { timestamps: true }
);

export default model<IContactMessage>("ContactMessage", contactMessageSchema);
