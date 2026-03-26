import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import AboutPageHero from "@/components/sections/AboutPageHero";
import AboutNarrative from "@/components/sections/AboutNarrative";
import AboutPlatformSnapshot from "@/components/sections/AboutPlatformSnapshot";
import StatsBar from "@/components/sections/StatsBar";
import Testimonials from "@/components/sections/Testimonials";
import CTABand from "@/components/sections/CTABand";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About — Feather Restaurant Marketing Platform",
    description:
      "Learn how Feather helps restaurants turn every QR scan into revenue through automated promotions, guest re-engagement, and real-time operational tools.",
    openGraph: {
      title: "About — Feather Restaurant Marketing Platform",
      description:
        "Learn how Feather helps restaurants turn every QR scan into revenue through automated promotions, guest re-engagement, and real-time operational tools.",
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: "About", path: "/about" }]} />
      <Navbar />
      <main>
        <AboutPageHero />
        <AboutNarrative />
        {/* <StatsBar /> */}
        <AboutPlatformSnapshot />
        <Testimonials />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
