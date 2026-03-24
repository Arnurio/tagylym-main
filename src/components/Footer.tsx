"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="border-t border-white/10 mt-20 text-white" style={{ backgroundColor: '#0C2D48' }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Tagylym
                        </h3>
                        <p className="mt-3 text-white/80 text-sm leading-relaxed">
                            {t("tagline")}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-white">{t("competitions")}</h4>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>FIRST LEGO League (FLL)</li>
                            <li>FIRST Tech Challenge (FTC)</li>
                            <li>FIRST Global Challenge (FGC)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-white">{t("resources_title")}</h4>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>{t("video_lessons")}</li>
                            <li>{t("quizzes")}</li>
                            <li>{t("checklists")}</li>
                            <li>{t("downloads")}</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-white/60">
                    {t("copyright")}
                </div>
            </div>
        </footer>
    );
}
