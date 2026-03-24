import { useTranslations } from "next-intl";
import type { ArtifactCardProps } from "@/types";

export default function ArtifactCard({ artifact }: ArtifactCardProps) {
    const t = useTranslations("common");

    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-sm transition-shadow cursor-pointer">
            {/* Icon */}
            <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-[#1A1A1A] truncate">
                    {artifact.name}
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed line-clamp-2">
                    {artifact.description}
                </p>
            </div>

            {/* Download button */}
            <a
                href={artifact.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-[#2563EB] hover:underline"
                onClick={(e) => e.stopPropagation()}
            >
                {t("download")}
            </a>
        </div>
    );
}
