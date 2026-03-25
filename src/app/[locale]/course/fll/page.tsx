"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

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

export default function CoursePlayerPage() {
  const t = useTranslations("fll");
  const params = useParams();
  const locale = params.locale as string;

  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);

      // 1. Get User
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      // 2. Fetch Course by ID from URL or first available
      const searchParams = new URLSearchParams(window.location.search);
      const courseId = searchParams.get('courseId');

      let query = supabase.from('courses').select('*');
      if (courseId) {
        query = query.eq('id', courseId);
      } else {
        query = query.limit(1);
      }
      const { data: courseData, error: courseError } = await query.single();

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
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Course not found.</p>
        <p className="text-slate-400 text-sm">Make sure the database is set up and sync_csv.mjs has been run.</p>
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
          <div className="w-full max-w-5xl mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                {activeLesson.type === 'video' && activeLesson.video_url ? (
                  <VideoPlayer
                    videoUrl={activeLesson.video_url}
                    lessonId={activeLesson.id}
                    onComplete={() => {
                      if (!completedLessons.includes(activeLesson.id)) {
                        toggleComplete(activeLesson.id);
                      }
                    }}
                  />
                ) : (
                  <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center border border-slate-800 gap-4">
                    <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 text-sm">Урок без видео</p>
                    {presentationUrl && (
                      <a
                        href={presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Открыть презентацию
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full max-w-2xl text-center">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{activeLesson.title}</h2>
            <div className="h-1 w-20 bg-[#8B5CF6] mx-auto mb-8 rounded-full" />

            {/* Links row */}
            <div className="flex gap-3 justify-center mb-10 flex-wrap">
              {activeLesson.video_url && (
                <a href={activeLesson.video_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Видео (RU)
                </a>
              )}
              {activeLesson.video_url_kk && (
                <a href={activeLesson.video_url_kk} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Видео (KK)
                </a>
              )}
              {activeLesson.presentation_url && (
                <a href={activeLesson.presentation_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Слайды (RU)
                </a>
              )}
              {activeLesson.presentation_url_kk && (
                <a href={activeLesson.presentation_url_kk} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Слайды (KK)
                </a>
              )}
            </div>

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
