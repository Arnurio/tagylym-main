"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const TARGET_CARDS = [
  {
    icon: "🎓",
    titleKey: "audience_students_title" as const,
    descKey: "audience_students_desc" as const,
    ctaKey: "audience_students_cta" as const,
    href: "/course/fll" as const,
    color: "#3B82F6",
  },
  {
    icon: "👨‍🏫",
    titleKey: "audience_mentors_title" as const,
    descKey: "audience_mentors_desc" as const,
    ctaKey: "audience_mentors_cta" as const,
    href: "/resources" as const,
    color: "#F97316",
  },
  {
    icon: "🏫",
    titleKey: "audience_schools_title" as const,
    descKey: "audience_schools_desc" as const,
    ctaKey: "audience_schools_cta" as const,
    href: "/course/fll" as const,
    color: "#22C55E",
  },
];

const FAQ_ITEMS = [
  { qKey: "faq_q1" as const, aKey: "faq_a1" as const },
  { qKey: "faq_q2" as const, aKey: "faq_a2" as const },
  { qKey: "faq_q3" as const, aKey: "faq_a3" as const },
  { qKey: "faq_q4" as const, aKey: "faq_a4" as const },
  { qKey: "faq_q5" as const, aKey: "faq_a5" as const },
  { qKey: "faq_q6" as const, aKey: "faq_a6" as const },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-700 bg-slate-800 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
      >
        <span className="font-semibold text-sm text-white pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
    const t = useTranslations("home");

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative w-full px-6 py-28 md:py-44 flex flex-col lg:flex-row items-center justify-center isolate">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(0,82,255,0.06),transparent_60%)]" />
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(77,124,255,0.06),transparent_60%)]" />
                
                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
                    {/* Hero Text */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="relative z-10 flex flex-col justify-center items-start lg:pr-10"
                    >
                        <motion.h1 
                            variants={fadeInUp}
                            className="text-5xl md:text-6xl lg:text-[5.25rem] font-calistoga leading-[1.05] tracking-[-0.02em] text-deepBlue mb-8 text-left"
                        >
                            <span className="relative inline-block">
                                <span className="gradient-text">{t("hero_title")}</span>
                                <span className="gradient-underline"></span>
                            </span>
                        </motion.h1>

                        <motion.div variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg space-y-4">
                            <p>{t("hero_subtitle_1")} {t("hero_subtitle_2")}</p>
                            <p>{t("hero_subtitle_3")} {t("hero_subtitle_4")}</p>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div variants={fadeInUp} className="mt-8">
                            <Link
                                href={"/auth/login" as "/"}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all shadow-lg shadow-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/40 hover:scale-[1.02]"
                                style={{ backgroundColor: '#8B5CF6' }}
                            >
                                {t("hero_cta")}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Graphic - Animated Robots */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: easeOut, delay: 0.3 }}
                        className="relative h-[400px] md:h-[500px] w-full hidden md:block"
                    >
                        {/* Decorative rotating ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-dashed border-accent/20"
                            />
                        </div>

                        {/* Floating elements */}
                        <motion.div 
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-[10%] top-1/2 -translate-y-1/2 z-10"
                        >
                            <Image src="/images/robot-ftc.png" alt="FTC Robot" width={220} height={260} className="object-contain drop-shadow-2xl" priority />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute right-[5%] top-1/3 -translate-y-1/2 z-20"
                        >
                            <Image src="/images/robot-fll.png" alt="FLL Robot" width={200} height={240} className="object-contain drop-shadow-2xl" priority />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* AUDIENCE SECTION */}
            <section className="bg-[#0F172A] px-6 py-28 relative border-b border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={stagger}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-4xl font-calistoga text-white mb-4"
                        >
                            {t("audience_title")}
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TARGET_CARDS.map((card, idx) => (
                            <motion.div
                                key={card.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-slate-700/50"
                                >
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {t(card.titleKey)}
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-grow">
                                    {t(card.descKey)}
                                </p>
                                <Link
                                    href={card.href as "/"}
                                    className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                                    style={{ color: card.color }}
                                >
                                    {t(card.ctaKey)}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* "О проекте Tagylym" Section */}
            <section className="bg-white px-6 py-28 relative">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15, margin: "-60px" }}
                        variants={stagger}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2">
                            <motion.span 
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-accent" 
                            />
                            <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent font-semibold">
                                {t("badge_about")}
                            </span>
                        </motion.div>

                        <motion.h2 
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl font-calistoga text-deepBlue mb-6 leading-tight"
                        >
                            {t("about_title")}
                        </motion.h2>
                        
                        <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed mb-8">
                            {t("about_body")}
                        </motion.p>

                        {/* Callout Card */}
                        <motion.div variants={fadeInUp} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="absolute top-0 right-8 -translate-y-[40%] text-[8rem] text-accent/[0.04] font-calistoga leading-none select-none">&quot;</div>
                            <p className="italic text-lg text-slate-800 relative z-10 font-medium tracking-tight">
                                {t("about_quote")}
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.7, ease: easeOut }}
                        className="relative"
                    >
                        {/* Gradient Border Frame */}
                        <div className="rounded-[2.5rem] bg-gradient-to-br from-accent via-accent-secondary to-accent p-[2px] shadow-accent-lg">
                            <div className="rounded-[calc(2.5rem-2px)] overflow-hidden bg-card">
                                <Image src="/images/photo-girl.png" alt="Student photo" width={600} height={700} className="w-full object-cover aspect-[4/5] md:aspect-[3/4]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* "Проблема" Section (Inverted Contrast) */}
            <section className="text-white px-6 py-32 relative overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
                {/* Dot grid texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                
                {/* Accent glow */}
                <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.7, ease: easeOut }}
                        className="order-last lg:order-first relative"
                    >
                        <div className="rounded-tl-[4rem] rounded-br-[4rem] overflow-hidden shadow-2xl relative">
                             <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-10 pointer-events-none" />
                            <Image src="/images/photo-boy.png" alt="Student photo" width={500} height={600} className="w-full object-cover aspect-square md:aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15, margin: "-60px" }}
                        variants={stagger}
                    >
                         {/* Badge */}
                         <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange bg-orange px-5 py-2">
                            <motion.span 
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} 
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                className="h-2 w-2 rounded-full bg-white" 
                            />
                            <span className="font-mono text-xs uppercase tracking-[0.15em] text-white font-semibold">
                                {t("badge_highlight")}
                            </span>
                        </motion.div>

                        <motion.h2 
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl font-calistoga text-white mb-6 leading-tight"
                        >
                            {t("problem_title")}
                        </motion.h2>

                        <motion.p variants={fadeInUp} className="text-lg text-white leading-relaxed mb-8">
                            {t("problem_body")}
                        </motion.p>

                        {/* Callout Card */}
                        <motion.div variants={fadeInUp} className="border border-[#0D9488] rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#0C2D48' }}>
                            <p className="italic text-lg text-white font-medium" style={{ color: "#ffffff" }}>
                                <span className="text-orange mr-2 font-calistoga text-2xl leading-none">&quot;</span>
                                {t("problem_quote")}
                                <span className="text-orange ml-2 font-calistoga text-2xl leading-none">&quot;</span>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>



            {/* Learning Tracks Section (Redesigned Presentations) */}
            <section id="tracks" className="px-6 py-32 relative overflow-hidden bg-background">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            {t("badge_learning_paths")}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-calistoga text-white"
                        >
                            {t("presentations_title")}
                        </motion.h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { titleKey: "track_fll_title" as const, descKey: "track_fll_desc" as const, slug: "fll", color: "#8B5CF6", icon: "🤖" },
                            { titleKey: "track_ftc_title" as const, descKey: "track_ftc_desc" as const, slug: "ftc", color: "#F97316", icon: "⚙️" },
                            { titleKey: "track_fgc_title" as const, descKey: "track_fgc_desc" as const, slug: "fgc", color: "#10B981", icon: "🌍" },
                        ].map((track, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="glass-card group p-8 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2 flex flex-col"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                    {track.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{t(track.titleKey)}</h3>
                                <p className="text-slate-400 leading-relaxed mb-8 flex-grow">{t(track.descKey)}</p>
                                
                                <Link 
                                    href={`/${track.slug}` as "/"}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors group/link"
                                >
                                    {t("view_track")}
                                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link 
                            href="/courses"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                        >
                            <span>{t("all_courses")}</span>
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                →
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="bg-slate-900 px-6 py-28 relative">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={stagger}
                        className="text-center mb-12"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-4xl font-calistoga text-white"
                        >
                            {t("faq_title")}
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.05 }}
                        variants={stagger}
                        className="space-y-3"
                    >
                        {FAQ_ITEMS.map((item) => (
                            <motion.div key={item.qKey} variants={fadeInUp}>
                                <FAQItem
                                    question={t(item.qKey)}
                                    answer={t(item.aKey)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
