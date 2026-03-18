import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function AboutPageHero() {
  const t = await getTranslations("AboutPageHero");

  return (
    <section
      className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-ink-08"
      aria-labelledby="about-page-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          data-reveal="up"
          className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
        >
          {t("eyebrow")}
        </p>

        <h1
          id="about-page-heading"
          data-reveal="up"
          data-reveal-delay="80"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6"
        >
          {t("title1")} <span className="text-ink-05">{t("title2")}</span>
        </h1>

        <p
          data-reveal="up"
          data-reveal-delay="160"
          className="text-lg text-ink-05 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          {t("description")}
        </p>

        <div
          data-reveal="up"
          data-reveal-delay="220"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/signup" size="lg">
            {t("startFreeTrial")}
          </Button>
          <Button href="/features" variant="ghost" size="lg">
            {t("exploreFeatures")}
          </Button>
        </div>
      </div>
    </section>
  );
}
