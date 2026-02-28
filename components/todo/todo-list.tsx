"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Task } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { ListTodo } from "lucide-react";

interface TodoListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TodoList({ tasks, onToggle, onDelete }: TodoListProps) {
    // Required by dnd-kit SortableContext to map the children
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ListTodo className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-2">You're all caught up!</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    No active tasks are scheduled. Take a break, or add a new goal above.
                </p>
            </div>
        );
    }

    return (
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col list-none m-0 p-0 relative min-h-[500px]">
                {/* 
                  AnimatePresence tracks mounting/unmounting to trigger Framer Motion's exit animations 
                */}
                <AnimatePresence mode="popLayout" initial={false}>
                    {tasks.map((task) => (
                        <TodoItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    ))}
                </AnimatePresence>
            </ul>
        </SortableContext>
    );
}
