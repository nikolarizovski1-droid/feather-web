import { Check, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PricingTeaser() {
  const t = await getTranslations("PricingTeaser");

  type PlanMsg = {
    name: string;
    price: string;
    description: string;
    cta: string;
    features: string[];
  };

  const plansData = t.raw("plans") as PlanMsg[];

  const plans = plansData.map((plan, i) => ({
    ...plan,
    period: plan.price === t("plans.0.price") && plan.price.toLowerCase().includes("free") || plan.price === "Free" || plan.price === "Бесплатно"
      ? t("forever")
      : t("perMonth"),
    ctaHref: i === 0 ? "/signup" : i === 1 ? "/signup?plan=growth" : "/signup?plan=pro",
    highlighted: i === 1,
    badge: i === 1 ? t("mostPopular") : undefined,
    showTrialNote: i > 0,
  }));

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
          >
            {t("eyebrow")}
          </p>
          <h2
            id="pricing-heading"
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-08 tracking-tight mb-5"
          >
            {t("title")}
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="160"
            className="text-lg text-ink-05 leading-relaxed"
          >
            {t("description")}
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              data-reveal="scale"
              data-reveal-delay={120 + index * 100}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                plan.highlighted
                  ? "bg-card border-2 border-brand/50 shadow-lg"
                  : "bg-card border border-black/5 shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-05 mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-4xl font-bold text-ink-08">
                    {plan.price}
                  </span>
                  <span className="text-sm text-ink-05 mb-1.5">
                    / {plan.period}
                  </span>
                </div>
                <p className="text-sm text-ink-05 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <Check size={10} className="text-brand" />
                    </div>
                    <span className="text-sm text-ink-05 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                href={plan.ctaHref}
                variant={plan.highlighted ? "primary" : "ghost-light"}
                className="w-full"
              >
                {plan.cta}
              </Button>

              {plan.showTrialNote && plan.highlighted && (
                <p className="text-[11px] text-ink-05/60 text-center -mt-3 leading-snug">
                  {t("trialNote")}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trial guarantee banner */}
        <div
          data-reveal="up"
          data-reveal-delay="400"
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-black/5 bg-ink-07 px-6 py-4 max-w-2xl mx-auto"
        >
          <ShieldCheck size={20} className="shrink-0 text-brand" />
          <p className="text-sm text-ink-05 text-center sm:text-left">
            {t.rich("trialGuarantee", {
              strong: (chunks) => (
                <strong className="text-ink-08 font-semibold">{chunks}</strong>
              ),
            })}
          </p>
        </div>

        {/* Compare link */}
        <div
          data-reveal="up"
          data-reveal-delay="460"
          className="mt-6 text-center"
        >
          <Link
            href="/pricing"
            className="text-sm text-ink-05 hover:text-ink-08 transition-colors inline-flex items-center gap-1.5"
          >
            {t("compareAllFeatures")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
