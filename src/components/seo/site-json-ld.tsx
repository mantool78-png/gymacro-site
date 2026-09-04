import { getSiteUrl, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { SITE_EDITORIAL_EMAIL, SITE_TELEGRAM_URL, SITE_VK_URL } from "@/lib/site-contact";

/** Возвращает базовые ноды графа (WebSite + Organization) для переиспользования. */
export function getSiteGraphNodes() {
  const baseUrl = getSiteUrl();
  return [
    {
      "@type": "WebSite" as const,
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "ru-RU",
      publisher: { "@id": `${baseUrl}/#organization` },
    },
    {
      "@type": "Organization" as const,
      "@id": `${baseUrl}/#organization`,
      name: SITE_NAME,
      url: baseUrl,
      logo: {
        "@type": "ImageObject" as const,
        "@id": `${baseUrl}/#logo`,
        url: `${baseUrl}/icon.svg`,
        contentUrl: `${baseUrl}/icon.svg`,
        width: 32,
        height: 32,
        caption: SITE_NAME,
      },
      sameAs: [SITE_TELEGRAM_URL, SITE_VK_URL],
      availableLanguage: ["ru-RU"],
      areaServed: {
        "@type": "Country" as const,
        name: "Россия",
        sameAs: "https://www.wikidata.org/wiki/Q159",
      },
      address: {
        "@type": "PostalAddress" as const,
        addressCountry: "RU",
      },
      contactPoint: {
        "@type": "ContactPoint" as const,
        contactType: "editorial",
        email: SITE_EDITORIAL_EMAIL,
        url: `${baseUrl}/contact`,
        availableLanguage: ["ru-RU"],
      },
    },
  ];
}

/** Рендерит JSON-LD с WebSite + Organization (для страниц без собственного JSON-LD). */
export function SiteJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@graph": getSiteGraphNodes(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
