import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function FeaturesPageHero() {
  const t = await getTranslations("FeaturesPageHero");

  const featureNames = t.raw("featureNames") as string[];

  return (
    <section
      className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-surface"
      aria-labelledby="features-page-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          data-reveal="up"
          className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
        >
          {t("eyebrow")}
        </p>

        <h1
          id="features-page-heading"
          data-reveal="up"
          data-reveal-delay="80"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-08 tracking-tight leading-[1.1] mb-6"
        >
          {t("title1")}{" "}
          <span className="text-ink-05">{t("title2")}</span>
        </h1>

        <p
          data-reveal="up"
          data-reveal-delay="160"
          className="text-lg text-ink-05 leading-relaxed mb-4 max-w-2xl mx-auto"
        >
          {t("description")}
        </p>

        <div
          data-reveal="up"
          data-reveal-delay="220"
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {featureNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center rounded-full bg-black/5 border border-black/8 px-3 py-1 text-xs font-medium text-ink-05"
            >
              {name}
            </span>
          ))}
        </div>

        <div
          data-reveal="up"
          data-reveal-delay="300"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/signup" size="lg">
            {t("startFreeTrial")}
          </Button>
          <Button href="/pricing" variant="ghost-light" size="lg">
            {t("viewPricing")}
          </Button>
        </div>
      </div>
    </section>
  );
}
