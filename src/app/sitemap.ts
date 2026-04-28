import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.feathermenu.com";

const locales = routing.locales;

const staticPages = [
  "",
  "/about",
  "/faq",
  "/features",
  "/how-it-works",
  "/pricing",
];

const useCaseTypes = [
  "fast-casual",
  "fine-dining",
  "multi-location",
];

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

  // Blog listing page
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Individual blog posts
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
