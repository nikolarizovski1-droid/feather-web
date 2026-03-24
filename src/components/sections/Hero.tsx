import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85&auto=format&fit=crop"
          alt="Atmospheric restaurant interior with warm lighting"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/82" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,96,100,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 xl:px-14 py-4 sm:py-4 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center min-h-screen">

            {/* ── Left: headline + CTA ─────────────────────────────── */}
            <div className="flex flex-col gap-8 max-w-[520px]">

              {/* eyebrow */}
              <div
                data-reveal="up"
                className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 self-start"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  {t("eyebrow")}
                </span>
              </div>

              {/* headline */}
              <h1
                data-reveal="up"
                data-reveal-delay="80"
                className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.0]"
              >
                {t("headline1")}
                <br />
                <span
                  className="text-brand"
                  style={{ textShadow: "0 0 60px rgba(255,96,100,0.45)" }}
                >
                  {t("headline2")}
                </span>
              </h1>

              {/* subheadline */}
              <p
                data-reveal="up"
                data-reveal-delay="160"
                className="text-base xl:text-lg text-white/55 leading-relaxed max-w-xl"
              >
                {t("subheadline")}
              </p>

              {/* CTAs + trust */}
              <div data-reveal="up" data-reveal-delay="240">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Button href="/signup" size="lg" className="animate-float-soft">
                    {t("startFreeTrial")}
                  </Button>
                  <Button href="/how-it-works" variant="ghost" size="lg">
                    {t("seeHowItWorks")}
                  </Button>
                </div>
                <p className="text-[11px] text-white/28">{t("trustLine")}</p>
              </div>


            </div>

            {/* ── Right: notification mockup ───────────────────────── */}
            <div
              data-reveal="up"
              data-reveal-delay="400"
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">

                {/* ambient glow behind card */}
                <div
                  className="absolute inset-0 -m-8 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,96,100,0.12) 0%, transparent 70%)",
                  }}
                />

                {/* main notification card */}
                <div
                  className="relative rounded-2xl border border-white/[0.10] p-5 w-72 xl:w-80 animate-float-soft"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(16px)",
                    boxShadow:
                      "0 0 40px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  {/* phone status bar */}
                  <div className="flex items-center justify-between mb-4 opacity-30">
                    <span className="text-[9px] text-white font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-1.5 rounded-sm bg-white" />
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* notification */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center shrink-0 text-[19px] leading-none">
                      🍕
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white/90 mb-0.5">
                        {t("mockupRestaurantName")}
                      </p>
                      <p className="text-[10px] text-white/50 leading-snug">
                        {t("mockupPromoText")}
                      </p>
                    </div>
                    <span className="text-[9px] text-white/25 shrink-0 mt-0.5">
                      10m
                    </span>
                  </div>

                  {/* divider */}
                  <div className="h-px bg-white/[0.06] mb-4" />

                  {/* trigger label */}
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/30 font-semibold">
                      {t("mockupTriggerLabel")}
                    </p>
                  </div>
                </div>

                {/* floating secondary card — scan count */}
                <div
                  className="absolute -bottom-5 -right-8 rounded-xl border border-white/[0.08] px-4 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/28 font-semibold mb-0.5">
                    {t("mockupPeriod")}
                  </p>
                  <p className="text-lg font-black text-white leading-none">
                    {t("mockupOrderCount")}{" "}
                    <span className="text-brand text-sm font-bold">{t("mockupOrderLabel")}</span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll cue ─────────────────────────────────────────────────── */}
      <a
        href="#stats"
        className="relative z-10 flex justify-center pb-6 pt-2 text-white/25 hover:text-white/55 transition-colors"
        aria-label={t("scrollDown")}
      >
        <ChevronDown size={22} className="animate-bounce" />
      </a>
    </section>
  );
}
