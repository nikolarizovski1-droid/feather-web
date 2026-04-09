import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import CookieConsent from "@/components/ui/CookieConsent";
import ScrollProgress from "@/components/ui/ScrollProgress";

const GTM_ID = "GTM-WQX9GZQB";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Feather — Restaurant Marketing & Digital Menu",
  description:
    "More than a QR menu. Feather is a complete restaurant marketing platform — push notifications, promotions, events, TV display app and analytics.",
  keywords:
    "digital menu system, QR code restaurant menu, digital menu app, restaurant marketing platform, restaurant digital menu",
  openGraph: {
    title: "Feather — Restaurant Marketing & Digital Menu",
    description:
      "More than a QR menu. Feather is a complete restaurant marketing platform — push notifications, promotions, events, TV display app and analytics.",
    type: "website",
    siteName: "Feather",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feather — Restaurant Marketing & Digital Menu",
    description:
      "More than a QR menu. Feather is a complete restaurant marketing platform.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Feather",
  description: "Restaurant Marketing Platform & Digital Menu System",
  url: "https://feathermenu.com",
  logo: "https://feathermenu.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://feathermenu.com/en/faq",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <ScrollProgress />
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
