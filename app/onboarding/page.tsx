import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // NOTE: This will later connect to Prisma to check if user has finished onboarding.
    return (
        <div className="min-h-screen py-24 flex items-center justify-center container mx-auto px-4">
            <div className="max-w-xl w-full bg-card rounded-xl p-8 border border-border shadow-lg space-y-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">KripaAI</span>
                </h1>
                <p className="text-lg text-muted-foreground pb-4">
                    Let's set up your profile to start receiving customized career coaching, resume tips, and interview feedback.
                </p>

                <OnboardingForm />
            </div>
        </div>
    );
}
