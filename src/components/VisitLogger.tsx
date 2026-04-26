"use client";

import { useVisitTracker } from "@/hooks/useVisitTracker";

export default function VisitLogger() {
  useVisitTracker();
  return null;
}
