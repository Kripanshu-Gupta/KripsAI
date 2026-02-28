"use client";

import { useState } from "react";
import { submitInterviewAnswers } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface InterviewSessionProps {
    jobTitle: string;
    questions: string[];
    onComplete: () => void;
}

export function InterviewSession({ jobTitle, questions, onComplete }: InterviewSessionProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinish = async () => {
        try {
            setIsSubmitting(true);

            // Structure the data to send to Gemini for grading
            const formattedAnswers = questions.map((q, index) => ({
                question: q,
                answer: answers[index]
            }));

            await submitInterviewAnswers({
                jobTitle,
                answers: formattedAnswers
            });

            onComplete(); // Tells parent to reset state / refersh page

        } catch (error) {
            console.error(error);
            alert("Failed to submit interview for grading.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header Info */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span className="text-muted-foreground">{Math.round(progressValue)}% Completed</span>
                </div>
                <Progress value={progressValue} className="w-full" />
            </div>

            {/* Question Block */}
            <div className="bg-muted p-4 rounded-lg border border-border">
                <h3 className="text-lg font-semibold">{currentQuestion}</h3>
            </div>

            {/* Answer Block */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Answer</label>
                <Textarea
                    placeholder="Type your response here... Be as detailed as possible."
                    className="h-48 resize-none"
                    value={answers[currentQuestionIndex]}
                    onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[currentQuestionIndex] = e.target.value;
                        setAnswers(newAnswers);
                    }}
                    disabled={isSubmitting}
                />
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                    Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={handleFinish} disabled={isSubmitting}>
                        {isSubmitting ? "Grading..." : "Finish & Get Feedback"}
                    </Button>
                ) : (
                    <Button onClick={handleNext}>
                        Next Question
                    </Button>
                )}
            </div>
        </div>
    );
}
