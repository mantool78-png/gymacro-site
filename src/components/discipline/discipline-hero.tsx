import Image from "next/image";
import Link from "next/link";
import {
  disciplineAccents,
  disciplineCoverImages,
  type DisciplineSlug,
} from "@/lib/mock-data";

interface DisciplineHeroProps {
  slug: DisciplineSlug;
  title: string;
  description: string;
  articlesCount: number;
}

export function DisciplineHero({ slug, title, description, articlesCount }: DisciplineHeroProps) {
  const accent = disciplineAccents[slug];
  const coverSrc = disciplineCoverImages[slug];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent.gradFrom} 0%, ${accent.gradTo} 100%)`,
      }}
    >
      {/* Декоративные круги */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20"
        style={{ background: "rgba(255,255,255,0.3)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-8 h-48 w-48 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.4)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 lg:gap-10 xl:gap-14">
          <div className="min-w-0">
            <Link
              href="/#disciplines"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              К дисциплинам
            </Link>

            <div className="mt-4">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-2 max-w-xl text-base text-white/75 md:text-lg">{description}</p>
            </div>

            {articlesCount > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {articlesCount}{" "}
                {articlesCount === 1 ? "статья" : articlesCount < 5 ? "статьи" : "статей"}
              </div>
            )}
          </div>

          <div className="flex shrink-0 justify-center md:justify-end md:pr-1">
            <div className="animate-discipline-hero-visual relative aspect-[4/5] w-[min(100%,240px)] shrink-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-2 ring-white/30 sm:w-[252px] md:w-[260px] lg:w-[276px]">
              <Image
                src={coverSrc}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 280px, 300px"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
