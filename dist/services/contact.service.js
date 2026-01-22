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
export const getAllContactMessages = async () => {
    return await ContactMessage.find().sort({ createdAt: -1 });
};
export const updateContactStatus = async (id, status) => {
    return await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
};
export const deleteContactMessage = async (id) => {
    return await ContactMessage.findByIdAndDelete(id);
};
