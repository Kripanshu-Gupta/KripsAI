"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateCareerContent } from "@/lib/gemini";

const generateCoverLetterPrompt = (
    jobDescription: string,
    industry: string,
    experience: string,
    careerGoals: string
) => `
You are an expert Career Coach and professional Copywriter specializing in the ${industry} industry.

Please write a highly persuasive, tailored, and modern Cover Letter for a candidate applying to the specific job described below. 
The generated letter MUST be returned natively in Markdown format.

Candidate Context:
- Industry: ${industry}
- Experience Level: ${experience}
- Career Goals: ${careerGoals}

Target Job Description:
"""
${jobDescription}
"""

Instructions:
1. Output ONLY the raw Markdown for the cover letter (no preamble like "Here is your letter...").
2. Format the contact information block logically at the top (with placeholders like [Your Name], [Your Phone], etc.).
3. Add a formal greeting.
4. Craft an attention-grabbing opening paragraph.
5. In the body paragraphs, weave the candidate's experience level (${experience}) and core ambitions directly into the needs specified within the job description. Emphasize value.
6. Provide a strong call to action in the closing paragraph.
7. Include a formal sign-off.
`;

export async function generateCoverLetter(data: { jobDescription: string }) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) {
        throw new Error("User profile not found. Please complete onboarding.");
    }

    const prompt = generateCoverLetterPrompt(
        data.jobDescription,
        dbUser.industry || "General",
        dbUser.experience || "Intermediate",
        dbUser.careerGoals || "Career advancement"
    );

    const generatedMarkdown = await generateCareerContent(prompt);

    if (!generatedMarkdown) {
        throw new Error("Failed to generate cover letter.");
    }

    const coverLetter = await prisma.coverLetter.create({
        data: {
            userId: dbUser.id,
            jobDesc: data.jobDescription,
            content: generatedMarkdown,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/cover-letter");

    return coverLetter;
}

export async function getUserCoverLetters() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) return [];

    return await prisma.coverLetter.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
    });
}
