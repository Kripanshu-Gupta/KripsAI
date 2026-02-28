"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
    industry: string;
    experience: string;
    careerGoals: string;
}) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Ensure user exists in our DB, if not, create them.
    // We use `upsert` based on the Clerk User ID.
    const email = user.emailAddresses[0]?.emailAddress || "";
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const dbUser = await prisma.user.upsert({
        where: { clerkUserId: user.id },
        create: {
            clerkUserId: user.id,
            email: email,
            name: name,
            industry: data.industry,
            experience: data.experience,
            careerGoals: data.careerGoals,
        },
        update: {
            industry: data.industry,
            experience: data.experience,
            careerGoals: data.careerGoals,
        },
    });

    revalidatePath("/dashboard");
    return dbUser;
}
