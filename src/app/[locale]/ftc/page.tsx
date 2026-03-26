"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import WaitlistForm from "@/components/WaitlistForm";

export default function FTCPage() {
    const t = useTranslations("ftc");

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* DECODE Theme Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8"
                    >
                        FIRST® Tech Challenge
                    </motion.div>
                    
                    <motion.h1
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-calistoga mb-6 tracking-tight"
                    >
                        DECODE<span className="text-primary">™</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12"
                    >
                        {t("description")}
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link 
                            href="/courses"
                            className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.05] transition-all"
                        >
                            {t("start_learning")}
                        </Link>
                        <button 
                            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-lg hover:bg-white/10 transition-all"
                        >
                            {t("join_waitlist")}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Disciplines / Features */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { titleKey: "feature_java_title" as const, descKey: "feature_java_desc" as const, icon: "💻" },
                        { titleKey: "feature_engineering_title" as const, descKey: "feature_engineering_desc" as const, icon: "🔧" },
                        { titleKey: "feature_competition_title" as const, descKey: "feature_competition_desc" as const, icon: "🎯" }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-10 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 group"
                        >
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{t(feature.titleKey)}</h3>
                            <p className="text-slate-400 leading-relaxed">{t(feature.descKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="py-32 px-6">
                <div className="max-w-4xl mx-auto relative">
                     <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl -z-10" />
                     <div className="glass-card p-12 md:p-20 text-center border-white/10">
                        <h2 className="text-4xl font-calistoga mb-6">{t("waitlist_title")}</h2>
                        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">{t("waitlist_subtitle")}</p>
                        <div className="max-w-md mx-auto">
                            <WaitlistForm track="ftc" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h4 className="text-xs font-black tracking-[0.3em] uppercase text-slate-500 mb-8">Official Resources</h4>
                    <div className="flex flex-wrap justify-center gap-10">
                        <a href="https://www.firstinspires.org/robotics/ftc" target="_blank" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">First Inspires</a>
                        <a href="https://ftc-events.firstinspires.org/" target="_blank" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">Events Portal</a>
                        <a href="https://www.gobilda.com/" target="_blank" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">goBILDA®</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
