"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateInterviewQuestions } from "@/actions/interview";
import { InterviewSession } from "./interview-session";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const setupSchema = z.object({
    jobTitle: z.string().min(2, {
        message: "Target job title must be at least 2 characters.",
    }),
});

export function InterviewSetup() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [activeJobTitle, setActiveJobTitle] = useState("");

    const form = useForm<z.infer<typeof setupSchema>>({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            jobTitle: "",
        },
    });

    async function onSubmit(values: z.infer<typeof setupSchema>) {
        try {
            setLoading(true);
            const generatedQuestions = await generateInterviewQuestions(values.jobTitle);

            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);
                setActiveJobTitle(values.jobTitle);
            } else {
                throw new Error("No questions retrieved.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to generate interview questions. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    // If questions are loaded, hand off the UI to the active Session component
    if (questions.length > 0) {
        return (
            <InterviewSession
                jobTitle={activeJobTitle}
                questions={questions}
                onComplete={() => setQuestions([])} // reset on finish
            />
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role you are applying for</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Product Manager, Software Engineer..." {...field} />
                            </FormControl>
                            <FormDescription>
                                We will generate 5 highly specific questions based on this role and your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating Questions..." : "Start Interview Practice"}
                </Button>
            </form>
        </Form>
    );
}
