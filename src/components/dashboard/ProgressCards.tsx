"use client";

import { useTranslations } from "next-intl";
import ProgressBar from "@/components/ProgressBar";

interface Category {
    id: string;
    name: string;
    name_kk?: string;
    name_en?: string;
    icon: string;
}

interface ProgressCardsProps {
    categories: Category[];
    categoryStats: Record<string, { total: number; completed: number }>;
    locale: string;
}

export default function ProgressCards({ categories, categoryStats, locale }: ProgressCardsProps) {
    const t = useTranslations("dashboard");

    const getLocalizedCategoryName = (cat: Category) => {
        if (locale === 'kk') return cat.name_kk || cat.name;
        if (locale === 'en') return cat.name_en || cat.name;
        return cat.name;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => {
                const stats = categoryStats[cat.id] ?? { total: 0, completed: 0 };
                return (
                    <div key={cat.id} className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 group hover:border-[#8B5CF6]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <div>
                                <h3 className="font-semibold text-white">{getLocalizedCategoryName(cat)}</h3>
                                <p className="text-xs text-[#94a3b8]">
                                    {stats.completed} / {stats.total} {t("lessons_completed")}
                                </p>
                            </div>
                        </div>
                        <ProgressBar 
                            completed={stats.completed} 
                            total={Math.max(stats.total, 1)} 
                        />
                    </div>
                );
            })}
        </div>
    );
}
