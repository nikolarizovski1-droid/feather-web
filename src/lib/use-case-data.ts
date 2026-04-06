import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Zap,
  Users,
  CalendarCheck,
  Tv,
  Tag,
  Building2,
  Smartphone,
  BarChart3,
} from "lucide-react";

export type UseCaseType =
  | "fast-casual"
  | "fine-dining"
  | "multi-location";

/** Translation key used to look up content in UseCasePage namespace */
export type UseCaseTranslationKey =
  | "fastCasual"
  | "fineDining"
  | "multiLocation";

export interface UseCaseConfig {
  type: UseCaseType;
  translationKey: UseCaseTranslationKey;
  featureIcons: LucideIcon[];
  testimonialInitials: string;
  featuredPlan: "basic" | "standard" | "premium";
  heroImage: string;
}

const USE_CASES: Record<UseCaseType, UseCaseConfig> = {
  "fast-casual": {
    type: "fast-casual",
    translationKey: "fastCasual",
    featureIcons: [Bell, Zap, Users],
    testimonialInitials: "AA",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=85&auto=format&fit=crop",
  },
  "fine-dining": {
    type: "fine-dining",
    translationKey: "fineDining",
    featureIcons: [CalendarCheck, Tv, Tag],
    testimonialInitials: "SC",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85&auto=format&fit=crop",
  },
  "multi-location": {
    type: "multi-location",
    translationKey: "multiLocation",
    featureIcons: [Building2, Smartphone, BarChart3],
    testimonialInitials: "MB",
    featuredPlan: "premium",
    heroImage:
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1920&q=85&auto=format&fit=crop",
  },
};

export const USE_CASE_TYPES: UseCaseType[] = [
  "fast-casual",
  "fine-dining",
  "multi-location",
];

export function getUseCaseConfig(type: string): UseCaseConfig | null {
  return USE_CASES[type as UseCaseType] ?? null;
}
