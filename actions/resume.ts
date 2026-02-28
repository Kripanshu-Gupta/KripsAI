"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateCareerContent } from "@/lib/gemini";

const generateResumePrompt = (
    jobTitle: string,
    industry: string,
    experience: string,
    skills: string,
    careerGoals: string
) => `
You are an expert AI Career Coach specializing in modern, ATS-friendly resumes for the ${industry} industry.

Please generate a professional, highly-tailored resume in Markdown format for the following profile:
- Target Job Title: ${jobTitle}
- Industry: ${industry}
- Experience Level: ${experience}
- Core Skills: ${skills}
- Career Goals/Aspirations: ${careerGoals}

Your output MUST be entirely in Markdown. Structure it standardly:
1. Header (Name placeholder, contact info placeholder)
2. Professional Summary (Crafted actively based on the goals and experience)
3. Core Competencies / Skills (Organize logically based on provided skills)
4. Professional Experience (Create 2-3 detailed, realistic placeholder roles demonstrating impact with bullet points)
5. Education (Placeholder)
`;

export async function generateAndSaveResume(data: {
    jobTitle: string;
    skills: string;
}) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Fetch full user profile to get base context (industry, experience level)
    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) {
        throw new Error("User profile not found. Please complete onboarding.");
    }

    const prompt = generateResumePrompt(
        data.jobTitle,
        dbUser.industry || "General",
        dbUser.experience || "Intermediate",
        data.skills,
        dbUser.careerGoals || "Career advancement"
    );

    // Call the Gemini API wrapper
    const generatedMarkdown = await generateCareerContent(prompt);

    if (!generatedMarkdown) {
        throw new Error("Failed to generate resume content");
    }

    // Save the result to the Neon DB
    const resume = await prisma.resume.create({
        data: {
            userId: dbUser.id,
            title: `${data.jobTitle} - ${new Date().toLocaleDateString()}`,
            content: generatedMarkdown,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/resume-builder");

    return resume;
}

export async function getUserResumes() {
    const user = await currentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) return [];

    return await prisma.resume.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
    });
}
