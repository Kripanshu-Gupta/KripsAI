"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUserProfile } from "@/actions/user";
import { industries } from "@/lib/industries";

const formSchema = z.object({
    industry: z.string().min(1, {
        message: "Please select an industry.",
    }),
    experience: z.string().min(1, {
        message: "Please select your experience level.",
    }),
    careerGoals: z.string().min(10, {
        message: "Goals must be at least 10 characters.",
    }).max(500, {
        message: "Goals must not be longer than 500 characters.",
    }),
});

export function OnboardingForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            industry: "",
            experience: "",
            careerGoals: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            await updateUserProfile(values);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an industry" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {industries
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((ind) => (
                                            <SelectItem key={ind.id} value={ind.name}>
                                                {ind.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                This helps KripaAI tailor the mock interviews and resume tips.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your experience" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate (3-5 years)</SelectItem>
                                    <SelectItem value="Senior">Senior (6+ years)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="careerGoals"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Career Goals & Aspirations</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="E.g., I want to transition into a Lead Software Engineer role and improve my system design skills."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Briefly describe where you want to go so KripaAI can build a roadmap.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving Profile..." : "Complete Onboarding"}
                </Button>
            </form>
        </Form>
    );
}
