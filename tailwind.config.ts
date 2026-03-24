import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                page: '#F5F5F5',
                card: '#FFFFFF',
                'text-main': '#1A1A1A',
                'text-muted': '#6B7280',
                'text-light': '#9CA3AF',
                blue: '#2563EB',
                'blue-light': '#EFF6FF',
                'border-card': '#E5E7EB',
                'border-selected': '#2563EB',
                'hero-from': '#1E3A8A',
                'hero-to': '#3B82F6',
                'star-beginner': '#2563EB',
                'star-intermediate': '#D97706',
                'star-advanced': '#16A34A',
                deepBlue: '#0C2D48',
                teal: '#0D9488',
                orange: '#F97316',
                sand: '#F0F4F8',
                // Minimalist Modern Tokens
                background: '#FAFAFA',
                foreground: '#0F172A',
                muted: '#F1F5F9',
                'muted-foreground': '#64748B',
                accent: '#0052FF',
                'accent-secondary': '#4D7CFF',
                border: '#E2E8F0',
                ring: '#0052FF',
            },
            fontFamily: {
                calistoga: ['"Calistoga"', 'Georgia', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
                inter: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'accent': '0 4px 14px rgba(0, 82, 255, 0.25)',
                'accent-lg': '0 8px 24px rgba(0, 82, 255, 0.35)',
            }
        },
    },
    plugins: [],
};
export default config;
