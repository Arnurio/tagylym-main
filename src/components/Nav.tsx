"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface NavLink {
    href: "/" | "/fll" | "/ftc" | "/fgc" | "/presentations/fll-innovation-project" | "/quiz" | "/resources" | "/dashboard";
    labelKey: "fll" | "ftc" | "fgc" | "presentations" | "quiz" | "resources" | "dashboard";
    authRequired?: boolean;
}

const NAV_LINKS: NavLink[] = [
    { href: "/fll", labelKey: "fll" },
    { href: "/ftc", labelKey: "ftc" },
    { href: "/fgc", labelKey: "fgc" },
    { href: "/presentations/fll-innovation-project", labelKey: "presentations" },
    { href: "/quiz", labelKey: "quiz" },
    { href: "/resources", labelKey: "resources" },
    { href: "/dashboard", labelKey: "dashboard", authRequired: true },
];

export default function Nav() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const tNav = useTranslations("nav");
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user: u } }) => {
            setUser(u ? { email: u.email ?? undefined } : null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ? { email: session.user.email ?? undefined } : null);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
    };

    const locales = [
        { code: 'kk', label: 'ҚАЗ' },
        { code: 'ru', label: 'РУС' },
        { code: 'en', label: 'ENG' },
    ];

    const switchLocale = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    const isActive = (href: string) => {
        const strippedPath = pathname.replace(`/${locale}`, '') || '/';
        if (href === '/') return strippedPath === '/';
        return strippedPath.startsWith(href);
    };

    const visibleLinks = NAV_LINKS.filter(link => !link.authRequired || user);

    return (
        <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#0C2D48', borderColor: '#0C2D48' }}>
            <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                {/* LEFT: Logo + wordmark */}
                <Link href={"/" as const} className="flex items-center gap-2 shrink-0">
                    <Image
                        src="/images/logo-tagylym.png"
                        alt="Tagylym"
                        width={28}
                        height={28}
                        className="h-7 w-7"
                        style={{ filter: 'invert(1)' }}
                        priority
                    />
                    <span className="text-sm font-semibold text-white">Tagylym</span>
                </Link>

                {/* CENTER: Navigation links (desktop) */}
                <div className="hidden lg:flex items-center gap-1 mx-4">
                    {visibleLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href as "/"}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                isActive(link.href)
                                    ? 'text-white underline decoration-[#8B5CF6]'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tNav(link.labelKey)}
                        </Link>
                    ))}
                </div>

                {/* RIGHT: Powered by + Lang switcher + Auth */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden xl:flex items-center gap-1.5 text-xs text-white/70">
                        Powered by
                        <Image
                            src="/images/logo-panheya.png"
                            alt="Panheya"
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                        Panheya
                    </span>

                    {/* Locale Switcher */}
                    <div className="flex items-center border border-white/20 rounded px-1 py-0.5 text-xs">
                        {locales.map((l, i) => (
                            <span key={l.code} className="flex items-center">
                                {i > 0 && <span className="text-white/30 mx-0.5">|</span>}
                                <button
                                    onClick={() => switchLocale(l.code)}
                                    className={`px-1 py-0.5 rounded transition-colors ${locale === l.code
                                        ? "text-white font-medium"
                                        : "text-white/50 hover:text-white"
                                        }`}
                                >
                                    {l.label}
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Auth (desktop) */}
                    {user ? (
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-xs text-white/70 max-w-[140px] truncate">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-red-400 hover:text-red-300 font-medium"
                            >
                                {tNav("logout")}
                            </button>
                        </div>
                    ) : (
                        <Link
                            href={"/auth/login" as const}
                            className="hidden md:inline text-xs px-3 py-1 rounded text-white hover:brightness-90 transition-all"
                            style={{ backgroundColor: '#0D9488' }}
                        >
                            {tNav("login")}
                        </Link>
                    )}

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden p-1 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 border-b p-4 shadow-lg space-y-1 z-50" style={{ backgroundColor: '#0C2D48', borderColor: '#0C2D48' }}>
                    {/* Navigation links */}
                    {visibleLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href as "/"}
                            className="block py-2 text-slate-300 hover:text-white border-b border-slate-700 text-sm font-medium transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {tNav(link.labelKey)}
                        </Link>
                    ))}

                    {/* Locale switcher (mobile) */}
                    <div className="pt-3 mt-2 border-t border-white/10">
                        <div className="flex items-center gap-1 border border-white/20 rounded px-1 py-0.5 text-xs w-fit">
                            {locales.map((l, i) => (
                                <span key={l.code} className="flex items-center">
                                    {i > 0 && <span className="text-white/30 mx-0.5">|</span>}
                                    <button
                                        onClick={() => { switchLocale(l.code); setIsOpen(false); }}
                                        className={`px-1.5 py-0.5 rounded ${locale === l.code ? "text-white font-medium" : "text-white/50"}`}
                                    >
                                        {l.label}
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Auth (mobile) */}
                    <div className="pt-3 border-t border-white/10">
                        {user ? (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">{user.email}</span>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="text-sm text-red-400 font-medium"
                                >
                                    {tNav("logout")}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={"/auth/login" as const}
                                className="block w-full text-center py-2 rounded-lg text-white text-sm font-medium hover:brightness-90 transition-all"
                                style={{ backgroundColor: '#0D9488' }}
                                onClick={() => setIsOpen(false)}
                            >
                                {tNav("login")}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
