"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateCoverLetter } from "@/actions/cover-letter";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    jobDescription: z.string().min(20, {
        message: "Please paste a more complete job description.",
    }),
});

export function CoverLetterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobDescription: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            await generateCoverLetter(values);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to generate cover letter. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Paste the target Job Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Requirements: \n- 3+ years experience in Next.js \n- Strong communication skills..."
                                    className="h-48 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We will scan this description and tailor your profile directly to their listed requirements.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Authoring Letter..." : "Generate Cover Letter"}
                </Button>
            </form>
        </Form>
    );
}
