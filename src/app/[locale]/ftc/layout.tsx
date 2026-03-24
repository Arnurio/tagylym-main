import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });
    return {
        title: t("ftc_title"),
        description: t("ftc_description"),
    };
}

export default function FTCLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
