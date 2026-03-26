"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { QuizCardProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const categoryKeys: Record<string, string> = {
    "robot-design": "categories.robot-design",
    "innovation": "categories.innovation",
    "coding": "categories.coding",
    "robot-game": "categories.robot-game",
    "core-values": "categories.core-values",
};

const levelKeys: Record<string, string> = {
    "beginner": "beginner",
    "intermediate": "intermediate",
    "advanced": "advanced",
};

export default function QuizCard({ quiz }: QuizCardProps) {
    const tLesson = useTranslations("lesson");
    const tCommon = useTranslations("common");
    const tQuiz = useTranslations("quiz");
    const tCourses = useTranslations("courses");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
    };

    const isCorrect = selectedOption === quiz.correct_answer;

    const resetQuiz = () => {
        setSelectedOption(null);
        setIsSubmitted(false);
        setShowAnswer(false);
    };

    return (
        <div className="glass-card p-8 border border-white/5 shadow-xl space-y-6 hover:border-white/10 transition-all group h-full flex flex-col">
            {/* Track & Level Header */}
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                    {categoryKeys[quiz.category] ? tQuiz(categoryKeys[quiz.category] as Parameters<typeof tQuiz>[0]) : quiz.category}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {levelKeys[quiz.level] ? tCourses(levelKeys[quiz.level] as Parameters<typeof tCourses>[0]) : quiz.level}
                </span>
            </div>

            {/* Question */}
            <p className="font-bold text-xl text-white leading-tight flex-grow">
                {quiz.question}
            </p>

            {quiz.type === "mcq" ? (
                <div className="space-y-4">
                    {/* MCQ Options */}
                    <div className="space-y-2.5">
                        {quiz.options?.map((option, idx) => {
                            const isOptionSelected = selectedOption === option;
                            const isOptionCorrect = option === quiz.correct_answer;
                            
                            let containerClass = "border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20";
                            
                            if (isSubmitted) {
                                if (isOptionCorrect) {
                                    containerClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium";
                                } else if (isOptionSelected && !isCorrect) {
                                    containerClass = "bg-red-500/10 border-red-500/30 text-red-400 font-medium";
                                } else {
                                    containerClass = "border-white/5 opacity-40";
                                }
                            } else if (isOptionSelected) {
                                containerClass = "border-primary/50 bg-primary/10 text-white font-medium ring-2 ring-primary/20";
                            }

                            return (
                                <motion.label
                                    key={idx}
                                    whileHover={!isSubmitted ? { x: 4 } : {}}
                                    className={`w-full text-left px-5 py-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${containerClass}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            isOptionSelected || (isSubmitted && isOptionCorrect)
                                                ? "border-primary bg-primary"
                                                : "border-white/20"
                                        }`}>
                                            {(isOptionSelected || (isSubmitted && isOptionCorrect)) && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name={`quiz-${quiz.id}`}
                                            value={option}
                                            checked={isOptionSelected}
                                            onChange={() => !isSubmitted && setSelectedOption(option)}
                                            disabled={isSubmitted}
                                            className="hidden"
                                        />
                                        <span className="text-sm">{option}</span>
                                    </div>
                                    {isSubmitted && isOptionCorrect && (
                                        <span className="text-emerald-500 text-lg font-bold">✓</span>
                                    )}
                                    {isSubmitted && isOptionSelected && !isCorrect && (
                                        <span className="text-red-500 text-lg font-bold">✗</span>
                                    )}
                                </motion.label>
                            );
                        })}
                    </div>

                    {/* Submit / Result */}
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100"
                        >
                            {tLesson("quiz_submit")}
                        </button>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mt-2"
                        >
                            {/* Tip */}
                            {quiz.tip && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                    <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                                        <span className="text-sm">💡</span> {tLesson("tip_label")}
                                    </div>
                                    <p className="text-sm text-amber-200/80 leading-relaxed italic">{quiz.tip}</p>
                                </div>
                            )}

                            <button
                                onClick={resetQuiz}
                                className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all"
                            >
                                ↻ {tCommon("try_again")}
                            </button>
                        </motion.div>
                    )}
                </div>
            ) : (
                /* Open-ended */
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!showAnswer ? (
                            <motion.button
                                key="btn"
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => setShowAnswer(true)}
                                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-sm border border-white/10 hover:bg-slate-700 transition-all"
                            >
                                {tLesson("quiz_show_answer")}
                            </motion.button>
                        ) : (
                            <motion.div 
                                key="answer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-3 opacity-20 text-4xl font-calistoga">A</div>
                                    <span className="font-bold text-primary text-[10px] uppercase tracking-[0.2em] block mb-3">
                                        {tLesson("quiz_answer_label")}
                                    </span>
                                    <p className="text-base text-white leading-relaxed font-medium">
                                        {quiz.correct_answer}
                                    </p>
                                </div>

                                {quiz.tip && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                                         <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                                            💡 {tLesson("tip_label")}
                                        </div>
                                        <p className="text-sm text-amber-200/80 leading-relaxed italic">{quiz.tip}</p>
                                    </div>
                                )}

                                <button
                                    onClick={resetQuiz}
                                    className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all"
                                >
                                    ↻ {tCommon("hide")}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
