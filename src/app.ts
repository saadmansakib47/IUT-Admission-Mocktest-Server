import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import passport from "passport";
import cors from "cors";

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Specific origin, not *
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200,
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

export default app;
