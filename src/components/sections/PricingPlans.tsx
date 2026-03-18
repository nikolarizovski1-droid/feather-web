"use client";

import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

type Billing = "monthly" | "annual";

export default function PricingPlans() {
  const t = useTranslations("PricingPlans");
  const [billing, setBilling] = useState<Billing>("monthly");

  type PlanMsg = {
    name: string;
    monthlyPrice: string;
    annualPrice: string;
    description: string;
    cta: string;
    features: string[];
  };

  const plansData = t.raw("plans") as PlanMsg[];

  const plans = plansData.map((plan, i) => ({
    ...plan,
    period: t("perMonth"),
    ctaHref: (b: Billing) =>
      i === 0 ? "/signup" : i === 1 ? `/signup?plan=growth&billing=${b}` : `/signup?plan=pro&billing=${b}`,
    highlighted: i === 1,
    badge: i === 1 ? t("mostPopular") : undefined,
    showTrial: i > 0,
  }));

  return (
    <section className="pb-24 lg:pb-32 bg-ink-08" aria-label="Pricing plans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Billing toggle */}
        <div
          data-reveal="up"
          className="flex items-center justify-center mb-14"
        >
          <div className="relative inline-flex items-center rounded-full bg-ink-07 p-1 gap-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                billing === "monthly"
                  ? "bg-card text-white shadow-sm"
                  : "text-ink-05 hover:text-white/70"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                billing === "annual"
                  ? "bg-card text-white shadow-sm"
                  : "text-ink-05 hover:text-white/70"
              }`}
            >
              {t("annual")}
              <span className="inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent leading-none">
                {t("save20")}
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const price =
              billing === "annual"
                ? plansData[index].annualPrice
                : plansData[index].monthlyPrice;
            const isFree =
              plansData[index].monthlyPrice === "Free" ||
              plansData[index].monthlyPrice === "Бесплатно";
            const isAnnualPaid = billing === "annual" && !isFree;

            return (
              <div
                key={plan.name}
                data-reveal="scale"
                data-reveal-delay={100 + index * 100}
                className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                  plan.highlighted
                    ? "bg-ink-07 border-2 border-brand/50 shadow-[0_0_50px_rgba(255,96,100,0.1)]"
                    : "bg-card border border-white/5"
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
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-white">
                      {price}
                    </span>
                    {!isFree && (
                      <span className="text-sm text-ink-05 mb-1.5">
                        / {plan.period}
                      </span>
                    )}
                  </div>
                  {isAnnualPaid && (
                    <p className="text-xs text-ink-05 mb-2">
                      {t("billedAnnually", { price: plansData[index].monthlyPrice })}
                    </p>
                  )}
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
                      <span className="text-sm text-white/70 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  href={plan.ctaHref(billing)}
                  variant={plan.highlighted ? "primary" : "ghost"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                {plan.showTrial && (
                  <p className="text-[11px] text-white/40 text-center -mt-3 leading-snug">
                    {t("trialNote")}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Trial guarantee banner */}
        <div
          data-reveal="up"
          data-reveal-delay="400"
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-white/5 bg-ink-07/40 px-6 py-4 max-w-2xl mx-auto"
        >
          <ShieldCheck size={20} className="shrink-0 text-brand" />
          <p className="text-sm text-white/60 text-center sm:text-left">
            {t.rich("trialGuarantee", {
              strong: (chunks) => (
                <strong className="text-white font-semibold">{chunks}</strong>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
