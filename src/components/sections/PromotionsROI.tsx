import { ArrowDown, Bell, CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import FeatureCard3D from "@/components/motion/FeatureCard3D";

interface FunnelStep {
  label: string;
  value: string;
  sub?: string;
}

interface PromotionCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: string;
  title: string;
  steps: FunnelStep[];
}

function FunnelCard({ promo }: { promo: PromotionCard }) {
  const Icon = promo.icon;
  return (
    <div className="h-full flex flex-col rounded-2xl bg-card border border-black/5 overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="px-7 pt-7 pb-6 border-b border-black/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <Icon size={18} className="text-brand" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            {promo.type}
          </span>
        </div>
        <p className="text-lg font-semibold text-ink-08 leading-snug">
          {promo.title}
        </p>
      </div>

      {/* Funnel steps */}
      <div className="flex flex-col flex-1 justify-between px-7 py-6">
        {promo.steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-ink-05 leading-snug">{step.label}</span>
              <div className="text-right">
                <span className="text-base font-bold text-ink-08 tabular-nums">
                  {step.value}
                </span>
                {step.sub && (
                  <span className="block text-xs text-ink-06 leading-tight">
                    {step.sub}
                  </span>
                )}
              </div>
            </div>
            {i < promo.steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown size={14} className="text-brand/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const promoIcons = [Bell, CalendarDays];

export default async function PromotionsROI() {
  const t = await getTranslations("PromotionsROI");

  type StepMsg = { label: string; value: string; sub?: string };
  type PromoMsg = { type: string; title: string; steps: StepMsg[] };
  const promoData = t.raw("promotions") as PromoMsg[];

  const promotions: PromotionCard[] = promoData.map((p, i) => ({
    icon: promoIcons[i],
    type: p.type,
    title: p.title,
    steps: p.steps,
  }));

  return (
    <section
      className="pt-14 lg:pt-16 pb-24 lg:pb-32 bg-surface"
      aria-labelledby="promotions-roi-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MotionFade direction="up">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand mb-3">
              {t("eyebrow")}
            </p>
          </MotionFade>
          <MotionFade direction="up" delay={0.08}>
            <h2
              id="promotions-roi-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-08 tracking-tight mb-5"
            >
              {t("title1")}
              <br />
              {t("title2")}
            </h2>
          </MotionFade>
          <MotionFade direction="up" delay={0.16}>
            <p className="text-lg text-ink-05 leading-relaxed">
              {t("description")}
            </p>
          </MotionFade>
        </div>

        {/* Funnel cards with 3D tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {promotions.map((promo, index) => (
            <FeatureCard3D
              key={promo.type}
              index={index}
              className="h-full"
            >
              <FunnelCard promo={promo} />
            </FeatureCard3D>
          ))}
        </div>

        {/* Disclaimer */}
        <MotionFade direction="up" delay={0.3} className="mt-10 text-center">
          <p className="text-xs text-ink-06">
            {t("disclaimer")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
