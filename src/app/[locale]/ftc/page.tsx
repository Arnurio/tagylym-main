"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";

const DISCIPLINE_CARDS = [
    { key: "d1", color: "#3B82F6" },
    { key: "d2", color: "#F97316" },
    { key: "d3", color: "#22C55E" },
    { key: "d4", color: "#8B5CF6" },
] as const;

const COMING_ITEMS = [
    "coming_1",
    "coming_2",
    "coming_3",
    "coming_4",
    "coming_5",
] as const;

const RESOURCES = [
    {
        key: "r1_label",
        url: "https://www.firstinspires.org/programs/ftc/",
    },
    {
        key: "r2_label",
        url: "https://ftc-resources.firstinspires.org/ftc/game",
    },
    {
        key: "r3_label",
        url: "https://www.gobilda.com/ftc-starter-bot-resource-guide-decode/",
    },
] as const;

export default function FTCPage() {
    const t = useTranslations("ftc");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            await supabase.from("waitlist").insert({ email: email.trim(), competition: "ftc" });
            setSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
            {/* === Competition Header === */}
            <div className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1">
                        {t("competition")}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-1 leading-tight">
                        {t("season")}
                    </h1>
                    <p className="text-base text-[#6B7280] italic mb-4">
                        {t("tagline")}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                        <span className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-full px-3 py-1 font-medium">
                            {t("age_range")}
                        </span>
                        <span className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-full px-3 py-1 font-medium">
                            {t("parts_kit")}
                        </span>
                        <span className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-full px-3 py-1 font-medium">
                            {t("programming")}
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
                {/* === Discipline Cards === */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {DISCIPLINE_CARDS.map(({ key, color }) => (
                            <div
                                key={key}
                                className="relative bg-white rounded-xl border border-[#E5E7EB] p-4 opacity-100 hover:opacity-90 transition-opacity"
                                style={{ cursor: "default" }}
                            >
                                {/* "Скоро" badge */}
                                <span
                                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ backgroundColor: color }}
                                >
                                    {t("discipline_soon_badge")}
                                </span>

                                {/* Colour accent bar */}
                                <div
                                    className="w-8 h-1 rounded-full mb-3"
                                    style={{ backgroundColor: color }}
                                />

                                <h3
                                    className="text-sm font-bold mb-2 leading-snug"
                                    style={{ color }}
                                >
                                    {t(`${key}_title` as Parameters<typeof t>[0])}
                                </h3>
                                <p className="text-xs text-[#6B7280] leading-[1.5]">
                                    {t(`${key}_desc` as Parameters<typeof t>[0])}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === What's Coming === */}
                <section className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                    <h2 className="text-base font-bold text-[#1A1A1A] mb-4">
                        {t("coming_section")}
                    </h2>
                    <ul className="space-y-2">
                        {COMING_ITEMS.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-3 text-sm text-[#374151]"
                            >
                                <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                                </span>
                                {t(item as Parameters<typeof t>[0])}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* === Key Resources === */}
                <section>
                    <h2 className="text-base font-bold text-[#1A1A1A] mb-3">
                        {t("resources_section")}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {RESOURCES.map(({ key, url }) => (
                            <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#2563EB]/30 transition-colors"
                            >
                                {t(key as Parameters<typeof t>[0])} →
                            </a>
                        ))}
                    </div>
                </section>

                {/* === Waitlist CTA === */}
                <section className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <h2 className="text-base font-bold text-[#1A1A1A] mb-4">
                        {t("waitlist_title")}
                    </h2>
                    {submitted ? (
                        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#16A34A] text-sm font-medium px-4 py-3 rounded-lg">
                            {t("waitlist_success")}
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-3 max-w-md"
                        >
                            <input
                                type="email"
                                required
                                placeholder={t("waitlist_placeholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A1A] placeholder:text-[#9CA3AF] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-[#F97316] hover:bg-orange-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                                {t("waitlist_button")}
                            </button>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}
