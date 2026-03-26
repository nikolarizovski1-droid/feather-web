import type { Metadata } from "next";

export const BASE_URL = "https://feathermenu.com";

/**
 * Build alternates object with canonical + hreflang for a given page path.
 * @param locale - Current locale ("en" | "mk")
 * @param path - Page path without locale prefix, e.g. "/about" or "" for home
 */
export function buildAlternates(
  locale: string,
  path: string = ""
): Metadata["alternates"] {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      en: `${BASE_URL}/en${path}`,
      mk: `${BASE_URL}/mk${path}`,
      "x-default": `${BASE_URL}/en${path}`,
    },
  };
}
