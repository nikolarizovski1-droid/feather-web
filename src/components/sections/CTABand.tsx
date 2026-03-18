import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function CTABand() {
  const t = await getTranslations("CTABand");

  return (
    <section
      className="relative overflow-hidden bg-brand py-20 lg:py-28"
      aria-labelledby="cta-heading"
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="cta-heading"
          data-reveal="up"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5"
        >
          {t("title")}
        </h2>
        <p
          data-reveal="up"
          data-reveal-delay="80"
          className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          {t("description")}
        </p>
        <div
          data-reveal="up"
          data-reveal-delay="160"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/signup" variant="dark" size="lg">
            {t("startTrial")}
          </Button>
          <Button
            href="/features"
            variant="ghost"
            size="lg"
            className="border-white/40 hover:border-white/70"
          >
            {t("exploreFeatures")}
          </Button>
        </div>
        <p
          data-reveal="up"
          data-reveal-delay="240"
          className="mt-6 text-sm text-white/55"
        >
          {t("trustLine")}
        </p>
      </div>
    </section>
  );
}
