import Link from "next/link";
import { calendarDaysUntilStart, parseIsoDateLocal } from "@/lib/sportgym-calendar";
import type { CompetitionEvent, DisciplineSlug } from "@/lib/mock-data";
import { disciplineAccents } from "@/lib/mock-data";

interface CompetitionsBlockProps {
  competitions: CompetitionEvent[];
  disciplineSlug: DisciplineSlug;
}

function formatEventDate(iso: string) {
  const d = parseIsoDateLocal(iso.slice(0, 10));
  return {
    day: d.getDate(),
    month: new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(d),
    year: d.getFullYear(),
    full: new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d),
  };
}

function EventBadge({ daysUntil }: { daysUntil: number }) {
  if (daysUntil <= 0) return null;
  if (daysUntil <= 6) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
        на этой неделе
      </span>
    );
  }
  if (daysUntil <= 30) {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
        скоро
      </span>
    );
  }
  return null;
}

export function CompetitionsBlock({ competitions, disciplineSlug }: CompetitionsBlockProps) {
  if (!competitions.length) return null;

  const accent = disciplineAccents[disciplineSlug];

  return (
    <div className="flex-1 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <h2
        className="mb-5 flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        style={{ color: accent.gradFrom }}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Ближайшие соревнования
      </h2>

      <ol className="flex flex-col gap-3">
        {competitions.map((ev) => {
          const { day, month } = formatEventDate(ev.date);
          const daysUntil = calendarDaysUntilStart(ev.date);

          return (
            <li key={ev.id}>
              <Link
                href={`/posts/${ev.slug}`}
                className="group flex items-start gap-4 rounded-xl p-3 transition hover:bg-zinc-50"
              >
                {/* Дата-значок в виде «билета» */}
                <div
                  className="flex h-14 w-12 flex-none flex-col items-center justify-center rounded-lg text-white"
                  style={{ background: `linear-gradient(135deg, ${accent.gradFrom}, ${accent.gradTo})` }}
                >
                  <span className="text-xl font-extrabold leading-none">{day}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-90">
                    {month.replace(".", "")}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700">
                      {ev.title}
                    </p>
                    <EventBadge daysUntil={daysUntil} />
                  </div>
                  {ev.excerpt && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{ev.excerpt}</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
