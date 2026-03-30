import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, BASE_URL } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
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

  // Keep in sync with actual pricing from API
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
        name: "Basic",
        price: "29",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "Events, Promotions, Products & Categories, Instant Menu, Menu Personalization",
      },
      {
        "@type": "Offer",
        name: "Standard",
        price: "69",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "All Basic features plus multi-language menus, Banner, Notifications, TV App",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "109",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "All Standard features plus Admin Operations, Call Actions, Orders, Pre-Order Promotions",
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
