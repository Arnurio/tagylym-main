// ─── Database Models ─────────────────────────────────────

export interface User {
    id: string;
    role: "student" | "coach" | "admin";
    subscription_tier: "free" | "basic" | "premium";
    team_id: string | null;
}

export interface Team {
    id: string;
    name: string;
    coach_id: string;
    competition_type: string;
}

export interface Competition {
    id: string;
    name: string;
    slug: "fll" | "ftc" | "fgc";
}

export interface Season {
    id: string;
    competition_id: string;
    name: string;
    year: number;
    is_active: boolean;
}

export interface Category {
    id: string;
    season_id: string;
    name: string;
    slug: string;
    icon: string;
    sort_order: number;
}

export interface Level {
    id: string;
    category_id: string;
    name: string;
    color: string;
    sort_order: number;
}

export interface Course {
    id: string;
    level_id: string;
    title: string;
    description: string | null;
    sort_order: number;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    video_url: string | null;
    content_md: string | null;
    sort_order: number;
    is_free: boolean;
}

export interface Quiz {
    id: string;
    lesson_id: string | null;
    category: string;
    level: string;
    type: "mcq" | "open";
    question: string;
    options: string[] | null;
    correct_answer: string;
    tip: string;
}

export interface Artifact {
    id: string;
    level_id: string;
    name: string;
    file_url: string;
    description: string | null;
}

export interface ChecklistItem {
    id: string;
    level_id: string;
    text: string;
    sort_order: number;
}

export interface Progress {
    user_id: string;
    lesson_id: string;
    completed_at: string;
}

export interface ChecklistProgress {
    user_id: string;
    item_id: string;
    checked: boolean;
}

// ─── Component Props ─────────────────────────────────────

export type LevelName = "beginner" | "intermediate" | "advanced";

export interface LevelBadgeProps {
    level: LevelName;
}

export type RubricCriterion =
    | "DESIGN"
    | "CREATE"
    | "ITERATE"
    | "COMMUNICATE"
    | "IMPACT"
    | "INNOVATION"
    | "FUN";

export type RubricLevel = "ACCOMPLISHED" | "EXCEEDS";

export interface RubricCalloutProps {
    criterion: RubricCriterion;
    level: RubricLevel;
    text: string;
}

export interface ChecklistBlockProps {
    items: ChecklistItem[];
    levelId: string;
    checkedItems: Record<string, boolean>;
    onToggle: (itemId: string) => Promise<void>;
}

export interface QuizCardProps {
    quiz: Quiz;
}

export interface TipBoxProps {
    text: string;
}

export interface ROIRow {
    id: string;
    missionName: string;
    points: number;
    time: number;
}

export interface VideoPlayerProps {
    videoUrl: string;
    lessonId?: string;
    onComplete?: () => void;
}

export interface ProgressBarProps {
    completed: number;
    total: number;
}

export interface ArtifactCardProps {
    artifact: Artifact;
}
