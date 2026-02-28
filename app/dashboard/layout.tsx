import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Ensure user has completed onboarding
    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser || !dbUser.industry) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 
        The main landing page has a header, but we want a slightly different
        or integrated layout for the dashboard. For now, we rely on the RootLayout 
        for global wrapping, but we could add a sidebar here if needed.
        Currently opting for a clean top-level view.
      */}
            <div className="flex-1 w-full mx-auto max-w-7xl px-4 md:px-6 py-8">
                {children}
            </div>
        </div>
    );
}
