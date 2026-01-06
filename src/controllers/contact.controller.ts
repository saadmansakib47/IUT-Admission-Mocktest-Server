import { Request, Response } from "express";
import { createContactMessage } from "../services/contact.service.js";

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // simple regex email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.toLowerCase())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userId = (req as any).user?.id; // attach if user is logged in

        await createContactMessage({ name, email, message, userId });

        res.status(201).json({
            message: "Your message has been received. We'll get back to you soon.",
        });
    } catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
