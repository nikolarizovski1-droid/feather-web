export function getLocalized(
  translations: Record<string, string>,
  locale: string,
): string {
  return translations[locale] ?? translations["en"] ?? Object.values(translations)[0] ?? "";
}
