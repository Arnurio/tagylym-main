import type { Rule } from 'sanity';

const courseSchema = {
    name: 'course',
    title: 'Курс',
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
            name: 'description_kk',
            title: 'Описание (KK)',
            type: 'text',
        },
        {
            name: 'description_ru',
            title: 'Описание (RU)',
            type: 'text',
        },
        {
            name: 'description_en',
            title: 'Описание (EN)',
            type: 'text',
        },
        {
            name: 'category',
            title: 'Категория',
            type: 'string',
            options: {
                list: ['robot-design', 'innovation', 'coding', 'robot-game'],
            },
        },
        {
            name: 'level',
            title: 'Уровень',
            type: 'string',
            options: {
                list: ['beginner', 'intermediate', 'advanced'],
            },
        },
        {
            name: 'order',
            title: 'Порядок',
            type: 'number',
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
                title: title_kk || title_ru || title_base || 'Untitled Course',
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

export default courseSchema;
