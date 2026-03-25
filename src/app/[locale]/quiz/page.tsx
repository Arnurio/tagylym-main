"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import QuizCard from "@/components/QuizCard";
import { supabase } from "@/lib/supabase";
import type { Quiz } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
    const t = useTranslations("quiz");
    const tCourses = useTranslations("courses");
    const tCommon = useTranslations("common");
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterLevel, setFilterLevel] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            let query = supabase.from("quizzes").select("*");

            if (filterCategory) query = query.eq("category", filterCategory);
            if (filterLevel) query = query.eq("level", filterLevel);

            const { data, error } = await query;
            if (!error && data) {
                setQuizzes(data);
            }
            setLoading(false);
        };

        fetchQuizzes();
    }, [filterCategory, filterLevel]);

    const categories = [
        { value: "", label: t("filter_all") },
        { value: "robot-design", label: t("categories.robot-design") },
        { value: "innovation", label: t("categories.innovation") },
        { value: "coding", label: t("categories.coding") },
        { value: "robot-game", label: t("categories.robot-game") },
        { value: "core-values", label: t("categories.core-values") },
    ];

    const levels = [
        { value: "", label: t("filter_all") },
        { value: "beginner", label: tCourses("beginner") },
        { value: "intermediate", label: tCourses("intermediate") },
        { value: "advanced", label: tCourses("advanced") },
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-calistoga text-white mb-4">
                        {t("page_title")}
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 mb-12 flex flex-wrap gap-6 items-end border-white/5 shadow-2xl"
                >
                    <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                            {t("filter_track")}
                        </label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full bg-slate-800/40 text-slate-200 text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
                        >
                            {categories.map((c) => (
                                <option key={c.value} value={c.value} className="bg-slate-900">{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                            {t("filter_level")}
                        </label>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full bg-slate-800/40 text-slate-200 text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
                        >
                            {levels.map((l) => (
                                <option key={l.value} value={l.value} className="bg-slate-900">{l.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="px-4 py-3 text-sm text-slate-500 font-medium whitespace-nowrap">
                        {loading ? tCommon("loading") : `${quizzes.length} ${t("results_count")}`}
                    </div>
                </motion.div>

                {/* Quiz Grid */}
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center py-20"
                        >
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </motion.div>
                    ) : quizzes.length > 0 ? (
                        <motion.div 
                            key="grid"
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {quizzes.map((quiz, idx) => (
                                <motion.div
                                    key={quiz.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <QuizCard quiz={quiz} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 glass-card border-dashed border-white/10"
                        >
                            <span className="text-6xl mb-6 block opacity-50">🔬</span>
                            <h3 className="text-xl font-bold text-white mb-2">{t("no_results")}</h3>
                            <p className="text-slate-500">{tCommon("try_other_filters") || "Try adjusting your filters"}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
