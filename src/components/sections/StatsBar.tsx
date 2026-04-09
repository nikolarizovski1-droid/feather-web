import { getTranslations } from "next-intl/server";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

export default async function StatsBar() {
  const t = await getTranslations("StatsBar");

  const stats = [
    { value: t("stat0value"), label: t("stat0label") },
    { value: t("stat1value"), label: t("stat1label") },
    { value: t("stat2value"), label: t("stat2label") },
    { value: t("stat3value"), label: t("stat3label") },
  ];

  return (
    <section id="stats" className="bg-surface" aria-label="Platform statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-black/5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 px-6 gap-1.5 text-center"
            >
              <AnimatedCounter
                value={stat.value}
                className="text-3xl sm:text-4xl font-bold text-ink-08 tracking-tight"
              />
              <span className="text-sm text-ink-05 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
