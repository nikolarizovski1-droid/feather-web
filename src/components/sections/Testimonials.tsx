import { getTranslations } from "next-intl/server";

const testimonialInitials = ["MB", "SC", "AA"];
const testimonialStars = [5, 5, 5];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-accent"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const t = await getTranslations("Testimonials");

  type TestimonialMsg = { quote: string; name: string; venue: string; city: string };
  const testimonials = (t.raw("testimonials") as TestimonialMsg[]).map((item, i) => ({
    ...item,
    initials: testimonialInitials[i],
    stars: testimonialStars[i],
  }));

  return (
    <section
      className="py-24 lg:py-32 bg-surface"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
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

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              data-reveal="scale"
              data-reveal-delay={100 + index * 100}
              className="flex flex-col gap-5 rounded-2xl bg-card border border-black/5 p-7 hover:border-black/10 transition-colors duration-300 shadow-sm"
            >
              <StarRating count={testimonial.stars} />

              <blockquote className="text-sm text-ink-05 leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand text-sm font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-08">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-ink-05">
                    {testimonial.venue} · {testimonial.city}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
