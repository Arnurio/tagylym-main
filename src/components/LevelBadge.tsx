import type { LevelName } from "@/types";
import { useTranslations } from "next-intl";

const colors: Record<string, string> = {
    beginner: '#2563EB',
    intermediate: '#D97706',
    advanced: '#16A34A',
};

export default function LevelBadge({ level }: { level: LevelName | string }) {
    const tLevels = useTranslations("levels");
    const color = colors[level] || colors.beginner;

    let label = level;
    try {
        label = tLevels(level);
    } catch {
        // Fallback
    }

    return (
        <span
            style={{ color }}
            className="flex items-center gap-0.5 text-xs font-medium"
        >
            <span>★</span>
            <span>{label}</span>
        </span>
    );
}
