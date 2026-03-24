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

export type UseCaseType = "fast-casual" | "fine-dining" | "multi-location";

export interface UseCaseFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface UseCaseTestimonial {
  quote: string;
  name: string;
  venue: string;
  city: string;
  initials: string;
}

export interface UseCaseData {
  type: UseCaseType;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    subheadline: string;
  };
  features: UseCaseFeature[];
  featuresTitle: string;
  testimonial: UseCaseTestimonial;
  featuredPlan: "basic" | "standard" | "premium";
}

const USE_CASES: Record<UseCaseType, UseCaseData> = {
  "fast-casual": {
    type: "fast-casual",
    meta: {
      title: "Feather for Fast Casual Restaurants — Digital Menu & Auto Marketing",
      description:
        "Feather helps fast casual restaurants go digital in minutes and re-engage every guest automatically — zero effort from your team.",
    },
    hero: {
      eyebrow: "For fast casual",
      headline1: "Your kitchen is fast.",
      headline2: "Your marketing should be too.",
      subheadline:
        "Every guest who scans your menu gets a push notification, sees your promos, and hears about your specials — automatically. No extra staff, no extra effort.",
    },
    featuresTitle: "Built for lean, fast-moving teams",
    features: [
      {
        icon: Bell,
        title: "Auto push notifications",
        description:
          "Every QR scan schedules a timed push notification. Set it once, and every guest gets re-engaged at the right moment — zero staff input required.",
      },
      {
        icon: Zap,
        title: "Live in under 10 minutes",
        description:
          "Upload your paper menu or PDF and AI builds the full digital menu — translated, categorised, and ready to go. No developers, no wait.",
      },
      {
        icon: Users,
        title: "One-tap table service",
        description:
          "Guests tap Call Waiter or Call Receipt and the right staff member gets an alert with the exact table. Less running, faster turns, happier guests.",
      },
    ],
    testimonial: {
      quote:
        "Push notifications changed how we think about slow Tuesdays. We sent a promo and had a fully booked evening. Never happened with a regular QR menu.",
      name: "Ahmed Al-Rashid",
      venue: "Souk Kitchen",
      city: "Dubai, UAE",
      initials: "AA",
    },
    featuredPlan: "standard",
  },

  "fine-dining": {
    type: "fine-dining",
    meta: {
      title: "Feather for Fine Dining — Event Marketing & Guest Experience",
      description:
        "Feather helps fine dining venues fill events, showcase signature items, and create a guest experience that starts before they arrive.",
    },
    hero: {
      eyebrow: "For fine dining",
      headline1: "Create an experience",
      headline2: "before they arrive.",
      subheadline:
        "Promote your events with one-tap calendar reminders, showcase featured items on every screen, and re-engage guests with perfectly timed push notifications.",
    },
    featuresTitle: "Tools for the full guest experience",
    features: [
      {
        icon: CalendarCheck,
        title: "Event promos + calendar reminders",
        description:
          "After every scan, guests get a notification about your next event. One tap books or saves it to their calendar. Fill every table without a single phone call.",
      },
      {
        icon: Tv,
        title: "TV Display App",
        description:
          "Transform your in-venue screens into a live marketing channel. Showcase signature dishes, upcoming events, and wine pairings — all updated in real time from your admin.",
      },
      {
        icon: Tag,
        title: "Product banners & upsells",
        description:
          "The first thing guests see after scanning is your hero banner. Spotlight tonight's tasting menu, a rare bottle, or a seasonal special — and add it to cart in one tap.",
      },
    ],
    testimonial: {
      quote:
        "The TV display app alone was worth it. Guests read our event promos while waiting, and event bookings have tripled since we started using Feather.",
      name: "Sarah Chen",
      venue: "Harbor View",
      city: "Sydney, Australia",
      initials: "SC",
    },
    featuredPlan: "standard",
  },

  "multi-location": {
    type: "multi-location",
    meta: {
      title: "Feather for Multi-Location Restaurants — One Dashboard, Every Venue",
      description:
        "Manage every location, every screen, and every team member from one Feather dashboard — with real-time analytics across your entire operation.",
    },
    hero: {
      eyebrow: "For multi-location",
      headline1: "One dashboard.",
      headline2: "Every venue. Every guest.",
      subheadline:
        "Manage menus, marketing, staff alerts, and in-venue screens across all your locations from a single admin. No duplicate logins, no lost context.",
    },
    featuresTitle: "Everything your operation needs at scale",
    features: [
      {
        icon: Building2,
        title: "Multi-venue management",
        description:
          "One dashboard controls every location — menus, promotions, QR codes, banners, and branding. Update one venue or push changes to all, instantly.",
      },
      {
        icon: Smartphone,
        title: "Staff apps for every team",
        description:
          "Real-time service alerts go to the right staff member at the right venue. Call Waiter, Call Receipt, and menu update notifications — all in dedicated iOS and Android apps.",
      },
      {
        icon: BarChart3,
        title: "Analytics across all locations",
        description:
          "See scan rates, engagement funnels, peak hours, and top products — per venue or rolled up across your entire operation. Make decisions with data, not guesswork.",
      },
    ],
    testimonial: {
      quote:
        "We switched from a basic QR menu and within a week our banner was promoting our new cocktail menu. Sales went up 23% that month alone.",
      name: "Marco Bianchi",
      venue: "La Terrazza",
      city: "Milan, Italy",
      initials: "MB",
    },
    featuredPlan: "premium",
  },
};

export const USE_CASE_TYPES: UseCaseType[] = [
  "fast-casual",
  "fine-dining",
  "multi-location",
];

export function getUseCaseData(type: string): UseCaseData | null {
  return USE_CASES[type as UseCaseType] ?? null;
}
