"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

interface WaitlistFormProps {
    track: "ftc" | "fgc";
}

export default function WaitlistForm({ track }: WaitlistFormProps) {
    const t = useTranslations(track);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const { error } = await supabase.from("waitlist").insert([
                { email, track }
            ]);

            if (error) {
                if (error.code === "23505") { // Unique violation
                    setStatus("success"); // Act as success if already subscribed
                } else {
                    throw error;
                }
            } else {
                setStatus("success");
            }
        } catch (err) {
            console.error("Waitlist error:", err);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <p className="text-emerald-400 font-bold mb-1">🎉 {t("waitlist_success")}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("waitlist_placeholder")}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    disabled={status === "loading"}
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-95 whitespace-nowrap"
                >
                    {status === "loading" ? "..." : t("waitlist_button")}
                </button>
            </div>
            {status === "error" && (
                <p className="mt-3 text-red-400 text-xs font-bold animate-pulse text-center">
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    );
}
