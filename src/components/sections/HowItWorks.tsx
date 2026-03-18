import { LayoutDashboard, Megaphone, TrendingUp, type LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

const stepIcons: LucideIcon[] = [LayoutDashboard, Megaphone, TrendingUp];
const stepNumbers = ["01", "02", "03"];
const stepHighlights = [false, true, false];

export default async function HowItWorks() {
  const t = await getTranslations("HowItWorks");

  type StepMsg = { title: string; description: string; tags: string[] };
  const steps = (t.raw("steps") as StepMsg[]).map((s, i) => ({
    ...s,
    number: stepNumbers[i],
    icon: stepIcons[i],
    highlight: stepHighlights[i],
  }));

  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 bg-ink-08"
      aria-labelledby="how-it-works-heading"
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
            id="how-it-works-heading"
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

        {/* Steps grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                data-reveal="up"
                data-reveal-delay={100 + index * 100}
                className={`relative flex flex-col gap-6 p-8 lg:p-10 ${
                  step.highlight ? "bg-surface" : "bg-ink-08"
                }`}
              >
                {/* Step number — large ghost watermark */}
                <span
                  aria-hidden
                  className="absolute top-6 right-7 text-[72px] font-black leading-none tabular-nums select-none text-white/[0.04]"
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    step.highlight
                      ? "bg-brand/10 border-brand/25"
                      : "bg-ink-07 border-white/6"
                  }`}
                >
                  <Icon
                    size={20}
                    className={step.highlight ? "text-brand" : "text-ink-05"}
                  />
                </div>

                {/* Step label */}
                <p
                  className={`text-[11px] font-bold tracking-[0.18em] uppercase -mb-4 ${
                    step.highlight ? "text-brand" : "text-ink-06"
                  }`}
                >
                  {t("stepLabel", { number: step.number })}
                </p>

                {/* Title + description */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-05 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Outcome tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium border ${
                        step.highlight
                          ? "bg-brand/8 border-brand/15 text-brand/80"
                          : "bg-ink-07 border-white/6 text-ink-05"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          data-reveal="up"
          data-reveal-delay="240"
          className="mt-14 text-center"
        >
          <Button href="/signup" size="lg">
            {t("cta")}
          </Button>
          <p className="mt-3 text-sm text-ink-06">
            {t("trustLine")}
          </p>
        </div>
      </div>
    </section>
  );
}
