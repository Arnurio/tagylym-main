"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import ProgressBar from "@/components/ProgressBar";
import type { Progress } from "@/types";

export default function DashboardPage() {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const tCourses = useTranslations("courses");
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
    const [categoryStats, setCategoryStats] = useState<Record<string, { total: number; completed: number }>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser ? { id: authUser.id, email: authUser.email } : null);

            // Fetch categories
            const { data: cats } = await supabase
                .from("categories")
                .select("id, name, icon")
                .order("order");
            if (cats) setCategories(cats);

            // Fetch user progress
            let completedIds: string[] = [];
            if (authUser) {
                const { data: prog } = await supabase
                    .from("progress")
                    .select("*")
                    .eq("user_id", authUser.id)
                    .order("completed_at", { ascending: false });
                if (prog) {
                    setProgress(prog);
                    completedIds = prog.map((p) => p.lesson_id);
                }
            }

            // Compute per-category stats: fetch levels → courses → lessons grouped by category
            if (cats && cats.length > 0) {
                const stats: Record<string, { total: number; completed: number }> = {};

                // Fetch all levels for these categories
                const catIds = cats.map((c) => c.id);
                const { data: levels } = await supabase
                    .from("levels")
                    .select("id, category_id")
                    .in("category_id", catIds);

                if (levels && levels.length > 0) {
                    const levelIds = levels.map((l) => l.id);

                    // Fetch all courses for those levels
                    const { data: courses } = await supabase
                        .from("courses")
                        .select("id, level_id")
                        .in("level_id", levelIds);

                    if (courses && courses.length > 0) {
                        const courseIds = courses.map((c) => c.id);

                        // Fetch all lessons for those courses
                        const { data: lessons } = await supabase
                            .from("lessons")
                            .select("id, course_id")
                            .in("course_id", courseIds);

                        if (lessons) {
                            // Build lookup: lessonId → categoryId
                            const courseToLevel: Record<string, string> = {};
                            courses.forEach((c) => { courseToLevel[c.id] = c.level_id; });
                            const levelToCategory: Record<string, string> = {};
                            levels.forEach((l) => { levelToCategory[l.id] = l.category_id; });

                            lessons.forEach((lesson) => {
                                const levelId = courseToLevel[lesson.course_id];
                                const catId = levelToCategory[levelId];
                                if (!catId) return;
                                if (!stats[catId]) stats[catId] = { total: 0, completed: 0 };
                                stats[catId].total += 1;
                                if (completedIds.includes(lesson.id)) {
                                    stats[catId].completed += 1;
                                }
                            });
                        }
                    }
                }

                setCategoryStats(stats);
            }

            setLoading(false);
        };

        init();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9]">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
                {/* Welcome */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            {t("welcome")}, {user?.email ? user.email.split("@")[0] : t("guest")}! 👋
                        </h1>
                        <p className="text-[#94a3b8]">{t("subtitle")}</p>
                    </div>

                    {/* Quick Access: Continue Learning */}
                    {progress.length > 0 && (
                        <Link
                            href={`/lessons/${progress[0].lesson_id}` as "/"}
                            className="inline-flex bg-[#8B5CF6] hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap"
                        >
                            {t("continue_learning")}
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <p className="text-[#94a3b8]">{tCommon("loading")}</p>
                    </div>
                ) : !user ? (
                    <div className="text-center py-16">
                        <span className="text-4xl mb-4 block">🔒</span>
                        <p className="text-[#94a3b8] mb-4">{t("login_prompt")}</p>
                        <Link
                            href="/auth/login"
                            className="inline-flex px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            {t("login_btn")}
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Progress Cards */}
                        <section className="mb-16">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-lg">📊</span>
                                {t("progress")}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.map((cat) => {
                                    const stats = categoryStats[cat.id] ?? { total: 0, completed: 0 };
                                    return (
                                        <div key={cat.id} className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-2xl">{cat.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-white">{cat.name}</h3>
                                                    <p className="text-xs text-[#94a3b8]">
                                                        {stats.completed} / {stats.total} {t("lessons_completed")}
                                                    </p>
                                                </div>
                                            </div>
                                            <ProgressBar completed={stats.completed} total={Math.max(stats.total, 1)} />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Recent Progress */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-lg">🕐</span>
                                    {t("recent")}
                                </h2>
                                {progress.length === 0 ? (
                                    <p className="text-sm text-[#94a3b8]">{t("noProgress")}</p>
                                ) : (
                                    <div className="space-y-3">
                                        {progress.slice(0, 3).map((p, idx) => (
                                            <Link href={`/lessons/${p.lesson_id}` as "/"} key={`${p.user_id}-${p.lesson_id}`} className="bg-[#1e293b] rounded-xl border border-[#334155] hover:border-[#8B5CF6] transition-colors p-4 flex items-center gap-4 cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-sm font-bold text-[#8B5CF6] shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-medium">{tCommon("lesson")}: {p.lesson_id}</p>
                                                    <p className="text-xs text-[#94a3b8]">
                                                        {new Date(p.completed_at).toLocaleDateString("kk-KZ")}
                                                    </p>
                                                </div>
                                                <div className="text-[#94a3b8]">→</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Checklist Status */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-lg">✅</span>
                                    {t("checklist")}
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {[tCourses("beginner"), tCourses("intermediate"), tCourses("advanced")].map((level, idx) => {
                                        const colors = ["bg-[#3B82F6]", "bg-[#F97316]", "bg-[#22C55E]"];
                                        return (
                                            <div key={level} className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${colors[idx]}`} />
                                                        <span className="font-medium text-sm text-white">{level}</span>
                                                    </div>
                                                    <span className="text-xs text-[#94a3b8]">0%</span>
                                                </div>
                                                <ProgressBar completed={0} total={1} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
