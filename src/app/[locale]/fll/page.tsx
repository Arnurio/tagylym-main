import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });
    return {
        title: t("fll_title"),
        description: t("fll_description"),
    };
}
import { Link } from "@/i18n/routing";
import Image from "next/image";
import LevelBadge from "@/components/LevelBadge";
import { getCourseThumbnail } from "@/lib/course-thumbnails";
import {
    getActiveSeasonByCompetition,
    getCategoriesBySeason,
    getAllCoursesForSeason,
} from "@/lib/queries";
import type { EnrichedCourse } from "@/lib/queries";

export default async function FLLPage() {
    const season = await getActiveSeasonByCompetition("fll");
    const categories = season
        ? await getCategoriesBySeason(season.id)
        : [];
    const allCourses = season
        ? await getAllCoursesForSeason(season.id)
        : [];

    const seasonSlug = season
        ? season.name.toLowerCase().replace(/\s+/g, "-")
        : "current";

    return (
        <FLLPageContent
            categories={categories}
            courses={allCourses}
            seasonSlug={seasonSlug}
            seasonName={season?.name ?? ""}
            seasonYear={season?.year ?? 0}
        />
    );
}

function FLLPageContent({
    categories,
    courses,
    seasonSlug,
    seasonName,
    seasonYear,
}: {
    categories: { id: string; name: string; slug: string; icon: string; sort_order: number }[];
    courses: EnrichedCourse[];
    seasonSlug: string;
    seasonName: string;
    seasonYear: number;
}) {
    const tCourses = useTranslations("courses");
    const tFll = useTranslations("fll");
    const tCommon = useTranslations("common");
    const tQuiz = useTranslations("quiz");

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
            {/* Page Header / Nav bar */}
            <header className="bg-white border-b border-[#E5E7EB] h-[52px]">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold text-[#1A1A1A]">
                        {tCourses("page_title")}
                    </h1>
                    <div className="hidden md:flex items-center gap-3 text-sm">
                        <span className="text-[#1A1A1A] font-semibold">{tCourses("levels")}</span>
                        <span className="text-[#D1D5DB]">·</span>
                        <span className="text-[#6B7280] cursor-pointer hover:text-[#1A1A1A]">{tCourses("beginner")}</span>
                        <span className="text-[#D1D5DB]">·</span>
                        <span className="text-[#6B7280] cursor-pointer hover:text-[#1A1A1A]">{tCourses("intermediate")}</span>
                        <span className="text-[#D1D5DB]">·</span>
                        <span className="text-[#6B7280] cursor-pointer hover:text-[#1A1A1A]">{tCourses("advanced")}</span>
                    </div>
                </div>
            </header>

            {/* Track Banner */}
            <div className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start gap-6">
                    {/* Left block */}
                    <div className="flex-shrink-0 w-full md:w-[260px]">
                        <div className="flex items-start gap-3">
                            <Image
                                src="/images/logo-first.png"
                                alt="FLL"
                                width={40}
                                height={40}
                                className="w-10 h-10 flex-shrink-0"
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-[#1A1A1A] leading-tight">
                                    {tFll("hub_title")}
                                </h2>
                                <p className="text-xs text-[#6B7280] mt-1 line-clamp-3">
                                    {seasonName} {seasonYear ? `(${seasonYear})` : ""} — {tFll("hub_subtitle")}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-sm text-amber-400">★★★</span>
                                    <span className="text-xs text-[#6B7280]">{tCourses("beginner")} · 4 {tCommon("week")}</span>
                                </div>
                                <Link
                                    href={`/fll/${seasonSlug}/${categories[0]?.slug || "robot-design"}/beginner` as "/"}
                                    className="inline-block mt-3 bg-[#2563EB] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                                >
                                    {tCourses("begin_learning")} →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right block: scrollable category tabs */}
                    <div className="flex-1 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3">
                            {categories.map((cat, i) => (
                                <Link
                                    key={cat.id}
                                    href={`/fll/${seasonSlug}/${cat.slug}` as "/"}
                                    className="flex-shrink-0 w-[128px] group"
                                >
                                    <div className="rounded-lg h-[72px] w-full overflow-hidden bg-[#1E293B]">
                                        <Image
                                            src={getCourseThumbnail(cat.slug)}
                                            alt={cat.name}
                                            width={128}
                                            height={72}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-xs text-[#1A1A1A] font-medium mt-1.5 line-clamp-2 leading-tight">
                                        {cat.name}
                                    </p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                                        {tCourses("course_of")} {i + 1} {tCourses("of")} {categories.length}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ALL Course Cards Grid */}
            <main className="max-w-7xl mx-auto px-6 py-6">
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/fll/${seasonSlug}/${course.categorySlug}/${course.levelSlug}/${course.id}` as "/"}
                                className="bg-white rounded-xl overflow-hidden border border-[#E5E7EB] cursor-pointer transition-shadow duration-150 hover:shadow-md group"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden bg-[#1E293B]">
                                    <Image
                                        src={getCourseThumbnail(course.categorySlug)}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <span className="absolute top-2 right-2 bg-black/65 text-white text-[10px] font-medium px-[7px] py-[2px] rounded">
                                        {tCourses("preview")}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="px-3.5 pt-3 pb-3.5">
                                    <p className="text-[11px] text-[#9CA3AF] mb-1">
                                        {tCourses("free_label")}
                                    </p>
                                    <h3 className="text-sm font-semibold text-[#1A1A1A] leading-[1.3] line-clamp-2 min-h-[2.4rem] mb-1.5">
                                        FLL CHALLENGE: {tQuiz("filter_track").toUpperCase()} {course.categoryName}
                                    </h3>
                                    {course.description && (
                                        <p className="text-[12px] text-[#6B7280] leading-[1.4] line-clamp-3 mb-2.5">
                                            {course.description}
                                        </p>
                                    )}

                                    {/* Level badge */}
                                    <LevelBadge level={course.levelSlug} />

                                    {/* Duration */}
                                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                                        {tCourses("week_range")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-[#6B7280]">
                        <p className="text-lg">{tCommon("loading")}</p>
                        <p className="text-sm mt-2">{tCourses("no_courses")}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
