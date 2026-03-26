# TAGYLYM — Project Instructions for Claude Code

## About the Founder
- **Arnur Kemerbek**, 16 лет, НИШ ЕМН Медеу, Алматы, 10 класс
- 4 года в робототехнике: WRO, FLL, FGC (сборная КЗ — Grand Challenge Gold, Einstein Gold), FTC (Inspire Award 3rd Place)
- Не программист — фаундер, визионер, контент-мейкер. Делай всё сам, отдавай готовый результат.
- GitHub: arnurio | Email: kemerbek10@gmail.com

## About Tagylym
Онлайн-платформа для обучения робототехнике (FLL/FTC/FGC/WRO). Видеоуроки, презентации, квизы, связь с менторами и выпускниками.
- Сайт: tagylym.com
- Фаза: MVP запущен, freemium модель
- Команда: 5 человек (Арнур-фаундер, ментор, эдвайзер-Stanford, девелопер piyazus (не активен), билдер-инженер)

## Stack
- **Framework:** Next.js 16 + TypeScript + React 19
- **Styling:** Tailwind CSS v4 + Framer Motion
- **CMS:** Sanity (schema in /sanity)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **i18n:** next-intl — 3 languages: KK (казахский), RU (русский), EN (английский)
- **Payments:** Stripe
- **State:** Zustand + React Query
- **Deploy:** Vercel

## Sub-agents
При сложных задачах используй sub-agents для параллельной работы:
- **Architect** — анализирует задачу, определяет какие файлы затронуты, планирует структуру изменений
- **Frontend Engineer** — пишет React компоненты, страницы, стили, анимации
- **Backend Engineer** — Supabase запросы, SQL миграции, API роуты, серверные функции
- **QA Engineer** — после изменений проверяет: `npx tsc --noEmit`, читает код на баги, проверяет i18n ключи во всех 3 языках
- **UX Reviewer** — проверяет соответствие дизайн-системе (glass-card, цвета, контрастность, анимации)

Workflow: Architect планирует → Frontend/Backend реализуют → QA проверяет → UX ревьюит. Не пропускай этапы.

## File Structure
```
src/
├── app/[locale]/          # Pages (routing by locale)
│   ├── page.tsx           # Homepage (hero, FAQ, "для кого")
│   ├── fll/               # FLL course pages
│   ├── ftc/               # FTC pages
│   ├── fgc/               # FGC pages
│   ├── courses/           # Course catalog
│   ├── course/            # Individual course view
│   ├── lessons/           # Lesson pages with video + content
│   ├── quiz/              # Quiz catalog
│   ├── dashboard/         # Student dashboard
│   ├── auth/              # Login/signup
│   ├── admin/             # Admin panel
│   ├── coach/             # Coach panel
│   ├── presentations/     # Presentations viewer
│   ├── pricing/           # Pricing page
│   └── resources/         # Resources + feedback form
├── components/            # Reusable components (Nav, Footer, QuizCard, etc.)
├── lib/                   # Supabase client, Sanity client, queries
├── types/                 # TypeScript interfaces
└── i18n/                  # i18n config
messages/                  # Translation files (kk.json, ru.json, en.json)
sanity/                    # Sanity CMS schemas
```

## Database Schema (Supabase)
Key tables: users, teams, competitions, seasons, categories, levels, courses, lessons, quizzes, artifacts, checklist_items, progress, checklist_progress.
- Quiz columns: id, lesson_id, category, level, type (mcq/open), question, options (JSONB), correct_answer, tip
- RLS enabled on all tables, content readable by anyone, user data restricted to owner

## Design System
- **Background:** #020617 (dark navy)
- **Surface:** #0F172A with glass-card effect (rgba(15,23,42,0.6) + backdrop-blur)
- **Primary:** #8B5CF6 (purple)
- **Accent:** #0EA5E9 (sky blue)
- **Tagylym brand colors:** deepBlue #0C2D48, teal #0D9488, orange #F97316, sand #F0F4F8
- **Fonts:** Inter (body), Calistoga (headings), JetBrains Mono (code)
- **Style:** glass-card with border-white/5, rounded-2xl, shadow-xl, framer-motion animations
- **CRITICAL:** Тёмный фон = белый текст, светлый фон = чёрный текст. НИКОГДА чёрный текст на тёмном фоне.

## Coding Rules
1. All user-facing text via `useTranslations()` — add keys to kk.json + ru.json + en.json simultaneously
2. After any change: `npx tsc --noEmit` must return 0 errors
3. Commit format: `feat:`, `fix:`, `chore:`
4. Components in src/components/, pages in src/app/[locale]/
5. Never break existing pages or functionality
6. Use existing design patterns (glass-card, motion animations, color scheme)
7. Supabase queries through src/lib/queries.ts or direct supabase client
8. Single file components — no separate CSS files, keep styles in Tailwind classes
9. Always use "use client" directive for components with hooks/interactivity

## Communication Style
- Общайся на ты, неформально, по-русски
- Без эмодзи, без клише ("давайте рассмотрим", "отличный вопрос")
- Ошибки — говори прямо
- Если не хватает информации — спроси, не додумывай
- Если дана прямая инструкция — делай именно так

## Content Structure (FLL)
- 4 judging sections: Robot Game, Robot Design, Innovation Project, Core Values
- Core Values integrated (not standalone) — evaluated through RD and IP presentations
- Levels: Beginner → Intermediate → Advanced
- Beginner: Robot Game + Robot Design combined into one track
- Lesson codes: RD-B01, IP-I03 (track-level-number)

## Content Status (March 2026)
- FLL Beginner: 25 presentations DONE (RD 8 + IP 6 + CV 3, KK+RU)
- FTC: 4 presentations DONE (needs upgrade)
- FGC: 4 presentations DONE (needs upgrade)
- WRO: NOT STARTED
- FLL Intermediate/Advanced: NOT STARTED
- Video lessons: IN PROGRESS

## FTC Awards (current)
Motivate Award NO LONGER EXISTS → replaced by Reach Award + Sustain Award.
Full list: Inspire, Think, Design, Connect, Reach, Sustain (+ Robot Performance, Control).

## Priorities
1. Tagylym — content + platform
2. Mentoring Panheya #21058 (FTC, FIRST World Championship end of April 2026)
3. AI CAD Copilot (early concept)
4. Studies (НИШ 10 класс)

## Current Sprint
- Digital Kazakhstan (Shymkent, March 27, 2026) — need working demo with quiz system
- Building CAT quiz (adaptive quiz that adjusts difficulty based on student answers)
- Site must show: presentations, video lessons, and CAT quiz bank

## Backlog (completed)
Tasks 1-15 completed: Nav links, mobile menu, footer i18n, hero CTA, hardcode fixes, SEO meta, waitlist, 404 page, "for whom" section, FAQ, dashboard fix, feedback form, courses catalog, persistent progress, FTC/FGC coming soon pages.

## Known Issues
1. Казахский текст бывает грамматически неестественным — используй короткие предложения, разговорный стиль
2. Контрастность текста — всегда проверяй перед коммитом
3. Не выдавай черновики — только финальный результат