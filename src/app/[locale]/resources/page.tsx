import { useTranslations } from "next-intl";
import ROICalculator from "@/components/ROICalculator";
import FeedbackForm from "@/components/FeedbackForm";

export default function ResourcesPage() {
    const t = useTranslations("resources");

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 space-y-20">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tight">{t("page_title")}</h1>
                    <p className="text-slate-400">{t("subtitle")}</p>
                </div>

                {/* ROI Calculator */}
                <section>
                    <ROICalculator />
                </section>

                {/* Useful Links */}
                <section>
                    <h2 className="text-xl font-bold mb-8 text-white tracking-tight">{t("useful_links")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: t("first_fll_title"), url: "https://www.firstlegoleague.org/", desc: t("first_fll_desc") },
                            { title: t("lego_education_title"), url: "https://education.lego.com/en-us/product-resources/spike-prime", desc: t("lego_education_desc") },
                            { title: t("pybricks_title"), url: "https://docs.pybricks.com/", desc: t("pybricks_desc") },
                            { title: t("challenge_updates_title"), url: "https://www.firstinspires.org/resource-library/fll/challenge/challenge-and-updates", desc: t("challenge_updates_desc") },
                        ].map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card p-6 flex items-center gap-5 group hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    🔗
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white text-sm group-hover:text-accent transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{link.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Feedback Form */}
                <section className="max-w-3xl mx-auto w-full">
                    <FeedbackForm />
                </section>
            </div>
        </div>
    );
}
