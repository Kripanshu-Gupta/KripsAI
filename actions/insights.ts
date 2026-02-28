"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateCareerContent } from "@/lib/gemini";

const generateInsightsPrompt = (
    industry: string,
    experience: string
) => `
You are an expert tech recruiter and career strategist specializing in the ${industry} domain.

Please provide a highly detailed, data-driven market insight report for someone with an experience level of "${experience}" within the ${industry} industry. 

You MUST return your entire response as a structured JSON string. Do not include markdown formatting blocks (like \`\`\`json) around the response. Return PURE JSON.
The JSON must adhere to this exact structure:
{
  "chartData": [
    { "domain": "Software Engineering", "demand": 85 },
    { "domain": "Cybersecurity", "demand": 92 },
    { "domain": "Data Science", "demand": 88 },
    { "domain": "Cloud Computing", "demand": 90 },
    { "domain": "AI/Machine Learning", "demand": 98 }
  ],
  "markdownReport": "Your highly detailed markdown report content goes here..."
}

For the \`chartData\` array, dynamically determine the 5 most comparable or relevant sub-domains within the broader ${industry} landscape and estimate their current market demand out of 100.

For the \`markdownReport\`, focus on the following key areas and return it strictly formatted in Markdown:
1. **Current Market Outlook**: Is hiring hot, cold, or shifting? What macroeconomic trends are impacting jobs here?
2. **Top In-Demand Skills**: List 4-5 hard skills and 2-3 soft skills that differentiate candidates right now.
3. **Salary Expectations**: Provide realistic, generalized compensation ranges based on their ${experience} level. Mention how specialization impacts this.
4. **Actionable Advice**: What is one thing this candidate can do this month to aggressively stand out to hiring managers?

Keep the tone professional, urgent, and highly informative.
`;

export async function generateIndustryInsights() {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser || !dbUser.industry) {
        throw new Error("User profile not found. Please complete onboarding.");
    }

    // Check if an insight was generated very recently to prevent unnecessary API burn (rate limiting/caching)
    // For production we might check if they have one from the last 7 days.
    const existingInsight = await prisma.industryInsight.findFirst({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
    });

    // If we have an insight generated in the last 24 hours, just return it
    if (existingInsight) {
        const hoursSinceGeneration = (Date.now() - existingInsight.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceGeneration < 24) {
            return existingInsight;
        }
    }

    const prompt = generateInsightsPrompt(
        dbUser.industry,
        dbUser.experience || "Intermediate"
    );

    const rawGeminiOutput = await generateCareerContent(prompt);

    if (!rawGeminiOutput) {
        throw new Error("Failed to generate industry insights.");
    }

    // Strip markdown JSON block format if Gemini mistakenly included it despite instructions
    const cleanedJson = rawGeminiOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    let structuredData: { markdownReport: string, chartData: any[] };
    try {
        structuredData = JSON.parse(cleanedJson);
    } catch (error) {
        throw new Error("AI returned malformed JSON payload.");
    }

    const insight = await prisma.industryInsight.create({
        data: {
            userId: dbUser.id,
            industry: dbUser.industry,
            experience: dbUser.experience || "Intermediate",
            content: structuredData.markdownReport,
            demandData: JSON.stringify(structuredData.chartData),
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/insights");

    return insight;
}

export async function getLatestInsight() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) return null;

    return await prisma.industryInsight.findFirst({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
    });
}
