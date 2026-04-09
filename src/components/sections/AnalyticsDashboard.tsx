import { BarChart2, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import {
  StaggeredList,
  StaggeredListItem,
} from "@/components/motion/ComparisonAnimations";

// ---------------------------------------------------------------------------
// Inline dashboard preview – purely cosmetic, illustrative data
// ---------------------------------------------------------------------------

const kpiData = [
  { value: "12,480", delta: "+18%", positive: true },
  { value: "6,340", delta: "+12%", positive: true },
  { value: "1,092", delta: "+9%", positive: true },
  { value: "348", delta: "+5%", positive: true },
];

const funnelData = [
  { label: "Menu Opens", pct: 100, width: "w-full" },
  { label: "Product Views", pct: 51, width: "w-[51%]" },
  { label: "Added to Cart", pct: 22, width: "w-[22%]" },
  { label: "Orders Placed", pct: 9, width: "w-[9%]" },
];

const chartBars = [35, 48, 42, 60, 78, 65, 82, 91, 74, 88, 96, 72];
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const peakHours = [
  { label: "11am", level: 1 },
  { label: "12pm", level: 3 },
  { label: "1pm", level: 4 },
  { label: "2pm", level: 2 },
  { label: "6pm", level: 3 },
  { label: "7pm", level: 5 },
  { label: "8pm", level: 5 },
  { label: "9pm", level: 4 },
];

const peakColor = (level: number) => {
  if (level <= 1) return "bg-brand/15";
  if (level <= 2) return "bg-brand/30";
  if (level <= 3) return "bg-brand/50";
  if (level <= 4) return "bg-brand/70";
  return "bg-brand";
};

const sources = [
  { label: "iOS", pct: 52 },
  { label: "Android", pct: 31 },
  { label: "Web", pct: 17 },
];

const topProducts = [
  { name: "Smash Burger", orders: 312 },
  { name: "Truffle Fries", orders: 248 },
  { name: "Aperol Spritz", orders: 196 },
  { name: "Tiramisu", orders: 141 },
];

function InlineDashboard({
  labels,
}: {
  labels: {
    kpiMenuOpens: string;
    kpiProductViews: string;
    kpiOrders: string;
    kpiServiceCalls: string;
    funnelTitle: string;
    funnelSub: string;
    chartTitle: string;
    peakTitle: string;
    sourcesTitle: string;
    topProductsTitle: string;
  };
}) {
  const kpiLabels = [
    labels.kpiMenuOpens,
    labels.kpiProductViews,
    labels.kpiOrders,
    labels.kpiServiceCalls,
  ];

  return (
    <div className="w-full rounded-2xl bg-[#2B2B2B] border border-white/5 p-4 flex flex-col gap-3 text-white select-none">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {kpiData.map((kpi, i) => (
          <div
            key={kpiLabels[i]}
            className="rounded-xl bg-[#252525] border border-white/5 px-3 py-3"
          >
            <p className="text-[10px] text-white/40 mb-1 leading-none truncate">
              {kpiLabels[i]}
            </p>
            <p className="text-lg font-bold tabular-nums leading-none">
              {kpi.value}
            </p>
            <span
              className={`text-[10px] font-semibold ${
                kpi.positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="rounded-xl bg-[#252525] border border-white/5 px-4 py-3">
        <div className="flex items-baseline justify-between mb-2.5">
          <p className="text-[11px] font-semibold text-white/80">
            {labels.funnelTitle}
          </p>
          <p className="text-[10px] text-white/30">{labels.funnelSub}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          {funnelData.map((step) => (
            <div key={step.label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-[10px] text-white/50 text-right">
                {step.label}
              </span>
              <div className="flex-1 h-4 rounded bg-white/5 overflow-hidden">
                <div
                  className={`h-full ${step.width} bg-brand/60 rounded`}
                />
              </div>
              <span className="w-8 text-[10px] text-white/50 tabular-nums">
                {step.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-[#252525] border border-white/5 px-4 py-3">
        <p className="text-[11px] font-semibold text-white/80 mb-2.5">
          {labels.chartTitle}
        </p>
        <div className="flex items-end gap-1 h-14">
          {chartBars.map((h, i) => (
            <div
              key={chartLabels[i]}
              className="flex-1 flex flex-col items-center gap-1 h-full"
            >
              <div
                className="w-full rounded-sm bg-brand/60"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {chartLabels.map((l) => (
            <div key={l} className="flex-1 text-center">
              <span className="text-[8px] text-white/25">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak hours + two bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Peak hours */}
        <div className="rounded-xl bg-[#252525] border border-white/5 px-4 py-3">
          <p className="text-[11px] font-semibold text-white/80 mb-2.5">
            {labels.peakTitle}
          </p>
          <div className="flex items-end gap-1.5">
            {peakHours.map((slot) => (
              <div
                key={slot.label}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-full rounded-sm ${peakColor(slot.level)}`}
                  style={{ height: `${slot.level * 8}px` }}
                />
                <span className="text-[8px] text-white/25 leading-none">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="rounded-xl bg-[#252525] border border-white/5 px-4 py-3">
          <p className="text-[11px] font-semibold text-white/80 mb-2.5">
            {labels.sourcesTitle}
          </p>
          <div className="flex flex-col gap-1.5">
            {sources.map((s, i) => {
              const colors = [
                "bg-brand",
                "bg-brand/50",
                "bg-brand/25",
              ];
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <div
                    className={`h-2 rounded-full ${colors[i]}`}
                    style={{ width: `${s.pct}%` }}
                  />
                  <span className="text-[10px] text-white/40 whitespace-nowrap">
                    {s.label} {s.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-xl bg-[#252525] border border-white/5 px-4 py-3">
        <p className="text-[11px] font-semibold text-white/80 mb-2.5">
          {labels.topProductsTitle}
        </p>
        <div className="flex flex-col gap-1.5">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold text-white/20 w-3 tabular-nums">
                {i + 1}
              </span>
              <span className="flex-1 text-[11px] text-white/60 truncate">
                {p.name}
              </span>
              <span className="text-[10px] font-semibold text-brand tabular-nums">
                {p.orders}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported section
// ---------------------------------------------------------------------------

export default async function AnalyticsDashboard() {
  const t = await getTranslations("AnalyticsDashboard");
  const bullets = t.raw("bullets") as string[];

  const dashboardLabels = {
    kpiMenuOpens: t("kpiMenuOpens"),
    kpiProductViews: t("kpiProductViews"),
    kpiOrders: t("kpiOrders"),
    kpiServiceCalls: t("kpiServiceCalls"),
    funnelTitle: t("funnelTitle"),
    funnelSub: t("funnelSub"),
    chartTitle: t("chartTitle"),
    peakTitle: t("peakTitle"),
    sourcesTitle: t("sourcesTitle"),
    topProductsTitle: t("topProductsTitle"),
  };

  return (
    <section
      id="analytics"
      className="py-24 lg:py-32 bg-ink-07 scroll-mt-28"
      aria-labelledby="analytics-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <MotionFade direction="left">
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <BarChart2 size={16} className="text-brand" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand">
                  {t("eyebrow")}
                </p>
              </div>
            </MotionFade>

            <MotionFade direction="left" delay={0.08}>
              <h2
                id="analytics-heading"
                className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-ink-08 tracking-tight leading-tight mb-5 whitespace-pre-line"
              >
                {t("title")}
              </h2>
            </MotionFade>

            <MotionFade direction="left" delay={0.16}>
              <p className="text-ink-05 text-lg leading-relaxed mb-8">
                {t("description")}
              </p>
            </MotionFade>

            <StaggeredList className="space-y-3">
              {bullets.map((bullet) => (
                <StaggeredListItem key={bullet} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Check size={11} className="text-brand" />
                  </div>
                  <span className="text-sm text-ink-05 leading-relaxed">
                    {bullet}
                  </span>
                </StaggeredListItem>
              ))}
            </StaggeredList>
          </div>

          {/* Dashboard preview with 3D tilt */}
          <MotionFade direction="right" delay={0.12} className="flex justify-center">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <div className="absolute inset-0 rounded-3xl bg-brand/5 blur-3xl scale-95" />
              <div className="relative">
                <InlineDashboard labels={dashboardLabels} />
              </div>
            </div>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
