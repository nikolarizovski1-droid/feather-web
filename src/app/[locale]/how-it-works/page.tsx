import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/sections/HowItWorks";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import Button from "@/components/ui/Button";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowItWorksPage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/how-it-works"),
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HowItWorksPage");

  type FaqItem = { question: string; answer: string };
  const faqItems = t.raw("faq.items") as FaqItem[];

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to get started with Feather",
    description:
      "Set up your restaurant's digital menu and marketing platform in three simple steps.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Set up your menu",
        text: "Upload your menu items, photos, and prices. Feather generates a beautiful digital menu and QR code instantly.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Activate marketing",
        text: "Enable push notifications, promotions, and events to automatically engage guests who scan your menu.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Every scan works",
        text: "Each QR scan builds your guest list and drives repeat visits through automated re-engagement campaigns.",
      },
    ],
  };

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: "How It Works", path: "/how-it-works" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Navbar />
      <main>

        {/* ── Page Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink-08 pt-28 pb-20 lg:pt-36 lg:pb-28">
          {/* Subtle brand glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,96,100,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p
              data-reveal="up"
              className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
            >
              {t("hero.eyebrow")}
            </p>
            <h1
              data-reveal="up"
              data-reveal-delay="80"
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] mb-6"
            >
              {t("hero.title")}
            </h1>
            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-lg text-white/55 leading-relaxed mb-10 max-w-xl mx-auto"
            >
              {t("hero.description")}
            </p>
            <div
              data-reveal="up"
              data-reveal-delay="240"
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button href="/signup" size="lg">
                {t("hero.startTrial")}
              </Button>
              <Button href="/pricing" variant="ghost" size="lg">
                {t("hero.seePricing")}
              </Button>
            </div>
          </div>

          {/* Scroll cue into the steps */}
          <div className="mt-12 flex justify-center text-white/20">
            <ChevronDown size={22} className="animate-bounce" />
          </div>
        </section>

        {/* ── 3-Step Section (reused from homepage) ─────────────────── */}
        <HowItWorks />

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-ink-08" aria-labelledby="hiw-faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-14">
              <p
                data-reveal="up"
                className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
              >
                {t("faq.eyebrow")}
              </p>
              <h2
                id="hiw-faq-heading"
                data-reveal="up"
                data-reveal-delay="80"
                className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
              >
                {t("faq.title")}
              </h2>
            </div>

            <div
              data-reveal="up"
              data-reveal-delay="160"
              className="divide-y divide-white/[0.07]"
            >
              {faqItems.map((item) => (
                <div key={item.question} className="py-6">
                  <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                    {item.question}
                  </h3>
                  <p className="text-sm text-ink-05 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
