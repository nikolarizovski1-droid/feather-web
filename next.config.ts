import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  redirects: async () => [
    // Old/dead URLs that Google is crawling
    { source: "/signup", destination: "/en/app/onboarding", permanent: true },
    { source: "/terms", destination: "/en", permanent: false },
    // Removed use-case pages
    { source: "/:locale/for/food-trucks", destination: "/:locale", permanent: true },
    { source: "/:locale/for/bars", destination: "/:locale", permanent: true },
    { source: "/:locale/for/hotels", destination: "/:locale", permanent: true },
    { source: "/:locale/for/cafes", destination: "/:locale", permanent: true },
    { source: "/:locale/for/ghost-kitchens", destination: "/:locale", permanent: true },
  ],
};

export default withNextIntl(nextConfig);
