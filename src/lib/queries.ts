import { createClient } from "./supabase/server";
import type {
    Competition,
    Season,
    Category,
    Level,
    Course,
    Lesson,
    Quiz,
    Artifact,
    ChecklistItem,
    Progress,
    ChecklistProgress,
} from "@/types";

// ─── Competitions ────────────────────────────────────────

export async function getCompetitions(): Promise<Competition[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("competitions")
        .select("*");
    if (error) throw error;
    return data ?? [];
}

// ─── Seasons ─────────────────────────────────────────────

export async function getActiveSeasonByCompetition(
    competitionSlug: string
): Promise<(Season & { competition: Competition }) | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("seasons")
        .select("*, competition:competitions!inner(*)")
        .eq("competitions.slug", competitionSlug)
        .eq("is_active", true)
        .single();
    if (error) return null;
    return data;
}

export async function getSeasonBySlug(
    competitionSlug: string,
    seasonSlug: string
): Promise<Season | null> {
    const supabase = await createClient();
    // seasonSlug format: "submerged-2025-26" → name: "SUBMERGED 2025-26"
    const { data: comp } = await supabase
        .from("competitions")
        .select("id")
        .eq("slug", competitionSlug)
        .single();
    if (!comp) return null;

    const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("competition_id", comp.id)
        .eq("slug", seasonSlug)
        .single();
    if (error) return null;
    return data;
}

// ─── Categories ──────────────────────────────────────────

export async function getCategoriesBySeason(
    seasonId: string
): Promise<Category[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("season_id", seasonId)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function getCategoryBySlug(
    seasonId: string,
    slug: string
): Promise<Category | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("season_id", seasonId)
        .eq("slug", slug)
        .single();
    if (error) return null;
    return data;
}

// ─── Levels ──────────────────────────────────────────────

export async function getLevelsByCategory(
    categoryId: string
): Promise<Level[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("levels")
        .select("*")
        .eq("category_id", categoryId)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function getLevelByCategoryAndName(
    categoryId: string,
    levelName: string
): Promise<Level | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("levels")
        .select("*")
        .eq("category_id", categoryId)
        .eq("name", levelName.toLowerCase())
        .single();
    if (error) return null;
    return data;
}

// ─── Courses ─────────────────────────────────────────────

export async function getCoursesByLevel(
    levelId: string
): Promise<Course[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("level_id", levelId)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

// ─── Lessons ─────────────────────────────────────────────

export async function getLessonsByCourse(
    courseId: string
): Promise<Lesson[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function getLessonById(
    lessonId: string
): Promise<Lesson | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
    if (error) return null;
    return data;
}

export async function getLessonCountByLevel(
    levelId: string
): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("lessons")
        .select("id, course:courses!inner(level_id)", { count: "exact", head: true })
        .eq("courses.level_id", levelId);
    if (error) return 0;
    return count ?? 0;
}

export async function getLessonTitlesByIds(
    lessonIds: string[]
): Promise<Record<string, { title: string; title_kk: string; title_en: string }>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("lessons")
        .select("id, title")
        .in("id", lessonIds);
    if (error || !data) return {};

    const result: Record<string, { title: string; title_kk: string; title_en: string }> = {};
    data.forEach((l) => {
        // @ts-ignore - these columns might be missing in DB but we provide fallbacks
        result[l.id] = { 
            title: l.title, 
            title_kk: (l as any).title_kk || l.title, 
            title_en: (l as any).title_en || l.title 
        };
    });
    return result;
}

// ─── Checklist Items ─────────────────────────────────────

export async function getChecklistItems(
    levelId: string
): Promise<ChecklistItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("level_id", levelId)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function getChecklistItemCount(
    levelId: string
): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("checklist_items")
        .select("id", { count: "exact", head: true })
        .eq("level_id", levelId);
    if (error) return 0;
    return count ?? 0;
}

// ─── Artifacts ───────────────────────────────────────────

export async function getArtifactsByLevel(
    levelId: string
): Promise<Artifact[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artifacts")
        .select("*")
        .eq("level_id", levelId);
    if (error) throw error;
    return data ?? [];
}

// ─── Quizzes ─────────────────────────────────────────────

export async function getQuizzes(filters?: {
    category?: string;
    level?: string;
}): Promise<Quiz[]> {
    const supabase = await createClient();
    let query = supabase.from("quizzes").select("*");

    if (filters?.category) {
        query = query.eq("category", filters.category);
    }
    if (filters?.level) {
        query = query.eq("level", filters.level);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}

export async function getQuizzesByLesson(
    lessonId: string
): Promise<Quiz[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", lessonId);
    if (error) throw error;
    return data ?? [];
}

// ─── User Progress ───────────────────────────────────────

export async function getUserProgress(
    userId: string
): Promise<Progress[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
}

export async function markLessonComplete(
    userId: string,
    lessonId: string
): Promise<void> {
    const supabase = await createClient();
    await supabase.from("progress").upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
    });
}

export async function unmarkLessonComplete(
    userId: string,
    lessonId: string
): Promise<void> {
    const supabase = await createClient();
    await supabase.from("progress").delete().match({ user_id: userId, lesson_id: lessonId });
}

// ─── Checklist Progress ──────────────────────────────────

export async function getChecklistProgress(
    userId: string,
    levelId: string
): Promise<ChecklistProgress[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("checklist_progress")
        .select("*, item:checklist_items!inner(*)")
        .eq("user_id", userId)
        .eq("checklist_items.level_id", levelId);
    if (error) return [];
    return data ?? [];
}

export async function toggleChecklistItem(
    userId: string,
    itemId: string,
    checked: boolean
): Promise<void> {
    const supabase = await createClient();
    await supabase.from("checklist_progress").upsert({
        user_id: userId,
        item_id: itemId,
        checked,
    });
}

// ─── Aggregate helpers ───────────────────────────────────

export async function getLevelsWithCounts(
    categoryId: string
): Promise<(Level & { lessonCount: number; checklistCount: number })[]> {
    const levels = await getLevelsByCategory(categoryId);

    const enriched = await Promise.all(
        levels.map(async (level) => {
            const [lessonCount, checklistCount] = await Promise.all([
                getLessonCountByLevel(level.id),
                getChecklistItemCount(level.id),
            ]);
            return { ...level, lessonCount, checklistCount };
        })
    );

    return enriched;
}

// ─── All courses for a season (flat grid) ────────────────

export interface EnrichedCourse extends Course {
    categoryName: string;
    categorySlug: string;
    levelName: string;
    levelSlug: string;
    levelColor: string;
}


export async function getAllCoursesForSeason(
    seasonId: string
): Promise<EnrichedCourse[]> {
    const categories = await getCategoriesBySeason(seasonId);
    const allCourses: EnrichedCourse[] = [];

    for (const cat of categories) {
        const levels = await getLevelsByCategory(cat.id);
        for (const level of levels) {
            const courses = await getCoursesByLevel(level.id);
            for (const course of courses) {
                allCourses.push({
                    ...course,
                    categoryName: cat.name,
                    categorySlug: cat.slug,
                    levelName: level.name,
                    levelSlug: level.name,
                    levelColor: level.color,
                });
            }
        }
    }

    return allCourses;
}

