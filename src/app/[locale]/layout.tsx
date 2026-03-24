import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "ru" | "en")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} className="dark">
            <body className="min-h-screen bg-surface text-slate-200 antialiased">
                <NextIntlClientProvider messages={messages}>
                    <Nav />
                    <main className="pt-16">{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
