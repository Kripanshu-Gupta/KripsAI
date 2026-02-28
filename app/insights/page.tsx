import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLatestInsight } from "@/actions/insights";
import { InsightsGeneratorButton } from "@/components/insights/insights-button";
import { IndustryChart } from "@/components/insights/industry-chart";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function InsightsDashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const latestInsight = await getLatestInsight();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Industry Insights</h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time market analysis tailored to your specific domain and experience level.
                    </p>
                </div>

                <div className="w-full md:w-auto">
                    {/* Limit generation frequency on the front-end visually if one exists within 24 hours */}
                    <InsightsGeneratorButton disabled={
                        latestInsight ? (Date.now() - latestInsight.createdAt.getTime()) / (1000 * 60 * 60) < 24 : false
                    } />
                </div>
            </div>

            <div className="grid gap-8">
                {!latestInsight ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                        <h3 className="text-xl font-medium mb-2">No Insights Generated Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Click the generate button above to get a personalized market analysis based on your onboarding profile.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {latestInsight.demandData && (
                            <IndustryChart data={JSON.parse(latestInsight.demandData)} />
                        )}

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50">
                                <CardTitle className="text-xl">
                                    Analysis for {latestInsight.industry} ({latestInsight.experience})
                                </CardTitle>
                                <CardDescription suppressHydrationWarning>
                                    Last updated: {new Date(latestInsight.createdAt).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="prose prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {latestInsight.content}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
