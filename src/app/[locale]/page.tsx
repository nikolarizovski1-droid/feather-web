import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ComparisonSection from "@/components/sections/ComparisonSection";
import HowItWorks from "@/components/sections/HowItWorks";
import WhoIsItFor from "@/components/sections/WhoIsItFor";
import Testimonials from "@/components/sections/Testimonials";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import MobileCTABar from "@/components/ui/MobileCTABar";

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
        <HowItWorks />
        <WhoIsItFor />
        <Testimonials />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
      <MobileCTABar />
    </>
  );
}
