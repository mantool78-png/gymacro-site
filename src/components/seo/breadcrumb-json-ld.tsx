import { getSiteUrl } from "@/lib/site";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = getSiteUrl();

  const listItems = [
    { "@type": "ListItem" as const, position: 1, name: "Главная", item: baseUrl },
    ...items.map((it, i) => ({
      "@type": "ListItem" as const,
      position: i + 2,
      name: it.name,
      item: `${baseUrl}${it.href}`,
    })),
  ];

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
