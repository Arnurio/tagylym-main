import type { RubricCalloutProps } from "@/types";
import { useTranslations } from "next-intl";

const levels = ["BEGINNING", "DEVELOPING", "ACCOMPLISHED", "EXCEEDS"];

export default function RubricCallout({
    criterion,
    level,
    text,
}: RubricCalloutProps) {
    const tLesson = useTranslations("lesson");
    const activeIndex = levels.indexOf(level.toUpperCase());

    return (
        <div className="bg-[#EFF6FF] border-l-4 border-[#2563EB] rounded-r-xl p-5 my-6">
            <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase tracking-wide text-[#1E40AF] font-semibold">
                    {tLesson("rubric_label")} · {criterion}
                </span>
                <div className="flex items-center gap-1.5 ml-auto" title={level}>
                    {levels.map((lvl, i) => (
                        <div
                            key={lvl}
                            className={`rounded-full ${i === activeIndex
                                ? "bg-[#2563EB] w-3 h-3"
                                : "bg-[#BFDBFE] w-2.5 h-2.5"
                                }`}
                        />
                    ))}
                </div>
            </div>
            <p className="text-sm text-[#1E40AF] leading-relaxed opacity-90">{text}</p>
        </div>
    );
}
