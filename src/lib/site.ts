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

/**
 * Абсолютный канонический URL страницы без завершающего слэша
 * (корень сайта — только базовый домен).
 */
export function siteCanonical(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const trimmed = normalized.replace(/\/+$/, "");
  if (!trimmed || trimmed === "/") return base;
  return `${base}${trimmed}`;
}

export const SITE_NAME = "Gymacro";

export const SITE_TITLE =
  "Gymacro — понятная гимнастика для родителей: акробатика, художественная и спортивная";

export const SITE_DESCRIPTION =
  "Gymacro — медиа для родителей детей в гимнастических секциях: акробатика, спортивная и художественная гимнастика, аэробика, батут. Простым языком о секциях, растяжке, разрядах и соревнованиях — от первого занятия до большого старта.";

/** Яндекс.Метрика — счётчик в интерфейсе Метрики (можно переопределить через NEXT_PUBLIC_YANDEX_METRIKA_ID). */
export const YANDEX_METRIKA_ID: number = (() => {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();
  if (raw) {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 108246768;
})();
