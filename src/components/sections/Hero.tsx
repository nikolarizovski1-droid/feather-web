import Image from "next/image";
import {
  ChevronDown,
  MessageCircle,
  Zap,
  TrendingUp,
  Sparkles,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  const card1Title = t("card1Title");
  const guestMatch = card1Title.match(/^(.*?)(guest)(.*)$/i);
  const fallbackSplitIndex = card1Title.lastIndexOf(" ");
  const card1TitleBefore = guestMatch
    ? guestMatch[1]
    : fallbackSplitIndex > 0
      ? `${card1Title.slice(0, fallbackSplitIndex)} `
      : "";
  const card1TitleHighlight = guestMatch
    ? guestMatch[2]
    : fallbackSplitIndex > 0
      ? card1Title.slice(fallbackSplitIndex + 1)
      : card1Title;
  const card1TitleAfter = guestMatch ? guestMatch[3] : "";

  const features = [
    t("card4Feature1"),
    t("card4Feature2"),
    t("card4Feature3"),
    t("card4Feature4"),
    t("card4Feature5"),
    t("card4Feature6"),
  ];

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
        {/* subtle top-left brand warmth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,96,100,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── 2 × 2 Feature Grid ─────────────────────────────────────── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2">

        {/* Desktop cross-hair dividers */}
        <div
          className="absolute inset-0 pointer-events-none z-20 hidden lg:block"
          aria-hidden
        >
          {/* vertical */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.10] to-transparent" />
          {/* horizontal */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
          {/* centre glow dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: "rgba(255,96,100,0.55)",
              boxShadow: "0 0 22px 8px rgba(255,96,100,0.20)",
            }}
          />
        </div>

        {/* ── Panel 1 — Brand + CTA (top-left → pulls to bottom-right) ─ */}
        <div className="relative flex flex-col justify-start lg:justify-end p-8 sm:p-10 xl:p-14 pt-20 sm:pt-24 lg:pt-20 xl:pt-28 pb-10 lg:pb-14 min-h-[80vh] lg:min-h-0 overflow-hidden border-b border-white/[0.07] lg:border-r">

          {/* ambient glow — bottom-right to reinforce pull direction */}
          <div
            className="absolute -bottom-28 -right-28 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,96,100,0.11) 0%, transparent 65%)",
            }}
          />

          {/* ghost watermark — opposite corner (top-left) */}
          <span
            aria-hidden
            className="absolute left-2 top-0 text-[9rem] xl:text-[11rem] font-black text-white/[0.025] leading-none select-none pointer-events-none"
          >
            01
          </span>

          {/* content container — pulled to right on desktop */}
          <div className="relative flex flex-col gap-8 w-full max-w-[460px] xl:max-w-[500px] mx-auto lg:mr-0">

            {/* eyebrow + headline + subheadline */}
            <div>
              <div
                data-reveal="up"
                className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 mb-7 self-start"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  {t("eyebrow")}
                </span>
              </div>

              <h1
                data-reveal="up"
                data-reveal-delay="80"
                className="text-4xl sm:text-5xl xl:text-[3.4rem] font-black tracking-tight text-white leading-[1.04] mb-5"
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

              <p
                data-reveal="up"
                data-reveal-delay="160"
                className="text-sm xl:text-base text-white/50 leading-relaxed"
              >
                {t("subheadline")}
              </p>
            </div>

            {/* CTAs + trust */}
            <div data-reveal="up" data-reveal-delay="240">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button href="/signup" size="lg" className="animate-float-soft">
                  {t("startFreeTrial")}
                </Button>
                <Button href="#how-it-works" variant="ghost" size="lg">
                  {t("seeHowItWorks")}
                </Button>
              </div>
              <p className="text-[11px] text-white/28">{t("trustLine")}</p>
            </div>

          </div>
        </div>

        {/* ── Panel 2 — Auto Push Notifications (top-right → pulls to bottom-left) ── */}
        <div className="relative flex flex-col justify-start lg:justify-end p-8 sm:p-10 xl:p-12 pt-10 lg:pt-20 xl:pt-28 pb-10 lg:pb-14 min-h-[80vh] lg:min-h-0 overflow-hidden border-b border-white/[0.07] group">

          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 20% 90%, rgba(255,96,100,0.07) 0%, transparent 65%)",
            }}
          />
          {/* ghost watermark — opposite corner (top-right) */}
          <span
            aria-hidden
            className="absolute right-2 top-0 text-[9rem] xl:text-[11rem] font-black text-white/[0.025] leading-none select-none pointer-events-none"
          >
            02
          </span>

          {/* content container — pulled to left on desktop */}
          <div className="relative flex flex-col gap-8 w-full max-w-[460px] xl:max-w-[500px] mx-auto lg:ml-0">

            {/* icon + main heading + description */}
            <div>
              <div
                data-reveal="up"
                data-reveal-delay="300"
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 24px rgba(255,96,100,0.14)" }}
                >
                  <MessageCircle className="w-5 h-5 text-brand" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand/50">
                  Auto re-engagement
                </span>
              </div>

              <div data-reveal="up" data-reveal-delay="360" className="mb-5">
                <h2 className="text-4xl sm:text-5xl xl:text-[3.9rem] font-black text-white leading-[0.98] tracking-tight mb-2">
                  {card1TitleBefore}
                  <span className="text-brand drop-shadow-[0_0_22px_rgba(255,96,100,0.38)]">
                    {card1TitleHighlight}
                  </span>
                  {card1TitleAfter}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/28 font-semibold mt-3">
                  after every scan · zero effort
                </p>
              </div>

              <div data-reveal="up" data-reveal-delay="420">
                <p className="text-sm xl:text-base text-white/40 leading-relaxed">
                  {t("card1Desc")}
                </p>
              </div>
            </div>

            {/* notification mockup */}
            <div data-reveal="up" data-reveal-delay="480">
              <div
                className="rounded-2xl border border-white/[0.08] p-3.5 flex items-start gap-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center shrink-0 text-[17px] leading-none">
                  🍕
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white/90 mb-0.5">
                    Your Restaurant
                  </p>
                  <p className="text-[10px] text-white/35 leading-snug">
                    Tonight&apos;s special — order now and save 15% 🔥
                  </p>
                </div>
                <span className="text-[9px] text-white/22 shrink-0 mt-0.5">
                  1h
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Panel 3 — Live in 2 minutes (bottom-left → pulls to top-right) ── */}
        <div className="relative flex flex-col justify-start p-8 sm:p-10 xl:p-12 pt-10 lg:pt-14 pb-10 lg:pb-20 xl:pb-28 min-h-[80vh] lg:min-h-0 overflow-hidden border-b border-white/[0.07] lg:border-b-0 lg:border-r group">

          {/* ambient glow — top-right to reinforce pull direction */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(254,201,76,0.06) 0%, transparent 65%)",
            }}
          />
          {/* ghost watermark — opposite corner (bottom-left) */}
          <span
            aria-hidden
            className="absolute left-2 bottom-0 text-[9rem] xl:text-[11rem] font-black text-white/[0.025] leading-none select-none pointer-events-none"
          >
            03
          </span>

          {/* content container — pulled to right on desktop */}
          <div className="relative flex flex-col gap-8 w-full max-w-[460px] xl:max-w-[500px] mx-auto lg:mr-0">

            {/* icon + stat + title + desc */}
            <div>
              <div
                data-reveal="up"
                data-reveal-delay="360"
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 24px rgba(254,201,76,0.10)" }}
                >
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/50">
                  AI-powered setup
                </span>
              </div>

              <div data-reveal="up" data-reveal-delay="420" className="mb-5">
                <p className="text-6xl xl:text-[5.5rem] font-black text-white leading-none tabular-nums mb-1.5">
                  2<span className="text-accent">min</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/28 font-semibold">
                  to go live · ai translates &amp; builds
                </p>
              </div>

              <div data-reveal="up" data-reveal-delay="480">
                <h3 className="text-xl xl:text-2xl font-bold text-white mb-2 leading-snug">
                  {t("card2Title")}
                </h3>
                <p className="text-xs xl:text-sm text-white/40 leading-relaxed">
                  {t("card2Desc")}
                </p>
              </div>
            </div>

            {/* PDF → AI → Menu visual */}
            <div data-reveal="up" data-reveal-delay="540">
              <div className="flex items-center gap-2.5">
                <div
                  className="rounded-xl border border-white/[0.08] px-3.5 py-2.5 text-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <p className="text-[8px] text-white/28 uppercase tracking-wide mb-0.5">
                    Input
                  </p>
                  <p className="text-xs font-bold text-white">PDF / Photo</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="h-px w-4 bg-accent/25" />
                  <div className="w-6 h-6 rounded-full border border-accent/25 bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-accent" />
                  </div>
                  <div className="h-px w-4 bg-accent/25" />
                </div>

                <div className="rounded-xl border border-accent/20 bg-accent/10 px-3.5 py-2.5 text-center">
                  <p className="text-[8px] text-accent/50 uppercase tracking-wide mb-0.5">
                    Output
                  </p>
                  <p className="text-xs font-bold text-white">Digital Menu</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Panel 4 — Revenue Impact (bottom-right → pulls to top-left) ── */}
        <div className="relative flex flex-col justify-start p-8 sm:p-10 xl:p-12 pt-10 lg:pt-14 pb-10 lg:pb-20 xl:pb-28 min-h-[80vh] lg:min-h-0 overflow-hidden group">

          {/* ambient glow — top-left to reinforce pull direction */}
          <div
            className="absolute -top-28 -left-28 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,96,100,0.07) 0%, transparent 60%)",
            }}
          />
          {/* ghost watermark — opposite corner (bottom-right) */}
          <span
            aria-hidden
            className="absolute right-2 bottom-0 text-[9rem] xl:text-[11rem] font-black text-white/[0.025] leading-none select-none pointer-events-none"
          >
            04
          </span>

          {/* content container — pulled to left on desktop */}
          <div className="relative flex flex-col gap-8 w-full max-w-[460px] xl:max-w-[500px] mx-auto lg:ml-0">

            {/* icon + stat + title + desc */}
            <div>
              <div
                data-reveal="up"
                data-reveal-delay="420"
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 24px rgba(255,96,100,0.14)" }}
                >
                  <TrendingUp className="w-5 h-5 text-brand" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand/50">
                  Revenue impact
                </span>
              </div>

              {/* big stat */}
              <div data-reveal="up" data-reveal-delay="480" className="mb-5">
                <div className="flex items-baseline gap-2 leading-none mb-1.5">
                  <p className="text-6xl xl:text-[5.5rem] font-black text-white tabular-nums">
                    +50
                  </p>
                  <p className="text-2xl xl:text-3xl font-black text-brand">
                    orders
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/28 font-semibold">
                  per month · at 1,000 scans
                </p>
              </div>

              {/* title + desc */}
              <div data-reveal="up" data-reveal-delay="540">
                <h3 className="text-xl xl:text-2xl font-bold text-white mb-2 leading-snug">
                  {t("card3Title")}
                </h3>
                <p className="text-xs xl:text-sm text-white/40 leading-relaxed">
                  {t("card3Desc")}
                </p>
              </div>
            </div>

            {/* feature checklist */}
            <div data-reveal="up" data-reveal-delay="600">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold mb-3">
                Everything included
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                    <span className="text-[10px] xl:text-[11px] text-white/38 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
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
