import type { Rule } from 'sanity';

const lessonSchema = {
    name: 'lesson',
    title: 'Урок',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Название',
            type: 'string',
            validation: (Rule: Rule) => Rule.required(),
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
            name: 'videoUrl',
            title: 'YouTube URL',
            type: 'url',
        },
        {
            name: 'content',
            title: 'Текст урока',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'tip',
            title: 'Совет тренеру',
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
}

export default lessonSchema;
