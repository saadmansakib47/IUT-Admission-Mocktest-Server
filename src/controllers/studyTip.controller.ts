import { Request, Response } from "express";
import * as studyTipService from "../services/studyTip.service.js";

export const fetchStudyTips = async (req: Request, res: Response) => {
    try {
        const { category } = req.query as any;
        const tips = await studyTipService.getStudyTips(category);
        res.json(tips);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch study tips" });
    }
};

export const addStudyTip = async (req: Request, res: Response) => {
    try {
        const tip = await studyTipService.createStudyTip(req.body);
        res.status(201).json(tip);
    } catch (error) {
        res.status(500).json({ message: "Failed to create study tip" });
    }
};

export const editStudyTip = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tip = await studyTipService.updateStudyTip(id, req.body);
        if (!tip) {
            return res.status(404).json({ message: "Study tip not found" });
        }
        res.json(tip);
    } catch (error) {
        res.status(500).json({ message: "Failed to update study tip" });
    }
};

export const removeStudyTip = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tip = await studyTipService.deleteStudyTip(id);
        if (!tip) {
            return res.status(404).json({ message: "Study tip not found" });
        }
        res.json({ message: "Study tip deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete study tip" });
    }
};
