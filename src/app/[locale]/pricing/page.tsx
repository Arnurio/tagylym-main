import { useTranslations } from "next-intl";

const plans = [
    {
        name: "freeName",
        price: "0",
        features: [
            "freeFeat1",
            "freeFeat2",
            "freeFeat3",
        ],
        cta: "ctaStart",
        highlight: false,
    },
    {
        name: "teamName",
        price: "990",
        features: [
            "teamFeat1",
            "teamFeat2",
            "teamFeat3",
            "teamFeat4",
            "teamFeat5",
        ],
        cta: "ctaChoose",
        highlight: true,
    },
    {
        name: "coachName",
        price: "2490",
        features: [
            "coachFeat1",
            "coachFeat2",
            "coachFeat3",
            "coachFeat4",
            "coachFeat5",
            "coachFeat6",
        ],
        cta: "ctaChoose",
        highlight: false,
    },
];

export default function PricingPage() {
    const t = useTranslations("pricing");

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-white mb-3">{t("title")}</h1>
                    <p className="text-muted">{t("subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`glass-card p-8 relative overflow-hidden ${plan.highlight
                                ? "border-accent/30 shadow-lg shadow-accent/10"
                                : ""
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-beginner" />
                            )}

                            <h3 className="text-xl font-bold text-white mb-1">{t(plan.name as Parameters<typeof t>[0])}</h3>

                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-4xl font-black text-white">₸{plan.price}</span>
                                <span className="text-muted text-sm mb-1">{t("perMonth")}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-accent mt-0.5">✓</span>
                                        {t(feature as Parameters<typeof t>[0])}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${plan.highlight
                                    ? "gradient-brand text-white hover:opacity-90"
                                    : "bg-surface-lighter text-slate-300 hover:text-white hover:bg-surface-lighter/80"
                                    }`}
                            >
                                {t(plan.cta as Parameters<typeof t>[0])}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
