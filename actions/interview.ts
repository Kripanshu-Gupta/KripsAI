"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateCareerContent, parseJsonFromGemini } from "@/lib/gemini";

// Helper prompt to generate the questions
const generateInterviewQuestionsPrompt = (
    jobTitle: string,
    industry: string,
    experience: string,
    careerGoals: string
) => `
You are an expert technical and behavioral interviewer for the ${industry} industry.

Please generate exactly 5 interview questions for a candidate applying for the role of "${jobTitle}".
The candidate has an experience level of: ${experience}.
Their overall career goals are: ${careerGoals}.

Provide a balanced mix of technical (or role-specific) knowledge questions and behavioral/situational questions. 
Return the output STRICTLY as a raw JSON array of strings. Do not include markdown blocks like \`\`\`json. Just the array.
Example format:
[
  "Can you describe a time when you..." ,
  "How would you architect a solution for..."
]
`;

export async function generateInterviewQuestions(jobTitle: string) {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) throw new Error("User profile not found.");

    const prompt = generateInterviewQuestionsPrompt(
        jobTitle,
        dbUser.industry || "General",
        dbUser.experience || "Intermediate",
        dbUser.careerGoals || "General advancement"
    );

    const rawResponse = await generateCareerContent(prompt);
    let questions: string[] = [];

    if (!rawResponse) {
        throw new Error("AI failed to provide a valid response.");
    }

    try {
        // Extract JSON specifically from the response
        const cleanedJson = parseJsonFromGemini(rawResponse);
        questions = JSON.parse(cleanedJson);

        if (!Array.isArray(questions)) {
            throw new Error("Parsed result is not an array");
        }
    } catch (error) {
        console.error("Failed to parse interview questions as JSON:", rawResponse);
        throw new Error("AI returned an invalid format for questions.");
    }

    return questions;
}

const generateFeedbackPrompt = (
    jobTitle: string,
    questionsAndAnswers: { question: string; answer: string }[]
) => `
You are an expert hiring manager reviewing an interview for a ${jobTitle} role.

Evaluate the following responses from the candidate. For each answer, provide constructive feedback on what they did well and what could be improved.
Also, provide an overall mock score out of 100.

Interview Transcript:
${questionsAndAnswers.map((qa, index) => `
Q${index + 1}: ${qa.question}
A${index + 1}: ${qa.answer || "(Did not answer)"}
`).join('\n')}

Format your response STRICTLY as a JSON object with this shape. Do not include markdown blocks \`\`\`json.
{
  "score": 85,
  "overallFeedback": "Overall, strong technical skills but lacked deep behavioral examples...",
  "detailedFeedback": [
    {
       "question": "...",
       "feedback": "..."
    }
  ]
}
`;

export async function submitInterviewAnswers(data: {
    jobTitle: string;
    answers: { question: string; answer: string }[];
}) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) throw new Error("User profile not found.");

    const prompt = generateFeedbackPrompt(data.jobTitle, data.answers);
    const rawResponse = await generateCareerContent(prompt);

    if (!rawResponse) {
        throw new Error("AI failed to provide feedback.");
    }

    let feedbackData;
    try {
        const cleanedJson = parseJsonFromGemini(rawResponse);
        feedbackData = JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Failed to parse feedback:", rawResponse);
        throw new Error("AI returned invalid feedback format.");
    }

    const generatedQuestionsText = data.answers.map(a => a.question).join("\n- ");

    // Save the full interview record
    const interview = await prisma.interview.create({
        data: {
            userId: dbUser.id,
            jobTitle: data.jobTitle,
            questions: generatedQuestionsText,
            feedback: JSON.stringify(feedbackData),
            score: feedbackData.score || 0,
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/interview");

    return interview;
}

export async function getUserInterviews() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) return [];

    return await prisma.interview.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
    });
}
