"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const presentations = [
  {
    slug: "fll-robot-design",
    title: "FLL — Robot Design",
    competition: "FLL",
    color: "#0C2D48",
    icon: "🤖",
    lessonCount: 8,
  },
  {
    slug: "fll-innovation-project",
    title: "FLL — Innovation Project",
    competition: "FLL",
    color: "#0D9488",
    icon: "💡",
    lessonCount: 6,
  },
  {
    slug: "fll-robot-game",
    title: "FLL — Robot Game",
    competition: "FLL",
    color: "#0C2D48",
    icon: "🎮",
    lessonCount: 5,
  },
  {
    slug: "fll-core-values",
    title: "FLL — Core Values",
    competition: "FLL",
    color: "#0D9488",
    icon: "⭐",
    lessonCount: 3,
  },
  {
    slug: "ftc-first-tech-challenge",
    title: "FTC — FIRST Tech Challenge",
    competition: "FTC",
    color: "#0C2D48",
    icon: "🔧",
    lessonCount: 4,
  },
  {
    slug: "fgc-first-global-challenge",
    title: "FGC — FIRST Global Challenge",
    competition: "FGC",
    color: "#F97316",
    icon: "🌍",
    lessonCount: 4,
  },
];

export default function PresentationsPage() {
  const t = useTranslations("presentations");

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                href={`/presentations/${p.slug}` as "/"}
                className="group flex flex-col rounded-2xl border border-white/5 bg-[#0F172A]/60 backdrop-blur overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300"
              >
                {/* Color accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: p.color }}
                />

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Icon + competition badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{p.icon}</span>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-md text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.competition}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-white font-semibold text-lg leading-snug group-hover:text-[#8B5CF6] transition-colors">
                    {p.title}
                  </h2>

                  {/* Lesson count */}
                  <p className="text-slate-400 text-sm">
                    {p.lessonCount} {t("lessons_count")}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <span className="text-sm font-medium text-[#8B5CF6] group-hover:underline">
                      {t("view")} →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
