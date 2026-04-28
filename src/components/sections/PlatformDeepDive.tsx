import Image from "next/image";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import {
  StaggeredList,
  StaggeredListItem,
} from "@/components/motion/ComparisonAnimations";

function MockupPlaceholder({
  type,
  label,
}: {
  type: "dashboard" | "phone";
  label: string;
}) {
  if (type === "dashboard") {
    return (
      <div className="relative w-full max-w-[640px] mx-auto rounded-2xl overflow-hidden">
        <Image
          src="/mockups/admin-mockup.png"
          alt={label}
          width={1539}
          height={1203}
          className="h-auto w-full object-contain"
          sizes="(min-width: 1024px) 640px, (min-width: 640px) 80vw, 100vw"
          priority
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[420px] rounded-2xl overflow-hidden">
      <Image
        src="/mockups/admin-mockup-mobiles.png"
        alt={label}
        width={2131}
        height={1662}
        className="h-auto w-full object-contain"
        sizes="(min-width: 1024px) 420px, (min-width: 640px) 70vw, 100vw"
        priority
      />
    </div>
  );
}

export default async function PlatformDeepDive() {
  const t = await getTranslations("PlatformDeepDive");

  const adminFeatures = t.raw("admin.features") as string[];
  const appFeatures = t.raw("apps.features") as string[];

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-28">

        {/* Part A — Admin Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <MotionFade direction="left">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand mb-4">
                {t("admin.eyebrow")}
              </p>
            </MotionFade>
            <MotionFade direction="left" delay={0.08}>
              <h2
                id="platform-heading"
                className="text-3xl sm:text-4xl font-bold text-ink-08 tracking-tight mb-5 leading-tight"
              >
                {t("admin.title1")}
                <br />
                {t("admin.title2")}
              </h2>
            </MotionFade>
            <MotionFade direction="left" delay={0.16}>
              <p className="text-ink-05 text-lg leading-relaxed mb-8">
                {t("admin.description")}
              </p>
            </MotionFade>
            <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {adminFeatures.map((feature) => (
                <StaggeredListItem key={feature} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Check size={11} className="text-brand" />
                  </div>
                  <span className="text-sm text-ink-05 leading-snug">
                    {feature}
                  </span>
                </StaggeredListItem>
              ))}
            </StaggeredList>
            <MotionFade direction="left" delay={0.4}>
              <Button href="/features" variant="ghost-light">
                {t("admin.cta")}
              </Button>
            </MotionFade>
          </div>
          <MotionFade direction="right" delay={0.12} className="order-1 lg:order-2">
            <MockupPlaceholder type="dashboard" label={t("admin.mockupLabel")} />
          </MotionFade>
        </div>

        {/* Divider */}
        <div className="border-t border-black/5" />

        {/* Part B — Native Apps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <MotionFade direction="left" delay={0.12} className="flex justify-center">
            <MockupPlaceholder type="phone" label={t("apps.mockupLabel")} />
          </MotionFade>
          <div>
            <MotionFade direction="right">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand mb-4">
                {t("apps.eyebrow")}
              </p>
            </MotionFade>
            <MotionFade direction="right" delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink-08 tracking-tight mb-5 leading-tight">
                {t("apps.title1")}
                <br />
                {t("apps.title2")}
              </h2>
            </MotionFade>
            <MotionFade direction="right" delay={0.16}>
              <p className="text-ink-05 text-lg leading-relaxed mb-8">
                {t("apps.description")}
              </p>
            </MotionFade>
            <StaggeredList className="space-y-3 mb-8">
              {appFeatures.map((feature) => (
                <StaggeredListItem key={feature} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Check size={11} className="text-brand" />
                  </div>
                  <span className="text-sm text-ink-05 leading-snug">
                    {feature}
                  </span>
                </StaggeredListItem>
              ))}
            </StaggeredList>

            {/* App store badges */}
            <MotionFade direction="right" delay={0.4} className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com/us/app/feather-menu/id6744873644"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-ink-08 px-4 py-2.5 hover:border-black/25 transition-colors"
                aria-label={t("apps.downloadOnAppStore")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-white/60 leading-none">
                    {t("apps.downloadOnThe")}
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {t("apps.appStore")}
                  </div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.feather.menu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-ink-08 px-4 py-2.5 hover:border-black/25 transition-colors"
                aria-label={t("apps.getItOnGooglePlay")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.18 23.76a2 2 0 0 1-.87-1.86V2.1a2 2 0 0 1 .87-1.86l.11-.06 12.05 12.05-.1.1L3.18 23.76zm13.5-7.9L4.04 22.62l9.85-9.85 2.79 3.09zm2.47-5.35c.53.3.88.85.88 1.49s-.35 1.19-.88 1.49l-2.25 1.3-3.06-3.06 3.06-3.06 2.25 1.3zM4.04 1.38l12.64 6.76-2.79 3.09L3.84 1.44l.2-.06z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-white/60 leading-none">
                    {t("apps.getItOn")}
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {t("apps.googlePlay")}
                  </div>
                </div>
              </a>
            </MotionFade>
          </div>
        </div>

      </div>
    </section>
  );
}
