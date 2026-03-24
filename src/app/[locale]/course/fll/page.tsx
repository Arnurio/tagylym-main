"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Mock Data for Prototype
const MOCK_CURRICULUM = [
  {
    title: "Robodesign",
    lessons: [
      { id: "rd1", title: "Robot Design Intro", type: "video" },
      { id: "rd2", title: "Mechanics Basics", type: "presentation" },
      { id: "rd3", title: "Programming Motors", type: "video" },
    ],
  },
  {
    title: "Innovation Project",
    lessons: [
      { id: "ip1", title: "Research Phase", type: "presentation" },
      { id: "ip2", title: "Solution Prototype", type: "video" },
    ],
  },
  {
    title: "Core Values",
    lessons: [
      { id: "cv1", title: "Teamwork & Inclusion", type: "video" },
    ],
  },
];

export default function CoursePlayerPage() {
  const t = useTranslations("fll");
  const [activeLesson, setActiveLesson] = useState(MOCK_CURRICULUM[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleComplete = (id: string) => {
    setCompletedLessons(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const totalLessons = MOCK_CURRICULUM.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-900 text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-y-auto overflow-x-hidden relative"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">{t("title")}</h2>
          <div className="h-2 w-full bg-slate-800 rounded-full mb-6 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="absolute top-0 left-0 h-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"
            />
          </div>
          <p className="text-xs text-slate-400 mb-8">{progressPercent}% {t("completed")}</p>

          <nav className="space-y-8">
            {MOCK_CURRICULUM.map((module) => (
              <div key={module.title}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  {module.title}
                </h3>
                <ul className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm text-left
                          ${activeLesson.id === lesson.id 
                            ? "bg-slate-800 text-white shadow-lg ring-1 ring-slate-700" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                          ${completedLessons.includes(lesson.id) 
                            ? "bg-emerald-500 border-emerald-500" 
                            : "border-slate-700"}`}
                        >
                          {completedLessons.includes(lesson.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate">{lesson.title}</span>
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
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
           <h1 className="text-sm font-medium text-slate-300">{t("lesson_label")} {activeLesson.title}</h1>
           <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500" />
           </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl aspect-video bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-8 group relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLesson.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full flex items-center justify-center text-slate-500 italic"
                  >
                    {activeLesson.type === 'video' ? (
                       <p className="text-lg">{t("placeholder_video", { id: activeLesson.id })}</p>
                    ) : (
                       <p className="text-lg">{t("placeholder_pres", { id: activeLesson.id })}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-2xl text-center">
               <h2 className="text-3xl font-bold text-white mb-4">{activeLesson.title}</h2>
               <p className="text-slate-400 mb-10 leading-relaxed">
                  {t("desc_prefix")}{activeLesson.title}{t("desc_suffix")}
                  <br />
                  {t("materials_reminder")}
               </p>

               <button
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 active:scale-95
                    ${completedLessons.includes(activeLesson.id)
                      ? "bg-slate-800 text-slate-400 border border-slate-700"
                      : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"}`}
               >
                  {completedLessons.includes(activeLesson.id) ? t("completed_btn") : t("mark_complete")}
               </button>
            </div>
        </div>
      </main>
    </div>
  );
}
