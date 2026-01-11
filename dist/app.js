import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import passport from "passport";
import cors from "cors";
import { testRouter } from "./routes/test.routes.js";
import { questionBankRouter } from "./routes/questionBank.routes.js";
import adminQuestionRouter from "./routes/adminQuestion.routes.js";
// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Specific origin, not *
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
const app = express();
app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/question-banks", questionBankRouter);
app.use("/api/tests", testRouter);
app.use("/api/admin/questions", adminQuestionRouter);
export default app;
