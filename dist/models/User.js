import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
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
}, { timestamps: true });
export const User = mongoose.model("User", UserSchema);
