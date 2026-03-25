"use client";

import { useTranslations } from "next-intl";
import ProgressBar from "@/components/ProgressBar";

interface ChecklistStatusProps {
    checklistStats: Record<string, { total: number; completed: number }>;
    levelNames: Record<string, string>;
    categories: any[];
    locale: string;
}

export default function ChecklistStatus({ checklistStats, levelNames, categories, locale }: ChecklistStatusProps) {
    const t = useTranslations("dashboard");

    if (categories.length === 0 || Object.keys(checklistStats).length === 0) {
        return <p className="text-sm text-[#94a3b8]">{t("no_progress") || "No checklist items found."}</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {Object.entries(checklistStats).map(([levelId, stats]) => {
                const levelName = levelNames[levelId] || levelId.substring(0, 8);
                const percentage = Math.round((stats.completed / (stats.total || 1)) * 100);
                
                return (
                    <div key={levelId} className="bg-[#1e293b] rounded-xl border border-[#334155] p-5 hover:border-[#8B5CF6]/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                                <span className="font-medium text-sm text-white">{levelName}</span>
                            </div>
                            <span className="text-xs text-[#94a3b8] font-mono">
                                {percentage}%
                            </span>
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
