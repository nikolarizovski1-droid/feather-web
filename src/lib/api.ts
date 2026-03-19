import type { PlansApiResponse } from "@/types/pricing";

const API_BASE = "https://dashboard.featherapp.net";

export async function fetchPricingPlans(
  countryCode?: string,
): Promise<PlansApiResponse | null> {
  try {
    const url = new URL(`${API_BASE}/api/v3/subscription/plans-public`);
    if (countryCode) {
      url.searchParams.set("country_code", countryCode.toLowerCase());
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Plans API returned ${res.status}`);
      return null;
    }

    return (await res.json()) as PlansApiResponse;
  } catch (err) {
    console.error("Failed to fetch pricing plans:", err);
    return null;
  }
}
