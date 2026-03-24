# Tagylym — Backlog

> **Как пользоваться:**
> В начале сессии напиши: *"читай BACKLOG.md, берись за следующую задачу"*
> Я сам отмечаю `[x]` когда готово и перехожу к следующей.

---

## Стек
- Next.js 14 · TypeScript · Tailwind · next-intl (KK / RU / EN)
- Правило: только `useTranslations()`, все тексты в `kk.json` + `ru.json` + `en.json`
- После каждой задачи: `npx tsc --noEmit` → 0 ошибок → коммит

---

## Задачи

### ✅ Выполнено
- [x] **Task 1 — Nav desktop links** — FLL/FTC/FGC/Quiz/Resources, активная ссылка `underline decoration-[#8B5CF6]`, i18n-ключи `nav.*`

### 🔲 В очереди

- [ ] **Task 2 — Navbar мобайл** — `src/components/Nav.tsx` добавить те же ссылки (FLL/FTC/FGC/Quiz/Resources) в мобильное меню. Стиль: `block py-2 text-slate-300 hover:text-white border-b border-slate-700`. Коммит: `"feat: add mobile nav links"`

- [ ] **Task 3 — Footer локализация** — убрать хардкод, добавить i18n ключи `footer.copyright` и `footer.tagline`. kk: "© 2025 Tagylym. Барлық құқықтар қорғалған." / "Робототехника білімі — баршаға". ru: "© 2025 Tagylym. Все права защищены." / "Образование по робототехнике — для всех". en: "© 2025 Tagylym. All rights reserved." / "Robotics education for everyone". Коммит: `"feat: localize footer"`

- [ ] **Task 4 — Hero CTA кнопка** — `src/app/[locale]/page.tsx` Hero секция. Кнопка-ссылка на `/fll`. Стиль: `bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-3 rounded-lg`. i18n ключ `home.hero_cta`: kk="Тегін бастау" ru="Начать бесплатно" en="Start Free". Коммит: `"feat: add hero CTA button"`

- [x] **Task 5 — Хардкод фикс** — 1) `lessons/[slug]/page.tsx` ~строка 211: "Деңгей" → `t("lesson.level")` (kk/ru/en). 2) `fll/page.tsx` ~строка 169: "ТРЕК" → `t("quiz.filter_track")`. Коммит: `"fix: replace hardcoded strings with i18n keys"`

- [x] **Task 6 — SEO метатеги** — `generateMetadata()` в page.tsx главной + fll + ftc + fgc с title и description. Коммит: `"feat: add SEO metadata"`

- [x] **Task 7 — Waitlist → Supabase** — создать `waitlist_migration.sql`, подключить форму в `ftc/page.tsx` и `fgc/page.tsx` к `supabase.from('waitlist').insert({email, competition})`. i18n ключ `waitlist.success`. Коммит: `"feat: connect waitlist to Supabase"`

- [x] **Task 8 — 404 страница** — создать `src/app/not-found.tsx`. Тёмный фон `bg-slate-900`, "404" в `#8B5CF6`, заголовок "Бет табылмады", кнопка "Басты бетке" → href="/". Коммит: `"feat: custom 404 page"`

- [x] **Task 9 — Секция "Для кого"** — `src/app/[locale]/page.tsx` после Hero. Три карточки `grid md:grid-cols-3`, стиль `bg-slate-800 border border-slate-700 rounded-xl p-6`. Карточки: Ученики🎓 / Менторы👨🏫 / Мектептер🏫. i18n ключи `audience.*`. Коммит: `"feat: add audience section"`

- [ ] **Task 10 — FAQ секция** — `src/app/[locale]/page.tsx` в конце. Аккордеон на `useState`, 6 вопросов через i18n ключи `faq.q1/a1...faq.q6/a6`. Стиль `bg-slate-800 border-slate-700`. Коммит: `"feat: add FAQ section"`

---

## Соглашения

| Тема | Правило |
|------|---------|
| Цвета | `#0C2D48` navbar · `#0D9488` кнопки · `#8B5CF6` акценты |
| i18n | Ключи добавлять одновременно в `kk.json`, `ru.json`, `en.json` |
| Коммиты | `feat:`, `fix:`, `chore:` |
| Компоненты | `src/components/`, страницы — `src/app/[locale]/` |
