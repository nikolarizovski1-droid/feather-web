import React from "react";
import { Check, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";

type CellValue = true | false | string;

interface FeatureRow {
  label: string;
  starter: CellValue;
  growth: CellValue;
  pro: CellValue;
}

interface Category {
  title: string;
  rows: FeatureRow[];
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10">
          <Check size={11} className="text-brand" />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <Minus size={16} className="text-ink-06" />
      </div>
    );
  }
  return (
    <span className="text-sm text-white/70 font-medium">{value}</span>
  );
}

export default async function PricingComparisonTable() {
  const t = await getTranslations("PricingComparisonTable");

  const categories = t.raw("categories") as Category[];

  return (
    <section className="py-24 lg:py-32 bg-surface" aria-label="Feature comparison">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
          >
            {t("eyebrow")}
          </p>
          <h2
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            {t("title")}
          </h2>
        </div>

        {/* Table */}
        <div
          data-reveal="up"
          data-reveal-delay="160"
          className="overflow-x-auto rounded-2xl border border-white/5"
        >
          <table className="w-full border-collapse text-left">
            {/* Sticky header */}
            <thead>
              <tr className="border-b border-white/8 bg-ink-07">
                <th className="py-5 pl-6 pr-4 text-sm font-semibold text-white/40 w-1/2">
                  {t("featureHeader")}
                </th>
                <th className="py-5 px-4 text-center text-sm font-semibold text-white/70 w-[16.66%]">
                  Starter
                  <span className="block text-xs font-normal text-ink-05 mt-0.5">
                    {t("starterFree")}
                  </span>
                </th>
                <th className="py-5 px-4 text-center w-[16.66%]">
                  <span className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-white">Growth</span>
                    <span className="text-xs font-normal text-ink-05 mt-0.5">
                      $29<span className="text-[10px]">/mo</span>
                    </span>
                  </span>
                </th>
                <th className="py-5 pl-4 pr-6 text-center text-sm font-semibold text-white/70 w-[16.66%]">
                  Pro
                  <span className="block text-xs font-normal text-ink-05 mt-0.5">
                    $79<span className="text-[10px]">/mo</span>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category, catIndex) => (
                <React.Fragment key={category.title}>
                  {/* Category header row */}
                  <tr
                    className={`border-b border-white/5 bg-ink-08/60 ${
                      catIndex > 0 ? "border-t border-white/8" : ""
                    }`}
                  >
                    <td
                      colSpan={4}
                      className="py-3 pl-6 pr-4 text-xs font-bold uppercase tracking-widest text-brand/80"
                    >
                      {category.title}
                    </td>
                  </tr>

                  {/* Feature rows */}
                  {category.rows.map((row, rowIndex) => (
                    <tr
                      key={row.label}
                      className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                        rowIndex === category.rows.length - 1
                          ? "border-white/0"
                          : ""
                      }`}
                    >
                      <td className="py-4 pl-6 pr-4 text-sm text-white/60 leading-snug">
                        {row.label}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Cell value={row.starter} />
                      </td>
                      <td className="py-4 px-4 text-center bg-brand/[0.03]">
                        <Cell value={row.growth} />
                      </td>
                      <td className="py-4 pl-4 pr-6 text-center">
                        <Cell value={row.pro} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <p
          data-reveal="up"
          data-reveal-delay="200"
          className="mt-5 text-center text-xs text-ink-06"
        >
          {t("priceNote")}
        </p>
      </div>
    </section>
  );
}
