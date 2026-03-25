"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import type { Progress, Lesson } from "@/types";

// Dashboard Components
import ProgressCards from "@/components/dashboard/ProgressCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ChecklistStatus from "@/components/dashboard/ChecklistStatus";

export default function DashboardPage() {
    const locale = useLocale();
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const tCourses = useTranslations("courses");
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string; name_kk?: string; name_en?: string; icon: string }[]>([]);
    const [categoryStats, setCategoryStats] = useState<Record<string, { total: number; completed: number }>>({});
    const [checklistStats, setChecklistStats] = useState<Record<string, { total: number; completed: number }>>({});
    const [recentLessons, setRecentLessons] = useState<Record<string, string>>({});
    const [levelNames, setLevelNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser ? { id: authUser.id, email: authUser.email } : null);

            // Fetch base data: categories and initial progress
            const [catsRes, progRes] = await Promise.all([
                supabase.from("categories").select("id, name, icon").order("sort_order"),
                authUser ? supabase.from("progress").select("*").eq("user_id", authUser.id).order("completed_at", { ascending: false }) : Promise.resolve({ data: [] })
            ]);

            const cats = catsRes.data;
            const prog = progRes.data;

            if (cats) setCategories(cats);
            if (prog) setProgress(prog);

            if (!cats || cats.length === 0) {
                setLoading(false);
                return;
            }

            const completedIds = prog?.map((p) => p.lesson_id) || [];
            const lastCompletedId = prog && prog.length > 0 ? prog[0].lesson_id : null;
            const catIds = cats.map((c) => c.id);

            // Fetch secondary data: levels and courses in parallel
            const [levelsRes, coursesRes] = await Promise.all([
                supabase.from("levels").select("id, category_id, name, color").in("category_id", catIds),
                supabase.from("courses").select("id, level_id").in("level_id", (await supabase.from("levels").select("id").in("category_id", catIds)).data?.map(l => l.id) || [])
            ]);

            const levels = levelsRes.data;
            let courses = coursesRes.data;

            // If we don't have courses yet (because we need levelIds), fetch them now.
            // Actually, let's just fetch everything track-related in one go if possible.
            const levelIds = levels?.map(l => l.id) || [];
            if (levelIds.length > 0 && (!courses || courses.length === 0)) {
                const { data } = await supabase.from("courses").select("id, level_id").in("level_id", levelIds);
                courses = data;
            }

            if (levels) {
                const lNames: Record<string, string> = {};
                levels.forEach(l => {
                    const nameMap: Record<string, string> = {
                        "Начинающий": tCourses("beginner"),
                        "Средний": tCourses("intermediate"),
                        "Продвинутый": tCourses("advanced")
                    };
                    const locName = locale === 'kk' ? (l as any).name_kk : (locale === 'en' ? (l as any).name_en : l.name);
                    lNames[l.id] = nameMap[l.name] || locName || l.name;
                });
                setLevelNames(lNames);
            }

            if (courses && courses.length > 0) {
                const courseIds = courses.map((c) => c.id);

                // Fetch lessons and checklist data in parallel
                const [lessonsRes, checklistItemsRes, checklistProgRes] = await Promise.all([
                    supabase.from("lessons").select("id, course_id, sort_order").in("course_id", courseIds).order("sort_order", { ascending: true }),
                    supabase.from("checklist_items").select("id, level_id").in("level_id", levelIds),
                    authUser ? supabase.from("checklist_progress").select("item_id, checked").eq("user_id", authUser.id).eq("checked", true) : Promise.resolve({ data: [] })
                ]);

                const allLessons = lessonsRes.data;
                const checkItems = checklistItemsRes.data;
                const checkProg = checklistProgRes.data;

                if (allLessons) {
                    // Title mapping for visible lessons
                    const recentLessonIds = completedIds.slice(0, 5);
                    if (recentLessonIds.length > 0) {
                        const { data: titles } = await supabase.from("lessons").select("id, title").in("id", recentLessonIds);
                        if (titles) {
                            const titleMap: Record<string, string> = {};
                            titles.forEach(l => {
                                const t = locale === 'kk' ? (l as any).title_kk : (locale === 'en' ? (l as any).title_en : l.title);
                                titleMap[l.id] = t || l.title;
                            });
                            setRecentLessons(titleMap);
                        }
                    }

                    // Stats calculation
                    const courseToLevel: Record<string, string> = {};
                    courses.forEach((c) => { courseToLevel[c.id] = c.level_id; });
                    const levelToCategory: Record<string, string> = {};
                    levels?.forEach((l) => { levelToCategory[l.id] = l.category_id; });

                    const stats: Record<string, { total: number; completed: number }> = {};
                    allLessons.forEach((lesson) => {
                        const levelId = courseToLevel[lesson.course_id];
                        const catId = levelToCategory[levelId];
                        if (!catId) return;
                        if (!stats[catId]) stats[catId] = { total: 0, completed: 0 };
                        stats[catId].total += 1;
                        if (completedIds.includes(lesson.id)) stats[catId].completed += 1;
                    });
                    setCategoryStats(stats);

                    // Refined Continue Learning Logic
                    let foundNext = false;
                    if (lastCompletedId) {
                        const currentLesson = allLessons.find(l => l.id === lastCompletedId);
                        if (currentLesson) {
                            // 1. Next in same course
                            const nextInCourse = allLessons.find(l => 
                                l.course_id === currentLesson.course_id && 
                                l.sort_order > currentLesson.sort_order
                            );
                            if (nextInCourse) {
                                const { data: fullNext } = await supabase.from("lessons").select("*").eq("id", nextInCourse.id).single();
                                if (fullNext) { setNextLesson(fullNext); foundNext = true; }
                            } else {
                                // 2. First in next course
                                const currentIndexInTrack = allLessons.findIndex(l => l.id === lastCompletedId);
                                if (currentIndexInTrack !== -1 && currentIndexInTrack < allLessons.length - 1) {
                                    const nextId = allLessons[currentIndexInTrack + 1].id;
                                    const { data: fullNext } = await supabase.from("lessons").select("*").eq("id", nextId).single();
                                    if (fullNext) { setNextLesson(fullNext); foundNext = true; }
                                }
                            }
                        }
                    }
                    if (!foundNext) {
                        const firstIncomplete = allLessons.find(l => !completedIds.includes(l.id));
                        if (firstIncomplete) {
                            const { data: fullNext } = await supabase.from("lessons").select("*").eq("id", firstIncomplete.id).single();
                            if (fullNext) setNextLesson(fullNext);
                        }
                    }
                }

                // Checklist stats
                if (checkItems) {
                    const cStats: Record<string, { total: number; completed: number }> = {};
                    const checkedIds = checkProg?.map(p => p.item_id) || [];
                    checkItems.forEach(item => {
                        if (!cStats[item.level_id]) cStats[item.level_id] = { total: 0, completed: 0 };
                        cStats[item.level_id].total += 1;
                        if (checkedIds.includes(item.id)) cStats[item.level_id].completed += 1;
                    });
                    setChecklistStats(cStats);
                }
            }

            setLoading(false);
        };

        init();
    }, [locale]);

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
                    {nextLesson && (
                        <Link
                            href={`/lessons/${nextLesson.id}` as "/"}
                            className="group inline-flex bg-[#8B5CF6] hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap items-center gap-2"
                        >
                            <span>{t("continue_learning")}</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-16 animate-pulse">
                        <p className="text-[#94a3b8]">{tCommon("loading")}</p>
                    </div>
                ) : !user ? (
                    <div className="text-center py-16 bg-[#1e293b] rounded-2xl border border-[#334155]">
                        <span className="text-4xl mb-4 block">🔒</span>
                        <p className="text-[#94a3b8] mb-4">{t("login_prompt")}</p>
                        <Link
                            href="/auth/login"
                            className="inline-flex px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium hover:bg-purple-500 transition-colors"
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
                            <ProgressCards 
                                categories={categories} 
                                categoryStats={categoryStats} 
                                locale={locale} 
                            />
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Recent Progress */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-lg">🕐</span>
                                    {t("recent")}
                                </h2>
                                <RecentActivity 
                                    progress={progress} 
                                    recentLessons={recentLessons} 
                                    locale={locale} 
                                />
                            </section>

                            {/* Checklist Status */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-lg">✅</span>
                                    {t("checklist")}
                                </h2>
                                <ChecklistStatus 
                                    checklistStats={checklistStats} 
                                    levelNames={levelNames} 
                                    categories={categories} 
                                    locale={locale} 
                                />
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
