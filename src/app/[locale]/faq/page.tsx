import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import CTABand from "@/components/sections/CTABand";
import FaqPageHero from "@/components/sections/FaqPageHero";
import FaqList from "@/components/sections/FaqList";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FaqPageMeta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/faq"),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqT = await getTranslations({ locale, namespace: "FaqList" });
  const categories = faqT.raw("categories") as FaqCategory[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: "FAQ", path: "/faq" }]} />
      <Navbar />
      <main>
        <FaqPageHero />
        <FaqList />
        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
