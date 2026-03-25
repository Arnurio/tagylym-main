"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        slug: string;
        category?: string;
        level?: string;
        lessonCount?: number;
    };
    locale: string;
}

export default function CourseCard({ course, locale }: CourseCardProps) {
    const t = useTranslations("courses");

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden flex flex-col h-full bg-slate-900/40 border border-slate-800 hover:border-accent/40 transition-all duration-300 shadow-xl"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-6 flex-grow space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                        {course.category || "FLL"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">
                        {course.level || t("beginner")}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-accent transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t("free_label")}
                    </div>
                    {course.lessonCount && (
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            {course.lessonCount} {t("lessons")}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
                <Link
                    href={`/${locale}/courses/${course.slug}`}
                    className="flex items-center justify-center w-full py-3 bg-slate-800/50 hover:bg-accent text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                    {t("start")}
                </Link>
            </div>
        </motion.div>
    );
}
