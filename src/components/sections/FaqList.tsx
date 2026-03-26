import { getTranslations } from "next-intl/server";
import TrackedDetails from "@/components/ui/TrackedDetails";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export default async function FaqList() {
  const t = await getTranslations("FaqList");
  const categories = t.raw("categories") as FaqCategory[];

  return (
    <section
      className="bg-ink-08 pb-20 lg:pb-24"
      aria-labelledby="faq-list-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p
            data-reveal="up"
            className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
          >
            {t("eyebrow")}
          </p>
          <h2
            id="faq-list-heading"
            data-reveal="up"
            data-reveal-delay="80"
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
          >
            {t("title")}
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="160"
            className="text-ink-05 max-w-2xl mx-auto"
          >
            {t("description")}
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.title}
              data-reveal="up"
              data-reveal-delay={String(60 + categoryIndex * 40)}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <TrackedDetails
                    key={item.question}
                    question={item.question}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20"
                  >
                    <summary className="cursor-pointer list-none text-base sm:text-lg font-semibold text-white flex items-start justify-between gap-4">
                      <span>{item.question}</span>
                      <span
                        aria-hidden="true"
                        className="text-ink-05 group-open:text-white transition-colors"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-ink-05 leading-relaxed pr-8">
                      {item.answer}
                    </p>
                  </TrackedDetails>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
