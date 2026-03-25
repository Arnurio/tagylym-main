"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const presentations: Record<string, { title: string; description: string; color: string; driveUrl: string }> = {
  "fll-innovation-project": {
    title: "FLL — Innovation Project",
    description: "Инновациялық жоба бойынша сабақтар",
    color: "#0D9488",
    driveUrl: "https://drive.google.com/drive/folders/1q97GXyl8q142NNbf-QnTbZ7sPWuY2JlW"
  },
  "fll-robot-design": {
    title: "FLL — Robot Design",
    description: "Роботты жобалау бойынша сабақтар",
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1aS5E_Ks_TRVm3f_3Mpfx10kT9oMTkjtV"
  },
  "fll-robot-game": {
    title: "FLL — Robot Game",
    description: "Робот ойыны бойынша сабақтар",
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1v1SIBoFZveA5oAZ1YuXKO9DQ-wWZ3RyO"
  },
  "fll-core-values": {
    title: "FLL — Core Values",
    description: "Негізгі құндылықтар бойынша сабақтар",
    color: "#0D9488",
    driveUrl: "https://drive.google.com/drive/folders/1NTeUiKgi0MKiv5HzaaDGMCdYo3NtHgK_"
  },
  "ftc-first-tech-challenge": {
    title: "FTC — FIRST Tech Challenge",
    description: "Robot Engineering, Coding, Inspire Awards бойынша сабақтар",
    color: "#0C2D48",
    driveUrl: "https://drive.google.com/drive/folders/1KEqWvCpG60qXkUGUPCXDp9zB4LLzXCxU"
  },
  "fgc-first-global-challenge": {
    title: "FGC — FIRST Global Challenge",
    description: "Robot Game, Game Project, Awards бойынша сабақтар",
    color: "#F97316",
    driveUrl: "https://drive.google.com/drive/folders/1gEiF642sSXBPczzOFvvCe9g6qhdSLY3X"
  }
};

function convertToEmbedUrl(driveUrl: string): string {
  // Convert Google Drive folder URL to embeddable format
  // https://drive.google.com/drive/folders/FOLDER_ID → https://drive.google.com/embeddedfolderview?id=FOLDER_ID#list
  const match = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/embeddedfolderview?id=${match[1]}#list`;
  }
  return driveUrl;
}

export default function PresentationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const track = presentations[slug];
  const t = useTranslations("presentations");

  if (!track) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0C2D48' }}>
          Презентация табылмады
        </h1>
        <p className="text-muted-foreground mb-8">
          Сіз іздеген презентация жоқ немесе жойылған.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0D9488' }}
        >
          Басты бетке қайту
        </Link>
      </div>
    );
  }

  const embedUrl = convertToEmbedUrl(track.driveUrl);

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
            <p className="text-white/80 text-sm mt-1">{track.description}</p>
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
            Google Drive-да ашу
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
