import { Request, Response } from "express";
import { User } from "../models/User.js";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({})
            .select("_id email role createdAt")
            .lean();

        const formattedUsers = users.map(user => ({
            _id: user._id,
            username: user.email.split("@")[0],
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
