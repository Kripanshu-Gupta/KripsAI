"use server";

import { generateCareerContent } from "@/lib/gemini";
import { currentUser } from "@clerk/nextjs/server";

const generateQuizPrompt = (domain: string) => `
You are an expert tech recruiter and technical assessor specializing in the ${domain} domain.

Please generate a 10-question multiple-choice quiz designed to test a professional's knowledge in ${domain}.

You MUST return your entire response as a structured JSON string. Do not include markdown formatting blocks (like \`\`\`json) around the response. Return PURE JSON.
The JSON must adhere to this exact structure:
[
  {
    "question": "What is the primary function of...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B",
    "explanation": "Option B is correct because..."
  },
  ... (10 questions total)
]

Ensure each question is highly relevant to ${domain}.
The "answer" must exactly match one of the strings in the "options" array.
Make the questions a mix of beginner, intermediate, and advanced difficulty.
`;

export async function generateQuizAction(domain: string) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const prompt = generateQuizPrompt(domain);
        const rawGeminiOutput = await generateCareerContent(prompt);

        if (!rawGeminiOutput) {
            throw new Error("Failed to generate quiz content.");
        }

        // Strip markdown JSON block format if Gemini mistakenly included it despite instructions
        const cleanedJson = rawGeminiOutput.replace(/```json/g, "").replace(/```/g, "").trim();

        const structuredData = JSON.parse(cleanedJson);
        return structuredData;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("AI returned malformed quiz payload.");
    }
}
