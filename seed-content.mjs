/**
 * seed-content.mjs — Insert full FLL curriculum content into Supabase.
 * Run with: node seed-content.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Level IDs (from seed.sql) ──────────────────────────
const L = {
    RD_BEG: "d1000000-0000-0000-0000-000000000001",
    RD_MID: "d1000000-0000-0000-0000-000000000002",
    RD_ADV: "d1000000-0000-0000-0000-000000000003",
    IN_BEG: "d1000000-0000-0000-0000-000000000004",
    IN_MID: "d1000000-0000-0000-0000-000000000005",
    IN_ADV: "d1000000-0000-0000-0000-000000000006",
    CD_BEG: "d1000000-0000-0000-0000-000000000007",
    CD_MID: "d1000000-0000-0000-0000-000000000008",
    CD_ADV: "d1000000-0000-0000-0000-000000000009",
    RG_BEG: "d1000000-0000-0000-0000-000000000010",
    RG_MID: "d1000000-0000-0000-0000-000000000011",
    RG_ADV: "d1000000-0000-0000-0000-000000000012",
};

// ═════════════════════════════════════════════════════════
// STEP 1 — QUIZZES (25 questions)
// ═════════════════════════════════════════════════════════

const quizzes = [
    // ── Robot Design — Beginner (3) ────────────────────
    {
        category: "robot-design", level: "beginner", type: "mcq",
        question: "Что даёт симметричное расположение колёс?",
        options: JSON.stringify(["Больше скорости", "Предсказуемое движение", "Меньше веса", "Ничего особенного"]),
        correct_answer: "Предсказуемое движение",
        tip: "Симметрия = одинаковое расстояние от центра тяжести до каждого колеса. Это ключ к точным поворотам.",
    },
    {
        category: "robot-design", level: "beginner", type: "mcq",
        question: "Что такое «пассивное вложение»?",
        options: JSON.stringify(["Вложение с мотором", "Вложение без мотора", "Вложение для захвата", "Вложение для толкания"]),
        correct_answer: "Вложение без мотора",
        tip: "Пассивные вложения проще в сборке и надёжнее. Начинайте с них, усложняйте по мере опыта.",
    },
    {
        category: "robot-design", level: "beginner", type: "open",
        question: "Что такое «жёсткое основание» и почему оно важно?",
        correct_answer: "Жёсткое основание — конструкция без люфтов и гибких соединений. Оно важно, потому что любая гибкость = непредсказуемое движение = потеря точности миссий.",
        tip: "Попроси ученика подёргать основание руками. Если что-то шевелится — это проблема.",
    },

    // ── Robot Design — Intermediate (2) ────────────────
    {
        category: "robot-design", level: "intermediate", type: "open",
        question: "Объясни формулу инновации: X → Y потому что Z. Приведи пример для вложения.",
        correct_answer: "X = стандартное решение (например, толкатель), Y = наш подход (захват сверху), Z = потому что это устраняет соскальзывание объекта при движении.",
        tip: "Если команда не может сформулировать Z — они не понимают, зачем сделали именно так. Это красный флаг для судей.",
    },
    {
        category: "robot-design", level: "intermediate", type: "mcq",
        question: "Что показывает ROI миссии?",
        options: JSON.stringify(["Сложность миссии", "Очки делённые на время выполнения", "Количество попыток", "Расстояние от базы"]),
        correct_answer: "Очки делённые на время выполнения",
        tip: "ROI > 0.6 — приоритет. 0.4–0.6 — рассмотреть. < 0.4 — пропустить или делать последней.",
    },

    // ── Robot Design — Advanced (2) ────────────────────
    {
        category: "robot-design", level: "advanced", type: "mcq",
        question: "Что такое «выравниватель» (aligner) и когда его используют?",
        options: JSON.stringify(["Датчик для навигации", "Физический упор для коррекции позиции робота", "Программный блок", "Тип вложения"]),
        correct_answer: "Физический упор для коррекции позиции робота",
        tip: "Выравниватель исправляет накопленную ошибку механически. Это надёжнее программной коррекции.",
    },
    {
        category: "robot-design", level: "advanced", type: "open",
        question: "Опиши систему пит-стопа: роли и цель.",
        correct_answer: "Капитан робота управляет роботом. Кодлид запускает программы. Пит-стоперы меняют вложения. Цель — смена вложения менее чем за 15 секунд.",
        tip: "Засеки время на тренировке. Если >20 сек — разбери, где теряется время.",
    },

    // ── Innovation Project — Beginner (2) ──────────────
    {
        category: "innovation", level: "beginner", type: "mcq",
        question: "Сколько проблем нужно исследовать перед выбором одной?",
        options: JSON.stringify(["1", "2", "3–5", "10"]),
        correct_answer: "3–5",
        tip: "Судьи проверяют: рассматривала ли команда альтернативы? Если исследовали только одну проблему — это BEGINNING по рубрике IDENTIFY.",
    },
    {
        category: "innovation", level: "beginner", type: "open",
        question: "Что должен содержать Plan проекта на уровне Beginner?",
        correct_answer: "Название проблемы, роли участников (у каждого своя), шаги исследования, даты.",
        tip: "Каждый участник должен знать свою роль. Судьи могут спросить любого.",
    },

    // ── Innovation Project — Intermediate (2) ──────────
    {
        category: "innovation", level: "intermediate", type: "mcq",
        question: "Что такое Iteration Log?",
        options: JSON.stringify(["Журнал тренировок", "Документ с 3+ итерациями, каждая с фидбеком и числовыми данными", "Список материалов", "Список командных ролей"]),
        correct_answer: "Документ с 3+ итерациями, каждая с фидбеком и числовыми данными",
        tip: "Без числовых данных до/после — это не итерация, это описание. Судьи ищут конкретику.",
    },
    {
        category: "innovation", level: "intermediate", type: "open",
        question: "Как должен выглядеть impact statement?",
        correct_answer: "Конкретная цифра + единица измерения + изменение. Например: «Наше решение сократит время ожидания с 45 до 12 минут для 200 пациентов в месяц».",
        tip: "Нет цифры = нет impact statement. Помоги команде найти или измерить данные.",
    },

    // ── Innovation Project — Advanced (2) ──────────────
    {
        category: "innovation", level: "advanced", type: "mcq",
        question: "Что должна содержать структура питча «Impact First»?",
        options: JSON.stringify(["Имена членов команды", "Цифровой результат воздействия в первом предложении", "Описание процесса исследования", "Список используемых материалов"]),
        correct_answer: "Цифровой результат воздействия в первом предложении",
        tip: "Судьи слушают десятки питчей. Если цифра не прозвучала в первых 10 секундах — вы уже потеряли их внимание.",
    },
    {
        category: "innovation", level: "advanced", type: "open",
        question: "Что такое mock judging и как его проводить?",
        correct_answer: "Симуляция судейства: 5 мин питч + 5 мин вопросы судей. Проводить минимум 3 раза с разными «судьями». Фиксировать вопросы, на которые команда не смогла ответить.",
        tip: "После каждого mock judging задай команде: какой вопрос был самым сложным? Это и есть зона роста.",
    },

    // ── Core Values (4, category=core-values) ──────────
    {
        category: "core-values", level: "beginner", type: "mcq",
        question: "Какой процент от Champion Award составляют Core Values?",
        options: JSON.stringify(["10%", "15%", "25%", "50%"]),
        correct_answer: "25%",
        tip: "Команды часто игнорируют CV, фокусируясь на роботе. Напомни: каждая сессия — это оценка CV.",
    },
    {
        category: "core-values", level: "intermediate", type: "open",
        question: "Как команда должна реагировать на конфликт между участниками?",
        correct_answer: "Признать разногласие, дать каждому высказаться, найти компромисс или проголосовать. Зафиксировать в командном дневнике.",
        tip: "Судьи могут спросить: «Были ли у вас разногласия и как вы их решили?» Готовь команду к этому вопросу.",
    },
    {
        category: "core-values", level: "beginner", type: "mcq",
        question: "Что означает принцип Inclusion в Core Values?",
        options: JSON.stringify(["Все участники должны уметь программировать", "Каждый участник вносит вклад и чувствует себя частью команды", "Команда должна выиграть", "Все участники одного возраста"]),
        correct_answer: "Каждый участник вносит вклад и чувствует себя частью команды",
        tip: "На судействе CV обращают внимание на то, говорят ли все участники, а не только лидер.",
    },
    {
        category: "core-values", level: "intermediate", type: "open",
        question: "Что такое командный дневник и зачем он нужен?",
        correct_answer: "Документ, где после каждой сессии фиксируется: что сделали, кто какую роль выполнял, что решили. Нужен как доказательство командной работы для судей CV.",
        tip: "Заполняй дневник прямо на сессии, не после. Через неделю детали забываются.",
    },

    // ── Coding — Beginner (3) ──────────────────────────
    {
        category: "coding", level: "beginner", type: "mcq",
        question: "Почему градусы надёжнее секунд для движения робота?",
        options: JSON.stringify(["Градусы быстрее", "Градусы не зависят от заряда батареи", "Секунды сложнее программировать", "Разницы нет"]),
        correct_answer: "Градусы не зависят от заряда батареи",
        tip: "Покажи ученику: запусти одну программу на полной батарее и на 50%. Разница в секундах очевидна. Разницы в градусах нет.",
    },
    {
        category: "coding", level: "beginner", type: "open",
        question: "Что такое «точка привязки» (anchor point) и зачем она нужна?",
        correct_answer: "Фиксированная точка на поле (стена, модель), от которой робот отталкивается перед миссией. Нужна для устранения накопленной ошибки навигации.",
        tip: "Без точек привязки ошибки накапливаются. Хорошая программа использует 2–3 точки привязки на маршрут.",
    },
    {
        category: "coding", level: "beginner", type: "mcq",
        question: "Что фиксируется в Code Log?",
        options: JSON.stringify(["Имена программистов", "Гипотезу, результат теста и изменение кода", "Только финальную программу", "Список миссий"]),
        correct_answer: "Гипотезу, результат теста и изменение кода",
        tip: "Code Log = научный метод применённый к программированию. Судьи COMMUNICATE проверяют именно это.",
    },

    // ── Coding — Intermediate (3) ──────────────────────
    {
        category: "coding", level: "intermediate", type: "open",
        question: "Объясни формулу P-контроллера. Что такое Kp и как его подобрать?",
        correct_answer: "Мощность мотора = Ошибка × Kp. Kp подбирается методом бисекции: начинаем с Kp=1, если робот колеблется — уменьшаем, если не реагирует — увеличиваем.",
        tip: "Попроси ученика нарисовать график ошибки. Если он видит осцилляцию — сразу понимает, что Kp слишком высокий.",
    },
    {
        category: "coding", level: "intermediate", type: "mcq",
        question: "Что такое метод бисекции при подборе Kp?",
        options: JSON.stringify(["Делить Kp пополам каждый раз", "Начать с крайних значений и сужать диапазон вдвое", "Увеличивать Kp на 1 каждый тест", "Использовать случайные значения"]),
        correct_answer: "Начать с крайних значений и сужать диапазон вдвое",
        tip: "Это универсальный метод поиска. Объясни его на примере угадывания числа от 1 до 100.",
    },
    {
        category: "coding", level: "intermediate", type: "open",
        question: "Как называть custom блоки и почему это важно?",
        correct_answer: "Имя должно описывать действие: ДвигатьсяДоСтены(), ЗахватитьОбъект(). Важно, потому что судьи COMMUNICATE просят объяснить любой блок. Непонятное название = провал на судействе.",
        tip: "Проверка: если другой участник команды видит имя блока — он должен понять что он делает без объяснений.",
    },

    // ── Coding — Advanced (2) ──────────────────────────
    {
        category: "coding", level: "advanced", type: "mcq",
        question: "Из каких трёх компонентов состоит PID-контроллер?",
        options: JSON.stringify(["Position, Integral, Direction", "Proportional, Integral, Derivative", "Power, Input, Distance", "Primary, Index, Data"]),
        correct_answer: "Proportional, Integral, Derivative",
        tip: "P = текущая ошибка, I = накопленная ошибка, D = скорость изменения ошибки. Каждый компонент решает свою проблему.",
    },
    {
        category: "coding", level: "advanced", type: "open",
        question: "Чем PyBricks отличается от блочного программирования SPIKE?",
        correct_answer: "PyBricks — это Python-библиотека для SPIKE/EV3. Даёт полный контроль над мотором, датчиками и логикой. Сложнее для начинающих, но позволяет реализовать PID, меню хаба, сложные алгоритмы.",
        tip: "На Advanced уровне судьи ожидают, что ученик может объяснить каждую строку кода. Если не может — вернись к блокам.",
    },
];

// ═════════════════════════════════════════════════════════
// STEP 2 — CHECKLIST ITEMS (60 items, 5 per level)
// ═════════════════════════════════════════════════════════

const checklistItems = [
    // Robot Design / Средний
    { level_id: L.RD_MID, text: "Реализовано минимум одно активное вложение", order: 1 },
    { level_id: L.RD_MID, text: "Используется формула инновации (X→Y потому что Z) в Журнале ролей", order: 2 },
    { level_id: L.RD_MID, text: "Test Log заполнен: гипотеза, результат, изменение", order: 3 },
    { level_id: L.RD_MID, text: "ROI посчитан для всех миссий команды", order: 4 },
    { level_id: L.RD_MID, text: "Все участники умеют менять вложение за <30 секунд", order: 5 },

    // Robot Design / Продвинутый
    { level_id: L.RD_ADV, text: "Реализовано 2+ вложения с системой быстрой смены", order: 1 },
    { level_id: L.RD_ADV, text: "Используется минимум один выравниватель", order: 2 },
    { level_id: L.RD_ADV, text: "План Б готов и протестирован", order: 3 },
    { level_id: L.RD_ADV, text: "Пит-стоп выполняется за <15 секунд", order: 4 },
    { level_id: L.RD_ADV, text: "Каждый участник может объяснить любое вложение судьям", order: 5 },

    // Innovation / Начинающий
    { level_id: L.IN_BEG, text: "Исследовано 3–5 проблем по теме сезона", order: 1 },
    { level_id: L.IN_BEG, text: "Выбрана одна проблема с обоснованием", order: 2 },
    { level_id: L.IN_BEG, text: "Project Plan заполнен с ролями для каждого участника", order: 3 },
    { level_id: L.IN_BEG, text: "Использованы минимум 3 источника информации", order: 4 },
    { level_id: L.IN_BEG, text: "Каждый участник знает, какую проблему решает команда", order: 5 },

    // Innovation / Средний
    { level_id: L.IN_MID, text: "Iteration Log содержит 3+ итерации", order: 1 },
    { level_id: L.IN_MID, text: "Каждая итерация имеет фидбек от 2+ разных источников", order: 2 },
    { level_id: L.IN_MID, text: "Есть числовые данные до/после для каждой итерации", order: 3 },
    { level_id: L.IN_MID, text: "Impact statement содержит конкретные цифры", order: 4 },
    { level_id: L.IN_MID, text: "Команда может объяснить почему выбрала именно это решение", order: 5 },

    // Innovation / Продвинутый
    { level_id: L.IN_ADV, text: "Проведено 3+ mock judging сессии", order: 1 },
    { level_id: L.IN_ADV, text: "Питч построен по структуре «Impact First»", order: 2 },
    { level_id: L.IN_ADV, text: "Партнёр или эксперт подтвердил решение", order: 3 },
    { level_id: L.IN_ADV, text: "Шкала энергии команды ≥3 перед судейством", order: 4 },
    { level_id: L.IN_ADV, text: "Любой участник может провести полный питч", order: 5 },

    // Coding / Начинающий
    { level_id: L.CD_BEG, text: "Измерена погрешность движения для нашего робота", order: 1 },
    { level_id: L.CD_BEG, text: "Все движения используют градусы, не секунды", order: 2 },
    { level_id: L.CD_BEG, text: "Используются минимум 2 точки привязки на маршрут", order: 3 },
    { level_id: L.CD_BEG, text: "Code Log заполнен для каждого теста", order: 4 },
    { level_id: L.CD_BEG, text: "Таблица гипотез ведётся для каждого изменения кода", order: 5 },

    // Coding / Средний
    { level_id: L.CD_MID, text: "Реализован P-контроллер для следования линии", order: 1 },
    { level_id: L.CD_MID, text: "Kp подобран методом бисекции и задокументирован", order: 2 },
    { level_id: L.CD_MID, text: "Все custom блоки имеют описательные имена", order: 3 },
    { level_id: L.CD_MID, text: "Используется метод бисекции маршрута для отладки", order: 4 },
    { level_id: L.CD_MID, text: "Каждый участник может объяснить логику P-контроллера", order: 5 },

    // Coding / Продвинутый
    { level_id: L.CD_ADV, text: "Реализован PID-контроллер (P+I+D)", order: 1 },
    { level_id: L.CD_ADV, text: "Программа написана на PyBricks", order: 2 },
    { level_id: L.CD_ADV, text: "Реализовано меню хаба для выбора маршрута", order: 3 },
    { level_id: L.CD_ADV, text: "Каждый участник может объяснить каждую строку кода судьям", order: 4 },
    { level_id: L.CD_ADV, text: "Code Log содержит документацию по PID-параметрам", order: 5 },

    // Robot Game / Начинающий
    { level_id: L.RG_BEG, text: "ROI посчитан для всех доступных миссий", order: 1 },
    { level_id: L.RG_BEG, text: "Поле разделено на 3–4 зоны", order: 2 },
    { level_id: L.RG_BEG, text: "Выбраны миссии с ROI > 0.6 как приоритетные", order: 3 },
    { level_id: L.RG_BEG, text: "Базовый маршрут протестирован минимум 5 раз", order: 4 },
    { level_id: L.RG_BEG, text: "Команда знает правила подсчёта очков для своих миссий", order: 5 },

    // Robot Game / Средний
    { level_id: L.RG_MID, text: "Есть Маршрут 1 (приоритетные миссии) и Маршрут 2 (запасной)", order: 1 },
    { level_id: L.RG_MID, text: "Система пит-стопа отработана: роли назначены", order: 2 },
    { level_id: L.RG_MID, text: "Смена вложения занимает <30 секунд", order: 3 },
    { level_id: L.RG_MID, text: "ROI-таблица актуализирована после каждого изменения маршрута", order: 4 },
    { level_id: L.RG_MID, text: "Команда прошла минимум 10 полных прогонов", order: 5 },

    // Robot Game / Продвинутый
    { level_id: L.RG_ADV, text: "План Б активируется автоматически если вложение упало", order: 1 },
    { level_id: L.RG_ADV, text: "Пит-стоп выполняется за <15 секунд стабильно", order: 2 },
    { level_id: L.RG_ADV, text: "Anti-crisis протокол известен всем участникам", order: 3 },
    { level_id: L.RG_ADV, text: "Счёт в лучшем прогоне ≥ 200 очков", order: 4 },
    { level_id: L.RG_ADV, text: "Команда может адаптировать маршрут прямо перед выходом на поле", order: 5 },
];

// ═════════════════════════════════════════════════════════
// STEP 3 — COURSES (4, Beginner only)
// ═════════════════════════════════════════════════════════

const courses = [
    {
        level_id: L.RD_BEG,
        title: "Основы конструирования",
        description: "Жёсткое основание, симметричные колёса, первое вложение",
        order: 1,
    },
    {
        level_id: L.IN_BEG,
        title: "Первый инновационный проект",
        description: "Выбор проблемы, роли команды, Project Plan",
        order: 1,
    },
    {
        level_id: L.CD_BEG,
        title: "Первые программы на SPIKE",
        description: "Градусы vs секунды, точки привязки, Code Log",
        order: 1,
    },
    {
        level_id: L.RG_BEG,
        title: "Стратегия игры роботов",
        description: "ROI формула, зоны поля, приоритизация миссий",
        order: 1,
    },
];

// ═════════════════════════════════════════════════════════
// RUN
// ═════════════════════════════════════════════════════════

async function main() {
    console.log("═══════════════════════════════════════");
    console.log(" Tagylym — Seed Full FLL Content");
    console.log("═══════════════════════════════════════");

    // 1. Delete old seed quizzes (the 3 we inserted before) to avoid duplicates
    console.log("\n⏳  Clearing old quiz seed data …");
    await supabase.from("quizzes").delete().in("id", [
        "f1000000-0000-0000-0000-000000000001",
        "f1000000-0000-0000-0000-000000000002",
        "f1000000-0000-0000-0000-000000000003",
    ]);

    // 2. Insert quizzes
    console.log(`⏳  Inserting ${quizzes.length} quizzes …`);
    const { error: qErr } = await supabase.from("quizzes").insert(quizzes);
    if (qErr) {
        console.error("❌  Quiz insert error:", qErr.message);
    } else {
        console.log(`✅  ${quizzes.length} quizzes inserted`);
    }

    // 3. Insert checklist items (don't duplicate existing RD_BEG ones)
    console.log(`⏳  Inserting ${checklistItems.length} checklist items …`);
    // Remove old RD_BEG items first
    await supabase.from("checklist_items").delete().in("id", [
        "e1000000-0000-0000-0000-000000000001",
        "e1000000-0000-0000-0000-000000000002",
        "e1000000-0000-0000-0000-000000000003",
        "e1000000-0000-0000-0000-000000000004",
        "e1000000-0000-0000-0000-000000000005",
    ]);
    const { error: cErr } = await supabase.from("checklist_items").insert(checklistItems);
    if (cErr) {
        console.error("❌  Checklist insert error:", cErr.message);
    } else {
        console.log(`✅  ${checklistItems.length} checklist items inserted`);
    }

    // 4. Insert courses
    console.log(`⏳  Inserting ${courses.length} courses …`);
    const { error: crErr } = await supabase.from("courses").insert(courses);
    if (crErr) {
        console.error("❌  Course insert error:", crErr.message);
    } else {
        console.log(`✅  ${courses.length} courses inserted`);
    }

    // 5. Re-insert RD_BEG checklist items (they're part of the 60 now)
    // Already included in checklistItems — RD_BEG was in the original seed,
    // but we only have 11 levels' items above. Let's add them back:
    const rdBegItems = [
        { level_id: L.RD_BEG, text: "Наш робот имеет симметричные колёса", order: 1 },
        { level_id: L.RD_BEG, text: "Используем жёсткое основание", order: 2 },
        { level_id: L.RD_BEG, text: "Все участники знают, как прикрепить базовое вложение", order: 3 },
        { level_id: L.RD_BEG, text: "Журнал ролей заполнен для каждой сессии", order: 4 },
        { level_id: L.RD_BEG, text: "Каждый член команды может собрать базового робота", order: 5 },
    ];
    const { error: rdErr } = await supabase.from("checklist_items").insert(rdBegItems);
    if (rdErr) {
        console.error("❌  RD_BEG checklist re-insert error:", rdErr.message);
    } else {
        console.log("✅  RD_BEG 5 checklist items re-inserted");
    }

    // ── Verify ─────────────────────────────────────────
    console.log("\n🔍  Verifying counts …");
    const [qCount, clCount, crCount] = await Promise.all([
        supabase.from("quizzes").select("id", { count: "exact", head: true }),
        supabase.from("checklist_items").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
    ]);

    console.log("\n╔═══════════════════════════════════╗");
    console.log("║       FINAL ROW COUNTS            ║");
    console.log("╠═══════════════════════════════════╣");
    console.log(`║  quizzes           ${String(qCount.count).padStart(4)}       ║`);
    console.log(`║  checklist_items   ${String(clCount.count).padStart(4)}       ║`);
    console.log(`║  courses           ${String(crCount.count).padStart(4)}       ║`);
    console.log("╚═══════════════════════════════════╝");

    console.log("\n🎉  Done!");
}

main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
});
