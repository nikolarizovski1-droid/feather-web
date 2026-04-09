import { LayoutDashboard, Megaphone, TrendingUp, type LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import {
  ConnectingLine,
  StepCard,
  AnimatedIcon,
  AnimatedTags,
  AnimatedTag,
} from "@/components/motion/HowItWorksAnimations";

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
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="how-it-works-heading"
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
              id="how-it-works-heading"
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

        {/* Steps grid with connecting line */}
        <div className="relative">
          <ConnectingLine />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/5 rounded-3xl overflow-hidden border border-black/5 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <StepCard
                  key={step.number}
                  index={index}
                  className={`relative flex flex-col gap-6 p-8 lg:p-10 ${
                    step.highlight ? "bg-card" : "bg-surface"
                  }`}
                >
                  {/* Step number — large ghost watermark */}
                  <span
                    aria-hidden
                    className="absolute top-6 right-7 text-[72px] font-black leading-none tabular-nums select-none text-black/[0.04]"
                  >
                    {step.number}
                  </span>

                  {/* Icon with glow */}
                  <AnimatedIcon
                    highlight={step.highlight}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-shadow ${
                      step.highlight
                        ? "bg-brand/10 border-brand/25"
                        : "bg-ink-07 border-black/6"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={step.highlight ? "text-brand" : "text-ink-05"}
                    />
                  </AnimatedIcon>

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
                    <h3 className="text-xl font-bold text-ink-08 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-05 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Outcome tags — pop in sequentially */}
                  <AnimatedTags>
                    {step.tags.map((tag) => (
                      <AnimatedTag
                        key={tag}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium border ${
                          step.highlight
                            ? "bg-brand/8 border-brand/15 text-brand/80"
                            : "bg-ink-07 border-black/6 text-ink-05"
                        }`}
                      >
                        {tag}
                      </AnimatedTag>
                    ))}
                  </AnimatedTags>
                </StepCard>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <MotionFade direction="up" delay={0.3} className="mt-14 text-center">
          <Button href="/app/onboarding" size="lg">
            {t("cta")}
          </Button>
          <p className="mt-3 text-sm text-ink-06">
            {t("trustLine")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
