import { BASE_URL } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  path?: string;
};

export default function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        ...(item.path
          ? { item: `${BASE_URL}/${locale}${item.path}` }
          : {}),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
