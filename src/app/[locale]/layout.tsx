import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Feather — Restaurant Marketing Platform & Digital Menu System",
  description:
    "More than a QR menu. Feather is a complete restaurant marketing platform — push notifications, promotions, events, TV display app and analytics, all in one.",
  keywords:
    "digital menu system, QR code restaurant menu, digital menu app, restaurant marketing platform, restaurant digital menu",
  openGraph: {
    title: "Feather — Restaurant Marketing Platform & Digital Menu System",
    description:
      "More than a QR menu. Feather is a complete restaurant marketing platform — push notifications, promotions, events, TV display app and analytics, all in one.",
    type: "website",
    siteName: "Feather",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feather — Restaurant Marketing Platform & Digital Menu System",
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
  url: "https://featherapp.co",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
