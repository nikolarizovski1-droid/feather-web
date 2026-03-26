import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, BASE_URL } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import FeaturesPageHero from "@/components/sections/FeaturesPageHero";
import FeaturesSubNav from "@/components/sections/FeaturesSubNav";
import FeatureDeepDive from "@/components/sections/FeatureDeepDive";
import AnalyticsDashboard from "@/components/sections/AnalyticsDashboard";
import PlatformDeepDive from "@/components/sections/PlatformDeepDive";
import CTABand from "@/components/sections/CTABand";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Features — Feather Restaurant Marketing Platform",
    description:
      "Explore Feather features: native menus, product banners, push notifications, event promotions, TV display app, and one-tap table service — one dashboard.",
    openGraph: {
      title: "Features — Feather Restaurant Marketing Platform",
      description:
        "Explore Feather features: native menus, product banners, push notifications, event promotions, TV display app, and one-tap table service.",
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/features"),
  };
}

export default async function FeaturesPage({
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
    featureList: [
      "Digital QR code menus",
      "Push notifications",
      "Event promotions",
      "Product banners",
      "TV display app",
      "One-tap table service",
      "Analytics dashboard",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <BreadcrumbJsonLd locale={locale} items={[{ name: "Features", path: "/features" }]} />
      <Navbar />
      <main>
        <FeaturesPageHero />
        <FeaturesSubNav />
        <FeatureDeepDive />
        <AnalyticsDashboard />
        <PlatformDeepDive />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
