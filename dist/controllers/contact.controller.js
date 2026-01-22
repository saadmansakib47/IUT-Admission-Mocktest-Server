import { createContactMessage, getAllContactMessages, updateContactStatus, deleteContactMessage } from "../services/contact.service.js";
export const submitContactForm = async (req, res) => {
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
        const userId = req.user?.id; // attach if user is logged in
        await createContactMessage({ name, email, message, userId });
        res.status(201).json({
            message: "Your message has been received. We'll get back to you soon.",
        });
    }
    catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const getContactMessages = async (req, res) => {
    try {
        const messages = await getAllContactMessages();
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateContactMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["new", "read", "replied", "resolved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedMessage = await updateContactStatus(id, status);
        if (!updatedMessage) {
            return res.status(404).json({ message: "Contact message not found" });
        }
        res.status(200).json(updatedMessage);
    }
    catch (error) {
        console.error("Error updating contact message status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteContactMessageController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await deleteContactMessage(id);
        if (!deletedMessage) {
            return res.status(404).json({ message: "Contact message not found" });
        }
        res.status(200).json({ message: "Contact message deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting contact message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
