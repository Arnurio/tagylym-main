// Lesson types for FTC Coding course

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CodeBlock {
    type: 'code';
    language: string;
    filename?: string;
    content: string;
}

export interface TextBlock {
    type: 'text';
    content: string;
}

export interface HeadingBlock {
    type: 'heading';
    level: 2 | 3 | 4;
    content: string;
}

export interface NoteBlock {
    type: 'note';
    variant: 'info' | 'warning' | 'tip' | 'error';
    content: string;
}

export interface ListBlock {
    type: 'list';
    ordered: boolean;
    items: string[];
}

export interface TaskBlock {
    type: 'task';
    title: string;
    description: string;
    subtasks?: string[];
    hints?: string[];
}

export type LessonBlock = CodeBlock | TextBlock | HeadingBlock | NoteBlock | ListBlock | TaskBlock;

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface LessonSection {
    id: string;
    title: string;
    blocks: LessonBlock[];
}

export interface Lesson {
    id: string;
    number: number;
    title: string;
    description: string;
    level: LessonLevel;
    duration: string;
    sections: LessonSection[];
    practicalTasks: TaskBlock[];
    quiz: QuizQuestion[];
}

export interface LessonProgress {
    lessonId: string;
    completed: boolean;
    quizScore?: number;
    completedAt?: string;
}

export interface CourseProgress {
    courseId: string;
    lessons: LessonProgress[];
    lastAccessedLessonId?: string;
}
