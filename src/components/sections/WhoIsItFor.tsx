import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import FeatureCard3D from "@/components/motion/FeatureCard3D";
import type { Plan, PlansApiResponse } from "@/types/pricing";
import { getLocalized } from "@/lib/i18n-helpers";

const PLAN_KEYS = ["basic", "standard", "premium"] as const;
const USE_CASE_PATHS = ["/for/fast-casual", "/for/fine-dining", "/for/multi-location"] as const;

interface WhoIsItForProps {
  plans: PlansApiResponse | null;
  locale: string;
}

export default async function WhoIsItFor({ plans, locale }: WhoIsItForProps) {
  const t = await getTranslations("WhoIsItFor");

  const monthlyByTier = new Map<string, Plan>();
  if (plans) {
    for (const plan of plans.plans) {
      if (plan.duration === "1m") {
        monthlyByTier.set(plan.plan_key, plan);
      }
    }
  }

  type CardMsg = {
    tag: string;
    headline: string;
    description: string;
    plan: string;
    cta: string;
  };
  const cards = (t.raw("cards") as CardMsg[]).map((card, i) => {
    const tierKey = PLAN_KEYS[i];
    const apiPlan = monthlyByTier.get(tierKey);
    const displayFeatures = apiPlan?.direct_features?.length
      ? apiPlan.direct_features
      : apiPlan?.features;
    const benefits = displayFeatures
      ? displayFeatures.slice(0, 3).map((f) => getLocalized(f.title_translations, locale))
      : [];

    return {
      ...card,
      benefits,
      planKey: tierKey,
      useCasePath: USE_CASE_PATHS[i],
      isHighlighted: i === 1,
      number: String(i + 1).padStart(2, "0"),
    };
  });

  return (
    <section
      className="py-24 lg:py-32 bg-ink-07"
      aria-labelledby="who-is-it-for-heading"
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
              id="who-is-it-for-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-08 tracking-tight mb-5"
            >
              {t("title")}
            </h2>
          </MotionFade>
          <MotionFade direction="up" delay={0.16}>
            <p className="text-lg text-ink-05 leading-relaxed">
              {t("description")}
            </p>
          </MotionFade>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <FeatureCard3D
              key={card.planKey}
              index={index}
              className={`group relative flex flex-col gap-6 rounded-2xl p-7 ${
                card.isHighlighted
                  ? "bg-card border-2 border-brand/50 shadow-lg"
                  : "bg-card border border-black/5 shadow-sm"
              }`}
            >
              {/* Ghost number watermark */}
              <span
                aria-hidden
                className="absolute top-4 right-5 text-[72px] font-black leading-none tabular-nums select-none text-black/[0.04] pointer-events-none"
              >
                {card.number}
              </span>

              {/* Most popular badge */}
              {card.isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                    {card.tag}
                  </span>
                </div>
              )}

              {/* Tag (non-highlighted cards) */}
              {!card.isHighlighted && (
                <span className="inline-flex self-start items-center rounded-full border border-black/10 bg-ink-07 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-05">
                  {card.tag}
                </span>
              )}

              {/* Headline + description */}
              <div className={card.isHighlighted ? "mt-3" : ""}>
                <h3 className="text-xl font-bold text-ink-08 leading-snug mb-2">
                  {card.headline}
                </h3>
                <p className="text-sm text-ink-05 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-black/[0.06]" />

              {/* Benefits */}
              <ul className="space-y-2.5 flex-1">
                {card.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                        card.isHighlighted ? "bg-brand/10" : "bg-brand/5"
                      }`}
                    >
                      <Check size={10} className="text-brand" />
                    </div>
                    <span className="text-sm text-ink-05 leading-snug">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Plan label */}
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-06">
                {card.plan}
              </p>

              {/* CTA */}
              <Link
                href={`/pricing?plan=${card.planKey}`}
                className={`inline-flex items-center justify-center gap-2 w-full h-11 px-6 text-sm font-semibold rounded-full transition-all duration-200 ${
                  card.isHighlighted
                    ? "bg-brand text-white hover:bg-[#e5474b] active:scale-[0.98]"
                    : "bg-transparent text-ink-08 border border-ink-08/20 hover:border-ink-08/40 hover:bg-black/5 active:scale-[0.98]"
                }`}
              >
                {card.cta}
                <ArrowRight size={15} />
              </Link>

              {/* Secondary: use-case deep-dive */}
              <Link
                href={card.useCasePath}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-ink-05 hover:text-ink-08 transition-colors duration-200"
              >
                {t("learnMore")}
                <ArrowRight size={12} />
              </Link>
            </FeatureCard3D>
          ))}
        </div>

        {/* Compare all plans link */}
        <MotionFade direction="up" delay={0.4} className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-ink-05 hover:text-ink-08 transition-colors duration-200"
          >
            {t("seePricing")}
            <ArrowRight size={14} />
          </Link>
        </MotionFade>

      </div>
    </section>
  );
}
