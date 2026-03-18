import { Bell, CalendarDays, ConciergeBell, Tv2, BarChart2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

const icons = [Bell, CalendarDays, Tv2, ConciergeBell, BarChart2];

type SnapshotItem = {
  title: string;
  description: string;
};

export default async function AboutPlatformSnapshot() {
  const t = await getTranslations("AboutPlatformSnapshot");
  const items = t.raw("items") as SnapshotItem[];

  return (
    <section
      className="py-24 lg:py-32 bg-ink-08"
      aria-labelledby="about-platform-snapshot-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-4"
          >
            {t("eyebrow")}
          </p>
          <h2
            id="about-platform-snapshot-heading"
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5"
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                key={item.title}
                data-reveal="scale"
                data-reveal-delay={80 + index * 70}
                className="rounded-2xl bg-card border border-white/5 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 mb-4">
                  <Icon size={18} className="text-brand" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-05 leading-relaxed">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
