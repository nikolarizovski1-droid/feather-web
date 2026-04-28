import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const BASE_URL = "https://www.feathermenu.com";

/**
 * Build alternates object with canonical + hreflang for a given page path.
 * @param locale - Current locale (any locale defined in routing.locales)
 * @param path - Page path without locale prefix, e.g. "/about" or "" for home
 */
export function buildAlternates(
  locale: string,
  path: string = ""
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${path}`;

  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages,
  };
}
