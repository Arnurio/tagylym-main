"use client";

import { useEffect } from "react";

export function useVisitTracker() {
  useEffect(() => {
    const key = "tg_visit_logged";
    if (sessionStorage.getItem(key)) return;

    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_path: window.location.pathname }),
    })
      .then(() => sessionStorage.setItem(key, "1"))
      .catch(() => {});
  }, []);
}
