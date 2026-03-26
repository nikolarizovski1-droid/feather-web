import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface BlogPostCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  locale: string;
  index: number;
}

export default async function BlogPostCard({
  slug,
  title,
  date,
  description,
  locale,
  index,
}: BlogPostCardProps) {
  const t = await getTranslations("BlogPage");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

  return (
    <Link
      href={`/blog/${slug}`}
      data-reveal="scale"
      data-reveal-delay={100 + index * 80}
      className="group flex flex-col gap-4 rounded-2xl bg-card border border-black/5 p-7 hover:border-brand/20 transition-colors shadow-sm"
    >
      <time className="text-xs text-ink-05">{formattedDate}</time>
      <h2 className="text-lg font-bold text-ink-08 leading-snug group-hover:text-brand transition-colors">
        {title}
      </h2>
      <p className="text-sm text-ink-05 leading-relaxed line-clamp-3">
        {description}
      </p>
      <span className="text-sm font-medium text-brand mt-auto">
        {t("readMore")} &rarr;
      </span>
    </Link>
  );
}
