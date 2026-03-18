import { X, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ComparisonSection() {
  const t = await getTranslations("ComparisonSection");

  const basicItems = t.raw("basicCard.items") as string[];
  const featherItems = t.raw("featherCard.items") as string[];

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="comparison-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
          >
            {t("eyebrow")}
          </p>
          <h2
            id="comparison-heading"
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5"
          >
            {t("title")}
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="160"
            className="text-lg text-ink-05 leading-relaxed"
          >
            {t("description")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Left: Basic QR tool */}
          <div
            data-reveal="scale"
            data-reveal-delay="80"
            className="rounded-2xl bg-ink-07 border border-white/5 p-8"
          >
            <div className="mb-6">
              <span className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-ink-05 uppercase tracking-wider mb-4">
                {t("basicCard.badge")}
              </span>
              <h3 className="text-xl font-bold text-white">
                {t("basicCard.title")}
              </h3>
            </div>
            <ul className="space-y-4">
              {basicItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <X size={12} className="text-ink-05" />
                  </div>
                  <span className="text-sm text-ink-05 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Feather */}
          <div
            data-reveal="scale"
            data-reveal-delay="180"
            className="rounded-2xl bg-ink-07 border border-brand/40 p-8 shadow-[0_0_60px_rgba(255,96,100,0.12)] relative overflow-hidden"
          >
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full" />
            <div className="mb-6 relative">
              <span className="inline-block rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand uppercase tracking-wider mb-4">
                {t("featherCard.badge")}
              </span>
              <h3 className="text-xl font-bold text-white">
                {t("featherCard.title")}
              </h3>
            </div>
            <ul className="space-y-4 relative">
              {featherItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <Check size={12} className="text-brand" />
                  </div>
                  <span className="text-sm text-white/80 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
