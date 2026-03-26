# Tagylym — Backlog

> **Как пользоваться:**
> В начале сессии напиши: *"читай BACKLOG.md, берись за следующую задачу"*
> Я сам отмечаю `[x]` когда готово и перехожу к следующей.

---

## Стек
- Next.js 16 · TypeScript · Tailwind v4 · next-intl (KK / RU / EN)
- Правило: только `useTranslations()`, все тексты в `kk.json` + `ru.json` + `en.json`
- После каждой задачи: `npx tsc --noEmit` → 0 ошибок → коммит

---

## Задачи

### ✅ Выполнено
- [x] **Task 1 — Nav desktop links** — FLL/FTC/FGC/Quiz/Resources, активная ссылка `underline decoration-[#8B5CF6]`, i18n-ключи `nav.*`
- [x] **Task 2 — Navbar мобайл** — `src/components/Nav.tsx` добавить те же ссылки (FLL/FTC/FGC/Quiz/Resources) в мобильное меню. Стиль: `block py-2 text-slate-300 hover:text-white border-b border-slate-700`.
- [x] **Task 3 — Footer локализация** — убрать хардкод, добавить i18n ключи `footer.copyright` и `footer.tagline`.
- [x] **Task 4 — Hero CTA кнопка** — `src/app/[locale]/page.tsx` Hero секция. Кнопка-ссылка на `/fll`.
- [x] **Task 5 — Хардкод фикс** — 1) `lessons/[slug]/page.tsx` ~строка 211: "Деңгей" → `t("lesson.level")` (kk/ru/en). 2) `fll/page.tsx` ~строка 169: "ТРЕК" → `t("quiz.filter_track")`.
- [x] **Task 6 — SEO метатеги** — `generateMetadata()` в page.tsx главной + fll + ftc + fgc с title и description.
- [x] **Task 7 — Waitlist → Supabase** — создать `waitlist_migration.sql`, подключить форму в `ftc/page.tsx` и `fgc/page.tsx`.
- [x] **Task 8 — 404 страница** — создать `src/app/not-found.tsx`. Тёмный фон `bg-slate-900`, "404" в `#8B5CF6`.
- [x] **Task 9 — Секция "Для кого"** — `src/app/[locale]/page.tsx` после Hero. Три карточки: Ученики🎓 / Менторы👨‍🏫 / Мектептер🏫.
- [x] **Task 10 — FAQ секция** — `src/app/[locale]/page.tsx` в конце. Аккордеон на `useState`.
- [x] **Task 11 — Dashboard "Continue Learning" fix** — исправить логику "Продолжить обучение" в дашборде.
- [x] **Task 12 — Форма обратной связи** — добавить общую форму обратной связи на страницу "Resources".

### 🔲 В очереди
- [x] **Task 13 — Courses Catalog** — страница `/courses` с сеткой карточек курсов, навигация и локализация.
- [x] **Task 14 — Persistent Lesson Progress** — сохранение прогресса видеоуроков в Supabase.
- [x] **Task 15 — FTC & FGC Coming Soon** — страницы-заглушки для новых направлений.

### 🚀 Текущий спринт (Digital Kazakhstan — Шымкент, 27 марта 2026)
- [ ] **CAT Quiz** — адаптивный квиз, который меняет сложность по ответам студента
- [ ] **Demo mode** — публичный показ: презентации + видеоуроки + квиз банк без авторизации
- [ ] **F1–F16 full fix pass** — контрастность, i18n, middleware, level names в БД (выполнено 26 марта 2026)

---
**Status**: Platform functional, localized, deployed on Vercel. Full fix pass completed 2026-03-26.

## Соглашения

| Тема | Правило |
|------|---------|
| Цвета | `#0C2D48` navbar · `#0D9488` кнопки · `#8B5CF6` акценты |
| i18n | Ключи добавлять одновременно в `kk.json`, `ru.json`, `en.json` |
| Коммиты | `feat:`, `fix:`, `chore:` |
| Компоненты | `src/components/`, страницы — `src/app/[locale]/` |
