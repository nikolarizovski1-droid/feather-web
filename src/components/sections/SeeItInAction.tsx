import Image from "next/image";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";

export default async function SeeItInAction() {
  const t = await getTranslations("SeeItInAction");

  const features = t.raw("features") as string[];

  return (
    <section
      id="see-it-in-action"
      className="py-24 lg:py-32 bg-card"
      aria-labelledby="see-it-in-action-heading"
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
              id="see-it-in-action-heading"
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

        {/* Two-column grid: phone mockup + QR code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto mb-12">
          {/* Left: Phone mockup */}
          <MotionFade direction="left" delay={0.2} className="flex justify-center">
            <div className="relative">
              <Image
                src="/mockups/Mockup1.png"
                alt="Feather demo restaurant menu on a phone"
                width={280}
                height={560}
                className="rounded-2xl"
                sizes="280px"
              />
              {/* Floating shadow for depth */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 rounded-full blur-xl" />
            </div>
          </MotionFade>

          {/* Right: QR code + instruction */}
          <MotionFade direction="right" delay={0.3} className="flex flex-col items-center gap-6">
            <div className="relative w-60 h-60 rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Image
                src="/images/demo-qr.svg"
                alt="QR code to scan Feather demo restaurant"
                fill
                className="object-contain p-2"
                sizes="240px"
              />
              {/* Pulsing glow ring */}
              <div className="absolute -inset-2 rounded-3xl border-2 border-brand/10 animate-pulse pointer-events-none" />
              {/* Fallback when image doesn't exist yet */}
              <div className="absolute inset-0 flex items-center justify-center text-ink-05 text-sm bg-white rounded-2xl -z-10">
                QR Code
              </div>
            </div>
            <p className="text-sm text-ink-05 text-center">
              {t("qrInstruction")}
            </p>
          </MotionFade>
        </div>

        {/* Feature badges */}
        <MotionFade direction="up" delay={0.35} className="flex flex-wrap justify-center gap-2 mb-14">
          {features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium border bg-brand/8 border-brand/15 text-brand/80"
            >
              {feature}
            </span>
          ))}
        </MotionFade>

        {/* CTA block */}
        <MotionFade direction="up" delay={0.4} className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-ink-08 mb-3">
            {t("ctaHeadline")}
          </h3>
          <p className="text-base text-ink-05 leading-relaxed max-w-xl mx-auto mb-6">
            {t("ctaDescription")}
          </p>
          <Button href="/app/onboarding" size="lg">
            {t("ctaButton")}
          </Button>
          <p className="mt-3 text-sm text-ink-06">
            {t("ctaTrustLine")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
