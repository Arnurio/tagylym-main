import {
    getSeasonBySlug,
    getCategoryBySlug,
    getLevelByCategoryAndName,
    getChecklistItems,
    getCoursesByLevel,
    getArtifactsByLevel,
} from "@/lib/queries";
import LevelPageContent from "./LevelPageContent";

export default async function LevelPage({
    params,
}: {
    params: Promise<{ locale: string; season: string; category: string; level: string }>;
}) {
    const { category, level, season } = await params;

    const seasonData = await getSeasonBySlug("fll", season);
    const categoryData = seasonData
        ? await getCategoryBySlug(seasonData.id, category)
        : null;
    const levelData = categoryData
        ? await getLevelByCategoryAndName(categoryData.id, level)
        : null;

    const [checklist, courses, artifacts] = levelData
        ? await Promise.all([
            getChecklistItems(levelData.id),
            getCoursesByLevel(levelData.id),
            getArtifactsByLevel(levelData.id),
        ])
        : [[], [], []];

    return (
        <LevelPageContent
            category={category}
            level={level}
            season={season}
            levelData={levelData}
            categoryData={categoryData}
            checklist={checklist}
            courses={courses}
            artifacts={artifacts}
        />
    );
}
