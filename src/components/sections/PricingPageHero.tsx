import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";

export default async function PricingPageHero() {
  const t = await getTranslations("PricingPageHero");

  return (
    <section
      className="pt-36 pb-20 lg:pt-44 lg:pb-24 bg-surface"
      aria-labelledby="pricing-page-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <MotionFade direction="up">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand mb-4">
            {t("eyebrow")}
          </p>
        </MotionFade>

        <MotionFade direction="up" delay={0.08}>
          <h1
            id="pricing-page-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-08 tracking-tight leading-[1.1] mb-6"
          >
            {t("title")}
          </h1>
        </MotionFade>

        <MotionFade direction="up" delay={0.16}>
          <p className="text-lg text-ink-05 leading-relaxed max-w-xl mx-auto">
            {t("description")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
