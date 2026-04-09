import Image from "next/image";
import { Check, type LucideIcon, Zap, Star, Bell, CalendarDays, Tv2, ConciergeBell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import MotionFade from "@/components/motion/MotionFade";
import {
  StaggeredList,
  StaggeredListItem,
} from "@/components/motion/ComparisonAnimations";

const featureIds = [
  "instant-access",
  "banners",
  "notifications",
  "events",
  "tv-app",
  "service",
];

const featureIcons: LucideIcon[] = [Zap, Star, Bell, CalendarDays, Tv2, ConciergeBell];

const featureMockups = [
  { src: "/mockups/Mockup1.png", width: 546, height: 1118 },
  { src: "/mockups/banner-mockup.png", width: 596, height: 1030 },
  { src: "/mockups/top-product-mockup.png", width: 795, height: 1111 },
  { src: "/mockups/promotions-mockup.png", width: 3002, height: 1756 },
  { src: "/mockups/tv-mockup.png", width: 2354, height: 1574 },
  { src: "/mockups/Mockup2.png", width: 571, height: 900 },
];

interface FeatureSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  mockupSrc: string;
  mockupWidth: number;
  mockupHeight: number;
  mockupLabel: string;
  icon: LucideIcon;
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <StaggeredList className="space-y-3">
      {bullets.map((bullet) => (
        <StaggeredListItem key={bullet} className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <Check size={11} className="text-brand" />
          </div>
          <span className="text-sm text-ink-05 leading-relaxed">{bullet}</span>
        </StaggeredListItem>
      ))}
    </StaggeredList>
  );
}

function FeatureSectionCard({
  feature,
  index,
}: {
  feature: FeatureSection;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const Icon = feature.icon;
  const bg = isEven ? "bg-surface" : "bg-ink-07";

  return (
    <section
      id={feature.id}
      className={`py-24 lg:py-32 ${bg} scroll-mt-28`}
      aria-labelledby={`feature-${feature.id}-heading`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            isEven ? "" : "lg:[direction:rtl]"
          }`}
        >
          {/* Text — slides in from the text side */}
          <div className={isEven ? "" : "lg:[direction:ltr]"}>
            <MotionFade direction={isEven ? "left" : "right"}>
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <Icon size={16} className="text-brand" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand">
                  {feature.eyebrow}
                </p>
              </div>
            </MotionFade>

            <MotionFade direction={isEven ? "left" : "right"} delay={0.08}>
              <h2
                id={`feature-${feature.id}-heading`}
                className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-ink-08 tracking-tight leading-tight mb-5"
              >
                {feature.title}
              </h2>
            </MotionFade>

            <MotionFade direction={isEven ? "left" : "right"} delay={0.16}>
              <p className="text-ink-05 text-lg leading-relaxed mb-8">
                {feature.description}
              </p>
            </MotionFade>

            <BulletList bullets={feature.bullets} />
          </div>

          {/* Mockup — slides in from the opposite side */}
          <MotionFade
            direction={isEven ? "right" : "left"}
            delay={0.12}
            className={`flex justify-center ${isEven ? "" : "lg:[direction:ltr]"}`}
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              <div className="absolute inset-0 rounded-3xl bg-brand/5 blur-3xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden p-4 flex items-center justify-center min-h-[400px]">
                <Image
                  src={feature.mockupSrc}
                  alt={feature.mockupLabel}
                  width={feature.mockupWidth}
                  height={feature.mockupHeight}
                  className="max-h-[420px] max-w-full h-auto w-auto object-contain"
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 90vw"
                />
              </div>
            </div>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}

export default async function FeatureDeepDive() {
  const t = await getTranslations("FeatureDeepDive");

  type FeatureMsg = {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    mockupLabel: string;
  };

  const features: FeatureSection[] = (t.raw("features") as FeatureMsg[]).map(
    (f, i) => ({
      id: featureIds[i],
      eyebrow: f.eyebrow,
      title: f.title,
      description: f.description,
      bullets: f.bullets,
      mockupSrc: featureMockups[i].src,
      mockupWidth: featureMockups[i].width,
      mockupHeight: featureMockups[i].height,
      mockupLabel: f.mockupLabel,
      icon: featureIcons[i],
    })
  );

  return (
    <>
      {features.map((feature, index) => (
        <FeatureSectionCard key={feature.id} feature={feature} index={index} />
      ))}
    </>
  );
}
