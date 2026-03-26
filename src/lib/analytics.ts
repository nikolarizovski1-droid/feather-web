// GTM dataLayer push utility
// All event tracking goes through GTM — GA4 is configured inside GTM, not hardcoded.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("feather_cookie_consent") === "accepted";
}

export function trackEvent(event: string, params?: EventParams) {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// Pre-defined events matching our tracking plan
export const events = {
  pricingView: () => trackEvent("pricing_view"),
  planToggle: (duration: string) => trackEvent("plan_toggle", { duration }),
  ctaClick: (location: string, label: string) =>
    trackEvent("cta_click", { cta_location: location, cta_label: label }),
  faqExpand: (question: string) => trackEvent("faq_expand", { question }),
  useCaseClick: (type: string) => trackEvent("use_case_click", { use_case: type }),
} as const;
