import { useTranslations } from "next-intl";

export default function CoachPage() {
    const t = useTranslations("common");

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center mx-auto mb-8 text-5xl animate-float">
                    👨‍🏫
                </div>
                <h1 className="text-3xl font-black text-white mb-3">Панель тренера</h1>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent font-medium mb-6">
                    {t("comingSoon")}
                </div>
                <p className="text-muted leading-relaxed">{t("comingSoonDescription")}</p>
            </div>
        </div>
    );
}
