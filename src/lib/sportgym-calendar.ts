import { cache } from "react";
import * as cheerio from "cheerio";
import type { DisciplineSlug } from "@/lib/mock-data";

/** Тип строки для бейджа — совместим с UI блока расписания */
export type CalendarEventType =
  | "international"
  | "world-cup"
  | "world-championship"
  | "russia-championship"
  | "russia-cup"
  | "all-russian"
  | "spartakiada";

export interface SportgymCalendarEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  link: string;
  disciplineSlug: DisciplineSlug;
  eventType: CalendarEventType;
}

const CALENDAR_BASE = "https://sportgymrus.ru/event-calendar.html";

const TITLE_PREFIX_TO_SLUG: Array<{ slug: DisciplineSlug; prefix: string }> = [
  { slug: "acrobatic", prefix: "Спортивная акробатика" },
  { slug: "artistic", prefix: "Спортивная гимнастика" },
  { slug: "rhythmic", prefix: "Художественная гимнастика" },
  { slug: "aerobic", prefix: "Спортивная аэробика" },
  { slug: "trampoline", prefix: "Прыжки на батуте" },
];

const MONTH_GEN: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

function monthIndex(name: string): number | undefined {
  const k = name.toLowerCase().trim();
  return MONTH_GEN[k];
}

/** Разбор ISO YYYY-MM-DD в локальную дату без сдвига UTC. */
export function parseIsoDateLocal(iso: string): Date {
  const day = iso.slice(0, 10);
  const [y, m, d] = day.split("-").map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d);
}

/**
 * Сколько полных календарных дней от сегодня (локальная полночь) до даты старта (YYYY-MM-DD).
 * Сегодня = 0, завтра = 1, … через 7 дней = 7.
 */
export function calendarDaysUntilStart(startDateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseIsoDateLocal(startDateIso);
  return Math.round((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Бейдж «на этой неделе»: старт через 1–6 полных дней (не сегодня, не «через неделю»). */
export function isStartThisCalendarWeek(startDateIso: string): boolean {
  const d = calendarDaysUntilStart(startDateIso);
  return d >= 1 && d <= 6;
}

/**
 * Бейдж «скоро»: уже не «на этой неделе», но старт ещё в обозримом горизонте.
 * Через 7–30 дней включительно.
 */
export function isStartSoon(startDateIso: string): boolean {
  const d = calendarDaysUntilStart(startDateIso);
  return d >= 7 && d <= 30;
}

/** Парсит строки дат с календаря ФГР (рус.) в ISO YYYY-MM-DD. */
export function parseRussianDateRange(raw: string): { dateStart: string; dateEnd: string } | null {
  let s = raw
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/г\.\s*/gi, "")
    .trim();

  // 22-27.04.2026
  let m = s.match(/^(\d{1,2})-(\d{1,2})\.(\d{2})\.(\d{4})$/);
  if (m) {
    const y = parseInt(m[4], 10);
    const mo = parseInt(m[3], 10) - 1;
    const d1 = parseInt(m[1], 10);
    const d2 = parseInt(m[2], 10);
    return { dateStart: ymd(y, mo, d1), dateEnd: ymd(y, mo, d2) };
  }

  // 21 - 26 января, 2026  /  2 - 6 мая, 2026
  m = s.match(
    /^(\d{1,2})\s*-\s*(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря),?\s*(\d{4})$/i,
  );
  if (m) {
    const y = parseInt(m[4], 10);
    const mo = monthIndex(m[3]!)!;
    const d1 = parseInt(m[1], 10);
    const d2 = parseInt(m[2], 10);
    return { dateStart: ymd(y, mo, d1), dateEnd: ymd(y, mo, d2) };
  }

  // 29 января - 1 февраля, 2026  /  27 апреля - 2 мая, 2026  /  30 мая - 4 июня, 2026
  m = s.match(
    /^(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*-\s*(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря),?\s*(\d{4})$/i,
  );
  if (m) {
    const y = parseInt(m[5], 10);
    const m1 = monthIndex(m[2]!)!;
    const m2 = monthIndex(m[4]!)!;
    const d1 = parseInt(m[1], 10);
    const d2 = parseInt(m[3], 10);
    return { dateStart: ymd(y, m1, d1), dateEnd: ymd(y, m2, d2) };
  }

  // 26 января, 2026 — один день
  m = s.match(
    /^(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря),?\s*(\d{4})$/i,
  );
  if (m) {
    const y = parseInt(m[3], 10);
    const mo = monthIndex(m[2]!)!;
    const d = parseInt(m[1], 10);
    const iso = ymd(y, mo, d);
    return { dateStart: iso, dateEnd: iso };
  }

  return null;
}

function ymd(y: number, m0: number, d: number): string {
  const mm = String(m0 + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function inferEventType(title: string): CalendarEventType {
  const t = title.toLowerCase();
  if (/чемпионат\s+мира|первенство\s+мира/.test(t)) return "world-championship";
  if (/кубок\s+мира|world\s+cup|fig\s+world/.test(t)) return "world-cup";
  if (/чемпионат\s+россии|первенство\s+россии/.test(t)) return "russia-championship";
  if (/кубок\s+россии/.test(t)) return "russia-cup";
  if (/спартакиад/.test(t)) return "spartakiada";
  if (/^мс\s|[\s.]мс\s|международн|European Cup|international/i.test(title)) return "international";
  return "all-russian";
}

function matchDiscipline(title: string): DisciplineSlug | null {
  const trimmed = title.trim();
  for (const { slug, prefix } of TITLE_PREFIX_TO_SLUG) {
    if (trimmed.startsWith(prefix)) return slug;
  }
  return null;
}

function stableId(href: string): string {
  const n = href.match(/competitions\/(\d+)/);
  return n ? `fgr-${n[1]}` : href;
}

function normalizeLocation(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/^ru\s*/i, "")
    .replace(/^Россия,\s*/i, "")
    .trim() || "—";
}

/**
 * Календарь на sportgymrus.ru — карточки div.b-box-event (не HTML-таблица).
 * Дата: .b-box-event__info-title, место: .b-box-event__info-subtitle, название: .b-box-event__title a
 */
function parseEventsFromHtml(html: string): SportgymCalendarEvent[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const out: SportgymCalendarEvent[] = [];

  $("div.b-box-event.m-radius").each((_, box) => {
    const $box = $(box);
    const $a = $box.find(".b-box-event__title a[href*='competitions/']").first();
    if (!$a.length) return;

    let href = $a.attr("href")?.trim() ?? "";
    if (!href.includes("competitions/")) return;
    if (href.startsWith("/")) href = `https://sportgymrus.ru${href}`;
    if (!href.startsWith("http")) return;

    const title = $a.text().replace(/\s+/g, " ").trim();
    if (!title) return;

    const disciplineSlug = matchDiscipline(title);
    if (!disciplineSlug) return;

    const id = stableId(href);
    if (seen.has(id)) return;
    seen.add(id);

    const dateRaw = $box.find(".b-box-event__info-title").first().text().replace(/\s+/g, " ").trim();
    const locRaw = $box.find(".b-box-event__info-subtitle").first().text().replace(/\s+/g, " ").trim();

    const parsed = parseRussianDateRange(dateRaw);
    if (!parsed) return;

    out.push({
      id,
      title,
      dateStart: parsed.dateStart,
      dateEnd: parsed.dateEnd,
      location: normalizeLocation(locRaw),
      link: href,
      disciplineSlug,
      eventType: inferEventType(title),
    });
  });

  out.sort((a, b) => a.dateStart.localeCompare(b.dateStart));
  return out;
}

async function fetchCalendarHtml(year: number): Promise<string> {
  const url = `${CALENDAR_BASE}?year=${year}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "Gymacro/1.0 (+https://gymacro.ru)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) {
    throw new Error(`sportgymrus calendar HTTP ${res.status}`);
  }
  return res.text();
}

export const getSportgymCalendarEvents = cache(async (year: number): Promise<SportgymCalendarEvent[]> => {
  const html = await fetchCalendarHtml(year);
  return parseEventsFromHtml(html);
});

export async function getSportgymCalendarEventsSafe(year: number): Promise<SportgymCalendarEvent[]> {
  try {
    return await getSportgymCalendarEvents(year);
  } catch {
    return [];
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function lastDayOfMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

/** Пересечение с календарным месяцем — сравнение строк YYYY-MM-DD без UTC. */
function eventsOverlappingMonth(
  events: SportgymCalendarEvent[],
  year: number,
  month: number,
): SportgymCalendarEvent[] {
  const monthStart = `${year}-${pad2(month + 1)}-01`;
  const ld = lastDayOfMonth(year, month);
  const monthEnd = `${year}-${pad2(month + 1)}-${pad2(ld)}`;

  return events.filter((e) => e.dateStart <= monthEnd && e.dateEnd >= monthStart);
}

export function getCurrentMonthBlockState(
  events: SportgymCalendarEvent[],
  disciplineSlug: DisciplineSlug,
): {
  competitions: SportgymCalendarEvent[];
  year: number;
  month: number;
  isFallback: boolean;
} {
  const scoped = events.filter((e) => e.disciplineSlug === disciplineSlug);
  const now = new Date();
  const y = now.getFullYear();
  const mo = now.getMonth();

  let list = eventsOverlappingMonth(scoped, y, mo);
  let year = y;
  let month = mo;
  let isFallback = false;

  if (list.length === 0) {
    for (let offset = 1; offset <= 14; offset++) {
      const d = new Date(y, mo + offset, 1);
      const tryList = eventsOverlappingMonth(scoped, d.getFullYear(), d.getMonth());
      if (tryList.length > 0) {
        list = tryList;
        year = d.getFullYear();
        month = d.getMonth();
        isFallback = true;
        break;
      }
    }
  }

  list = [...list].sort((a, b) => a.dateStart.localeCompare(b.dateStart));

  return { competitions: list, year, month, isFallback };
}

export function calendarYearForSite(): number {
  return new Date().getFullYear();
}

