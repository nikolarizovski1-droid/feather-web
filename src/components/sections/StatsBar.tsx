import { getTranslations } from "next-intl/server";

export default async function StatsBar() {
  const t = await getTranslations("StatsBar");

  const stats = [
    { value: t("stat0value"), label: t("stat0label") },
    { value: t("stat1value"), label: t("stat1label") },
    { value: t("stat2value"), label: t("stat2label") },
    { value: t("stat3value"), label: t("stat3label") },
  ];

  return (
    <section id="stats" className="bg-ink-08" aria-label="Platform statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-reveal="up"
              data-reveal-delay={80 + index * 70}
              className="flex flex-col items-center justify-center py-10 px-6 gap-1.5 text-center"
            >
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm text-ink-05 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
