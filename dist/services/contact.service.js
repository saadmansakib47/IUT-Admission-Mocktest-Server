import ContactMessage from "../models/ContactMessage.js";
export const createContactMessage = async (data) => {
    const message = await ContactMessage.create({
        name: data.name,
        email: data.email,
        message: data.message,
        user: data.userId || undefined,
    });
    return message;
};
