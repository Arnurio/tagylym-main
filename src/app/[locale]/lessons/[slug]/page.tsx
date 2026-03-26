"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import VideoPlayer from "@/components/VideoPlayer";
import QuizCard from "@/components/QuizCard";
import type { Quiz } from "@/types";

interface LessonData {
    id: string;
    course_id: string;
    title: string;
    title_kk?: string | null;
    title_en?: string | null;
    video_url: string | null;
    video_url_kk?: string | null;
    presentation_url?: string | null;
    presentation_url_kk?: string | null;
    content_md: string | null;
    sort_order: number;
    is_free: boolean;
}

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );
}

function LessonContent({ id, locale }: { id: string; locale: string }) {
    const t = useTranslations("lesson");
    const tCommon = useTranslations("common");
    const [lesson, setLesson] = useState<LessonData | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [siblings, setSiblings] = useState<{ id: string; title: string; sort_order: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id ?? null);

            const { data, error } = await supabase
                .from("lessons")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setLesson(data);

            const [sibsRes, quizRes] = await Promise.all([
                supabase
                    .from("lessons")
                    .select("id, title, sort_order")
                    .eq("course_id", data.course_id)
                    .order("sort_order", { ascending: true }),
                supabase
                    .from("quizzes")
                    .select("*")
                    .eq("lesson_id", id),
            ]);

            if (sibsRes.data) setSiblings(sibsRes.data);
            if (quizRes.data) setQuizzes(quizRes.data);

            setLoading(false);
        };

        init();
    }, [id]);

    const handleVideoEnd = async () => {
        if (!userId) return;
        await supabase.from("progress").upsert(
            { user_id: userId, lesson_id: id, completed_at: new Date().toISOString() },
            { onConflict: "user_id,lesson_id" }
        );
    };

    if (loading) return <LoadingSpinner />;

    if (notFound || !lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
                <div className="text-center max-w-md px-6">
                    <h1 className="text-2xl font-bold mb-3">{tCommon("coming_soon")}</h1>
                    <p className="text-slate-400 text-sm mb-6">{t("no_content")}</p>
                    <Link
                        href={"/fll" as "/"}
                        className="inline-flex px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        ← {t("back_to_courses")}
                    </Link>
                </div>
            </div>
        );
    }

    const title =
        locale === "kk" ? (lesson.title_kk || lesson.title) :
        locale === "en" ? (lesson.title_en || lesson.title) :
        lesson.title;

    const videoUrl =
        locale === "kk" ? (lesson.video_url_kk || lesson.video_url) : lesson.video_url;

    const presentationUrl =
        locale === "kk" ? (lesson.presentation_url_kk || lesson.presentation_url) : lesson.presentation_url;

    const currentIdx = siblings.findIndex((s) => s.id === id);
    const prevLesson = currentIdx > 0 ? siblings[currentIdx - 1] : null;
    const nextLesson = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <div className="max-w-3xl mx-auto py-10 px-6">
                <Link
                    href={"/fll" as "/"}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    FLL
                </Link>
                <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

                {videoUrl && videoUrl.split(',').map((rawUrl, idx) => (
                    <div key={idx} className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <VideoPlayer videoUrl={rawUrl.trim()} lessonId={id} onComplete={idx === 0 ? handleVideoEnd : undefined} />
                    </div>
                ))}

                {presentationUrl && (
                    <div className="mb-8 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-white">Презентация</h3>
                            <a
                                href={presentationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:opacity-80 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Ашу / Открыть
                            </a>
                        </div>
                        <iframe
                            src={(() => {
                                const driveFile = presentationUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                                if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
                                const slides = presentationUrl.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
                                if (slides) return `https://drive.google.com/file/d/${slides[1]}/preview`;
                                if (presentationUrl.toLowerCase().endsWith(".pdf")) return presentationUrl;
                                return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(presentationUrl)}`;
                            })()}
                            className="w-full h-[500px] md:h-[600px]"
                            allowFullScreen
                        />
                    </div>
                )}

                {lesson.content_md && (
                    <div className="mb-8 text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                        {lesson.content_md}
                    </div>
                )}

                {quizzes.length > 0 && (
                    <div className="mt-12 mb-6">
                        <h2 className="text-2xl font-bold text-white mb-6">{t("quiz_title")}</h2>
                        <div className="space-y-6">
                            {quizzes.map((q) => (
                                <QuizCard key={q.id} quiz={q} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
                    {prevLesson ? (
                        <Link
                            href={`/lessons/${prevLesson.id}` as "/"}
                            className="border border-white/10 text-slate-300 hover:bg-white/5 transition-colors rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2"
                        >
                            ← {t("prev")}
                        </Link>
                    ) : (
                        <span />
                    )}
                    {nextLesson ? (
                        <Link
                            href={`/lessons/${nextLesson.id}` as "/"}
                            className="bg-primary text-white hover:opacity-90 transition-opacity rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2"
                        >
                            {t("next")} →
                        </Link>
                    ) : (
                        <span />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LessonPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const [resolvedParams, setResolvedParams] = useState<{ locale: string; slug: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) return <LoadingSpinner />;
    return <LessonContent id={resolvedParams.slug} locale={resolvedParams.locale} />;
}
