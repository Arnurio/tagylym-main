"use client";

import { useTranslations } from "next-intl";
import type { ChecklistBlockProps } from "@/types";

export default function ChecklistBlock({ items, checkedItems, onToggle }: ChecklistBlockProps) {
    const t = useTranslations("level");

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = items.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            {/* Progress bar at top */}
            <div className="mb-4">
                <div className="text-xs text-[#6B7280] mb-2 font-medium">
                    {completedCount} / {totalCount} {t("progress")}
                </div>
                <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <ul className="space-y-0">
                {items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                        <li key={item.id} className="py-2.5 border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors -mx-2 px-2 rounded-md">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={checkedItems[item.id] || false}
                                    onChange={() => onToggle(item.id)}
                                    className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] flex-shrink-0 cursor-pointer text-[#2563EB] focus:ring-[#2563EB]/30 bg-white checked:bg-[#2563EB] checked:border-[#2563EB]"
                                />
                                <span
                                    className={`text-sm leading-relaxed transition-colors ${checkedItems[item.id]
                                        ? "text-[#9CA3AF] line-through"
                                        : "text-[#374151]"
                                        }`}
                                >
                                    {item.text}
                                </span>
                            </label>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
