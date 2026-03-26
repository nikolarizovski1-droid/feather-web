import { getTranslations } from "next-intl/server";

export default async function FaqPageHero() {
  const t = await getTranslations("FaqPageHero");

  return (
    <section
      className="pt-36 pb-16 lg:pt-44 lg:pb-20 bg-surface"
      aria-labelledby="faq-page-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          data-reveal="up"
          className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
        >
          {t("eyebrow")}
        </p>

        <h1
          id="faq-page-heading"
          data-reveal="up"
          data-reveal-delay="80"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-08 tracking-tight leading-[1.1] mb-6"
        >
          {t("title")}
        </h1>

        <p
          data-reveal="up"
          data-reveal-delay="160"
          className="text-lg text-ink-05 leading-relaxed max-w-2xl mx-auto"
        >
          {t("description")}
        </p>
      </div>
    </section>
  );
}
