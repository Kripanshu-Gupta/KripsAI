import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserInterviews } from "@/actions/interview";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InterviewSetup } from "@/components/interview/interview-setup";

export default async function InterviewDashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const pastInterviews = await getUserInterviews();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Mock Interviews</h1>
                <p className="text-muted-foreground mt-2">
                    Practice answering tailored career questions and receive instant AI feedback.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Setup Configuration Column */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Start New Session</CardTitle>
                            <CardDescription>
                                Define the specific role you are practicing for to generate questions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InterviewSetup />
                        </CardContent>
                    </Card>
                </div>

                {/* Previous Results Column */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Past Sessions</h2>

                    {pastInterviews.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground flex-1 flex items-center justify-center">
                            You haven't completed any mock interviews yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {pastInterviews.map((interview) => (
                                <Card key={interview.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className={`absolute top-0 right-0 p-3 text-2xl font-extrabold opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity ${interview.score && interview.score > 80 ? 'text-green-500' : 'text-primary'
                                        }`}>
                                        {interview.score || '--'}/100
                                    </div>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl pr-8">{interview.jobTitle}</CardTitle>
                                        <CardDescription suppressHydrationWarning>
                                            {new Date(interview.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-foreground/80 line-clamp-3 mb-4">
                                            {/* We parse the feedback JSON to extract the overall blurb */}
                                            {(() => {
                                                try {
                                                    if (!interview.feedback) return "No feedback provided.";
                                                    const fb = JSON.parse(interview.feedback);
                                                    return fb.overallFeedback || "Detailed feedback available inside.";
                                                } catch {
                                                    return "Feedback processing error.";
                                                }
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
