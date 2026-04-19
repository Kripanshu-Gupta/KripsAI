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

export function parseJsonFromGemini(text: string): string {
    if (!text) return "";

    // Sometimes Gemini wraps JSON in markdown blocks
    let cleanedText = text.replace(/```(?:json)?/gi, "").trim();

    // Find the first { or [ and last } or ]
    const firstCurly = cleanedText.indexOf('{');
    const firstSquare = cleanedText.indexOf('[');
    let startIndex = -1;
    let endIndex = -1;

    if (firstCurly !== -1 && firstSquare !== -1) {
        if (firstCurly < firstSquare) {
            startIndex = firstCurly;
            endIndex = cleanedText.lastIndexOf('}');
        } else {
            startIndex = firstSquare;
            endIndex = cleanedText.lastIndexOf(']');
        }
    } else if (firstCurly !== -1) {
        startIndex = firstCurly;
        endIndex = cleanedText.lastIndexOf('}');
    } else if (firstSquare !== -1) {
        startIndex = firstSquare;
        endIndex = cleanedText.lastIndexOf(']');
    }

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        cleanedText = cleanedText.substring(startIndex, endIndex + 1);
    }

    return cleanedText;
}
