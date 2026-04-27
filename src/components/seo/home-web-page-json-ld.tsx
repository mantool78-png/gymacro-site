import { getSiteUrl, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Главная: WebPage + BreadcrumbList.
 * WebSite + Organization рендерятся глобально через SiteJsonLd в layout.
 * Ноды связаны через @id-ссылки — поисковики объединяют их автоматически.
 */
export function HomeWebPageJsonLd() {
  const baseUrl = getSiteUrl();

  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${baseUrl}/#website` },
        breadcrumb: { "@id": `${baseUrl}/#breadcrumb` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-intro"],
        },
        about: {
          "@type": "Thing",
          name: "Гимнастика",
          description:
            "Спортивная и художественная гимнастика, акробатика, аэробика, прыжки на батуте",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: baseUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
