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
  Truck,
  Wine,
  BedDouble,
  Coffee,
  ChefHat,
} from "lucide-react";

export type UseCaseType =
  | "fast-casual"
  | "fine-dining"
  | "multi-location"
  | "food-trucks"
  | "bars"
  | "hotels"
  | "cafes"
  | "ghost-kitchens";

/** Translation key used to look up content in UseCasePage namespace */
export type UseCaseTranslationKey =
  | "fastCasual"
  | "fineDining"
  | "multiLocation"
  | "foodTrucks"
  | "bars"
  | "hotels"
  | "cafes"
  | "ghostKitchens";

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
  "food-trucks": {
    type: "food-trucks",
    translationKey: "foodTrucks",
    featureIcons: [Truck, Bell, Zap],
    testimonialInitials: "JR",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=1920&q=85&auto=format&fit=crop",
  },
  bars: {
    type: "bars",
    translationKey: "bars",
    featureIcons: [Wine, CalendarCheck, Bell],
    testimonialInitials: "DK",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=85&auto=format&fit=crop",
  },
  hotels: {
    type: "hotels",
    translationKey: "hotels",
    featureIcons: [BedDouble, Tv, Building2],
    testimonialInitials: "LP",
    featuredPlan: "premium",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85&auto=format&fit=crop",
  },
  cafes: {
    type: "cafes",
    translationKey: "cafes",
    featureIcons: [Coffee, Tag, Users],
    testimonialInitials: "EM",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=85&auto=format&fit=crop",
  },
  "ghost-kitchens": {
    type: "ghost-kitchens",
    translationKey: "ghostKitchens",
    featureIcons: [ChefHat, Smartphone, BarChart3],
    testimonialInitials: "TN",
    featuredPlan: "standard",
    heroImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=85&auto=format&fit=crop",
  },
};

export const USE_CASE_TYPES: UseCaseType[] = [
  "fast-casual",
  "fine-dining",
  "multi-location",
  "food-trucks",
  "bars",
  "hotels",
  "cafes",
  "ghost-kitchens",
];

export function getUseCaseConfig(type: string): UseCaseConfig | null {
  return USE_CASES[type as UseCaseType] ?? null;
}
