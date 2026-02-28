"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateAndSaveResume } from "@/actions/resume";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    jobTitle: z.string().min(2, {
        message: "Target job title must be at least 2 characters.",
    }),
    skills: z.string().min(5, {
        message: "Please list at least a few skills (e.g., React, TypeScript, Node.js).",
    }),
});

interface ResumeFormProps {
    onSuccess?: () => void;
}

export function ResumeForm({ onSuccess }: ResumeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobTitle: "",
            skills: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            await generateAndSaveResume(values);
            form.reset();
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error) {
            console.error(error);
            // In a real app we'd trigger a toast notification here
            alert("Failed to generate resume. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Senior Frontend Engineer" {...field} />
                            </FormControl>
                            <FormDescription>
                                The exact role you are applying to. KripaAI will optimize for this.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Core Skills</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g., React, Next.js, Node.js, Prisma, SQL, Team Leadership"
                                    className="resize-none h-24"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                List your primary skills. The AI will strategically weave these into your experience.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating Resume (This may take a minute)..." : "Generate Resume via AI"}
                </Button>
            </form>
        </Form>
    );
}
