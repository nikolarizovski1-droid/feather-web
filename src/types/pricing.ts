export interface PlanFeature {
  name: string;
  description: string;
  title_translations: Record<string, string>;
  description_translations: Record<string, string>;
  is_direct?: boolean;
}

export interface PlanPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export type PlanDuration = "1m" | "6m" | "1y";

export type PlanKey = "basic" | "standard" | "premium";

export interface Plan {
  id: number;
  plan_key: PlanKey;
  plan_tier: number;
  duration: PlanDuration;
  name: string;
  description: string;
  name_translations: Record<string, string>;
  description_translations: Record<string, string>;
  price: PlanPrice;
  stripe_price_id: string;
  features: PlanFeature[];
  direct_features: Omit<PlanFeature, "is_direct">[];
}

export interface PlansCountry {
  id: number;
  code: string;
  name: string;
}

export interface PlansApiResponse {
  country: PlansCountry | null;
  currency: string;
  plans: Plan[];
}
