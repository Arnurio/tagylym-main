"use client";

import { useState, useEffect } from "react";

import { Link } from "@/i18n/routing";
import { getCourseBySlug, getLessonsByCourseSlug } from "@/lib/sanity";
import { supabase } from "@/lib/supabase";
import LevelBadge from "@/components/LevelBadge";
import type { LevelName } from "@/types";

interface SanityCourse {
    title: string;
    slug: string;
    description: string;
    category: string;
    level: string;
    order: number;
}

interface SanityLessonListItem {
    title: string;
    slug: string;
    order: number;
    isFree: boolean;
    videoUrl: string | null;
}

export default function CoursePage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

    useEffect(() => {
        params.then((p) => setResolvedParams(p));
    }, [params]);

    if (!resolvedParams) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    return <CourseContent slug={resolvedParams.slug} />;
}

function CourseContent({ slug }: { slug: string }) {
    const [course, setCourse] = useState<SanityCourse | null>(null);
    const [lessons, setLessons] = useState<SanityLessonListItem[]>([]);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);

            try {
                const courseData = await getCourseBySlug(slug);
                setCourse(courseData);

                if (courseData) {
                    const lessonData = await getLessonsByCourseSlug(slug);
                    if (lessonData) setLessons(lessonData);
                }

                // Fetch user progress
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: progress } = await supabase
                        .from("progress")
                        .select("lesson_id")
                        .eq("user_id", user.id);
                    if (progress) {
                        setCompletedLessons(new Set(progress.map((p) => p.lesson_id)));
                    }
                }
            } catch {
                // Sanity fetch error
            }

            setLoading(false);
        };

        fetchCourse();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mx-auto mb-6 text-4xl">
                        📖
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Курс не найден</h1>
                    <p className="text-muted text-sm leading-relaxed mb-6">
                        Содержание курса будет добавлено позже.
                    </p>
                    <Link
                        href={"/fll" as "/"}
                        className="inline-flex px-5 py-2.5 rounded-lg gradient-brand text-white font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        ← Вернуться к FLL
                    </Link>
                </div>
            </div>
        );
    }

    const levelName = (course.level || "beginner") as LevelName;

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
                {/* Header */}
                <div className="mb-8">
                    <LevelBadge level={levelName} />
                    <h1 className="text-3xl font-black text-white mt-3 mb-2">{course.title}</h1>
                    {course.description && (
                        <p className="text-muted leading-relaxed">{course.description}</p>
                    )}
                </div>

                {/* Progress */}
                {lessons.length > 0 && (
                    <div className="glass-card p-4 mb-8">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted">Прогресс курса</span>
                            <span className="text-white font-medium">
                                {lessons.filter((l) => completedLessons.has(l.slug)).length}/{lessons.length}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-surface-lighter rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-beginner to-advanced transition-all duration-500"
                                style={{
                                    width: `${lessons.length > 0 ? (lessons.filter((l) => completedLessons.has(l.slug)).length / lessons.length) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Lesson List */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-lg">📚</span>
                    Уроки ({lessons.length})
                </h2>

                {lessons.length === 0 ? (
                    <p className="text-sm text-muted">Уроки для этого курса ещё не добавлены.</p>
                ) : (
                    <div className="space-y-3 stagger-children">
                        {lessons.map((lesson, idx) => {
                            const isCompleted = completedLessons.has(lesson.slug);
                            return (
                                <Link
                                    key={lesson.slug}
                                    href={`/lessons/${lesson.slug}` as "/"}
                                    className="glass-card p-5 flex items-center gap-4 group block"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isCompleted
                                                ? "bg-advanced/20 text-advanced"
                                                : "bg-accent/15 text-accent"
                                            }`}
                                    >
                                        {isCompleted ? "✓" : idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white text-sm group-hover:text-accent transition-colors truncate">
                                            {lesson.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {lesson.isFree && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-beginner/10 text-beginner border border-beginner/20">
                                                    Бесплатно
                                                </span>
                                            )}
                                            {lesson.videoUrl && (
                                                <span className="text-xs text-muted flex items-center gap-1">
                                                    🎬 Видео
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-muted group-hover:text-accent transition-colors shrink-0">
                                        →
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
