"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

export default function FeedbackForm() {
    const t = useTranslations("resources");
    const tCommon = useTranslations("common");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from("feedback")
                .insert([formData]);

            if (insertError) {
                if (insertError.code === '42P01') {
                    setError("Database table 'feedback' not found. Please contact administrator.");
                } else {
                    throw insertError;
                }
                return;
            }

            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            console.error("Feedback submission error:", err);
            setError(t("feedback_error"));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="glass-card p-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg shadow-accent/10">
                    ✓
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{t("feedback_success")}</h3>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                    ← {t("feedback_submit")}
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
            
            <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                        {t("feedback_title")}
                    </h2>
                    <p className="text-slate-400 leading-relaxed max-w-lg">
                        {t("feedback_subtitle")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                                {t("feedback_name")}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={t("feedback_name_placeholder")}
                                className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                                {t("feedback_email")}
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t("feedback_email_placeholder")}
                                className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                            {t("feedback_subject")}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder={t("feedback_subject_placeholder")}
                            className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                            {t("feedback_message")}
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder={t("feedback_message_placeholder")}
                            className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-300 resize-none min-h-[120px]"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg animate-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-extrabold py-4 rounded-xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98] text-sm uppercase tracking-widest"
                    >
                        {loading ? tCommon("loading") : t("feedback_submit")}
                    </button>
                </form>
            </div>
        </div>
    );
}
