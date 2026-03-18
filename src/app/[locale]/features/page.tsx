import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import FeaturesPageHero from "@/components/sections/FeaturesPageHero";
import FeaturesSubNav from "@/components/sections/FeaturesSubNav";
import FeatureDeepDive from "@/components/sections/FeatureDeepDive";
import PlatformDeepDive from "@/components/sections/PlatformDeepDive";
import CTABand from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Features — Feather Restaurant Marketing Platform",
  description:
    "Explore every Feather feature: instant native menus, product banners, auto push notifications, event promotions, TV display app, and one-tap table service — all managed from one admin dashboard.",
  openGraph: {
    title: "Features — Feather Restaurant Marketing Platform",
    description:
      "Explore every Feather feature: instant native menus, product banners, auto push notifications, event promotions, TV display app, and one-tap table service.",
    type: "website",
    siteName: "Feather",
  },
};

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <FeaturesPageHero />
        <FeaturesSubNav />
        <FeatureDeepDive />
        <PlatformDeepDive />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
