import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import passport from "passport";
import cors from "cors";
import { testRouter } from "./routes/test.routes.js";
import { questionBankRouter } from "./routes/questionBank.routes.js";
import adminQuestionRouter from "./routes/adminQuestion.routes.js";
import adminContactRouter from "./routes/adminContact.routes.js";
import adminStatsRouter from "./routes/adminStats.routes.js";
import adminUserRouter from "./routes/adminUser.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import aiRoutes from "./routes/ai.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import studyTipRoutes from "./routes/studyTip.routes.js";
import { httpLogger } from "./config/pino.js";

// CORS configuration
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = [
            "http://localhost:3000",
            "https://iut-test-prep.vercel.app",
            process.env.FRONTEND_URL
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
app.use("/api/admin/contacts", adminContactRouter);
app.use("/api/admin/stats", adminStatsRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/user", userRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/study-tips", studyTipRoutes);

app.use(errorHandler);
app.use(httpLogger);

export default app;
