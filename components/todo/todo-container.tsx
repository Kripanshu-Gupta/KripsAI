"use client";

import { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

import { Task, TaskPriority } from "@/types/todo";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";
import { CheckCircle2, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function TodoContainer() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // 1. Unified Mount & Load Effect
    // Using an async wrapper or queueMicrotask prevents the "synchronous" warning
    useEffect(() => {
        const initializeContainer = () => {
            const saved = localStorage.getItem("kripa-ai-tasks");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setTasks(parsed);
                } catch (error) {
                    console.error("Failed parsing storage tasks:", error);
                }
            }
            setIsMounted(true);
        };

        // Execution is pushed to the next tick to avoid cascading synchronous render warning
        const timeoutId = setTimeout(initializeContainer, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    // 2. Sync whenever tasks change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("kripa-ai-tasks", JSON.stringify(tasks));
        }
    }, [tasks, isMounted]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Using useCallback for handlers to keep child components stable
    const handleAddTask = useCallback((title: string, priority: TaskPriority, dueDate: Date | null) => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date(),
        };
        setTasks((prev) => [newTask, ...prev]);
    }, []);

    const handleToggleTask = useCallback((id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    const handleDeleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
    };

    // Prevent hydration mismatch
    if (!isMounted) return null;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Updated Tailwind v4 classes: bg-linear-to-br */}
            <Card className="bg-linear-to-br from-primary/5 via-background to-background border-primary/10">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ListTodo className="w-6 h-6 text-primary" />
                            Task Manager
                        </CardTitle>
                        <CardDescription>Drag and drop tasks to prioritize your workflow.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-between items-end border-t border-border/40 pt-4 mt-2">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Progress</p>
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                            {stats.completed} / {stats.total}
                            <span className="text-muted-foreground text-sm font-normal ml-1">Completed</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div>
                <TodoInput onAdd={handleAddTask} />
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <TodoList
                        tasks={tasks}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                    />
                </DndContext>
            </div>
        </div>
    );
}