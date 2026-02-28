"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, GripVertical, Trash2, CheckCircle2, Circle } from "lucide-react";

import { Task } from "@/types/todo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const priorityConfig = {
    low: { color: "bg-blue-500/10 text-blue-500 border-blue-200/20", label: "Low" },
    medium: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-200/20", label: "Medium" },
    high: { color: "bg-red-500/10 text-red-500 border-red-200/20", label: "High" },
};

export function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
    // dnd-kit hooks for this specific item's ID
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    // Apply the dnd-kit transforms to move the items visually
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <motion.li
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex items-center justify-between p-4 mb-3 border rounded-xl shadow-sm bg-card transition-all",
                isDragging ? "shadow-xl border-primary ring-1 ring-primary/50 opacity-90 scale-[1.02]" : "hover:border-primary/30",
                task.completed ? "opacity-60 bg-muted/30" : ""
            )}
        >
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground transition-colors p-1"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* Status Toggle */}
                <button
                    onClick={() => onToggle(task.id)}
                    className="flex-shrink-0 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                        <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                </button>

                {/* Content */}
                <div className="flex flex-col truncate pr-4">
                    <span
                        className={cn(
                            "text-base font-medium transition-colors truncate",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                    >
                        {task.title}
                    </span>

                    <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider rounded-md", priorityConfig[task.priority].color)}>
                            {priorityConfig[task.priority].label}
                        </Badge>

                        {task.dueDate && (
                            <div className="flex items-center text-xs text-muted-foreground gap-1.5 font-medium">
                                <CalendarIcon className="w-3.5 h-3.5 opacity-70" />
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </motion.li>
    );
}
