import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatsBar from "@/components/sections/StatsBar";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import Button from "@/components/ui/Button";
import {
  getUseCaseData,
  USE_CASE_TYPES,
  type UseCaseType,
} from "@/lib/use-case-data";

interface PageParams {
  locale: string;
  type: string;
}

export async function generateStaticParams() {
  return USE_CASE_TYPES.flatMap((type) =>
    ["en", "mk"].map((locale) => ({ locale, type }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { type } = await params;
  const data = getUseCaseData(type);
  if (!data) return {};
  return {
    title: data.meta.title,
    description: data.meta.description,
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, type } = await params;
  setRequestLocale(locale);

  const data = getUseCaseData(type);
  if (!data) notFound();

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85&auto=format&fit=crop"
              alt="Restaurant interior"
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

          <div className="relative z-10 mx-auto max-w-5xl px-8 sm:px-10 xl:px-14 py-28">
            {/* Eyebrow */}
            <div
              data-reveal="up"
              className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                {data.hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              data-reveal="up"
              data-reveal-delay="80"
              className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.0] mb-6"
            >
              {data.hero.headline1}
              <br />
              <span
                className="text-brand"
                style={{ textShadow: "0 0 60px rgba(255,96,100,0.45)" }}
              >
                {data.hero.headline2}
              </span>
            </h1>

            {/* Subheadline */}
            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-base xl:text-lg text-white/55 leading-relaxed max-w-xl mb-10"
            >
              {data.hero.subheadline}
            </p>

            {/* CTAs */}
            <div
              data-reveal="up"
              data-reveal-delay="240"
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                href={`/signup?plan=${data.featuredPlan}`}
                size="lg"
                className="animate-float-soft"
              >
                Start 30-Day Free Trial
              </Button>
              <Button href="/pricing" variant="ghost" size="lg">
                See Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <StatsBar />

        {/* ── Feature Highlights ────────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-ink-08" aria-label="Key features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2
                data-reveal="up"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
              >
                {data.featuresTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {data.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    data-reveal="scale"
                    data-reveal-delay={100 + index * 100}
                    className="flex flex-col gap-5 rounded-2xl bg-card border border-white/5 p-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                      <Icon size={20} className="text-brand" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-ink-05 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonial ───────────────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-surface" aria-label="Customer testimonial">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <article
              data-reveal="scale"
              className="flex flex-col gap-6 rounded-2xl bg-card border border-white/5 p-8 lg:p-10"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-accent"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-lg text-white/80 leading-relaxed">
                &ldquo;{data.testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand text-sm font-bold">
                  {data.testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {data.testimonial.name}
                  </div>
                  <div className="text-xs text-ink-05">
                    {data.testimonial.venue} · {data.testimonial.city}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
