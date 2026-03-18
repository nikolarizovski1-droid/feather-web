import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative min-h-screen flex flex-col" aria-label="Hero">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85&auto=format&fit=crop"
          alt="Atmospheric restaurant interior with warm lighting"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#2C2B2B]" />
        <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="mx-auto max-w-4xl text-center">

          {/* Eyebrow */}
          <div
            data-reveal="up"
            className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">
              {t("eyebrow")}
            </span>
          </div>

          {/* H1 */}
          <h1
            data-reveal="up"
            data-reveal-delay="80"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6"
          >
            {t("headline1")}
            <br />
            <span className="text-brand">{t("headline2")}</span> {t("headline3")}
          </h1>

          {/* Subheadline */}
          <p
            data-reveal="up"
            data-reveal-delay="160"
            className="mx-auto max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed mb-10"
          >
            {t("subheadline")}
          </p>

          {/* CTAs */}
          <div
            data-reveal="up"
            data-reveal-delay="240"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/signup" size="lg" className="animate-float-soft">
              {t("startFreeTrial")}
            </Button>
            <Button href="#how-it-works" variant="ghost" size="lg">
              {t("seeHowItWorks")}
            </Button>
          </div>

          {/* Trust line */}
          <p
            data-reveal="up"
            data-reveal-delay="320"
            className="mt-6 text-sm text-white/45"
          >
            {t("trustLine")}
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#stats"
        className="relative z-10 flex justify-center pb-8 text-white/30 hover:text-white/60 transition-colors"
        aria-label={t("scrollDown")}
      >
        <ChevronDown size={28} className="animate-bounce" />
      </a>
    </section>
  );
}
