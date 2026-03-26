import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LevelBadge from "@/components/LevelBadge";
import {
    getSeasonBySlug,
    getCategoryBySlug,
    getLevelsWithCounts,
} from "@/lib/queries";
import type { LevelName } from "@/types";

// Level names are stored as English slugs in DB

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ locale: string; season: string; category: string }>;
}) {
    const { category, season } = await params;

    const seasonData = await getSeasonBySlug("fll", season);
    const categoryData = seasonData
        ? await getCategoryBySlug(seasonData.id, category)
        : null;
    const levels = categoryData
        ? await getLevelsWithCounts(categoryData.id)
        : [];

    return (
        <CategoryPageContent
            category={category}
            season={season}
            cat={categoryData}
            levels={levels}
        />
    );
}

function CategoryPageContent({
    category,
    season,
    cat,
    levels,
}: {
    category: string;
    season: string;
    cat: { id: string; name: string; slug: string; icon: string } | null;
    levels: { id: string; name: string; color: string; sort_order: number; lessonCount: number; checklistCount: number }[];
}) {
    const tCommon = useTranslations("common");
    const tCourses = useTranslations("courses");
    const tFll = useTranslations("fll");
    const tErrors = useTranslations("errors");

    if (!cat) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <p className="text-[#6B7280]">{tErrors("not_found")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
            {/* Header */}
            <section className="bg-white border-b border-[#E5E7EB] py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-5xl mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-[#F3F4F6] text-2xl mx-auto">{cat.icon}</div>
                    <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">{cat.name}</h1>
                    <p className="text-[#6B7280] max-w-2xl mx-auto">
                        {tFll("category_subtitle")}
                    </p>
                </div>
            </section>

            {/* Level Cards */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-center mb-12">{tCourses("levels")}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                    {levels.map((level) => {
                        const slug = (level.name as LevelName) || "beginner";
                        const displayNames: Record<string, string> = {
                            "beginner": tCourses("beginner"),
                            "intermediate": tCourses("intermediate"),
                            "advanced": tCourses("advanced")
                        };
                        const displayName = displayNames[slug] || level.name;

                        return (
                            <Link
                                key={level.id}
                                href={`/fll/${season}/${category}/${slug}` as "/"}
                                className="bg-white rounded-2xl border border-[#E5E7EB] p-8 group relative overflow-hidden transition-all hover:border-[#2563EB]/50 hover:shadow-md"
                            >
                                {/* Top accent bar */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ backgroundColor: level.color }}
                                />

                                <LevelBadge level={slug} />

                                <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-3 group-hover:text-[#2563EB] transition-colors">
                                    {displayName}
                                </h3>

                                <div className="space-y-3 text-sm text-[#6B7280] mb-8">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                        {level.lessonCount} {tCommon("lessons")}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                        {level.checklistCount} {tFll("checklist_count")}
                                    </div>
                                </div>

                                <div
                                    className="py-3 rounded-xl text-center text-sm font-semibold transition-all group-hover:opacity-90"
                                    style={{ backgroundColor: `${level.color}15`, color: level.color }}
                                >
                                    {tCourses("start")}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Core Values */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-[#EFF6FF] rounded-2xl p-6 border-l-4 border-[#2563EB]">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-[#1E40AF]">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                        {tFll("categories.core-values")}
                    </h3>
                    <p className="text-sm text-[#3B82F6] leading-relaxed">
                        {tFll("core_values_text")}
                    </p>
                </div>
            </section>
        </div>
    );
}
