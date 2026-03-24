"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const t = useTranslations("nav");
    const tAuth = useTranslations("auth");
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) {
                    setError(signUpError.message);
                } else {
                    setSuccess(tAuth("successMsg"));
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message);
                } else {
                    router.push("/dashboard");
                }
            }
        } catch {
            setError(tAuth("errorDefault"));
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                        T
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        {isSignUp ? tAuth("createAccount") : t("login")}
                    </h1>
                    <p className="text-sm text-muted mt-2">{tAuth("subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-muted mb-1.5">{tAuth("email")}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-surface-lighter text-white text-sm rounded-lg px-4 py-3 border border-surface-lighter/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                            placeholder={tAuth("email_placeholder")}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1.5">
                            {tAuth("password")}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-surface-lighter text-white text-sm rounded-lg px-4 py-3 border border-surface-lighter/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading
                            ? tAuth("loading")
                            : isSignUp
                                ? tAuth("register")
                                : t("login")}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError("");
                                setSuccess("");
                            }}
                            className="text-sm text-accent hover:text-white transition-colors"
                        >
                            {isSignUp
                                ? tAuth("alreadyHaveAccount")
                                : tAuth("noAccount")}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted mt-6">
                    <Link href="/" className="text-accent hover:text-white transition-colors">
                        {tAuth("backToHome")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
