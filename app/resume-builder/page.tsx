import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserResumes } from "@/actions/resume";
import { ResumeForm } from "@/components/resume-builder/resume-form";
import { DownloadButton } from "@/components/shared/download-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Resume = {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
};

export default async function ResumeBuilderPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const resumes = await getUserResumes();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Resume Builder</h1>
                <p className="text-muted-foreground mt-2">
                    Create tailored, ATS-optimized resumes using KripaAI.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Resume</CardTitle>
                            <CardDescription>
                                Provide the details below to let Gemini write an impactful resume for you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResumeForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: List of Generated Resumes */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Resumes</h2>

                    {resumes.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                            You haven&apos;t generated any resumes yet. Fill out the form to get started!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {resumes.map((resume: Resume) => (
                                <Card key={resume.id} className="overflow-hidden">
                                    <div className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between p-6">
                                        <div className="flex flex-col space-y-1.5">
                                            <CardTitle className="text-lg">{resume.title}</CardTitle>
                                            <CardDescription>
                                                Generated on {resume.createdAt.toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <DownloadButton content={resume.content} fileName={resume.title} />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {resume.content}
                                            </ReactMarkdown>
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
