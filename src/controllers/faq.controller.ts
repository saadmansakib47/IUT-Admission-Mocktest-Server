import { Request, Response } from "express";
import * as faqService from "../services/faq.service.js";

export const fetchFAQs = async (req: Request, res: Response) => {
    try {
        const faqs = await faqService.getFAQs();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch FAQs" });
    }
};

export const addFAQ = async (req: Request, res: Response) => {
    try {
        const faq = await faqService.createFAQ(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Failed to create FAQ" });
    }
};

export const editFAQ = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const faq = await faqService.updateFAQ(id, req.body);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: "Failed to update FAQ" });
    }
};

export const removeFAQ = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const faq = await faqService.deleteFAQ(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete FAQ" });
    }
};
