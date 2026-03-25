"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import WaitlistForm from "@/components/WaitlistForm";

export default function FGCPage() {
    const t = useTranslations("fgc");

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* FGC Theme Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
                    >
                        FIRST® Global Challenge
                    </motion.div>
                    
                    <motion.h1
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-calistoga mb-6 tracking-tight"
                    >
                        INCHEON <span className="text-teal-400">2026</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12"
                    >
                        {t("description") || "Национальная сборная готовится к мировому вызову. Уникальный опыт, международное сотрудничество и глобальные проблемы."}
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button 
                            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-xl bg-teal-600 text-white font-bold text-lg shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.05] transition-all"
                        >
                            {t("join_waitlist") || "Join Waitlist"}
                        </button>
                        <Link 
                            href="/"
                            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-lg hover:bg-white/10 transition-all"
                        >
                            {t("back_to_home") || "Back to Home"}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Values / Features */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "National Team", desc: "Мы готовим лучших из лучших для представления страны на мировой арене.", icon: "🇰🇿" },
                        { title: "Global Impact", desc: "Решайте реальные мировые проблемы через призму робототехники и инноваций.", icon: "🌎" },
                        { title: "Elite Mentoring", desc: "Прямой доступ к менторам, имеющим опыт участия в международных финалах.", icon: "🥇" }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-10 border border-white/5 hover:border-teal-500/30 transition-all hover:-translate-y-2 group"
                        >
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="py-32 px-6">
                <div className="max-w-4xl mx-auto relative">
                     <div className="absolute inset-0 bg-teal-500/5 rounded-[3rem] blur-3xl -z-10" />
                     <div className="glass-card p-12 md:p-20 text-center border-white/10">
                        <h2 className="text-4xl font-calistoga mb-6">{t("waitlist_title") || "Join the Selection Process"}</h2>
                        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">{t("waitlist_subtitle") || "Be notified when the national team selection starts and access preparatory materials."}</p>
                        <div className="max-w-md mx-auto">
                            <WaitlistForm track="fgc" />
                        </div>
                    </div>
                </div>
            </section>

             {/* Resources Footer */}
             <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h4 className="text-xs font-black tracking-[0.3em] uppercase text-slate-500 mb-8">Official Resources</h4>
                    <div className="flex flex-wrap justify-center gap-10">
                        <a href="https://first.global/" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors font-bold uppercase text-[10px] tracking-widest">FIRST Global</a>
                        <a href="https://first.global/fgc/" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors font-bold uppercase text-[10px] tracking-widest">The Challenge</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
