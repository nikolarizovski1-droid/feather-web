import Button from "@/components/ui/Button";
import TrackedCTALink from "@/components/ui/TrackedCTALink";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";

export default async function CTABand() {
  const t = await getTranslations("CTABand");

  return (
    <section
      className="relative overflow-hidden bg-brand py-20 lg:py-28"
      aria-labelledby="cta-heading"
    >
      {/* Animated floating blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-blob-1" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-blob-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-mesh-drift-1" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <MotionFade direction="up">
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5"
          >
            {t("title")}
          </h2>
        </MotionFade>
        <MotionFade direction="up" delay={0.08}>
          <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl mx-auto">
            {t("description")}
          </p>
        </MotionFade>
        <MotionFade direction="up" delay={0.16}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TrackedCTALink
              href="/app/onboarding"
              location="cta_band"
              className="inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer bg-ink-08 text-white hover:bg-[#2a2725] active:scale-[0.98] h-12 px-8 text-base hover:shadow-[0_0_24px_rgba(28,25,23,0.4)]"
            >
              {t("startTrial")}
            </TrackedCTALink>
            <Button
              href="/features"
              variant="ghost"
              size="lg"
              className="border-white/40 hover:border-white/70"
            >
              {t("exploreFeatures")}
            </Button>
          </div>
        </MotionFade>
        <MotionFade direction="up" delay={0.24}>
          <p className="mt-6 text-sm text-white/55">
            {t("trustLine")}
          </p>
        </MotionFade>
      </div>
    </section>
  );
}
