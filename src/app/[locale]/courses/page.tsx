"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CourseCard from "@/components/CourseCard";
import { motion } from "framer-motion";

export default function CoursesPage() {
    const t = useTranslations("courses");
    const params = useParams();
    const locale = params.locale as string;

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            const { data, error } = await supabase
                .from('courses')
                .select(`
                    id, 
                    title, 
                    levels (
                        name,
                        categories (
                            name
                        )
                    ),
                    lessons (id)
                `)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error("Error fetching courses:", error);
            } else {
                const mapped = data.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    slug: (c as any).slug || c.id,
                    level: c.levels?.name,
                    category: locale === 'kk' ? (c.levels?.categories as any)?.name_kk || c.levels?.categories?.name : locale === 'en' ? (c.levels?.categories as any)?.name_en || c.levels?.categories?.name : c.levels?.categories?.name,
                    lessonCount: c.lessons?.length || 0
                }));
                setCourses(mapped);
            }
            setLoading(false);
        }
        fetchCourses();
    }, [locale]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
                <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Hero / Header */}
            <section className="pt-20 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10" />
                
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest"
                    >
                        {t("preview")}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tight"
                    >
                        {t("page_title")}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto"
                    >
                        {t("begin_learning")}
                    </motion.p>
                </div>
            </section>

            {/* Grid */}
            <main className="max-w-7xl mx-auto px-6">
                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                        <p className="text-slate-500 font-medium">{t("no_courses")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                            >
                                <CourseCard course={course} locale={locale} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
