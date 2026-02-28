"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TaskPriority } from "@/types/todo";
import { cn } from "@/lib/utils";

interface TodoInputProps {
    onAdd: (title: string, priority: TaskPriority, dueDate: Date | null) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd(title.trim(), priority, dueDate || null);
        setTitle("");
        setPriority("medium");
        setDueDate(undefined);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-card p-4 rounded-xl border shadow-sm mb-8"
        >
            <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    New Task
                </label>
                <Input
                    placeholder="E.g., Update resume, Prepare for interview..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-primary/20 bg-background/50 focus-visible:ring-primary/50"
                />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                <div className="space-y-1.5 w-[140px]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Priority
                    </label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                        <SelectTrigger className="border-primary/20">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Low
                                </span>
                            </SelectItem>
                            <SelectItem value="medium">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
                                </span>
                            </SelectItem>
                            <SelectItem value="high">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500" /> High
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5 w-[160px]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Due Date
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal border-primary/20",
                                    !dueDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={setDueDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1.5 self-end">
                    <label className="text-xs font-semibold text-transparent uppercase tracking-wider hidden sm:block">
                        Add
                    </label>
                    <Button
                        type="submit"
                        disabled={!title.trim()}
                        className="w-full sm:w-auto px-6 h-10 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 sm:mr-1" />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
