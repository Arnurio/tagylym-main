"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCourseThumbnail } from "@/lib/course-thumbnails";
import LevelBadge from "@/components/LevelBadge";
import ChecklistBlock from "@/components/ChecklistBlock";
import RubricCallout from "@/components/RubricCallout";
import ArtifactCard from "@/components/ArtifactCard";
import type { LevelName, ChecklistItem } from "@/types";

const rubricCriterionMap: Record<string, "DESIGN" | "CREATE" | "INNOVATION" | "ITERATE"> = {
    "robot-design": "DESIGN",
    coding: "CREATE",
    innovation: "INNOVATION",
    "robot-game": "ITERATE",
};

const rubricTexts: Record<string, Record<string, string>> = {
    "robot-design": {
        beginner: "Робот жобаланды, негізгі тапсырмаларды орындай алады. Команда дизайнның негізгі шешімдерін түсіндіре алады.",
        intermediate: "Дизайн тестілеу негізінде жақсартылды. Инженерлік журналда процесс құжатталған.",
        advanced: "Нақты негіздемесі бар инновациялық дизайн. Команда инженерлік процесті терең түсінетінін көрсетеді.",
    },
    coding: {
        beginner: "Бағдарлама роботты миссияларды орындау үшін іске қосады. Код жүйелі және түсінікті.",
        intermediate: "Датчиктер мен шарттарды қолдану. Дәл қозғалыс үшін P-контроллер.",
        advanced: "PID-реттегіш, PyBricks-тегі модульдік код. Маршрутты оңтайландыру алгоритмдері.",
    },
    innovation: {
        beginner: "Мәселе анықталды, шешім ұсынылды. Презентация құрылымдалған.",
        intermediate: "Прототип нақты пайдаланушылармен сыналды. Әсер ету көрсеткіштері бар.",
        advanced: "Impact First: алғашқы 10 секундта цифрлық нәтиже. Масштабталатын шешім.",
    },
    "robot-game": {
        beginner: "Робот 3+ миссияны орындайды. Команда ережелер мен стратегияны біледі.",
        intermediate: "Миссиялардың ROI-анализі. Оңтайландырылған маршруттар. 150+ ұпай.",
        advanced: "300+ ұпай. Резервтік жоспарлары бар толық автономды стратегия.",
    },
};

export default function LevelPageContent({
    category,
    level,
    season,
    levelData,
    categoryData,
    checklist,
    courses,
    artifacts,
}: {
    category: string;
    level: string;
    season: string;
    levelData: { id: string; name: string; color: string } | null;
    categoryData: { name: string } | null;
    checklist: ChecklistItem[];
    courses: { id: string; title: string; description: string | null; sort_order: number }[];
    artifacts: { id: string; name: string; file_url: string; description: string | null }[];
}) {
    const tCommon = useTranslations("common");
    const tCourses = useTranslations("courses");
    const tNav = useTranslations("nav");
    const tErrors = useTranslations("errors");
    const tLesson = useTranslations("lesson");
    const tQuiz = useTranslations("quiz");
    const tChecklist = useTranslations("checklist");
    const levelName = level as LevelName;
    const rubricLevel = level === "advanced" ? "EXCEEDS" as const : "ACCOMPLISHED" as const;
    const criterion = rubricCriterionMap[category] || "DESIGN";
    const rubricText = rubricTexts[category]?.[level] || "Бұл деңгей үшін бағалау критерийлері.";

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from("checklist_progress")
                    .select("item_id, checked")
                    .eq("user_id", user.id);

                if (data) {
                    const progress: Record<string, boolean> = {};
                    data.forEach((row) => {
                        progress[row.item_id] = row.checked;
                    });
                    setCheckedItems(progress);
                }
            } catch {
                // Not logged in or error
            }
        };

        loadProgress();
    }, [checklist]);

    const handleToggle = async (itemId: string) => {
        const newChecked = !checkedItems[itemId];
        setCheckedItems((prev) => ({ ...prev, [itemId]: newChecked }));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from("checklist_progress").upsert({
                user_id: user.id,
                item_id: itemId,
                checked: newChecked,
            }, { onConflict: "user_id,item_id" });
        } catch {
            // Persist locally
        }
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;

    if (!levelData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <p className="text-[#6B7280]">{tErrors("not_found")}</p>
            </div>
        );
    }

    const allLevels = ["beginner", "intermediate", "advanced"];
    const displayNames: Record<string, string> = {
        "beginner": tCourses("beginner"),
        "intermediate": tCourses("intermediate"),
        "advanced": tCourses("advanced")
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
            {/* Header */}
            <header className="bg-white px-6 py-6 border-b border-[#E5E7EB] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* LEFT */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href={`/fll/${season}/${category}` as any} className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F3F4F6]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">
                                {categoryData?.name || "Трек"}
                            </h1>
                            <p className="text-sm text-[#6B7280] mt-1">
                                {completedCount} / {checklist.length} {tChecklist("progress")}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT (Level tabs) */}
                    <div className="flex bg-[#F3F4F6] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                        {allLevels.map(lvl => (
                            <Link
                                key={lvl}
                                href={`/fll/${season}/${category}/${lvl}` as any}
                                className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${lvl === level
                                    ? "bg-white shadow-sm text-[#1A1A1A] font-medium"
                                    : "text-[#6B7280] hover:text-[#374151]"
                                    }`}
                            >
                                {displayNames[lvl]}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Track Navigation Banner */}
            <div className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-[#1A1A1A]">{tQuiz("filter_track")}: {categoryData?.name}</span>
                        <LevelBadge level={levelName} />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
                {/* Rubric */}
                <RubricCallout criterion={criterion} level={rubricLevel} text={rubricText} />

                {/* Course Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                        {tCourses("page_title")}
                    </h2>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course, idx) => (
                                <Link
                                    key={course.id}
                                    href={`/course/fll?courseId=${course.id}` as any}
                                    className="block bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
                                >
                                    {/* Course Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={getCourseThumbnail(category)}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                            {tCommon("preview")}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <span className="text-xs font-bold text-[#2563EB] tracking-wider mb-2 block uppercase">
                                            {tCommon("lesson")} {idx + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] leading-tight mb-3 group-hover:text-[#2563EB] transition-colors">
                                            {course.title}
                                        </h3>
                                        {course.description && (
                                            <p className="text-sm text-[#6B7280] line-clamp-2 h-10">
                                                {course.description}
                                            </p>
                                        )}

                                        <div className="border-t border-[#F3F4F6] my-4" />

                                        {/* Footer */}
                                        <div className="flex justify-between items-center text-xs font-medium text-[#6B7280]">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                15 {tLesson("minutes")}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                3 {tCommon("lessons")}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#6B7280]">{tCourses("no_courses")}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checklist */}
                    {checklist.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-[#1A1A1A]">{tChecklist("title")}</h2>
                            <ChecklistBlock 
                                items={checklist} 
                                levelId={levelData.id} 
                                checkedItems={checkedItems}
                                onToggle={handleToggle}
                            />
                        </div>
                    )}

                    {/* Artifacts */}
                    {artifacts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1A1A1A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                {tNav("resources")}
                            </h2>
                            <div className="space-y-3">
                                {artifacts.map((artifact) => (
                                    <ArtifactCard
                                        key={artifact.id}
                                        artifact={{ ...artifact, level_id: levelData.id, description: artifact.description || "" }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
