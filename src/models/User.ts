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
    name?: string;
    location?: string;
    bio?: string;
    profilePicture?: string;
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
        name: { type: String, trim: true },
        location: { type: String, trim: true },
        bio: { type: String, trim: true },
        profilePicture: { type: String, trim: true },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
