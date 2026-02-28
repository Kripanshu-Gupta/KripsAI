import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserCoverLetters } from "@/actions/cover-letter";
import { CoverLetterForm } from "@/components/cover-letter/cover-letter-form";
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

export default async function CoverLetterDashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const generatedLetters = await getUserCoverLetters();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Cover Letter Generator</h1>
                <p className="text-muted-foreground mt-2">
                    Never write a generic cover letter again. Tailor your pitch perfectly to the job description.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Column: Form */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Letter</CardTitle>
                            <CardDescription>
                                Paste the job description of your target role below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CoverLetterForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: List of Generated Letters */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Saved Letters</h2>

                    {generatedLetters.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                            You haven't generated any cover letters yet. Paste a job description to begin!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {generatedLetters.map((letter: any) => (
                                <Card key={letter.id} className="overflow-hidden">
                                    <div className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between p-6">
                                        <div className="flex flex-col space-y-1.5">
                                            <CardTitle className="text-lg line-clamp-1">
                                                {/* Auto-generated title based on first few words of JD */}
                                                {letter.jobDesc.split(' ').slice(0, 5).join(' ') + "..."}
                                            </CardTitle>
                                            <CardDescription>
                                                Generated on {new Date(letter.createdAt).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <DownloadButton
                                            content={letter.content}
                                            fileName={letter.jobDesc.split(' ').slice(0, 5).join(' ') + " Cover Letter"}
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {letter.content}
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
