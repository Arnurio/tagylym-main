import type { ProgressBarProps } from "@/types";
import { useTranslations } from "next-intl";

export default function ProgressBar({ completed, total }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const t = useTranslations("level");

    return (
        <div className="w-full">
            <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-1">
                <span className="text-xs text-[#6B7280]">
                    {completed} / {total} {t("lessons")}
                </span>
            </div>
        </div>
    );
}
