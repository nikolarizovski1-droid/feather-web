import Image from "next/image";
import { ChevronDown, MessageCircle, Zap, TrendingUp, Sparkles, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  const features = [
    t("card4Feature1"),
    t("card4Feature2"),
    t("card4Feature3"),
    t("card4Feature4"),
    t("card4Feature5"),
    t("card4Feature6"),
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" aria-label="Hero">

      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85&auto=format&fit=crop"
          alt="Atmospheric restaurant interior with warm lighting"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Dark left → lighter right so photo bleeds through the panels */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/96 via-black/80 to-black/40" />
        {/* Top & bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/55" />
      </div>

      {/* ── Brand glow (left side atmosphere) ───────────────────────────── */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at left center, rgba(255,96,100,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row lg:items-center gap-12 xl:gap-20 pt-28 pb-12">

          {/* ─── LEFT: headline + CTAs ──────────────────────────────────── */}
          <div className="lg:flex-1 flex flex-col">

            {/* Eyebrow */}
            <div
              data-reveal="up"
              className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-1.5 mb-8 self-start"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                {t("eyebrow")}
              </span>
            </div>

            {/* H1 */}
            <h1
              data-reveal="up"
              data-reveal-delay="80"
              className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.04] mb-6"
            >
              {t("headline1")}
              <br />
              <span className="text-brand drop-shadow-[0_0_30px_rgba(255,96,100,0.45)]">
                {t("headline2")}
              </span>
            </h1>

            {/* Subheadline */}
            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-lg text-white/60 leading-relaxed mb-10 max-w-md"
            >
              {t("subheadline")}
            </p>

            {/* CTAs */}
            <div
              data-reveal="up"
              data-reveal-delay="240"
              className="flex flex-row items-center gap-4 mb-6"
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
              className="text-sm text-white/38"
            >
              {t("trustLine")}
            </p>
          </div>

          {/* ─── RIGHT: 2×2 frosted panels ──────────────────────────────── */}
          <div className="lg:w-[480px] xl:w-[520px] shrink-0 grid grid-cols-2 gap-3 sm:gap-4">

            {/* Panel 1 — Message to every customer */}
            <div
              data-reveal="up"
              data-reveal-delay="380"
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-black/35 border border-white/10 p-5 sm:p-6 group hover:border-brand/30 hover:bg-black/40 transition-colors duration-300"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              {/* Ghost number */}
              <span aria-hidden className="absolute -bottom-3 -right-1 text-[5.5rem] font-black leading-none text-white/[0.05] select-none pointer-events-none">
                01
              </span>
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-brand/55">01</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{t("card1Title")}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{t("card1Desc")}</p>
              </div>
            </div>

            {/* Panel 2 — Menu in 2 minutes */}
            <div
              data-reveal="up"
              data-reveal-delay="440"
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-black/35 border border-white/10 p-5 sm:p-6 group hover:border-brand/30 hover:bg-black/40 transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <span aria-hidden className="absolute -bottom-3 -right-1 text-[5.5rem] font-black leading-none text-white/[0.05] select-none pointer-events-none">
                02
              </span>
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-brand/55">02</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{t("card2Title")}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{t("card2Desc")}</p>
              </div>
            </div>

            {/* Panel 3 — Earning */}
            <div
              data-reveal="up"
              data-reveal-delay="500"
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-black/35 border border-white/10 p-5 sm:p-6 group hover:border-brand/30 hover:bg-black/40 transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <span aria-hidden className="absolute -bottom-3 -right-1 text-[5.5rem] font-black leading-none text-white/[0.05] select-none pointer-events-none">
                03
              </span>
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-brand/55">03</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{t("card3Title")}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{t("card3Desc")}</p>
              </div>
            </div>

            {/* Panel 4 — Feature list */}
            <div
              data-reveal="up"
              data-reveal-delay="560"
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-black/35 border border-white/10 p-5 sm:p-6 group hover:border-brand/30 hover:bg-black/40 transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <span aria-hidden className="absolute -bottom-3 -right-1 text-[5.5rem] font-black leading-none text-white/[0.05] select-none pointer-events-none">
                04
              </span>
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-brand/55">04</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2.5 leading-snug">{t("card4Title")}</h3>
                <ul className="space-y-1.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                      <span className="text-[11px] text-white/50 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────────── */}
      <a
        href="#stats"
        className="relative z-10 flex justify-center pb-8 text-white/25 hover:text-white/55 transition-colors"
        aria-label={t("scrollDown")}
      >
        <ChevronDown size={24} className="animate-bounce" />
      </a>

    </section>
  );
}
