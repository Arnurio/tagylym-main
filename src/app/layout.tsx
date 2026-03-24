import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tagylym — Robotics Education Platform",
  description:
    "Comprehensive robotics education platform for FIRST competition teams — FLL, FTC, and FGC. Video lessons, quizzes, checklists, and winning strategies.",
  keywords: [
    "robotics",
    "FIRST",
    "FLL",
    "FTC",
    "FGC",
    "LEGO",
    "education",
    "робототехника",
    "образование",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
