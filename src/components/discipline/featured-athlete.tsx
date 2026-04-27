import Image from "next/image";
import Link from "next/link";
import type { Article, DisciplineSlug } from "@/lib/mock-data";
import { disciplineAccents } from "@/lib/mock-data";

const PLACEHOLDER_IMAGE = "/images/article-placeholder.svg";

interface FeaturedAthleteProps {
  athletes: Article[];
  disciplineSlug: DisciplineSlug;
}

export function FeaturedAthlete({ athletes, disciplineSlug }: FeaturedAthleteProps) {
  if (!athletes.length) return null;

  const accent = disciplineAccents[disciplineSlug];
  const athlete = athletes[0];
  const imageSrc = athlete.image?.trim() ? athlete.image : PLACEHOLDER_IMAGE;
  const isRemote = imageSrc.startsWith("http");

  return (
    <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Заголовок блока */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{
          background: `linear-gradient(90deg, ${accent.gradFrom}14, ${accent.gradTo}08)`,
          borderBottom: `2px solid ${accent.gradFrom}22`,
        }}
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ color: accent.gradFrom }}
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h2
          className="font-display text-sm font-bold uppercase tracking-wider"
          style={{ color: accent.gradFrom }}
        >
          Легенда дисциплины
        </h2>
      </div>

      {/* Карточка спортсмена */}
      <Link href={`/posts/${athlete.slug}`} className="group block">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
          <Image
            src={imageSrc}
            alt={athlete.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={!isRemote}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-display text-base font-bold leading-snug text-white group-hover:text-white/90">
              {athlete.title}
            </p>
          </div>
        </div>

        <div className="p-4">
          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">{athlete.excerpt}</p>
          <span
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition"
            style={{ color: accent.gradFrom }}
          >
            Читать историю
            <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Остальные профили если есть */}
      {athletes.length > 1 && (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Также в разделе
          </p>
          <div className="flex flex-col gap-1.5">
            {athletes.slice(1).map((a) => (
              <Link
                key={a.id}
                href={`/posts/${a.slug}`}
                className="text-sm font-medium text-zinc-700 transition hover:underline"
                style={{ textDecorationColor: accent.gradFrom }}
              >
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
