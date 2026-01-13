import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const getAIAnalysis = async (analysisPayload: any) => {
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert university admission mentor. Give actionable feedback."
                },
                {
                    role: "user",
                    content: `
Here is the student's test performance data:
${JSON.stringify(analysisPayload, null, 2)}

Please analyze:
- Score quality
- Time management
- Weak subjects & topics
- Practical improvement advice
`
                }
            ],
            temperature: 0.7
        })
    });

    const data: any = await response.json();
    return data.choices[0].message.content;
};


export const getAIQuestionExplanation = async (payload: {
    subject: string;
    stem: string;
    options: string[];
    correctAnswer: string;
    selectedAnswer: string | null;
}) => {
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an experienced university admission tutor. Explain MCQ answers clearly with exam-focused guidance."
                },
                {
                    role: "user",
                    content: `
Question (Subject: ${payload.subject}):

"${payload.stem}"

Options:
${payload.options
                            .map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`)
                            .join("\n")}

Correct Answer:
${payload.correctAnswer}

Student's Answer:
${payload.selectedAnswer ?? "Not answered"}

Please:
1. Explain why the correct answer is correct
2. Explain why the student's answer is wrong or missing
3. Identify the topic involved
4. Give 1–2 exam-focused tips
`
                }
            ],
            temperature: 0.6
        })
    });

    const data: any = await response.json();
    return data.choices[0].message.content;
};
