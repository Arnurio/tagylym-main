import type { Rule } from 'sanity';

const lessonSchema = {
    name: 'lesson',
    title: 'Урок',
    type: 'document',
    fields: [
        {
            name: 'title_kk',
            title: 'Название (KK)',
            type: 'string',
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: 'title_ru',
            title: 'Название (RU)',
            type: 'string',
        },
        {
            name: 'title_en',
            title: 'Название (EN)',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: 'courseSlug',
            title: 'Slug курса (из Supabase)',
            type: 'string',
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: 'order',
            title: 'Порядок в курсе',
            type: 'number',
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: 'isFree',
            title: 'Бесплатный урок',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'videoUrl_kk',
            title: 'URL видео (KK)',
            type: 'url',
            description: 'Ссылка на YouTube (KK)',
        },
        {
            name: 'videoUrl_ru',
            title: 'URL видео (RU)',
            type: 'url',
            description: 'Ссылка на YouTube (RU)',
        },
        {
            name: 'presentationUrl_kk',
            title: 'URL презентации (KK)',
            type: 'url',
            description: 'Прямая ссылка на файл (KK)',
        },
        {
            name: 'presentationUrl_ru',
            title: 'URL презентации (RU)',
            type: 'url',
            description: 'Прямая ссылка на файл (RU)',
        },
        {
            name: 'content_kk',
            title: 'Текст урока (KK)',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'content_ru',
            title: 'Текст урока (RU)',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'tip_kk',
            title: 'Совет тренеру (KK)',
            type: 'text',
            rows: 2,
        },
        {
            name: 'tip_ru',
            title: 'Совет тренеру (RU)',
            type: 'text',
            rows: 2,
        },
        {
            name: 'rubricCriterion',
            title: 'Критерий рубрики',
            type: 'string',
            options: {
                list: ['IDENTIFY', 'DESIGN', 'CREATE', 'ITERATE', 'COMMUNICATE'],
            },
        },
        {
            name: 'rubricLevel',
            title: 'Уровень рубрики',
            type: 'string',
            options: {
                list: ['BEGINNING', 'DEVELOPING', 'ACCOMPLISHED', 'EXCEEDS'],
            },
        },
    ],
    preview: {
        select: {
            title_kk: 'title_kk',
            title_ru: 'title_ru',
            title_base: 'title',
        },
        prepare(selection: any) {
            const { title_kk, title_ru, title_base } = selection;
            return {
                title: title_kk || title_ru || title_base || 'Untitled Lesson',
            };
        },
    },
    orderings: [
        {
            title: 'По порядку (возрастание)',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
};

export default lessonSchema;
