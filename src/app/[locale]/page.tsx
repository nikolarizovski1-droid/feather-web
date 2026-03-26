import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, BASE_URL } from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates(locale),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Feather",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: BASE_URL,
    description:
      "Restaurant marketing platform with digital menus, push notifications, promotions, events, TV display app, and analytics.",
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "0",
        priceCurrency: "USD",
        description: "Free digital menu with QR code",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "29",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "Push notifications, promotions, events, and analytics",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "79",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "Everything in Growth plus TV display app, advanced analytics, and priority support",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        {/* <StatsBar /> */}
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
