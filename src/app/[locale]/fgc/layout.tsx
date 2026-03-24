import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });
    return {
        title: t("fgc_title"),
        description: t("fgc_description"),
    };
}

export default function FGCLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
