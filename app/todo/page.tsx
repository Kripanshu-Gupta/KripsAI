import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TodoContainer } from "@/components/todo/todo-container";
import prisma from "@/lib/prisma";

export default async function TodoPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
    });

    if (!dbUser) {
        redirect("/onboarding");
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500">
                Action Plan & Tasks
            </h1>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Organize your career goals, interview prep, and application milestones. Drag and drop items to prioritize what matters most today.
            </p>
            <TodoContainer />
        </div>
    );
}
