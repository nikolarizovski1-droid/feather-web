import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ComparisonSection from "@/components/sections/ComparisonSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import PlatformDeepDive from "@/components/sections/PlatformDeepDive";
import HowItWorks from "@/components/sections/HowItWorks";
import PromotionsROI from "@/components/sections/PromotionsROI";
import AnalyticsDashboard from "@/components/sections/AnalyticsDashboard";
import Testimonials from "@/components/sections/Testimonials";
import PricingTeaser from "@/components/sections/PricingTeaser";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";

export default async function Home({
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
        <Hero />
        <StatsBar />
        <ComparisonSection />
        <FeaturesGrid />
        <AnalyticsDashboard />
        <PlatformDeepDive />
        <HowItWorks />
        <PromotionsROI />
        <Testimonials />
        <PricingTeaser />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
