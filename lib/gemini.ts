import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
}

export const ai = new GoogleGenAI({
    apiKey: apiKey,
});

/**
 * Utility to standard prompt Gemini for career coaching tasks.
 * Ensures the response is returned cleanly.
 */
export async function generateCareerContent(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7, // Add a bit of creativity but keep it professional
            },
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate content using Gemini.");
    }
}
