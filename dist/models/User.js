import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
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
}, { timestamps: true });
export const User = mongoose.model("User", UserSchema);
