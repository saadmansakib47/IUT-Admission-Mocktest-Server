import { StudyTip, IStudyTip } from "../models/StudyTip.js";

export const getStudyTips = async (category?: string) => {
    const query: any = {};
    if (category) query.category = category;
    return StudyTip.find(query).sort({ createdAt: -1 }).lean();
};

export const createStudyTip = async (data: Partial<IStudyTip>) => {
    const studyTip = new StudyTip(data);
    return studyTip.save();
};

export const updateStudyTip = async (id: string, data: Partial<IStudyTip>) => {
    return StudyTip.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteStudyTip = async (id: string) => {
    return StudyTip.findByIdAndDelete(id).lean();
};
