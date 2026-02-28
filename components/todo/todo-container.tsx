"use client";

import { useState, useEffect } from "react";
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

    // Initialize state from local storage securely after React mounts on client
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("kripa-ai-tasks");
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (err) {
                console.error("Failed parsing specific local storage tasks.");
            }
        }
    }, []);

    // Sync whenever tasks change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("kripa-ai-tasks", JSON.stringify(tasks));
        }
    }, [tasks, isMounted]);

    // Dnd-kit intelligent sensors configuration (allows pointer precision and keyboard accessibility)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require a small drag distance so clicks still register naturally on buttons
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddTask = (title: string, priority: TaskPriority, dueDate: Date | null) => {
        const newTask: Task = {
            id: uuidv4(), // Generate unique distinct ID
            title,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date(),
        };
        // Add new task to top of list
        setTasks([newTask, ...tasks]);
    };

    const handleToggleTask = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Fired when user drops an item
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // If dragged perfectly back or off completely, do nothing
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

    if (!isMounted) return null; // Prevent hydration flash

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">

            {/* Header Analytics Card */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/10">
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

            {/* Application Core */}
            <div>
                <TodoInput onAdd={handleAddTask} />

                {/* DndContext wrapping boundaries for dragging */}
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
