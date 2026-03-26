import { BASE_URL } from "@/lib/seo";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  locale: string;
  image?: string;
}

export default function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  locale,
  image,
}: ArticleJsonLdProps) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: "Feather",
    },
    publisher: {
      "@type": "Organization",
      name: "Feather",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: `${BASE_URL}/${locale}/blog/${slug}`,
    ...(image ? { image } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
    />
  );
}
