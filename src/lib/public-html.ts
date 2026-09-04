import { SITE_EDITORIAL_EMAIL, SITE_TELEGRAM_URL } from "@/lib/site-contact";

const STALE_TELEGRAM_HREF =
  /https?:\/\/(?:t\.me|telegram\.me)\/gymacro\/?(?![A-Za-z0-9_])/gi;

const REQUISITES_PLACEHOLDER =
  /Реквизиты владельца Сайта:\s*\[при необходимости заполните\]\.?/gi;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Все публичные CTA ведут на единственный канал ACROTIM. */
export function rewriteStaleTelegramUrls(html: string): string {
  return html.replace(STALE_TELEGRAM_HREF, SITE_TELEGRAM_URL);
}

/**
 * Правки CMS-HTML, которые нельзя ждать от WP admin:
 * устаревший Telegram, почта без mailto, служебный плейсхолдер реквизитов.
 */
export function sanitizePublicPageHtml(html: string): string {
  let out = rewriteStaleTelegramUrls(html);

  out = out.replace(
    REQUISITES_PLACEHOLDER,
    `Связаться с редакцией можно по электронной почте: ${SITE_EDITORIAL_EMAIL}.`,
  );
  out = out.replace(/\[при необходимости заполните\]/gi, "");

  const emailRe = new RegExp(escapeRegExp(SITE_EDITORIAL_EMAIL), "gi");
  out = out.replace(emailRe, (match, offset: number, full: string) => {
    const before = full.slice(Math.max(0, offset - 80), offset);
    if (/mailto:\s*$/i.test(before)) return match;
    if (/href\s*=\s*["'][^"']*$/i.test(before)) return match;
    if (/<a\b[^>]*href\s*=\s*["']mailto:[^"']+["'][^>]*>\s*$/i.test(before)) return match;
    return `<a href="mailto:${SITE_EDITORIAL_EMAIL}">${SITE_EDITORIAL_EMAIL}</a>`;
  });

  return out;
}
