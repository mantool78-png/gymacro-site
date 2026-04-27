import type { CalendarEventType, SportgymCalendarEvent } from "@/lib/sportgym-calendar";
import {
  getCurrentMonthBlockState,
  isStartSoon,
  isStartThisCalendarWeek,
  parseIsoDateLocal,
} from "@/lib/sportgym-calendar";
import type { DisciplineSlug } from "@/lib/mock-data";
import { disciplineAccents } from "@/lib/mock-data";

interface StaticScheduleBlockProps {
  disciplineSlug: DisciplineSlug;
  events: SportgymCalendarEvent[];
}

const TYPE_LABELS: Record<
  CalendarEventType,
  { label: string; color: string }
> = {
  "world-championship": { label: "Чемпионат мира", color: "bg-amber-50 text-amber-700 ring-amber-200" },
  "world-cup": { label: "Кубок мира", color: "bg-sky-50 text-sky-700 ring-sky-200" },
  international: { label: "Международные", color: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  "russia-championship": { label: "Первенство / Чемп. России", color: "bg-violet-50 text-violet-700 ring-violet-200" },
  "russia-cup": { label: "Кубок России", color: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200" },
  "all-russian": { label: "Всероссийские", color: "bg-zinc-100 text-zinc-600 ring-zinc-200" },
  spartakiada: { label: "Спартакиада", color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

function formatDateBadge(start: string, end: string) {
  const s = parseIsoDateLocal(start);
  const e = parseIsoDateLocal(end);
  const sDay = s.getDate();
  const eDay = e.getDate();
  const monthShort = (d: Date) =>
    new Intl.DateTimeFormat("ru-RU", { month: "short" })
      .format(d)
      .replace(".", "")
      .toUpperCase();

  const sameCalendarDay =
    sDay === eDay && s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameCalendarDay) {
    return { variant: "single" as const, day: sDay, month: monthShort(s) };
  }

  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const dayRange = `${sDay}–${eDay}`;

  if (sameMonth) {
    return {
      variant: "rangeSameMonth" as const,
      dayRange,
      month: monthShort(s),
      rangeLen: dayRange.length,
    };
  }

  return {
    variant: "rangeCrossMonth" as const,
    dayRange: `${sDay}–${eDay}`,
    monthsLine: `${monthShort(s)}–${monthShort(e)}`,
  };
}

function formatDateRangeLabelIfNeeded(start: string, end: string): string | null {
  const s = parseIsoDateLocal(start);
  const e = parseIsoDateLocal(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) return null;

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" })
      .format(d)
      .replace(".", "");
  return `${fmt(s)} – ${fmt(e)}`;
}

function getEventStatus(start: string, end: string): "past" | "active" | "soon" | "coming" | "future" {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const s = parseIsoDateLocal(start);
  const e = parseIsoDateLocal(end);
  e.setHours(23, 59, 59);
  if (e < now) return "past";
  if (s <= now) return "active";
  if (isStartThisCalendarWeek(start)) return "soon";
  if (isStartSoon(start)) return "coming";
  return "future";
}

const MONTH_NAMES_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function CompetitionCard({
  comp,
  accentFrom,
  accentTo,
}: {
  comp: SportgymCalendarEvent;
  accentFrom: string;
  accentTo: string;
}) {
  const badge = formatDateBadge(comp.dateStart, comp.dateEnd);
  const extraRangeLabel = formatDateRangeLabelIfNeeded(comp.dateStart, comp.dateEnd);
  const status = getEventStatus(comp.dateStart, comp.dateEnd);
  const typeMeta = TYPE_LABELS[comp.eventType];
  const isPast = status === "past";

  const inner = (
    <>
      <div
        className={`flex flex-none flex-col items-center justify-center rounded-xl px-1.5 text-white ${
          badge.variant === "single" ? "h-14 w-12" : "min-h-[3.5rem] min-w-[2.75rem] max-w-[4.25rem] py-1.5"
        }`}
        style={{
          background: isPast
            ? "#d4d4d8"
            : status === "active"
            ? "linear-gradient(135deg, #16a34a, #15803d)"
            : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        }}
      >
        {badge.variant === "single" && (
          <>
            <span className="text-xl font-extrabold leading-none tabular-nums">{badge.day}</span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide opacity-95 leading-none">
              {badge.month}
            </span>
          </>
        )}
        {badge.variant === "rangeSameMonth" && (
          <>
            <span
              className={`text-center font-extrabold leading-tight tracking-tight tabular-nums ${
                badge.rangeLen <= 4 ? "text-[15px]" : badge.rangeLen <= 5 ? "text-sm" : "text-xs"
              }`}
            >
              {badge.dayRange}
            </span>
            <span className="mt-0.5 text-center text-[8px] font-bold uppercase tracking-wide opacity-95 leading-tight">
              {badge.month}
            </span>
          </>
        )}
        {badge.variant === "rangeCrossMonth" && (
          <>
            <span className="text-center text-[13px] font-extrabold leading-tight tabular-nums">
              {badge.dayRange}
            </span>
            <span className="mt-0.5 max-w-[3.75rem] text-center text-[7px] font-bold uppercase leading-[1.1] tracking-tight opacity-95">
              {badge.monthsLine}
            </span>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {status === "active" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Идёт сейчас
            </span>
          )}
          {status === "soon" && (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 ring-1 ring-red-200">
              На этой неделе
            </span>
          )}
          {status === "coming" && (
            <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 ring-1 ring-sky-200">
              Скоро
            </span>
          )}
        </div>
        <p
          className={`mt-0.5 text-sm font-semibold leading-snug ${
            isPast ? "text-zinc-400" : "text-zinc-900"
          }`}
        >
          {comp.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {extraRangeLabel && (
            <span className="text-[11px] font-medium text-zinc-500">{extraRangeLabel}</span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${typeMeta.color}`}
          >
            {typeMeta.label}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
          <svg className="h-3 w-3 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {comp.location}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border bg-white p-4 transition-shadow ${
        isPast
          ? "border-zinc-100 opacity-50"
          : status === "active"
          ? "border-green-200 shadow-sm shadow-green-100"
          : "border-zinc-100 shadow-sm hover:shadow-md"
      }`}
    >
      {inner}
    </div>
  );
}

export function StaticScheduleBlock({ disciplineSlug, events }: StaticScheduleBlockProps) {
  const { competitions, year, month, isFallback } = getCurrentMonthBlockState(
    events,
    disciplineSlug,
  );
  const accent = disciplineAccents[disciplineSlug];

  if (!events.length) {
    return (
      <section className="border-b border-zinc-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm text-zinc-500">
            Календарь соревнований сейчас недоступен. Попробуйте обновить страницу позже.
          </p>
        </div>
      </section>
    );
  }

  if (!competitions.length) {
    return (
      <section className="border-b border-zinc-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
              style={{ color: accent.gradFrom }}
            >
              Соревнования
            </h2>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            В выбранном периоде для этого вида спорта нет событий в календаре.
          </p>
        </div>
      </section>
    );
  }

  const monthLabel = `${MONTH_NAMES_RU[month]} ${year}`;

  return (
    <section className="border-b border-zinc-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            style={{ color: accent.gradFrom }}
          >
            <svg className="h-5 w-5 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isFallback ? "Ближайшие соревнования" : "Соревнования в этом месяце"}
          </h2>

          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${accent.gradFrom}, ${accent.gradTo})` }}
          >
            {monthLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((comp) => (
            <CompetitionCard
              key={comp.id}
              comp={comp}
              accentFrom={accent.gradFrom}
              accentTo={accent.gradTo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
