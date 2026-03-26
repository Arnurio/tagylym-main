"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Quiz } from "@/types";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
type Level = typeof LEVELS[number];
const SESSION_LENGTH = 10;

const CATEGORIES = [
    { value: "", labelKey: "cat_all_categories" as const },
    { value: "robot-design", labelKey: "categories.robot-design" as const },
    { value: "innovation", labelKey: "categories.innovation" as const },
    { value: "coding", labelKey: "categories.coding" as const },
    { value: "robot-game", labelKey: "categories.robot-game" as const },
    { value: "core-values", labelKey: "categories.core-values" as const },
];

type Phase = "select" | "playing" | "results";

interface QuestionResult {
    question: string;
    correct: boolean;
    level: Level;
}

export default function CatQuizPage() {
    const t = useTranslations("quiz");
    const tCourses = useTranslations("courses");

    const [phase, setPhase] = useState<Phase>("select");
    const [category, setCategory] = useState("");
    const [pool, setPool] = useState<Record<Level, Quiz[]>>({ beginner: [], intermediate: [], advanced: [] });
    const [used, setUsed] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [noQuestions, setNoQuestions] = useState(false);

    // Playing state
    const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
    const [currentLevel, setCurrentLevel] = useState<Level>("beginner");
    const [selected, setSelected] = useState<string | null>(null);
    const [answered, setAnswered] = useState(false);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [consecutiveWrong, setConsecutiveWrong] = useState(0);
    const [levelChange, setLevelChange] = useState<"up" | "down" | null>(null);
    const [history, setHistory] = useState<QuestionResult[]>([]);

    const levelLabel = (level: Level) => {
        if (level === "beginner") return tCourses("beginner");
        if (level === "intermediate") return tCourses("intermediate");
        return tCourses("advanced");
    };

    const levelColor = (level: Level) => {
        if (level === "beginner") return "#10B981";
        if (level === "intermediate") return "#F59E0B";
        return "#8B5CF6";
    };

    const pickQuestion = useCallback((level: Level, currentPool: Record<Level, Quiz[]>, currentUsed: Set<string>): Quiz | null => {
        const available = currentPool[level].filter(q => !currentUsed.has(q.id));
        if (available.length === 0) {
            // Try other levels
            for (const l of LEVELS) {
                const alt = currentPool[l].filter(q => !currentUsed.has(q.id));
                if (alt.length > 0) return alt[Math.floor(Math.random() * alt.length)];
            }
            return null;
        }
        return available[Math.floor(Math.random() * available.length)];
    }, []);

    const startSession = async () => {
        setLoading(true);
        let query = supabase.from("quizzes").select("*").eq("type", "mcq");
        if (category) query = query.eq("category", category);
        const { data, error } = await query;

        if (error || !data || data.length < 3) {
            setNoQuestions(true);
            setLoading(false);
            return;
        }

        const newPool: Record<Level, Quiz[]> = { beginner: [], intermediate: [], advanced: [] };
        for (const q of data) {
            if (q.level === "beginner") newPool.beginner.push(q);
            else if (q.level === "intermediate") newPool.intermediate.push(q);
            else if (q.level === "advanced") newPool.advanced.push(q);
        }

        const newUsed = new Set<string>();
        const first = pickQuestion("beginner", newPool, newUsed);
        if (!first) {
            setNoQuestions(true);
            setLoading(false);
            return;
        }

        setPool(newPool);
        setUsed(newUsed);
        setCurrentLevel("beginner");
        setCurrentQuestion(first);
        setSelected(null);
        setAnswered(false);
        setTotalAnswered(0);
        setCorrectCount(0);
        setConsecutiveCorrect(0);
        setConsecutiveWrong(0);
        setLevelChange(null);
        setHistory([]);
        setNoQuestions(false);
        setPhase("playing");
        setLoading(false);
    };

    const handleAnswer = (option: string) => {
        if (answered || !currentQuestion) return;
        setSelected(option);
        setAnswered(true);

        const isCorrect = option === currentQuestion.correct_answer;
        const newTotal = totalAnswered + 1;
        const newCorrect = isCorrect ? correctCount + 1 : correctCount;
        setTotalAnswered(newTotal);
        setCorrectCount(newCorrect);
        setHistory(prev => [...prev, { question: currentQuestion.question, correct: isCorrect, level: currentLevel }]);

        // Update consecutive counters
        let newConsecCorrect = isCorrect ? consecutiveCorrect + 1 : 0;
        let newConsecWrong = isCorrect ? 0 : consecutiveWrong + 1;
        setConsecutiveCorrect(newConsecCorrect);
        setConsecutiveWrong(newConsecWrong);

        // Determine next level
        let nextLevel = currentLevel;
        let change: "up" | "down" | null = null;
        const levelIdx = LEVELS.indexOf(currentLevel);

        if (newConsecCorrect >= 2 && levelIdx < 2) {
            nextLevel = LEVELS[levelIdx + 1];
            newConsecCorrect = 0;
            change = "up";
        } else if (newConsecWrong >= 2 && levelIdx > 0) {
            nextLevel = LEVELS[levelIdx - 1];
            newConsecWrong = 0;
            change = "down";
        }

        setLevelChange(change);

        if (newTotal >= SESSION_LENGTH) {
            // Will go to results on next click
        }
    };

    const handleNext = () => {
        if (totalAnswered >= SESSION_LENGTH) {
            setPhase("results");
            return;
        }

        // Determine next level based on current state
        let nextLevel = currentLevel;
        const levelIdx = LEVELS.indexOf(currentLevel);
        if (consecutiveCorrect === 0 && levelChange === "up") nextLevel = LEVELS[Math.min(levelIdx + 1, 2)];
        if (consecutiveWrong === 0 && levelChange === "down") nextLevel = LEVELS[Math.max(levelIdx - 1, 0)];

        // Recalculate with updated consecutives after handleAnswer set them
        const newUsed = new Set(used);
        if (currentQuestion) newUsed.add(currentQuestion.id);
        setUsed(newUsed);

        const next = pickQuestion(nextLevel, pool, newUsed);
        if (!next) {
            setPhase("results");
            return;
        }

        setCurrentLevel(nextLevel);
        setCurrentQuestion(next);
        setSelected(null);
        setAnswered(false);
        setLevelChange(null);
    };

    const restart = () => {
        setPhase("select");
        setNoQuestions(false);
    };

    const progressPct = Math.round((totalAnswered / SESSION_LENGTH) * 100);

    if (phase === "select") {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold uppercase tracking-widest mb-4">
                            CAT
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3">{t("cat_title")}</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">{t("cat_subtitle")}</p>
                    </div>

                    <div className="bg-[#0F172A]/60 border border-white/5 rounded-2xl p-6 space-y-6 backdrop-blur">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("filter_track")}</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-slate-800/40 text-slate-200 text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-[#8B5CF6]/50 focus:outline-none transition-all cursor-pointer"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.value} value={c.value} className="bg-slate-900">
                                        {t(c.labelKey)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-slate-800/30 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
                            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t("cat_rule_correct")}</div>
                            <div className="flex items-center gap-2"><span className="text-red-400">●</span> {t("cat_rule_wrong")}</div>
                            <div className="flex items-center gap-2"><span className="text-slate-500">●</span> {t("cat_rule_questions", { n: SESSION_LENGTH })}</div>
                        </div>

                        {noQuestions && (
                            <p className="text-red-400 text-sm text-center">{t("cat_no_questions")}</p>
                        )}

                        <button
                            onClick={startSession}
                            disabled={loading}
                            className="w-full bg-[#8B5CF6] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#7C3AED] transition-all disabled:opacity-50 shadow-lg shadow-[#8B5CF6]/20"
                        >
                            {loading ? "..." : t("cat_start")}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <Link href="/quiz" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                            ← {t("cat_back")}
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (phase === "results") {
        const pct = Math.round((correctCount / totalAnswered) * 100);
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-[#0F172A]/60 border border-white/5 rounded-2xl p-8 backdrop-blur text-center space-y-6">
                        <div className="text-6xl">{pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚"}</div>
                        <h2 className="text-3xl font-bold text-white">{t("cat_results_title")}</h2>
                        <p className="text-slate-400 text-lg">
                            {t("cat_score", { correct: correctCount, total: totalAnswered })}
                        </p>

                        {/* Score bar */}
                        <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444" }}
                            />
                        </div>

                        {/* Question history */}
                        <div className="space-y-2 text-left max-h-48 overflow-y-auto">
                            {history.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                    <span className={item.correct ? "text-emerald-400 mt-0.5" : "text-red-400 mt-0.5"}>
                                        {item.correct ? "✓" : "✗"}
                                    </span>
                                    <span className="text-slate-400 line-clamp-1">{item.question}</span>
                                    <span
                                        className="ml-auto shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded"
                                        style={{ color: levelColor(item.level), backgroundColor: `${levelColor(item.level)}15` }}
                                    >
                                        {levelLabel(item.level).toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={restart}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
                            >
                                {t("cat_restart")}
                            </button>
                            <Link
                                href="/quiz"
                                className="flex-1 py-3 rounded-xl bg-[#8B5CF6] text-white text-sm font-bold text-center hover:bg-[#7C3AED] transition-all"
                            >
                                {t("cat_back")}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Playing phase
    if (!currentQuestion) return null;
    const isCorrect = selected === currentQuestion.correct_answer;

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-lg space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{t("cat_question_n", { n: totalAnswered + (answered ? 0 : 1), total: SESSION_LENGTH })}</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: levelColor(currentLevel) }}>
                                {levelLabel(currentLevel).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            animate={{ width: `${progressPct}%` }}
                            className="h-full bg-[#8B5CF6] rounded-full"
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Level change toast */}
                <AnimatePresence>
                    {levelChange && answered && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-center text-sm font-bold py-2 px-4 rounded-xl ${levelChange === "up" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}
                        >
                            {levelChange === "up" ? "↑ " : "↓ "}{t(levelChange === "up" ? "cat_level_up" : "cat_level_down")}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Question card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="bg-[#0F172A]/60 border border-white/5 rounded-2xl p-8 backdrop-blur space-y-6"
                    >
                        {/* Level badge */}
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest"
                                style={{ color: levelColor(currentLevel), backgroundColor: `${levelColor(currentLevel)}15` }}
                            >
                                {levelLabel(currentLevel)}
                            </span>
                        </div>

                        <p className="text-white font-bold text-xl leading-snug">{currentQuestion.question}</p>

                        <div className="space-y-3">
                            {currentQuestion.options?.map((option, idx) => {
                                const isSelected = selected === option;
                                const isOptionCorrect = option === currentQuestion.correct_answer;

                                let cls = "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5 cursor-pointer";
                                if (answered) {
                                    if (isOptionCorrect) cls = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                                    else if (isSelected) cls = "border-red-500/40 bg-red-500/10 text-red-300";
                                    else cls = "border-white/5 opacity-30";
                                } else if (isSelected) {
                                    cls = "border-[#8B5CF6]/50 bg-[#8B5CF6]/10 text-white ring-2 ring-[#8B5CF6]/20";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        disabled={answered}
                                        className={`w-full text-left px-5 py-4 rounded-xl border flex items-center justify-between transition-all text-sm ${cls}`}
                                    >
                                        <span>{option}</span>
                                        {answered && isOptionCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                                        {answered && isSelected && !isCorrect && <span className="text-red-400 font-bold">✗</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className={`py-3 px-4 rounded-xl text-sm font-bold text-center ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                    {isCorrect ? t("cat_correct") : t("cat_wrong")}
                                </div>

                                {currentQuestion.tip && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest block mb-1">💡 Tip</span>
                                        <p className="text-amber-200/80 text-sm leading-relaxed">{currentQuestion.tip}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-[#8B5CF6] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#7C3AED] transition-all"
                                >
                                    {totalAnswered >= SESSION_LENGTH ? t("cat_finish") : t("cat_next")}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
