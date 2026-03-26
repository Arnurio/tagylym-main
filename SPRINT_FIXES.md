# SPRINT: Full Fix Pass — Tagylym Platform
# Дата: 26 марта 2026
# Контекст: Digital Kazakhstan (Шымкент, 27 марта). Всё чиним сейчас.

> **Инструкция:** Читай CLAUDE.md → затем этот файл → выполняй задачи по порядку.
> После каждой задачи: `npx tsc --noEmit` → 0 ошибок → git commit с правильным префиксом.
> Не ломай существующие страницы. Если сомневаешься — спроси.

---

## Task F1 — Добавить muted-foreground токен

**Проблема:** В `globals.css` (@theme) нет `--color-muted-foreground`. Класс `text-muted-foreground` используется в hero subtitle и about body — Tailwind v4 не может его разрешить, текст может быть невидимым.

**Что делать:**
1. Добавить в `src/app/globals.css` в секцию `@theme`:
```
--color-muted-foreground: #94A3B8;
```

2. Проверь все использования:
```bash
grep -rn "muted-foreground" src/ --include="*.tsx" --include="*.css"
```
- На тёмном фоне → `text-muted-foreground` (#94A3B8) — ОК
- На белом фоне (About section) → замени на `text-slate-600` (#475569) для нормального контраста

**Файлы:** `src/app/globals.css`, `src/app/[locale]/page.tsx`
**Коммит:** `fix: add muted-foreground token and fix contrast on light backgrounds`

---

## Task F2 — Контрастность About секции

**Проблема:** `src/app/[locale]/page.tsx` ~строка 263: секция "About Tagylym" — `bg-white`, но внутри `text-foreground` = #F8FAFC (белый текст на белом фоне = НЕВИДИМО). `bg-card` на quote = полупрозрачный тёмный на белом.

**Что делать:**
1. Найди секцию `{/* "О проекте Tagylym" Section */}` (~строка 262)
2. Замени классы:
   - Заголовок: `text-deepBlue` или `text-slate-900`
   - Body текст: `text-slate-600`
   - Quote card: `bg-slate-50 border-slate-200` вместо `bg-card border-border`
   - Quote текст: `text-slate-800` вместо `text-foreground`
   - Badge "About": `bg-sky-50 border-sky-200 text-sky-600` если текущий не читается на белом

**ПРАВИЛО:** Тёмный фон = белый текст. Светлый фон = тёмный текст. НИКОГДА белый на белом.

**Коммит:** `fix: correct contrast for About section on white background`

---

## Task F3 — Хардкод текстов в Learning Tracks

**Проблема:** `src/app/[locale]/page.tsx` ~строка 412-415. Карточки треков — русский текст в JSX. Казахские/английские пользователи видят русский.

Также fallback строки с `||` (~строки 407, 435, 449):
```js
{t("presentations_title") || "Образовательные треки"}
```

**Что делать:**
1. Добавить ключи в `home` namespace во ВСЕ ТРИ файла (kk.json, ru.json, en.json):

**kk.json:**
```json
"track_fll_title": "FLL Masterclass",
"track_fll_desc": "LEGO Education, Spike Prime және ойын стратегиясы — жас инженерлерге арналған.",
"track_ftc_title": "FTC DECODE™",
"track_ftc_desc": "Java-да бағдарламалау және күрделі механизмдерді жобалау.",
"track_fgc_title": "FGC Incheon 2026",
"track_fgc_desc": "Жаһандық сын-тегеуріндер мен ұлттық құраманы дүниежүзілік финалға дайындау."
```

**ru.json:**
```json
"track_fll_title": "FLL Masterclass",
"track_fll_desc": "LEGO Education, Spike Prime и стратегия игры для самых юных инженеров.",
"track_ftc_title": "FTC DECODE™",
"track_ftc_desc": "Продвинутое программирование на Java и проектирование сложных механизмов.",
"track_fgc_title": "FGC Incheon 2026",
"track_fgc_desc": "Глобальные вызовы и подготовка национальной сборной к мировому финалу."
```

**en.json:**
```json
"track_fll_title": "FLL Masterclass",
"track_fll_desc": "LEGO Education, Spike Prime and game strategy for young engineers.",
"track_ftc_title": "FTC DECODE™",
"track_ftc_desc": "Advanced Java programming and complex mechanism design.",
"track_fgc_title": "FGC Incheon 2026",
"track_fgc_desc": "Global challenges and national team preparation for the world finals."
```

2. В `page.tsx` замени хардкод массив:
```tsx
const tracks = [
    { titleKey: "track_fll_title", descKey: "track_fll_desc", slug: "fll", color: "#8B5CF6", icon: "🤖" },
    { titleKey: "track_ftc_title", descKey: "track_ftc_desc", slug: "ftc", color: "#F97316", icon: "⚙️" },
    { titleKey: "track_fgc_title", descKey: "track_fgc_desc", slug: "fgc", color: "#10B981", icon: "🌍" },
];
```
В рендере: `t(track.titleKey)` и `t(track.descKey)`.

3. Убери ВСЕ `|| "fallback"` паттерны. Ключи определены — fallback не нужен.

**Коммит:** `fix: localize Learning Tracks section, remove hardcoded Russian text`

---

## Task F4 — /resources убрать из protected

**Проблема:** `src/middleware.ts` строка 8: `/resources` за авторизацией. Это публичный контент для менторов, на главной CTA ведёт туда — новый пользователь получит редирект на логин.

**Что делать:**
```ts
const protectedPaths = ["/dashboard"];
```

**Коммит:** `fix: make /resources publicly accessible`

---

## Task F5 — Удалить мёртвый массив presentations

**Проблема:** `src/app/[locale]/page.tsx` строки 21-58: массив `presentations` (6 объектов). Нигде не рендерится.

**Что делать:** Удалить весь `const presentations = [...]`.

**Коммит:** `chore: remove unused presentations array from homepage`

---

## Task F6 — Удалить orphan kz.json

**Проблема:** `messages/kz.json` (181 строка). Routing = "kk", не "kz". Файл нигде не подключён.

**Что делать:** Удалить `messages/kz.json`.

**Коммит:** `chore: remove orphan kz.json (locale is "kk")`

---

## Task F7 — Hardcoded Supabase cookie в middleware

**Проблема:** `src/middleware.ts` строки 22-23: `sb-nvfvrbudxltzgqmazeos-auth-token` — хардкод project ID. Если сменится проект, auth тихо сломается.

**Что делать:**
```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase/)?.[1] || "";

const hasAuthToken =
    request.cookies.has(`sb-${projectRef}-auth-token`) ||
    request.cookies.has(`sb-${projectRef}-auth-token.0`);
```

**Коммит:** `fix: derive Supabase cookie name from env instead of hardcoding`

---

## Task F8 — Хардкод Kazakh rubric texts в LevelPageContent

**Проблема:** `src/app/[locale]/fll/[season]/[category]/[level]/LevelPageContent.tsx` строки 22-43: `rubricTexts` — все на казахском. Русские и английские пользователи видят казахский.

**Что делать:**
1. Добавить namespace `rubric` во все 3 messages файла. Ключи: `{category}_{level}`.

**kk.json** — скопируй текущие тексты из кода как есть (они уже на казахском):
```json
"rubric": {
    "robot-design_beginner": "Робот жобаланды, негізгі тапсырмаларды орындай алады. Команда дизайнның негізгі шешімдерін түсіндіре алады.",
    "robot-design_intermediate": "Дизайн тестілеу негізінде жақсартылды. Инженерлік журналда процесс құжатталған.",
    "robot-design_advanced": "Нақты негіздемесі бар инновациялық дизайн. Команда инженерлік процесті терең түсінетінін көрсетеді.",
    "coding_beginner": "Бағдарлама роботты миссияларды орындау үшін іске қосады. Код жүйелі және түсінікті.",
    "coding_intermediate": "Датчиктер мен шарттарды қолдану. Дәл қозғалыс үшін P-контроллер.",
    "coding_advanced": "PID-реттегіш, PyBricks-тегі модульдік код. Маршрутты оңтайландыру алгоритмдері.",
    "innovation_beginner": "Мәселе анықталды, шешім ұсынылды. Презентация құрылымдалған.",
    "innovation_intermediate": "Прототип нақты пайдаланушылармен сыналды. Әсер ету көрсеткіштері бар.",
    "innovation_advanced": "Impact First: алғашқы 10 секундта цифрлық нәтиже. Масштабталатын шешім.",
    "robot-game_beginner": "Робот 3+ миссияны орындайды. Команда ережелер мен стратегияны біледі.",
    "robot-game_intermediate": "Миссиялардың ROI-анализі. Оңтайландырылған маршруттар. 150+ ұпай.",
    "robot-game_advanced": "300+ ұпай. Резервтік жоспарлары бар толық автономды стратегия."
}
```

**ru.json:**
```json
"rubric": {
    "robot-design_beginner": "Робот спроектирован, выполняет базовые задачи. Команда может объяснить основные конструктивные решения.",
    "robot-design_intermediate": "Дизайн улучшен на основе тестирования. Процесс задокументирован в инженерном журнале.",
    "robot-design_advanced": "Инновационный дизайн с чётким обоснованием. Команда демонстрирует глубокое понимание инженерного процесса.",
    "coding_beginner": "Программа запускает робота для выполнения миссий. Код организован и понятен.",
    "coding_intermediate": "Использование датчиков и условий. P-контроллер для точного движения.",
    "coding_advanced": "PID-регулятор, модульный код на PyBricks. Алгоритмы оптимизации маршрутов.",
    "innovation_beginner": "Проблема определена, решение предложено. Презентация структурирована.",
    "innovation_intermediate": "Прототип протестирован с реальными пользователями. Есть показатели воздействия.",
    "innovation_advanced": "Impact First: цифровой результат в первые 10 секунд. Масштабируемое решение.",
    "robot-game_beginner": "Робот выполняет 3+ миссии. Команда знает правила и стратегию.",
    "robot-game_intermediate": "ROI-анализ миссий. Оптимизированные маршруты. 150+ очков.",
    "robot-game_advanced": "300+ очков. Полностью автономная стратегия с резервными планами."
}
```

**en.json:**
```json
"rubric": {
    "robot-design_beginner": "Robot is designed and performs basic tasks. Team can explain key design decisions.",
    "robot-design_intermediate": "Design improved through testing. Process documented in engineering notebook.",
    "robot-design_advanced": "Innovative design with clear rationale. Team demonstrates deep understanding of engineering process.",
    "coding_beginner": "Program runs the robot to complete missions. Code is organized and readable.",
    "coding_intermediate": "Uses sensors and conditionals. P-controller for precise movement.",
    "coding_advanced": "PID controller, modular PyBricks code. Route optimization algorithms.",
    "innovation_beginner": "Problem identified, solution proposed. Presentation is structured.",
    "innovation_intermediate": "Prototype tested with real users. Impact metrics available.",
    "innovation_advanced": "Impact First: quantifiable result in first 10 seconds. Scalable solution.",
    "robot-game_beginner": "Robot completes 3+ missions. Team knows rules and strategy.",
    "robot-game_intermediate": "Mission ROI analysis. Optimized routes. 150+ points.",
    "robot-game_advanced": "300+ points. Fully autonomous strategy with backup plans."
}
```

2. В компоненте замени хардкод `rubricTexts` на:
```tsx
const tRubric = useTranslations("rubric");
// при использовании:
const rubricText = tRubric(`${category}_${level}`);
```
Удали весь объект `rubricTexts`.

**Коммит:** `fix: localize rubric texts in LevelPageContent`

---

## Task F9 — Badge "Learning Paths" и "Highlight" хардкод

**Проблема:** `src/app/[locale]/page.tsx`:
- ~строка 397: `"Learning Paths"` badge
- ~строка 356: `"Highlight"` badge

**Что делать:** Добавить в `home` namespace:

**kk.json:**
```json
"badge_learning_paths": "Оқу бағыттары",
"badge_highlight": "Маңызды"
```

**ru.json:**
```json
"badge_learning_paths": "Образовательные треки",
"badge_highlight": "Важно"
```

**en.json:**
```json
"badge_learning_paths": "Learning Paths",
"badge_highlight": "Highlight"
```

Заменить хардкод на `t("badge_learning_paths")` и `t("badge_highlight")`.

**Коммит:** `fix: localize badge texts on homepage`

---

## Task F10 — ROI Calculator hardcoded placeholder

**Проблема:** `src/components/ROICalculator.tsx` строка 143: `placeholder="Mission M01..."`.

**Что делать:** Добавить в `roi` namespace:

kk: `"mission_placeholder": "M01 миссиясы..."`
ru: `"mission_placeholder": "Миссия M01..."`
en: `"mission_placeholder": "Mission M01..."`

Заменить на `t("mission_placeholder")`.

**Коммит:** `fix: localize ROI Calculator placeholder`

---

## Task F11 — Middleware → proxy (Next.js 16)

**Проблема:** Next.js 16 пишет: `The "middleware" file convention is deprecated. Please use "proxy" instead.`

**Что делать:**
1. Прочитай https://nextjs.org/docs/messages/middleware-to-proxy
2. Проверь совместимость с next-intl v4 — если next-intl ещё не поддерживает proxy, оставь как есть и добавь комментарий `// TODO: migrate to proxy when next-intl supports it`
3. Если поддерживает — переписать `src/middleware.ts` → `src/proxy.ts`

**Коммит:** `chore: migrate middleware to proxy (Next.js 16)` или `chore: add TODO for middleware-to-proxy migration`

---

## Task F12 — Level mapping в queries.ts

**Проблема:** `src/lib/queries.ts` строки 117-121 и 379-381: маппинг `beginner → "Начинающий"`. БД хранит русские названия.

**Что делать:**
1. Напиши SQL миграцию `fix_level_names.sql`:
```sql
UPDATE levels SET name = 'beginner' WHERE name = 'Начинающий';
UPDATE levels SET name = 'intermediate' WHERE name = 'Средний';
UPDATE levels SET name = 'advanced' WHERE name = 'Продвинутый';
```
2. Убери оба маппинга из `queries.ts` — используй slug напрямую.
3. Проверь все места где отображается имя уровня — там должен быть i18n (`courses.beginner`, `courses.intermediate`, `courses.advanced`), а не raw DB name.

**Коммит:** `fix: normalize level names in database to English slugs`

---

## Task F13 — Создать .env.example

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Коммит:** `chore: add .env.example`

---

## Task F14 — .gitignore для тяжёлых файлов

**Проблема:** `design/` (185MB), `pptx_temp/` (6MB) в git.

**Что делать:**
1. Добавить в `.gitignore`:
```
design/
pptx_temp/
```
2. Убрать из tracking:
```bash
git rm -r --cached design/
git rm -r --cached pptx_temp/
```
НЕ удаляй файлы физически.

**Коммит:** `chore: remove heavy design/ and pptx_temp/ from git tracking`

---

## Task F15 — npm audit fix

```bash
npm audit fix
```
Без `--force`. Только безопасные фиксы.

**Коммит:** `chore: fix npm audit vulnerabilities`

---

## Task F16 — Обновить BACKLOG.md

- "Next.js 14" → "Next.js 16"
- Добавить текущие задачи (CAT quiz, Digital Kazakhstan demo)
- Обновить статус

**Коммит:** `chore: update BACKLOG.md`

---

## ФИНАЛЬНЫЙ ЧЕКЛИСТ

Прогони после ВСЕХ задач:

```bash
# 1. TypeScript
npx tsc --noEmit

# 2. Build
npx next build

# 3. Ключи i18n синхронизированы:
node -e "
const flat = (o,p='') => Object.entries(o).reduce((a,[k,v]) => typeof v==='object' ? {...a,...flat(v,p+k+'.')} : {...a,[p+k]:1}, {});
const kk = flat(JSON.parse(require('fs').readFileSync('messages/kk.json','utf8')));
const ru = flat(JSON.parse(require('fs').readFileSync('messages/ru.json','utf8')));
const en = flat(JSON.parse(require('fs').readFileSync('messages/en.json','utf8')));
const all = new Set([...Object.keys(kk),...Object.keys(ru),...Object.keys(en)]);
const missing = [];
all.forEach(k => {
  if(!kk[k]) missing.push('kk: '+k);
  if(!ru[k]) missing.push('ru: '+k);
  if(!en[k]) missing.push('en: '+k);
});
if(missing.length) { console.log('MISSING KEYS:'); missing.forEach(m=>console.log(' -',m)); }
else console.log('All i18n keys synced (' + all.size + ' keys)');
"

# 4. Хардкод Cyrillic check:
grep -rn '"[А-Яа-яЁёІіҚқҮүҰұҺһӘәҒғӨө][^"]*"' src/app/ src/components/ --include="*.tsx" | grep -v "//\|className\|style\|key=\|alt=\|src=\|console"
```

Если всё чисто — `git push`.

---

## Task F17 — Presentation embed не работает (/embed → /preview)

**Проблема:** Файлы на Drive — загруженные .pptx, не нативные Google Slides. Google блокирует `/embed` для таких файлов → ошибка "Произошла ошибка" в iframe. Затрагивает ВСЕ 25 уроков на сайте.

**Что делать:**
В `src/app/[locale]/course/fll/page.tsx` функция `getEmbedUrl()` (строки 29-38):

БЫЛО:
```ts
const slides = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/embed`;
```

СТАЛО:
```ts
const slides = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/preview`;
```

Та же функция может быть в `src/app/[locale]/lessons/[slug]/page.tsx` — проверь и поменяй там тоже.

**Проверь глобально:**
```bash
grep -rn "/embed" src/ --include="*.tsx" | grep -i "presentation\|slides"
```

**Коммит:** `fix: use /preview instead of /embed for uploaded Google Slides pptx`

---

## Task F18 — RD-B01 и IP-B01: RU и KK ведут на один файл

**Проблема:** В `curriculum.csv` два урока имеют одинаковый presentation ID для RU и KK:
- RD-B01: обе ссылки → `1lQEwjkeX7zSEk4TM3eiSqJqri_Fmlkd8`
- IP-B01: обе ссылки → `1wyGXECxTYh3pe0jd_x2aIwerd0N43S4I`

Это значит казахские пользователи видят русскую презентацию.

**Что делать:** Спросить Арнура какие правильные KK presentation ID для этих двух уроков, обновить в curriculum.csv и перегнать `sync_csv.mjs`. Если казахских версий пока нет — оставить как есть, это не баг а missing content.

**Коммит:** `fix: correct KK presentation URLs for RD-B01 and IP-B01`

---

## Task F19 — Обновить curriculum.csv и перегнать sync_csv.mjs

**Что обновилось:**
- RD-B01 → Video RU: https://youtu.be/qgMmg71g38I
- RD-B03 → Video RU: https://youtu.be/9JCiSarPcbM
- RD-B04 → Video RU: https://youtu.be/VjfBVnr0Jsc
- RD-B05 → Video RU: https://youtu.be/VvWqK8KzC4g
- RD-B06 → Video RU: https://youtu.be/eKbhdTVMQq0
- RD-B07 → Video RU: https://youtu.be/r1cuhH0jH8Q
- RD-B08 → Video RU: https://youtu.be/RwJeINbfHH8 + Video KK: https://youtu.be/1AW7NciKpyA
- CV-02 → Video RU имеет 2 URL через пробел (sync берёт только первый)
- Файл почищен от 26 мусорных строк

**Что делать:**
1. Замени `curriculum.csv` в корне репо на почищенную версию (уже сделано)
2. Прогони sync:
```bash
node sync_csv.mjs
```
3. Проверь в Supabase что video_url обновились для RD-B01..RD-B08

**Коммит:** `chore: update curriculum.csv with RU Robot Design videos`

---

## Task F20 — Поддержка нескольких видео на один урок (CV-02)

**Проблема:** CV-02 имеет по 2 видео на каждом языке (RD-часть и IP-часть). В CSV они через запятую:
- Video RU: `https://youtu.be/B4ZI6ZM7-3M,https://youtu.be/-EdUyXHyldY`
- Video KK: `https://youtu.be/dN4BFhqEsc0,https://youtu.be/3auzZeJJ6j8`

Сейчас `sync_csv.mjs` берёт только первый URL.

**Что делать:**

### 1. sync_csv.mjs — сохранять все URL через запятую
Строки ~228-229, заменить:
```js
const cleanVideoRu = (videoUrlRu || '').split(/\s+/).filter(u => u.startsWith('http'))[0] || null;
const cleanVideoKk = (videoUrlKk || '').split(/\s+/).filter(u => u.startsWith('http'))[0] || null;
```
На:
```js
const cleanVideoRu = (videoUrlRu || '').split(/[\s,]+/).filter(u => u.startsWith('http')).join(',') || null;
const cleanVideoKk = (videoUrlKk || '').split(/[\s,]+/).filter(u => u.startsWith('http')).join(',') || null;
```

### 2. Frontend — рендерить несколько VideoPlayer если URL содержит запятую

В `src/app/[locale]/course/fll/page.tsx`, секция Video player embed (~строка 408):

Заменить рендер одного видео на:
```tsx
{activeLesson.video_url && (
  <>
    {activeLesson.video_url.split(',').map((url, idx) => (
      <div key={idx} className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
          <span className="text-xs font-medium text-slate-400">
            {t("video") || "Видео"}{activeLesson.video_url!.includes(',') ? ` ${idx + 1}` : ''}
          </span>
        </div>
        <VideoPlayer url={url.trim()} />
      </div>
    ))}
  </>
)}
```

Проверь также `src/app/[locale]/lessons/[slug]/page.tsx` — если там аналогичный рендер видео, обнови тоже.

**Коммит:** `feat: support multiple videos per lesson (comma-separated URLs)`
