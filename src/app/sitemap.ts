import type { MetadataRoute } from "next";

const BASE_URL = "https://feathermenu.com";

const locales = ["en", "mk"] as const;

const staticPages = [
  "",
  "/about",
  "/faq",
  "/features",
  "/how-it-works",
  "/pricing",
];

const useCaseTypes = ["fast-casual", "fine-dining", "multi-location"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Use-case pages for each locale
  for (const type of useCaseTypes) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/for/${type}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
