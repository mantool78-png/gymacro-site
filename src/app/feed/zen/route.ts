import {
  decodeHtmlEntities,
  stripHtml,
  type WpPost,
} from "@/lib/wp";
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/site";

export const dynamic = "force-dynamic";

/** RSS для Яндекс Дзена: ссылки ведут на канонические URL Next (/posts/…), не на /cms/… */
const ITEMS = 30;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(html: string): string {
  return html.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

const CMS_MEDIA_ATTR =
  /\s(src|data-src|data-large_image|data-lazy-src|data-original)=(["'])(\/cms\/(?:wp-content|wp-includes)\/[^"'<>]*)\2/gi;

/**
 * Абсолютные https-URL медиафайлов WP. Дзен часто игнорирует относительные пути в RSS.
 */
function absolutizeWpCmsUrls(html: string, siteBase: string): string {
  const b = siteBase.replace(/\/$/, "");
  return html.replace(
    CMS_MEDIA_ATTR,
    (_full, attr: string, quote: string, path: string) =>
      ` ${attr}=${quote}${b}${path}${quote}`,
  );
}

/** Комма-разделённый srcset: дописать базовый домен у путей /cms/.... */
function absolutizeSrcSet(html: string, siteBase: string): string {
  const b = siteBase.replace(/\/$/, "");
  return html.replace(
    /\ssrcset=(["'])([^"']+)\1/gi,
    (_, quote: string, list: string) => {
      const parts = list.split(",").map((chunk: string) => {
        const t = chunk.trim();
        const sp = t.indexOf(" ");
        const raw = sp >= 0 ? t.slice(0, sp) : t;
        const suf = sp >= 0 ? t.slice(sp) : "";
        const url = raw.trim();
        if (url.startsWith("/cms/")) return `${b}${url}${suf}`;
        return t;
      });
      return ` srcset=${quote}${parts.join(", ")}${quote}`;
    },
  );
}

/** Ленивая загрузка: подставить в src после абсолютизации data-src, если src пустой или data:image. */
function promoteLazyImgSrc(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const lazyM = /\bdata-src=(["'])([^"']*)\1/i.exec(tag);
    if (!lazyM) return tag;
    const quote = lazyM[1];
    const lazyUrl = lazyM[2].trim();
    const srcInner = /\bsrc=(["'])([^"']*)\1/i.exec(tag)?.[2]?.trim() ?? "";
    const trivial =
      !srcInner ||
      /^data:image\//i.test(srcInner) ||
      srcInner.length < 12 ||
      /^about:blank$/i.test(srcInner);

    if (!trivial || !/^https?:\/\//i.test(lazyUrl)) return tag;

    if (/\bsrc=/i.test(tag)) {
      return tag.replace(/\bsrc=(["']).*?\1/i, `src=${quote}${lazyUrl}${quote}`);
    }
    return tag.replace(/^<img\b/i, `<img src=${quote}${lazyUrl}${quote} `);
  });
}

/**
 * Обложка из контента для enclosure (если в WP не указали «Изображение записи»).
 */
function firstCmsUploadFromHtml(html: string, siteBase: string): string | null {
  const b = siteBase.replace(/\/$/, "");
  const attrs =
    /<[^>]*?(?:src|data-src|data-large_image)=(["'])([^"']+)\1/gi;
  let m;
  while ((m = attrs.exec(html)) !== null) {
    let u = m[2]?.trim();
    if (!u || u.startsWith("data:")) continue;
    if (u.startsWith("//")) u = `https:${u}`;
    else if (u.startsWith("/")) u = `${b}${u}`;
    if (!/wp-content\/uploads\//i.test(u)) continue;
    return u;
  }
  return null;
}

function rssBodyHtml(wpHtml: string, siteBase: string): string {
  let h = decodeHtmlEntities(stripUnsafeHtml(wpHtml));
  h = absolutizeWpCmsUrls(h, siteBase);
  h = absolutizeSrcSet(h, siteBase);
  h = promoteLazyImgSrc(h);
  return h;
}

/** WordPress отдаёт date_gmt без суффикса зоны — это UTC. */
function pubDateRfc822(dateGmt: string): string {
  const raw = dateGmt.trim();
  const iso = raw.endsWith("Z") ? raw : `${raw.replace(" ", "T")}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toUTCString().replace("GMT", "+0000");
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  const mon = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][d.getUTCMonth()];
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  const yyyy = d.getUTCFullYear();
  return `${wd}, ${dd} ${mon} ${yyyy} ${hh}:${mm}:${ss} +0000`;
}

function featuredImageUrl(post: WpPost): string | null {
  const url = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (typeof url !== "string" || !url.trim()) return null;
  return url.trim();
}

function absoluteMediaUrl(url: string | null | undefined, siteBase: string): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const b = siteBase.replace(/\/$/, "");
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/")) return `${b}${u}`;
  return u;
}

function enclosureType(url: string): string {
  const lower = url.split("?")[0]?.toLowerCase() ?? "";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

function postPublicPath(slug: string): string {
  return `/posts/${slug}`;
}

export async function GET(): Promise<Response> {
  const base = getSiteUrl();
  const wpUrl = new URL(`${base}/cms/wp-json/wp/v2/posts`);
  wpUrl.searchParams.set("_embed", "1");
  wpUrl.searchParams.set("per_page", String(ITEMS));
  wpUrl.searchParams.set("orderby", "date");
  wpUrl.searchParams.set("order", "desc");
  wpUrl.searchParams.set("status", "publish");

  const res = await fetch(wpUrl.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return new Response(`WordPress недоступен: ${res.status}`, {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const data: unknown = await res.json();
  const posts = Array.isArray(data) ? (data as WpPost[]) : [];

  const channelLink = base;
  const selfLink = `${base}/feed/zen`;

  const itemsXml = posts.map((post) => {
    const title = decodeHtmlEntities(stripHtml(post.title?.rendered ?? "")).trim() || "Без названия";
    const description = decodeHtmlEntities(stripHtml(post.excerpt?.rendered ?? "")).trim();
    const slug = post.slug;
    const link = `${base}${postPublicPath(slug)}`;
    const guid =
      decodeHtmlEntities(stripHtml(post.guid?.rendered ?? "")).trim() ||
      `gymacro-post-${post.id}`;
    const pub = pubDateRfc822(post.date_gmt ?? post.date);
    const bodyHtml = rssBodyHtml(post.content?.rendered ?? "", base);
    const img = absoluteMediaUrl(
      featuredImageUrl(post) ?? firstCmsUploadFromHtml(bodyHtml, base),
      base,
    );
    const encodedBody = escapeCdata(`<h1>${title}</h1>${bodyHtml}`);

    const enclosure =
      img != null
        ? `\n        <enclosure url="${escapeXml(img)}" type="${enclosureType(img)}"/>`
        : "";

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(guid)}</guid>
      <pubDate>${escapeXml(pub)}</pubDate>
      <description>${escapeXml(description.slice(0, 500))}</description>
      <media:rating scheme="urn:simple">nonadult</media:rating>${enclosure}
      <content:encoded><![CDATA[${encodedBody}]]></content:encoded>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ru</language>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml"/>
${itemsXml.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=120",
    },
  });
}
