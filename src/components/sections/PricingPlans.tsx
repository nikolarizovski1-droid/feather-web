"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { events } from "@/lib/analytics";
import type {
  Plan,
  PlanDuration,
  PlanKey,
  PlansApiResponse,
} from "@/types/pricing";
import { getLocalized } from "@/lib/i18n-helpers";

type PlansByTier = Record<PlanKey, Record<PlanDuration, Plan>>;

const TIER_ORDER: PlanKey[] = ["basic", "standard", "premium"];
const DURATIONS: PlanDuration[] = ["1m", "6m", "1y"];

function computeSavingsPercent(
  monthlyAmount: number,
  bundleAmount: number,
  months: number,
): number {
  const fullPrice = monthlyAmount * months;
  if (fullPrice <= 0) return 0;
  return Math.round(((fullPrice - bundleAmount) / fullPrice) * 100);
}

interface PricingPlansProps {
  plans: PlansApiResponse | null;
  locale: string;
}

export default function PricingPlans({ plans, locale }: PricingPlansProps) {
  const t = useTranslations("PricingPlans");
  const [duration, setDuration] = useState<PlanDuration>("1m");

  useEffect(() => {
    events.pricingView();
  }, []);

  const grouped = useMemo<PlansByTier | null>(() => {
    if (!plans) return null;

    const map = {} as PlansByTier;
    for (const plan of plans.plans) {
      const key = plan.plan_key as PlanKey;
      if (!map[key]) map[key] = {} as Record<PlanDuration, Plan>;
      map[key][plan.duration as PlanDuration] = plan;
    }
    return map;
  }, [plans]);

  const savings = useMemo(() => {
    if (!grouped) return { "6m": 0, "1y": 0 };

    const ref = grouped[TIER_ORDER[1]];
    if (!ref) return { "6m": 0, "1y": 0 };

    const monthly = ref["1m"]?.price.amount ?? 0;
    return {
      "6m": computeSavingsPercent(monthly, ref["6m"]?.price.amount ?? 0, 6),
      "1y": computeSavingsPercent(monthly, ref["1y"]?.price.amount ?? 0, 12),
    };
  }, [grouped]);

  if (!grouped) {
    return (
      <section className="pb-24 lg:pb-32 bg-surface" aria-label="Pricing plans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-ink-05">{t("apiError")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 lg:pb-32 bg-surface" aria-label="Pricing plans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Billing toggle */}
        <div
          data-reveal="up"
          className="flex items-center justify-center mb-14"
        >
          <div className="relative inline-flex items-center rounded-full bg-ink-07 p-1 gap-1 shadow-sm">
            {DURATIONS.map((d) => {
              const label =
                d === "1m"
                  ? t("monthly")
                  : d === "6m"
                    ? t("sixMonths")
                    : t("annual");
              const savePct = d === "6m" ? savings["6m"] : d === "1y" ? savings["1y"] : 0;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDuration(d);
                    events.planToggle(d);
                  }}
                  className={`relative flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    duration === d
                      ? "bg-card text-ink-08 shadow-sm"
                      : "text-ink-05 hover:text-ink-08"
                  }`}
                >
                  {label}
                  {savePct > 0 && (
                    <span className="inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent leading-none">
                      {t("savePercent", { percent: savePct })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIER_ORDER.map((tierKey, index) => {
            const tierPlans = grouped[tierKey];
            if (!tierPlans) return null;

            const activePlan = tierPlans[duration];
            if (!activePlan) return null;

            const monthlyPlan = tierPlans["1m"];
            const isHighlighted = activePlan.plan_tier === 2;
            const name = getLocalized(activePlan.name_translations, locale);
            const tierLabel = name.split(" - ")[0] || name;
            const description = getLocalized(activePlan.description_translations, locale);

            // Only show features that are unique to this tier.
            // For Standard and Premium, this avoids re-listing features already included from lower tiers.
            const displayFeatures =
              activePlan.direct_features?.length > 0
                ? activePlan.direct_features
                : activePlan.features;

            const billingNote =
              duration === "6m"
                ? t("billedSemiAnnually", { price: monthlyPlan?.price.formatted ?? "" })
                : duration === "1y"
                  ? t("billedAnnually", { price: monthlyPlan?.price.formatted ?? "" })
                  : null;

            return (
              <div
                key={tierKey}
                data-reveal="scale"
                data-reveal-delay={100 + index * 100}
                className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                  isHighlighted
                    ? "bg-card border-2 border-brand/50 shadow-lg"
                    : "bg-card border border-black/5 shadow-sm"
                }`}
              >
                {/* Badge */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                      {t("mostPopular")}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-05 mb-3">
                    {tierLabel}
                  </h3>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-ink-08">
                      {activePlan.price.formatted}
                    </span>
                    <span className="text-sm text-ink-05 mb-1.5">
                      / {duration === "1m" ? t("perMonth") : duration === "6m" ? t("perSixMonths") : t("perYear")}
                    </span>
                  </div>
                  {billingNote && (
                    <p className="text-xs text-ink-05 mb-2">{billingNote}</p>
                  )}
                  <p className="text-sm text-ink-05 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {displayFeatures.map((feature) => {
                    const featureLabel = getLocalized(feature.title_translations, locale);
                    return (
                      <li key={feature.name} className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                          <Check size={10} className="text-brand" />
                        </div>
                        <span className="text-sm text-ink-05 leading-snug">
                          {featureLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
                <Button
                  href={`/signup?plan=${tierKey}&billing=${duration}`}
                  variant={isHighlighted ? "primary" : "ghost-light"}
                  className="w-full"
                >
                  {t("cta")}
                </Button>

                <p className="text-[11px] text-ink-05/60 text-center -mt-3 leading-snug">
                  {t("trialNote")}
                </p>
              </div>
            );
          })}
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
      </div>
    </section>
  );
}
