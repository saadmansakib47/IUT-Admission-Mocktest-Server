import { Schema, model } from "mongoose";
const contactMessageSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["new", "read", "replied", "resolved"],
        default: "new",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });
export default model("ContactMessage", contactMessageSchema);
