"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import type { Quiz } from "@/types";

interface Lesson {
  id: string;
  title: string;
  title_kk?: string | null;
  title_en?: string | null;
  type: 'video' | 'presentation';
  video_url?: string | null;
  video_url_kk?: string | null;
  presentation_url?: string | null;
  presentation_url_kk?: string | null;
  sort_order: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

function getEmbedUrl(url: string): string {
  const driveFile = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
  const slides = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/embed`;
  if (url.toLowerCase().endsWith('.pptx') || url.includes('sharepoint') || url.includes('1drv.ms')) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function CoursePlayerPage() {
  const t = useTranslations("fll");
  const params = useParams();
  const locale = params.locale as string;

  const [user, setUser] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Quiz state
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizPhase, setQuizPhase] = useState<'hidden' | 'running' | 'done'>('hidden');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);

      // 1. Get User
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      // 2. Fetch Course by ID from URL or show course list
      const searchParams = new URLSearchParams(window.location.search);
      const courseId = searchParams.get('courseId');

      if (!courseId) {
        // No course selected — load all courses for selection
        const { data: courses } = await supabase
          .from('courses')
          .select('id, title, title_kk, title_en, description')
          .order('sort_order', { ascending: true });
        setAllCourses(courses ?? []);
        setLoading(false);
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        console.error("Error fetching course:", courseError);
        setLoading(false);
        return;
      }
      setCourse(courseData);

      // 3. Fetch Lessons from Supabase (primary source of truth)
      const { data: sbLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, title_kk, title_en, video_url, video_url_kk, presentation_url, presentation_url_kk, sort_order')
        .eq('course_id', courseData.id)
        .order('sort_order', { ascending: true });

      if (lessonsError) {
        console.error("Error fetching lessons:", lessonsError);
      }

      if (!sbLessons || sbLessons.length === 0) {
        console.warn("No lessons found in Supabase for this course");
        setCurriculum([{ title: courseData.title, lessons: [] }]);
      } else {
        const mappedLessons: Lesson[] = sbLessons.map((l) => {
          // Pick localized title
          const title =
            locale === 'kk' ? (l.title_kk || l.title) :
            locale === 'en' ? (l.title_en || l.title) :
            l.title;

          // Pick localized video
          const video_url =
            locale === 'kk' ? (l.video_url_kk || l.video_url) :
            l.video_url;

          return {
            id: l.id,
            title,
            title_kk: l.title_kk,
            title_en: l.title_en,
            type: video_url ? 'video' : 'presentation',
            video_url,
            video_url_kk: l.video_url_kk,
            presentation_url: l.presentation_url,
            presentation_url_kk: l.presentation_url_kk,
            sort_order: l.sort_order,
          };
        });

        // Get localized course title
        const courseTitle =
          locale === 'kk' ? (courseData.title_kk || courseData.title) :
          locale === 'en' ? (courseData.title_en || courseData.title) :
          courseData.title;

        setCurriculum([{ title: courseTitle, lessons: mappedLessons }]);
        if (mappedLessons.length > 0) {
          setActiveLesson(mappedLessons[0]);
        }
      }

      // 4. Fetch Progress if user is logged in
      if (authUser) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('lesson_id')
          .eq('user_id', authUser.id);
        if (progressData) {
          setCompletedLessons(progressData.map(p => p.lesson_id));
        }
      }
      setLoading(false);
    }

    init();
  }, [locale]);

  useEffect(() => {
    if (!activeLesson) return;
    setQuizPhase('hidden');
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelected(null);
    setQuizAnswered(false);
    supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', activeLesson.id)
      .eq('type', 'mcq')
      .then(({ data }) => setQuizzes(data ?? []));
  }, [activeLesson?.id]);

  const toggleComplete = useCallback(async (lessonId: string) => {
    if (!user) return;
    setSyncing(true);
    const isCompleted = completedLessons.includes(lessonId);
    setCompletedLessons(prev =>
      isCompleted ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
    try {
      if (isCompleted) {
        await supabase.from('progress').delete().match({ user_id: user.id, lesson_id: lessonId });
      } else {
        await supabase.from('progress').upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Failed to sync progress:", err);
      setCompletedLessons(prev =>
        isCompleted ? [...prev, lessonId] : prev.filter(id => id !== lessonId)
      );
    } finally {
      setSyncing(false);
    }
  }, [user, completedLessons]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    // Show course selection grid
    return (
      <div className="min-h-screen bg-[#0f172a] text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">FLL SUBMERGED™ 2025–26</h1>
          <p className="text-slate-400 mb-10">Курс таңдаңыз / Выберите курс</p>
          {allCourses.length === 0 ? (
            <p className="text-slate-500">Курстар табылмады. База деректерін тексеріңіз.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allCourses.map((c) => {
                const title = locale === 'kk' ? (c.title_kk || c.title) : locale === 'en' ? (c.title_en || c.title) : c.title;
                return (
                  <a
                    key={c.id}
                    href={`?courseId=${c.id}`}
                    className="group bg-slate-800/60 border border-slate-700 hover:border-[#8B5CF6]/50 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8B5CF6]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center mb-4 text-lg">
                      📚
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#8B5CF6] transition-colors">{title}</h3>
                    {c.description && (
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{c.description}</p>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!activeLesson) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl">No lessons found for this course.</p>
        <p className="text-slate-400 text-sm">Run <code className="bg-slate-800 px-2 py-1 rounded">node sync_csv.mjs</code> to load lessons.</p>
      </div>
    );
  }

  const allLessons = curriculum.flatMap(m => m.lessons);
  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100) || 0;

  // Get localized presentation URL
  const presentationUrl =
    locale === 'kk'
      ? (activeLesson.presentation_url_kk || activeLesson.presentation_url)
      : activeLesson.presentation_url;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-y-auto overflow-x-hidden relative"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">
            {course.title_kk || course.title_en || course.title}
          </h2>
          <div className="h-2 w-full bg-slate-800 rounded-full mb-6 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="absolute top-0 left-0 h-full bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            />
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{progressPercent}% {t("completed")}</p>
            {syncing && <div className="w-3 h-3 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />}
          </div>

          <nav className="space-y-8">
            {curriculum.map((module) => (
              <div key={module.title}>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                  {module.title}
                </h3>
                <ul className="space-y-1.5">
                  {module.lessons.map((lesson, idx) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm text-left group
                          ${activeLesson.id === lesson.id
                            ? "bg-[#8B5CF6]/10 text-white ring-1 ring-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                          ${completedLessons.includes(lesson.id)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-700 group-hover:border-slate-500"}`}
                        >
                          {completedLessons.includes(lesson.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate font-medium">{idx + 1}. {lesson.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)]">
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-slate-400">
            <span className="text-slate-600 mr-2">{t("lesson_label")}</span>
            <span className="text-slate-200">{activeLesson.title}</span>
          </h1>
          <div className="flex items-center gap-4">
            {syncing && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">Saving...</span>}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6]" />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto p-8 flex flex-col items-center">
          <div className="w-full max-w-5xl mb-12 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-6"
              >
                {/* Presentation embed */}
                {presentationUrl && (
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
                      <span className="text-xs font-medium text-slate-400">Презентация</span>
                      <a
                        href={presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8B5CF6] hover:opacity-80 flex items-center gap-1.5 transition-opacity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Толық экран
                      </a>
                    </div>
                    <iframe
                      src={getEmbedUrl(presentationUrl)}
                      className="w-full"
                      style={{ height: '520px' }}
                      allowFullScreen
                      allow="autoplay"
                    />
                  </div>
                )}

                {/* Video player embed */}
                {activeLesson.video_url && (
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
                      <span className="text-xs font-medium text-slate-400">Бейне сабақ / Видеоурок</span>
                      <a
                        href={activeLesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8B5CF6] hover:opacity-80 flex items-center gap-1.5 transition-opacity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        YouTube
                      </a>
                    </div>
                    <VideoPlayer
                      videoUrl={activeLesson.video_url}
                      lessonId={activeLesson.id}
                      onComplete={() => {
                        if (!completedLessons.includes(activeLesson.id)) {
                          toggleComplete(activeLesson.id);
                        }
                      }}
                    />
                  </div>
                )}

                {/* No content fallback */}
                {!presentationUrl && !activeLesson.video_url && (
                  <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800">
                    <p className="text-slate-500 text-sm">Мазмұн жоқ / Контент не добавлен</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* QUIZ SECTION */}
          {quizzes.length > 0 && (
            <div className="w-full max-w-5xl mb-8">
              {quizPhase === 'hidden' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{t("quiz_check")}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{quizzes.length} вопросов</p>
                  </div>
                  <button
                    onClick={() => { setQuizPhase('running'); setQuizIndex(0); setQuizScore(0); setQuizSelected(null); setQuizAnswered(false); }}
                    className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest transition-all"
                  >
                    {t("quiz_check")} →
                  </button>
                </div>
              )}

              {quizPhase === 'running' && (() => {
                const q = quizzes[quizIndex];
                const options: string[] = Array.isArray(q.options) ? q.options : [];
                return (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("quiz_check")}</span>
                      <span className="text-[10px] font-bold text-slate-400">{quizIndex + 1} / {quizzes.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                      <div
                        className="h-full bg-[#8B5CF6] rounded-full transition-all duration-300"
                        style={{ width: `${((quizIndex) / quizzes.length) * 100}%` }}
                      />
                    </div>

                    {/* Question */}
                    <p className="text-white font-bold text-base leading-snug mb-5">{q.question}</p>

                    {/* Options */}
                    <div className="space-y-2.5 mb-5">
                      {options.map((opt) => {
                        let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
                        if (!quizAnswered) {
                          cls += quizSelected === opt
                            ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-white"
                            : "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50";
                        } else {
                          if (opt === q.correct_answer) cls += "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                          else if (opt === quizSelected) cls += "border-red-500 bg-red-500/10 text-red-300";
                          else cls += "border-slate-800 text-slate-500";
                        }
                        return (
                          <button
                            key={opt}
                            disabled={quizAnswered}
                            onClick={() => setQuizSelected(opt)}
                            className={cls}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tip after answer */}
                    {quizAnswered && q.tip && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-400 leading-relaxed">
                        {q.tip}
                      </div>
                    )}

                    {/* Action button */}
                    {!quizAnswered ? (
                      <button
                        disabled={!quizSelected}
                        onClick={() => {
                          if (!quizSelected) return;
                          if (quizSelected === q.correct_answer) setQuizScore(s => s + 1);
                          setQuizAnswered(true);
                        }}
                        className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-30 text-white text-xs font-black uppercase tracking-widest transition-all"
                      >
                        {t("quiz_confirm")}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (quizIndex + 1 >= quizzes.length) {
                            setQuizPhase('done');
                          } else {
                            setQuizIndex(i => i + 1);
                            setQuizSelected(null);
                            setQuizAnswered(false);
                          }
                        }}
                        className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-black uppercase tracking-widest transition-all"
                      >
                        {quizIndex + 1 >= quizzes.length ? t("quiz_result").replace('{score}', String(quizScore + (quizSelected === q.correct_answer ? 1 : 0))).replace('{total}', String(quizzes.length)) : t("quiz_next") + " →"}
                      </button>
                    )}
                  </div>
                );
              })()}

              {quizPhase === 'done' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center mx-auto mb-4 text-3xl">
                    {quizScore / quizzes.length >= 0.7 ? '🏆' : quizScore / quizzes.length >= 0.5 ? '👍' : '📚'}
                  </div>
                  <p className="text-3xl font-black text-white mb-2">
                    {t("quiz_result").replace('{score}', String(quizScore)).replace('{total}', String(quizzes.length))}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    {quizScore / quizzes.length >= 0.7 ? t("quiz_high") : quizScore / quizzes.length >= 0.5 ? t("quiz_mid") : t("quiz_low")}
                  </p>
                  <button
                    onClick={() => { setQuizPhase('running'); setQuizIndex(0); setQuizScore(0); setQuizSelected(null); setQuizAnswered(false); }}
                    className="px-8 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    {t("quiz_retry")}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="w-full max-w-2xl text-center">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{activeLesson.title}</h2>
            <div className="h-1 w-20 bg-[#8B5CF6] mx-auto mb-8 rounded-full" />

            <button
              onClick={() => toggleComplete(activeLesson.id)}
              disabled={syncing}
              className={`px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50
                ${completedLessons.includes(activeLesson.id)
                  ? "bg-slate-800 text-slate-500 border border-slate-700"
                  : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[0_0_30px_rgba(139,92,246,0.3)]"}`}
            >
              {completedLessons.includes(activeLesson.id) ? t("completed_btn") : t("mark_complete")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
