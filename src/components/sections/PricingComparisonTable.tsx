import React from "react";
import { Check, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Plan, PlansApiResponse } from "@/types/pricing";
import { getLocalized } from "@/lib/i18n-helpers";
import MotionFade from "@/components/motion/MotionFade";

const TIER_ORDER = ["basic", "standard", "premium"] as const;

function Cell({ value }: { value: boolean }) {
  if (value) {
    return (
      <div className="flex justify-center">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10">
          <Check size={11} className="text-brand" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <Minus size={16} className="text-ink-06" />
    </div>
  );
}

function getTierLabel(plan: Plan, locale: string): string {
  const name = getLocalized(plan.name_translations, locale);
  return name.split(" - ")[0] || name;
}

interface ComparisonCategory {
  title: string;
  rows: {
    label: string;
    cells: boolean[];
  }[];
}

function buildComparisonData(
  monthlyPlans: Plan[],
  locale: string,
): ComparisonCategory[] {
  const featureNameSets = monthlyPlans.map(
    (p) => new Set(p.features.map((f) => f.name)),
  );

  return monthlyPlans.map((plan, tierIdx) => ({
    title: getTierLabel(plan, locale),
    rows: plan.direct_features.map((df) => ({
      label: getLocalized(df.title_translations, locale),
      cells: featureNameSets.map((set) => set.has(df.name)),
    })),
  }));
}

interface PricingComparisonTableProps {
  plans: PlansApiResponse | null;
  locale: string;
}

export default async function PricingComparisonTable({
  plans,
  locale,
}: PricingComparisonTableProps) {
  const t = await getTranslations("PricingComparisonTable");

  if (!plans) {
    return (
      <section className="py-24 lg:py-32 bg-surface" aria-label="Feature comparison">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-ink-05">{t("apiError")}</p>
        </div>
      </section>
    );
  }

  const monthlyPlans = TIER_ORDER.map((key) =>
    plans.plans.find((p) => p.plan_key === key && p.duration === "1m"),
  ).filter((p): p is Plan => p != null);

  if (monthlyPlans.length === 0) return null;

  const categories = buildComparisonData(monthlyPlans, locale);

  return (
    <section className="py-24 lg:py-32 bg-surface" aria-label="Feature comparison">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <MotionFade direction="up">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand mb-3">
              {t("eyebrow")}
            </p>
          </MotionFade>
          <MotionFade direction="up" delay={0.08}>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-08 tracking-tight">
              {t("title")}
            </h2>
          </MotionFade>
        </div>

        {/* Table */}
        <MotionFade direction="up" delay={0.16}>
          <div className="overflow-x-auto rounded-2xl border border-black/5 shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-black/8 bg-ink-07">
                  <th className="py-5 pl-6 pr-4 text-sm font-semibold text-ink-05 w-1/2">
                    {t("featureHeader")}
                  </th>
                  {monthlyPlans.map((plan, i) => {
                    const label = getTierLabel(plan, locale);
                    const isMiddle = plan.plan_tier === 2;
                    const isLast = i === monthlyPlans.length - 1;
                    return (
                      <th
                        key={plan.plan_key}
                        className={`py-5 ${isLast ? "pl-4 pr-6" : "px-4"} text-center w-[16.66%]`}
                      >
                        <span className="inline-flex flex-col items-center">
                          <span
                            className={`text-sm font-semibold ${isMiddle ? "font-bold text-ink-08" : "text-ink-08/70"}`}
                          >
                            {label}
                          </span>
                          <span className="text-xs font-normal text-ink-05 mt-0.5">
                            {plan.price.formatted}
                            <span className="text-[10px]">/{t("perMonth")}</span>
                          </span>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {categories.map((category, catIndex) => (
                  <React.Fragment key={category.title}>
                    <tr
                      className={`border-b border-black/5 bg-ink-07/60 ${
                        catIndex > 0 ? "border-t border-black/8" : ""
                      }`}
                    >
                      <td
                        colSpan={1 + monthlyPlans.length}
                        className="py-3 pl-6 pr-4 text-xs font-bold uppercase tracking-widest text-brand/80"
                      >
                        {category.title}
                      </td>
                    </tr>

                    {category.rows.map((row, rowIndex) => (
                      <tr
                        key={row.label}
                        className={`border-b border-black/5 transition-colors hover:bg-black/[0.02] ${
                          rowIndex === category.rows.length - 1
                            ? "border-black/0"
                            : ""
                        }`}
                      >
                        <td className="py-4 pl-6 pr-4 text-sm text-ink-05 leading-snug">
                          {row.label}
                        </td>
                        {row.cells.map((hasFeature, cellIdx) => {
                          const isMiddle = monthlyPlans[cellIdx]?.plan_tier === 2;
                          const isLast = cellIdx === row.cells.length - 1;
                          return (
                            <td
                              key={cellIdx}
                              className={`py-4 ${isLast ? "pl-4 pr-6" : "px-4"} text-center ${
                                isMiddle ? "bg-brand/[0.03]" : ""
                              }`}
                            >
                              <Cell value={hasFeature} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </MotionFade>

        <MotionFade direction="up" delay={0.24}>
          <p className="mt-5 text-center text-xs text-ink-06">
            {t("priceNote")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
