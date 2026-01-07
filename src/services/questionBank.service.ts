import { QuestionBank } from "../models/QuestionBank";


export const getQuestionBanks = async (type?: string, subject?: string) => {
    const query: any = {};
    if (type) query.type = type;
    if (subject) query.subjects = subject;


    return QuestionBank.find(query).lean();
};