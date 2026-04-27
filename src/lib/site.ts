/**
 * Публичный URL сайта (для sitemap, robots, абсолютных ссылок).
 * На проде можно задать NEXT_PUBLIC_SITE_URL или SITE_URL.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (raw && typeof raw === "string") {
    const t = raw.trim().replace(/\/$/, "");
    if (t) return t;
  }
  return "https://gymacro.ru";
}

export const SITE_NAME = "Gymacro";

export const SITE_TITLE =
  "Gymacro — гимнастика: статьи и гайды для спортсменов и тренеров";

export const SITE_DESCRIPTION =
  "Gymacro — статьи и гайды о гимнастике: акробатика, спортивная и художественная гимнастика, аэробика, батут. Для спортсменов, тренеров и родителей: техника, ОФП, психология, соревнования.";
