import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log the error for internal debugging
    console.error(`[Error] ${req.method} ${req.url}:`, err.message);
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    // Mongoose CastError (e.g. invalid ID)
    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid ID for ${err.path}: "${err.value}". Check if you included a colon ':' by mistake in the URL.`,
        });
    }

    // Mongoose ValidationError
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el: any) => el.message);
        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }

    // Default error
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
};
