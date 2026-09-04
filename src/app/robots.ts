import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        /** При Disallow /cms/: лента на Next — /feed/zen; только uploads (картинки), без plugins/themes — меньше ложных обходов и 404 в GSC. */
        allow: ["/", "/feed/", "/cms/wp-content/uploads/"],
        disallow: ["/cms/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
