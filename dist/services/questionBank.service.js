import { QuestionBank } from "../models/QuestionBank.js";
export const getQuestionBanks = async (type, subject) => {
    const query = {};
    if (type)
        query.type = type;
    if (subject)
        query.subjects = subject;
    return QuestionBank.find(query).lean();
};
