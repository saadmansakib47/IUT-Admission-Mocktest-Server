import ContactMessage, { IContactMessage } from "../models/ContactMessage.js";

export const createContactMessage = async (data: {
    name: string;
    email: string;
    message: string;
    userId?: string;
}): Promise<IContactMessage> => {
    const message = await ContactMessage.create({
        name: data.name,
        email: data.email,
        message: data.message,
        user: data.userId || undefined,
    });

    return message;
};

export const getAllContactMessages = async (): Promise<IContactMessage[]> => {
    return await ContactMessage.find().sort({ createdAt: -1 });
};

export const updateContactStatus = async (
    id: string,
    status: IContactMessage["status"]
): Promise<IContactMessage | null> => {
    return await ContactMessage.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

export const deleteContactMessage = async (id: string): Promise<IContactMessage | null> => {
    return await ContactMessage.findByIdAndDelete(id);
};
