"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type LocaleDescriptions = { kk: string; ru: string; en: string };

const presentations: Record<string, { title: string; description: LocaleDescriptions; color: string; driveUrl: string }> = {
  "fll-innovation-project": {
    title: "FLL — Innovation Project",
    description: {
      kk: "Инновациялық жоба бойынша сабақтар",
      ru: "Уроки по инновационному проекту",
      en: "Lessons on the Innovation Project"
    },
    color: "#0D9488",
    driveUrl: "https://drive.google.com/drive/folders/1q97GXyl8q142NNbf-QnTbZ7sPWuY2JlW"
  },
  "fll-robot-design": {
    title: "FLL — Robot Design",
    description: {
      kk: "Роботты жобалау бойынша сабақтар",
      ru: "Уроки по дизайну робота",
      en: "Lessons on Robot Design"
    },
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1aS5E_Ks_TRVm3f_3Mpfx10kT9oMTkjtV"
  },
  "fll-robot-game": {
    title: "FLL — Robot Game",
    description: {
      kk: "Робот ойыны бойынша сабақтар",
      ru: "Уроки по игре робота",
      en: "Lessons on Robot Game"
    },
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1v1SIBoFZveA5oAZ1YuXKO9DQ-wWZ3RyO"
  },
  "fll-core-values": {
    title: "FLL — Core Values",
    description: {
      kk: "Негізгі құндылықтар бойынша сабақтар",
      ru: "Уроки по основным ценностям",
      en: "Lessons on Core Values"
    },
    color: "#0D9488",
    driveUrl: "https://drive.google.com/drive/folders/1NTeUiKgi0MKiv5HzaaDGMCdYo3NtHgK_"
  },
  "ftc-first-tech-challenge": {
    title: "FTC — FIRST Tech Challenge",
    description: {
      kk: "Robot Engineering, Coding, Awards бойынша сабақтар",
      ru: "Уроки по Robot Engineering, Coding и Awards",
      en: "Lessons on Robot Engineering, Coding, and Awards"
    },
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1KEqWvCpG60qXkUGUPCXDp9zB4LLzXCxU"
  },
  "fgc-first-global-challenge": {
    title: "FGC — FIRST Global Challenge",
    description: {
      kk: "Robot Game, Game Project, Awards бойынша сабақтар",
      ru: "Уроки по Robot Game, Game Project и Awards",
      en: "Lessons on Robot Game, Game Project, and Awards"
    },
    color: "#F97316",
    driveUrl: "https://drive.google.com/drive/folders/1gEiF642sSXBPczzOFvvCe9g6qhdSLY3X"
  }
};

function convertToEmbedUrl(driveUrl: string, locale: string): string {
  const match = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  const hl = locale === "kk" ? "ru" : locale;
  if (match) {
    return `https://drive.google.com/embeddedfolderview?id=${match[1]}&hl=${hl}#list`;
  }
  return driveUrl;
}

export default function PresentationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = (params.locale as string) || "kk";
  const track = presentations[slug];
  const t = useTranslations("presentations");

  if (!track) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0C2D48' }}>
          {t("not_found")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t("not_found_desc")}
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0D9488' }}
        >
          {t("back_home")}
        </Link>
      </div>
    );
  }

  const embedUrl = convertToEmbedUrl(track.driveUrl, locale);
  const description = track.description[locale as keyof LocaleDescriptions] || track.description.kk;

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="border-b border-border"
        style={{ backgroundColor: track.color }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href={"/#tracks" as "/"}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {t("back")}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {track.title}
            </h1>
            <p className="text-white/80 text-sm mt-1">{description}</p>
          </div>

          <a
            href={track.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t("open_drive")}
          </a>
        </div>
      </motion.div>

      {/* Embedded Drive viewer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full"
        style={{ height: 'calc(100vh - 160px)' }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          title={track.title}
          allow="autoplay"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </motion.div>
    </div>
  );
}
