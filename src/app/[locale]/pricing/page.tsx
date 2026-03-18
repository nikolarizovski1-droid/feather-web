import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingPageHero from "@/components/sections/PricingPageHero";
import PricingPlans from "@/components/sections/PricingPlans";
import PricingComparisonTable from "@/components/sections/PricingComparisonTable";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";

export const metadata: Metadata = {
  title: "Pricing — Feather Restaurant Marketing Platform",
  description:
    "Start free with Feather's digital menu. Upgrade to Growth or Pro to unlock push notifications, event promotions, analytics, and more.",
};

export default async function PricingPage({
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
        <PricingPageHero />
        <PricingPlans />
        <PricingComparisonTable />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
