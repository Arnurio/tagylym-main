# Tagylym — Robotics Education Platform

Комплексная образовательная платформа для команд FIRST (FLL, FTC, FGC). Видеоуроки, тесты, чек-листы и стратегии для подготовки к соревнованиям.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **CMS:** Sanity.io
- **Payments:** Stripe
- **i18n:** next-intl (RU primary, EN secondary)
- **State:** Zustand (client), React Query (server)
- **Video:** YouTube embed via react-youtube

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd tagylym
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Your Sanity project ID
- `STRIPE_SECRET_KEY` — Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Your Stripe publishable key

### 3. Database setup

Run the SQL files in your Supabase SQL Editor in order:

1. `schema.sql` — Creates all tables and RLS policies
2. `seed.sql` — Inserts seed data (FLL competition, categories, levels, quizzes)

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/ru` (Russian locale).

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing (ru, en)
│   │   ├── page.tsx       # Home page
│   │   ├── fll/           # FLL section
│   │   ├── ftc/           # FTC (Coming Soon)
│   │   ├── fgc/           # FGC (Coming Soon)
│   │   ├── quiz/          # Quiz bank
│   │   ├── lessons/       # Lesson viewer
│   │   ├── courses/       # Course detail
│   │   ├── dashboard/     # User dashboard
│   │   ├── resources/     # Resources + ROI Calculator
│   │   ├── pricing/       # Pricing plans
│   │   ├── auth/login/    # Authentication
│   │   ├── coach/         # Coach panel (Coming Soon)
│   │   └── admin/         # Admin panel
│   ├── globals.css        # Design system + Tailwind
│   └── layout.tsx         # Root layout
├── components/
│   ├── Nav.tsx            # Responsive navigation
│   ├── LevelBadge.tsx     # Color-coded level pill
│   ├── RubricCallout.tsx  # Rubric criteria callout
│   ├── ChecklistBlock.tsx # Interactive checklist (Supabase)
│   ├── QuizCard.tsx       # MCQ + Open-ended quiz
│   ├── TipBox.tsx         # Coach tip box
│   ├── ROICalculator.tsx  # Mission ROI calculator
│   ├── VideoPlayer.tsx    # YouTube embed wrapper
│   ├── ProgressBar.tsx    # Animated progress bar
│   └── ArtifactCard.tsx   # Download card
├── i18n/
│   ├── routing.ts         # Locale routing config
│   └── request.ts         # Request-time locale loading
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── sanity.ts          # Sanity client
│   └── stripe.ts          # Stripe client
├── types/
│   └── index.ts           # All TypeScript interfaces
├── middleware.ts           # next-intl middleware
messages/
├── ru.json                # Russian translations
└── en.json                # English translations
```

## Design System

| Token           | Color     | Usage                     |
| --------------- | --------- | ------------------------- |
| `beginner`      | `#3B82F6` | Beginner level            |
| `intermediate`  | `#F97316` | Intermediate level        |
| `advanced`      | `#22C55E` | Advanced level            |
| `accent`        | `#8B5CF6` | Primary accent            |
| `brand`         | `#1E3A5F` | Brand color               |
| `surface`       | `#0F172A` | Background                |

**Fonts:** Inter (body), JetBrains Mono (code)

## Key Features

- 🌐 **Bilingual** — Russian (primary) + English
- 🎥 **Video Lessons** — YouTube embed with progress tracking
- ✅ **Interactive Checklists** — Persisted to Supabase
- 📊 **ROI Calculator** — Mission efficiency tool with CSV export
- 🎯 **Quiz Engine** — MCQ + Open-ended with tips
- 📋 **Rubric Mapping** — ACCOMPLISHED vs EXCEEDS criteria
- 🎨 **Dark Theme** — Glassmorphism + animations

## License

MIT
