"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { QuizCardProps } from "@/types";

export default function QuizCard({ quiz }: QuizCardProps) {
    const tLesson = useTranslations("lesson");
    const tCommon = useTranslations("common");
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
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-4">
            {/* Question */}
            <p className="font-semibold text-base text-[#1A1A1A] mb-4">{quiz.question}</p>

            {quiz.type === "mcq" ? (
                <>
                    {/* MCQ Options */}
                    <div className="space-y-2">
                        {quiz.options?.map((option, idx) => {
                            let optionClass = "border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]";

                            if (isSubmitted) {
                                if (option === quiz.correct_answer) {
                                    optionClass = "bg-[#F0FDF4] border-green-300 text-green-800 font-medium";
                                } else if (option === selectedOption && !isCorrect) {
                                    optionClass = "bg-[#FEF2F2] border-red-300 text-red-700 font-medium";
                                } else {
                                    optionClass = "border-[#E5E7EB] opacity-50";
                                }
                            } else if (option === selectedOption) {
                                optionClass = "border-[#2563EB] bg-blue-50 text-[#1D4ED8] font-medium";
                            }

                            return (
                                <label
                                    key={idx}
                                    className={`w-full text-left px-4 py-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${optionClass}`}
                                >
                                    <input
                                        type="radio"
                                        name={`quiz-${quiz.id}`}
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={() => !isSubmitted && setSelectedOption(option)}
                                        disabled={isSubmitted}
                                        className="w-4 h-4 text-[#2563EB] border-[#D1D5DB] focus:ring-[#2563EB]/30 bg-white"
                                    />
                                    <span className="text-sm">{option}</span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Submit / Result */}
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {tLesson("quiz_submit")}
                        </button>
                    ) : (
                        <div className="space-y-4 mt-4">
                            <div
                                className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? "bg-[#F0FDF4] text-green-800 border border-green-300" : "bg-[#FEF2F2] text-red-700 border border-red-300"
                                    }`}
                            >
                                <span className="text-sm font-bold">{isCorrect ? "✓" : "✗"}</span>
                                <span className="font-medium text-sm">
                                    {isCorrect ? tLesson("quiz_correct") : tLesson("quiz_wrong")}
                                </span>
                            </div>

                            {/* Tip */}
                            {quiz.tip && (
                                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="font-mono text-xs uppercase tracking-wide text-[#92400E]">
                                            {tLesson("tip_label")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#78350F] leading-relaxed">{quiz.tip}</p>
                                </div>
                            )}

                            <button
                                onClick={resetQuiz}
                                className="text-sm text-[#2563EB] hover:text-[#1D4ED8] underline transition-colors"
                            >
                                ↻ {tCommon("try_again")}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* Open-ended */
                <>
                    {!showAnswer ? (
                        <button
                            onClick={() => setShowAnswer(true)}
                            className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#1D4ED8] transition-colors"
                        >
                            {tLesson("quiz_show_answer")}
                        </button>
                    ) : (
                        <div className="space-y-4 mt-4 animate-fade-in-up">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <span className="font-semibold text-[#1D4ED8] text-xs uppercase tracking-wider block mb-2">
                                    {tLesson("quiz_answer_label")}
                                </span>
                                <p className="text-sm text-[#374151] leading-relaxed">
                                    {quiz.correct_answer}
                                </p>
                            </div>

                            {quiz.tip && (
                                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="font-mono text-xs uppercase tracking-wide text-[#92400E]">
                                            {tLesson("tip_label")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#78350F] leading-relaxed">{quiz.tip}</p>
                                </div>
                            )}

                            <button
                                onClick={resetQuiz}
                                className="text-sm text-[#2563EB] hover:text-[#1D4ED8] underline transition-colors"
                            >
                                ↻ {tCommon("hide")}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
