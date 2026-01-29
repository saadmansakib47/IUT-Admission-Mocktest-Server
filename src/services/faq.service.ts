import { FAQ, IFAQ } from "../models/FAQ.js";

export const getFAQs = async () => {
    return FAQ.find().sort({ createdAt: -1 }).lean();
};

export const createFAQ = async (data: Partial<IFAQ>) => {
    const faq = new FAQ(data);
    return faq.save();
};

export const updateFAQ = async (id: string, data: Partial<IFAQ>) => {
    return FAQ.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteFAQ = async (id: string) => {
    return FAQ.findByIdAndDelete(id).lean();
};
