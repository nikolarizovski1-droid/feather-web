import type { Metadata } from "next";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingPageHero from "@/components/sections/PricingPageHero";
import PricingPlans from "@/components/sections/PricingPlans";
import PromotionsROI from "@/components/sections/PromotionsROI";
import PricingComparisonTable from "@/components/sections/PricingComparisonTable";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import { fetchPricingPlans } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pricing — Feather Restaurant Marketing Platform",
  description:
    "Start free with Feather's digital menu. Upgrade to Growth or Pro to unlock push notifications, event promotions, analytics, and more.",
};

function getCountryCode(headersList: Headers): string | undefined {
  const vercel = headersList.get("x-vercel-ip-country");
  if (vercel && vercel.length === 2 && vercel !== "XX") return vercel;

  const cloudflare = headersList.get("cf-ipcountry");
  if (cloudflare && cloudflare.length === 2 && cloudflare !== "XX")
    return cloudflare;

  return undefined;
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headersList = await headers();
  const countryCode = getCountryCode(headersList);
  const plansData = await fetchPricingPlans(countryCode);

  return (
    <>
      <Navbar />
      <main>
        <PricingPageHero />
        <PricingPlans plans={plansData} locale={locale} />
        <PromotionsROI />
        <PricingComparisonTable plans={plansData} locale={locale} />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
