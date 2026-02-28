"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, BrainCircuit, Trophy, RefreshCcw } from "lucide-react";
import { industries } from "@/lib/industries";
import { generateQuizAction } from "@/actions/quiz";

type Question = {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
};

export function QuizFeature() {
    const [gameState, setGameState] = useState<"setup" | "loading" | "playing" | "results">("setup");
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    const handleStartQuiz = async () => {
        if (!name || !domain) return;

        try {
            setGameState("loading");
            const generatedQuestions = await generateQuizAction(domain);
            setQuestions(generatedQuestions);

            // Reset gameplay state
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setIsAnswerRevealed(false);

            setGameState("playing");
        } catch (error) {
            console.error(error);
            setGameState("setup");
            alert("Failed to generate quiz. Please try again.");
        }
    };

    const handleAnswerSelect = (option: string) => {
        if (isAnswerRevealed) return;
        setSelectedAnswer(option);
    };

    const handleConfirmAnswer = () => {
        if (!selectedAnswer) return;

        setIsAnswerRevealed(true);
        if (selectedAnswer === questions[currentQuestionIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerRevealed(false);
        } else {
            setGameState("results");
        }
    };

    const handleRestart = () => {
        setGameState("setup");
        setName("");
        setDomain("");
    };

    // Derived values for Select Items (Flattening sub-industries into a single list)
    const allDomains = industries.flatMap(ind => ind.subIndustries).sort((a, b) => a.localeCompare(b));

    if (gameState === "setup") {
        return (
            <Card className="max-w-xl mx-auto shadow-lg border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        Configure Your Challenge
                    </CardTitle>
                    <CardDescription>
                        Enter your name and pick a specialization domain to generate 10 targeted questions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Name</label>
                        <Input
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Domain</label>
                        <Select onValueChange={setDomain} value={domain}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a domain..." />
                            </SelectTrigger>
                            <SelectContent>
                                {allDomains.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!name || !domain}
                        onClick={handleStartQuiz}
                    >
                        Generate & Start Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (gameState === "loading") {
        return (
            <Card className="max-w-xl mx-auto shadow-lg border-primary/20 bg-card/50 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <h3 className="text-xl font-semibold">Generating Your Quiz...</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                        Our AI is currently crafting 10 difficult questions based on {domain}. Give us a few seconds.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (gameState === "playing") {
        const currentQ = questions[currentQuestionIndex];

        return (
            <Card className="max-w-2xl mx-auto shadow-lg border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground font-medium">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">
                        {currentQ.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {currentQ.options.map((opt, i) => {
                        let buttonVariant: "outline" | "default" | "secondary" | "destructive" = "outline";
                        let isCorrect = opt === currentQ.answer;

                        if (isAnswerRevealed) {
                            if (isCorrect) {
                                buttonVariant = "default"; // Highlight green/primary when correct
                            } else if (opt === selectedAnswer && !isCorrect) {
                                buttonVariant = "destructive"; // Red if picked wrong
                            }
                        } else if (opt === selectedAnswer) {
                            buttonVariant = "secondary";
                        }

                        return (
                            <Button
                                key={i}
                                variant={buttonVariant}
                                className={`w-full justify-start text-left h-auto py-4 px-6 whitespace-normal ${isAnswerRevealed && isCorrect ? "bg-green-600 hover:bg-green-700 text-white border-transparent" : ""
                                    }`}
                                onClick={() => handleAnswerSelect(opt)}
                                disabled={isAnswerRevealed}
                            >
                                {opt}
                            </Button>
                        )
                    })}

                    {isAnswerRevealed && (
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                            <p className="font-semibold mb-1">
                                {selectedAnswer === currentQ.answer ? "✅ Correct!" : "❌ Incorrect"}
                            </p>
                            <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-4">
                    {!isAnswerRevealed ? (
                        <Button
                            className="w-full"
                            disabled={!selectedAnswer}
                            onClick={handleConfirmAnswer}
                        >
                            Lock Answer
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Results"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    if (gameState === "results") {
        const percentage = Math.round((score / questions.length) * 100);
        let message = "Good effort!";
        if (percentage >= 80) message = "Outstanding!";
        else if (percentage >= 60) message = "Solid performance!";

        return (
            <Card className="max-w-xl mx-auto shadow-lg border-primary/20 bg-card/50 backdrop-blur text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">Quiz Complete, {name}!</CardTitle>
                    <CardDescription className="text-lg pt-2">
                        You scored {score} out of {questions.length} ({percentage}%) in {domain}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {message} Review your knowledge gaps and try again whenever you're ready.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full gap-2" size="lg" onClick={handleRestart}>
                        <RefreshCcw className="w-4 h-4" /> Try Another Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return null;
}
