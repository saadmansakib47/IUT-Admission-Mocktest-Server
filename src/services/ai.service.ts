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
