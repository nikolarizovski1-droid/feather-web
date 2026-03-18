import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

type AboutPoint = {
  title: string;
  description: string;
};

export default async function AboutNarrative() {
  const t = await getTranslations("AboutNarrative");
  const points = t.raw("points") as AboutPoint[];

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="about-narrative-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p
              data-reveal="up"
              className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
            >
              {t("eyebrow")}
            </p>
            <h2
              id="about-narrative-heading"
              data-reveal="up"
              data-reveal-delay="80"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6"
            >
              {t("title")}
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-lg text-ink-05 leading-relaxed mb-4"
            >
              {t("description1")}
            </p>
            <p
              data-reveal="up"
              data-reveal-delay="220"
              className="text-lg text-ink-05 leading-relaxed"
            >
              {t("description2")}
            </p>
          </div>

          <div className="rounded-2xl bg-card border border-white/5 p-7 lg:p-8">
            <p
              data-reveal="up"
              className="text-xs font-semibold uppercase tracking-widest text-white/45 mb-5"
            >
              {t("principlesTitle")}
            </p>
            <ul className="space-y-5">
              {points.map((point, index) => (
                <li
                  key={point.title}
                  data-reveal="up"
                  data-reveal-delay={120 + index * 80}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Check size={11} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{point.title}</p>
                    <p className="text-sm text-ink-05 leading-relaxed mt-1">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
