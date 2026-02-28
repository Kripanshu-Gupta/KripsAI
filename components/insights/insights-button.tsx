"use client";

import { useState } from "react";
import { generateIndustryInsights } from "@/actions/insights";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function InsightsGeneratorButton({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        try {
            setLoading(true);
            await generateIndustryInsights();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to generate insights. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={loading || disabled}
        >
            {loading ? "Analyzing Market Data..." : "Generate Fresh Insights"}
        </Button>
    );
}
