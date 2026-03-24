"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import QuizCard from "@/components/QuizCard";
import { supabase } from "@/lib/supabase";
import type { Quiz } from "@/types";

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
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white mb-3">{t("page_title")}</h1>
                    <p className="text-slate-400">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 mb-8 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-slate-400 font-medium mb-1.5">
                            {t("filter_track")}
                        </label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full bg-[#0f172a] text-slate-300 text-sm rounded-lg px-3 py-2 border border-[#334155] focus:border-[#8B5CF6] focus:outline-none"
                        >
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-slate-400 font-medium mb-1.5">
                            {t("filter_level")}
                        </label>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full bg-[#0f172a] text-slate-300 text-sm rounded-lg px-3 py-2 border border-[#334155] focus:border-[#8B5CF6] focus:outline-none"
                        >
                            {levels.map((l) => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-slate-400 mb-6">
                    {loading ? tCommon("loading") : `${quizzes.length} ${t("results_count")}`}
                </p>

                {/* Quiz Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quizzes.map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                )}

                {!loading && quizzes.length === 0 && (
                    <div className="text-center py-16">
                        <span className="text-4xl mb-4 block">🔍</span>
                        <p className="text-slate-400">{t("no_results")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
