/**
 * seed-sanity.mjs — Insert 4 placeholder lessons into Sanity CMS
 * Run with: node seed-sanity.mjs
 */
import { config } from "dotenv";

config({ path: ".env.local" });

const PROJECT_ID = "eb50c3xu";
const DATASET = "datasetnumber1";
const TOKEN = process.env.SANITY_API_TOKEN;
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;

const lessons = [
    {
        _type: "lesson",
        _id: "lesson-zhestkoe-osnovanie",
        title: "Жёсткое основание",
        slug: { _type: "slug", current: "zhestkoe-osnovanie" },
        courseSlug: "osnovy-konstruirovaniya",
        order: 1,
        isFree: true,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        content: [
            {
                _type: "block",
                _key: "b1",
                style: "h2",
                children: [{ _type: "span", _key: "s1", text: "Зачем нужно жёсткое основание?" }],
            },
            {
                _type: "block",
                _key: "b2",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s2",
                        text: "Жёсткое основание — это фундамент вашего робота. Любая гибкость в конструкции приводит к непредсказуемому движению и потере точности при выполнении миссий. В этом уроке мы разберём, как проверить жёсткость и что делать, если основание «гуляет».",
                    },
                ],
            },
            {
                _type: "block",
                _key: "b3",
                style: "h3",
                children: [{ _type: "span", _key: "s3", text: "Как проверить?" }],
            },
            {
                _type: "block",
                _key: "b4",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s4",
                        text: "Возьмите собранное основание двумя руками и попробуйте его скрутить. Если есть хоть малейший люфт — укрепляйте конструкцию дополнительными балками.",
                    },
                ],
            },
        ],
        tip: "Попроси ученика подёргать основание руками. Если что-то шевелится — это проблема.",
        rubricCriterion: "DESIGN",
        rubricLevel: "ACCOMPLISHED",
    },
    {
        _type: "lesson",
        _id: "lesson-simmetrichnye-kolyosa",
        title: "Симметричные колёса",
        slug: { _type: "slug", current: "simmetrichnye-kolyosa" },
        courseSlug: "osnovy-konstruirovaniya",
        order: 2,
        isFree: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        content: [
            {
                _type: "block",
                _key: "b1",
                style: "h2",
                children: [{ _type: "span", _key: "s1", text: "Почему симметрия важна?" }],
            },
            {
                _type: "block",
                _key: "b2",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s2",
                        text: "Симметричное расположение колёс обеспечивает предсказуемое движение робота. Когда расстояние от центра тяжести до каждого колеса одинаковое, повороты становятся точными и повторяемыми.",
                    },
                ],
            },
        ],
        tip: "Замерь расстояние от центра тяжести до каждого колеса линейкой прямо на уроке.",
        rubricCriterion: "DESIGN",
        rubricLevel: "ACCOMPLISHED",
    },
    {
        _type: "lesson",
        _id: "lesson-formula-roi",
        title: "Формула ROI",
        slug: { _type: "slug", current: "formula-roi" },
        courseSlug: "strategiya-igry-robotov",
        order: 1,
        isFree: true,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        content: [
            {
                _type: "block",
                _key: "b1",
                style: "h2",
                children: [{ _type: "span", _key: "s1", text: "Что такое ROI миссии?" }],
            },
            {
                _type: "block",
                _key: "b2",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s2",
                        text: "ROI (Return on Investment) миссии = Очки ÷ Время выполнения. Это формула, которая помогает приоритизировать миссии: сначала делаем те, где ROI максимальный.",
                    },
                ],
            },
            {
                _type: "block",
                _key: "b3",
                style: "h3",
                children: [{ _type: "span", _key: "s3", text: "Пороги ROI" }],
            },
            {
                _type: "block",
                _key: "b4",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s4",
                        text: "ROI > 0.6 — приоритетная миссия. 0.4–0.6 — рассмотреть. < 0.4 — пропустить или делать в последнюю очередь.",
                    },
                ],
            },
        ],
        tip: "ROI > 0.6 — приоритет. Считай ROI для каждой миссии до написания маршрута.",
        rubricCriterion: "IDENTIFY",
        rubricLevel: "EXCEEDS",
    },
    {
        _type: "lesson",
        _id: "lesson-kak-vybrat-problemu",
        title: "Как выбрать проблему",
        slug: { _type: "slug", current: "kak-vybrat-problemu" },
        courseSlug: "pervyy-innovatsionnyy-proekt",
        order: 1,
        isFree: true,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        content: [
            {
                _type: "block",
                _key: "b1",
                style: "h2",
                children: [{ _type: "span", _key: "s1", text: "Выбор проблемы для проекта" }],
            },
            {
                _type: "block",
                _key: "b2",
                style: "normal",
                children: [
                    {
                        _type: "span",
                        _key: "s2",
                        text: "По рубрике IDENTIFY, команда должна исследовать 3–5 проблем по теме сезона и выбрать одну с обоснованием. Если команда рассмотрела только одну проблему — это уровень BEGINNING.",
                    },
                ],
            },
        ],
        tip: "Если команда исследовала только 1 проблему — это BEGINNING по рубрике IDENTIFY.",
        rubricCriterion: "IDENTIFY",
        rubricLevel: "ACCOMPLISHED",
    },
];

async function main() {
    console.log("═══════════════════════════════════════");
    console.log(" Tagylym — Seed Sanity CMS Content");
    console.log("═══════════════════════════════════════");

    const mutations = lessons.map((doc) => ({
        createOrReplace: doc,
    }));

    console.log(`\n⏳  Inserting ${lessons.length} lessons into Sanity …`);

    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ mutations }),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error(`❌  Sanity API error (${res.status}):`, text);
        process.exit(1);
    }

    const result = await res.json();
    console.log(`✅  ${lessons.length} lessons inserted`);
    console.log("    IDs:", result.results?.map((r) => r.id).join(", "));

    // Verify
    console.log("\n🔍  Verifying …");
    const verifyRes = await fetch(
        `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(
            'count(*[_type == "lesson"])'
        )}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );
    const verifyData = await verifyRes.json();
    console.log(`    Lessons in Sanity: ${verifyData.result}`);

    console.log("\n🎉  Done!");
}

main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
});
