import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: "student" | "admin";
    isEmailVerified: boolean;
    refreshTokenHash?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshTokenHash: String,
        resetToken: String,
        resetTokenExpiry: Date,
        lastLoginAt: Date,
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
