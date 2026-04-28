import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, Building2 } from "lucide-react";
import { buildAlternates } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import CTABand from "@/components/sections/CTABand";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");

  const eyebrow = t("eyebrow");
  const companyName = t("companyName");
  const companyLabel = t("companyLabel");

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: "Contact", path: "/contact" }]} />
      <Navbar />
      <main>
        <section
          className="pt-36 pb-20 lg:pt-44 lg:pb-28 bg-surface"
          aria-labelledby="contact-page-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {eyebrow && (
              <p
                data-reveal="up"
                className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
              >
                {eyebrow}
              </p>
            )}

            <h1
              id="contact-page-heading"
              data-reveal="up"
              data-reveal-delay="80"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-08 tracking-tight leading-[1.1] mb-6 text-balance"
            >
              {t("title")}
            </h1>

            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-lg text-ink-05 leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              {t("description")}
            </p>

            <div
              data-reveal="up"
              data-reveal-delay="220"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              <a
                href={t("phoneHref")}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-black/5 bg-card p-6 text-left shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-05">
                    {t("phoneLabel")}
                  </span>
                  <span className="text-base font-semibold text-ink-08">
                    {t("phoneDisplay")}
                  </span>
                  <span className="text-sm text-brand font-medium mt-1 group-hover:underline">
                    {t("callCta")} →
                  </span>
                </div>
              </a>

              <a
                href={t("emailHref")}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-black/5 bg-card p-6 text-left shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-05">
                    {t("emailLabel")}
                  </span>
                  <span className="text-base font-semibold text-ink-08 break-all">
                    {t("emailAddress")}
                  </span>
                  <span className="text-sm text-brand font-medium mt-1 group-hover:underline">
                    {t("emailCta")} →
                  </span>
                </div>
              </a>
            </div>

            {companyName && (
              <div
                data-reveal="up"
                data-reveal-delay="280"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-ink-07 px-4 py-2"
              >
                <Building2 size={14} className="text-ink-05" />
                {companyLabel && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-05">
                    {companyLabel}
                  </span>
                )}
                <span className="text-sm text-ink-08 font-medium">
                  {companyName}
                </span>
              </div>
            )}
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
