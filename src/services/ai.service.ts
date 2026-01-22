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

    Please provide a concise explanation (strictly 3–4 lines) that covers:
    - Why the correct answer is right and why the student's answer (if any) is wrong.
    - The core topic and 1 quick exam tip.
    Keep it punchy and direct.
`
                }
            ],
            temperature: 0.6
        })
    });

    const data: any = await response.json();
    return data.choices[0].message.content;
};


export const getAICoachInsights = async (tests: any[]) => {
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
                    content: "You are an AI academic coach. Analyze student mock tests and provide brief, punchy insights."
                },
                {
                    role: "user",
                    content: `
You are given up to 5 recent mock test attempts by a student.
Each test has: title, score, totalMarks, timeTaken, submittedAt.

Your task:
- Generate EXACTLY 3 short insights (2–3 lines each)
- Focus ONLY on trends:
  - score improvement or decline
  - time management patterns
  - subject or consistency issues
- DO NOT comment on every test
- Be constructive and concise

Each insight MUST include:
- message
- tag (one of: "critical", "warning", "on-track")

Return ONLY valid JSON in this format:
[
  { "tag": "...", "message": "..." }
]

Tests:
${JSON.stringify(tests, null, 2)}
`
                }
            ],
            temperature: 0.6
        })
    });

    const data: any = await response.json();
    const content = data.choices[0].message.content;

    try {
        // Strip out any markdown code blocks if the AI included them
        const jsonContent = content.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonContent);
    } catch (error) {
        console.error("Failed to parse AI coach insights:", error);
        return [
            {
                tag: "warning",
                message: "We're having trouble analyzing your recent performance. Try again later!"
            }
        ];
    }
};
