import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QuizFeature } from "@/components/quiz/quiz-feature";

export default async function QuizPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500">
                Industry Knowledge Quiz
            </h1>
            <QuizFeature />
        </div>
    );
}
