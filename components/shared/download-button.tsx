"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
    content: string;
    fileName: string;
}

export function DownloadButton({ content, fileName }: DownloadButtonProps) {
    const handleDownload = () => {
        // Generate an accessible .txt file from the markdown contents
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        // Create hidden anchor
        const link = document.createElement("a");
        link.href = url;

        // Fallback fileName if one is incredibly long or malformed
        const safeFileName = fileName ? fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50) : "kripaai_document";

        link.setAttribute("download", `${safeFileName}.txt`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button variant="outline" size="sm" onClick={handleDownload} className="flex gap-2">
            <Download className="h-4 w-4" />
            Download (.txt)
        </Button>
    );
}
