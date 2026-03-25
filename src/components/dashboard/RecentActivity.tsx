"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Progress {
    user_id: string;
    lesson_id: string;
    completed_at: string;
}

interface RecentActivityProps {
    progress: Progress[];
    recentLessons: Record<string, string>;
    locale: string;
}

export default function RecentActivity({ progress, recentLessons, locale }: RecentActivityProps) {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");

    if (progress.length === 0) {
        return <p className="text-sm text-[#94a3b8]">{t("noProgress")}</p>;
    }

    return (
        <div className="space-y-3">
            {progress.slice(0, 3).map((p, idx) => (
                <Link 
                    href={`/lessons/${p.lesson_id}` as "/"} 
                    key={`${p.user_id}-${p.lesson_id}`} 
                    className="bg-[#1e293b] rounded-xl border border-[#334155] hover:border-[#8B5CF6] transition-colors p-4 flex items-center gap-4 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-sm font-bold text-[#8B5CF6] shrink-0 group-hover:bg-[#8B5CF6]/25 transition-colors">
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-white font-medium">{recentLessons[p.lesson_id] || tCommon("lesson")}</p>
                        <p className="text-xs text-[#94a3b8]">
                            {new Date(p.completed_at).toLocaleDateString(locale === 'kk' ? 'kk-KZ' : (locale === 'en' ? 'en-US' : 'ru-RU'))}
                        </p>
                    </div>
                    <div className="text-[#94a3b8] group-hover:translate-x-1 transition-transform">→</div>
                </Link>
            ))}
        </div>
    );
}
