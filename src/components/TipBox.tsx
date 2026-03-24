import { useTranslations } from "next-intl";

export default function TipBox({ text }: { text: string }) {
    const tLesson = useTranslations("lesson");
    return (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 my-4">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-700">
                    {tLesson("tip_label")}
                </span>
            </div>
            <p className="text-sm text-[#78350F] leading-relaxed">{text}</p>
        </div>
    );
}
