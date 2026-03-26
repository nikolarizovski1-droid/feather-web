import Image from "next/image";
import {
  Zap,
  Star,
  Bell,
  CalendarDays,
  Tv2,
  ConciergeBell,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const featureIcons: LucideIcon[] = [Zap, Star, Bell, CalendarDays, Tv2, ConciergeBell];
const featureMockupSrcs = [
  "/mockups/Mockup1.png",
  "/mockups/banner-mockup.png",
  "/mockups/top-product-mockup.png",
  "/mockups/promotions-mockup.png",
  "/mockups/tv-mockup.png",
  "/mockups/Mockup2.png",
];
const featureMockupSizes = [
  { width: 546, height: 1118 },
  { width: 596, height: 1030 },
  { width: 795, height: 1111 },
  { width: 3002, height: 1756 },
  { width: 2354, height: 1574 },
  { width: 571, height: 900 },
];

function FeatureMockup({
  label,
  src,
  width,
  height,
}: {
  label: string;
  src: string;
  width: number;
  height: number;
}) {
  return (
    <div className="mx-auto w-full h-[360px] rounded-2xl overflow-hidden p-3 flex items-center justify-center">
      <Image
        src={src}
        alt={label}
        width={width}
        height={height}
        className="max-h-full max-w-full h-auto w-auto object-contain"
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 42vw, 92vw"
        priority
      />
    </div>
  );
}

export default async function FeaturesGrid() {
  const t = await getTranslations("FeaturesGrid");

  type FeatureMsg = { title: string; description: string; mockupLabel: string };
  const features = (t.raw("features") as FeatureMsg[]).map((f, i) => ({
    ...f,
    icon: featureIcons[i],
    mockupSrc: featureMockupSrcs[i],
    mockupWidth: featureMockupSizes[i].width,
    mockupHeight: featureMockupSizes[i].height,
  }));

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
          >
            {t("eyebrow")}
          </p>
          <h2
            id="features-heading"
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-08 tracking-tight mb-5"
          >
            {t("title")}
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="160"
            className="text-lg text-ink-05 leading-relaxed"
          >
            {t("description")}
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                data-reveal="scale"
                data-reveal-delay={100 + index * 80}
                className="group rounded-2xl bg-card border border-black/5 p-6 flex flex-col gap-5 hover:border-brand/20 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg"
              >
                {/* Mockup */}
                <div className="flex justify-center py-2">
                  <FeatureMockup
                    label={feature.mockupLabel}
                    src={feature.mockupSrc}
                    width={feature.mockupWidth}
                    height={feature.mockupHeight}
                  />
                </div>

                {/* Text content */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 group-hover:bg-brand/15 transition-colors">
                      <Icon size={18} className="text-brand" />
                    </div>
                    <h3 className="font-semibold text-ink-08 text-sm leading-tight">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-ink-05 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
