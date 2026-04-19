import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { FileText, MessageSquare, PenTool, TrendingUp, BrainCircuit, ListTodo } from "lucide-react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
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
        <div className="space-y-8">
            {/* Dashboard Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {dbUser.name?.split(' ')[0] || "User"}!</h1>
                <p className="text-muted-foreground mt-2">
                    Here is your AI career coach dashboard. Let&apos;s get to work on your personalized tools for the {dbUser.industry} industry.
                </p>
            </div>

            {/* Stats/Quick Overview - Optional but good for scale */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saved Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Tailored for your specific roles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mock Interviews</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Completed sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Generated via AI</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tool Launchers */}
            <h2 className="text-2xl font-semibold tracking-tight pt-6">Your Career Tools</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Resume Builder Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            AI Resume Builder
                        </CardTitle>
                        <CardDescription>
                            Create a data-driven, ATS-friendly resume tailored to your target {dbUser.industry} role using Google Gemini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/resume-builder">
                            <Button className="w-full">Open Builder</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Mock Interview Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Mock Interviews
                        </CardTitle>
                        <CardDescription>
                            Practice difficult, role-specific questions with our AI interviewer and receive actionable feedback.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/interview">
                            <Button className="w-full" variant="secondary">Start Practice</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Cover Letter Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenTool className="h-5 w-5 text-primary" />
                            Cover Letter Generator
                        </CardTitle>
                        <CardDescription>
                            Stop writing from scratch. Automatically generate professional cover letters tailored to any job opening.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/cover-letter">
                            <Button className="w-full" variant="secondary">Generate Letter</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Industry Insights Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Industry Insights
                        </CardTitle>
                        <CardDescription>
                            Get personalized market analysis, top required skills, and salary expectations for your exact industry.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/insights">
                            <Button className="w-full" variant="secondary">View Market Data</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Industry Quiz Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                            Quiz Time
                        </CardTitle>
                        <CardDescription>
                            Test your knowledge with an AI-curated 10-question quiz specific to your selected domain.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/quiz">
                            <Button className="w-full" variant="secondary">Play Quiz</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* To-Do List Link */}
                <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListTodo className="h-5 w-5 text-primary" />
                            Task Manager
                        </CardTitle>
                        <CardDescription>
                            Organize applications, setup deadlines, and track your prep with a drag-and-drop workflow.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/todo">
                            <Button className="w-full" variant="secondary">Open Tasks</Button>
                        </Link>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
