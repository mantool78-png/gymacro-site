import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DisciplineHero,
  NewsStrip,
  CompetitionsBlock,
  FeaturedAthlete,
  DocumentsAndChecklists,
  FunZone,
  StaticScheduleBlock,
} from "@/components/discipline";
import { SiteFooter, SiteHeader } from "@/components/home";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import type { DisciplineSlug } from "@/lib/mock-data";
import { disciplines } from "@/lib/mock-data";
import {
  getLatestPostsByCategorySlug,
  getNewsByDiscipline,
  getCompetitionsByDiscipline,
  getAthletesByDiscipline,
  getDocumentsByDiscipline,
  getChecklistsByDiscipline,
  getFunByDiscipline,
} from "@/lib/wp";
import { calendarYearForSite, getSportgymCalendarEventsSafe } from "@/lib/sportgym-calendar";
import { getSiteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const DISCIPLINE_TO_CATEGORY_SLUGS: Record<string, string[]> = {
  acrobatic: ["acro", "akrobatika", "sportivnaya-akrobatika", "acrobatic"],
  artistic: ["sportgim", "sportivnaya-gimnastika", "sportivnaya-gimnastica", "artistic", "gimnastika", "sg"],
  rhythmic: [
    "hudozhestvennaya-gimnastika",
    "hudozhestvennaya-gimnastica",
    "hudozhestvennaya",
    "rhythmic",
    "hgg",
    "hudozhestvennaya-gimnastika",
    "hudozhestvennaya",
  ],
  aerobic: ["aerobika", "aerobica", "aerobic"],
  trampoline: ["batut", "trampoline", "pryzhki-na-batute"],
};

const VALID_SLUGS = new Set(Object.keys(DISCIPLINE_TO_CATEGORY_SLUGS));


async function getDisciplinePosts(routeSlug: string) {
  const candidates = DISCIPLINE_TO_CATEGORY_SLUGS[routeSlug];
  if (!candidates?.length) return [];

  for (const categorySlug of candidates) {
    const posts = await getLatestPostsByCategorySlug(categorySlug, 24);
    if (posts.length > 0) return posts;
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const discipline = disciplines.find((d) => d.slug === slug);
  if (!discipline) return { title: "Раздел не найден" };
  const canonical = `${getSiteUrl()}/disciplines/${slug}`;
  return {
    title: `${discipline.name} — Gymacro`,
    description: `Статьи, новости, соревнования и материалы по дисциплине «${discipline.name}»: советы для тренеров, спортсменов и родителей. Gymacro.`,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${discipline.name} — Gymacro`,
      locale: "ru_RU",
      siteName: "Gymacro",
    },
  };
}

export default async function DisciplinePage({ params }: Props) {
  const { slug } = await params;
  if (!VALID_SLUGS.has(slug)) notFound();

  const disciplineSlug = slug as DisciplineSlug;
  const discipline = disciplines.find((d) => d.slug === disciplineSlug)!;

  const calendarYear = calendarYearForSite();

  // Параллельно загружаем все блоки
  const [posts, news, competitions, athletes, documents, checklists, fun, sportgymEvents] =
    await Promise.all([
      getDisciplinePosts(slug),
      getNewsByDiscipline(disciplineSlug, 8).catch(() => []),
      getCompetitionsByDiscipline(disciplineSlug, 6).catch(() => []),
      getAthletesByDiscipline(disciplineSlug, 3).catch(() => []),
      getDocumentsByDiscipline(disciplineSlug, 8).catch(() => []),
      getChecklistsByDiscipline(disciplineSlug, 6).catch(() => []),
      getFunByDiscipline(disciplineSlug, 6).catch(() => []),
      getSportgymCalendarEventsSafe(calendarYear),
    ]);

  const hasDynamic =
    news.length > 0 ||
    competitions.length > 0 ||
    athletes.length > 0 ||
    documents.length > 0 ||
    checklists.length > 0 ||
    fun.length > 0;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Дисциплины", href: "/#disciplines" },
          { name: discipline.name, href: `/disciplines/${slug}` },
        ]}
      />
      <SiteHeader />

      <main className="min-h-[60vh] bg-[var(--color-surface)]">
        {/* 1. Герой */}
        <DisciplineHero
          slug={disciplineSlug}
          title={discipline.name}
          description={discipline.description}
          articlesCount={posts.length}
        />

        {/* 2. Календарь соревнований (ФГР, sportgymrus.ru) — для всех дисциплин */}
        <StaticScheduleBlock disciplineSlug={disciplineSlug} events={sportgymEvents} />

        {/* 3. Новости */}
        <NewsStrip news={news} />

        {/* 4. Соревнования из WP + Легенда */}
        {(competitions.length > 0 || athletes.length > 0) && (
          <section className="border-b border-zinc-100 bg-[var(--color-surface)] py-10">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex flex-col gap-6 lg:flex-row">
                {competitions.length > 0 && (
                  <div className="lg:w-[55%]">
                    <CompetitionsBlock
                      competitions={competitions}
                      disciplineSlug={disciplineSlug}
                    />
                  </div>
                )}
                {athletes.length > 0 && (
                  <div className={competitions.length > 0 ? "lg:flex-1" : "w-full"}>
                    <FeaturedAthlete athletes={athletes} disciplineSlug={disciplineSlug} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. Документы и чек-листы */}
        <DocumentsAndChecklists
          documents={documents}
          checklists={checklists}
          disciplineSlug={disciplineSlug}
        />

        {/* 5. Фан-зона */}
        <FunZone fun={fun} />

        {/* 6. Все статьи */}
        <section className="pb-16 pt-10">
          <div className="mx-auto max-w-6xl px-4">
            <header className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                {hasDynamic ? "Все статьи" : "Статьи и материалы"}
              </h2>
              {!hasDynamic && (
                <p className="mt-2 text-sm text-zinc-500">
                  Статьи и материалы по этой дисциплине.
                </p>
              )}
            </header>

            {!posts.length ? (
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 text-sm text-zinc-500">
                Пока нет материалов в этом разделе.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-zinc-950/[0.04] transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/posts/${post.slug}`} className="block">
                      {post.image?.trim() ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50/50 to-sky-50/60">
                          <svg
                            className="absolute inset-0 h-full w-full opacity-60"
                            viewBox="0 0 400 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                          >
                            <path
                              d="M-20 180 Q 80 50 200 130 T 420 80"
                              className="text-violet-400/50"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                            />
                            <path
                              d="M20 220 Q 140 120 260 170 Q 340 200 400 110"
                              className="text-violet-400/35"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeDasharray="4 8"
                            />
                            <path
                              d="M10 80 L 100 50 L 160 120 L 240 60 L 340 100"
                              stroke="#0ea5e9"
                              strokeOpacity="0.25"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="200" cy="130" r="3" fill="#6d28d9" fillOpacity="0.2" />
                            <circle cx="260" cy="170" r="2" fill="#0ea5e9" fillOpacity="0.3" />
                            <circle cx="100" cy="50" r="1.5" fill="#6d28d9" fillOpacity="0.25" />
                          </svg>
                          
                          <div className="relative z-10 rounded-[24px] border border-white/60 bg-white/70 px-6 py-4 text-center shadow-sm backdrop-blur-md md:px-8 md:py-6">
                            <span className="block font-display text-3xl font-black uppercase tracking-widest text-zinc-800 md:text-4xl">
                              Новости
                            </span>
                            <span className="mt-1 block text-sm font-bold uppercase tracking-[0.3em] text-violet-600/70 md:text-lg">
                              Спорта
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-zinc-900">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 text-xs font-medium text-zinc-400">
                          {new Intl.DateTimeFormat("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(post.date))}
                          {" · "}
                          {post.readMinutes} мин чтения
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
