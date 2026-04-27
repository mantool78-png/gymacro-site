import Image from "next/image";
import Link from "next/link";
import { disciplines, disciplineAccents, type Article } from "@/lib/mock-data";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

export function NewsFeed({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="px-4 pb-4 pt-3 md:pb-5 md:pt-3">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-bold tracking-tight text-zinc-900 md:text-lg">
            Новости
          </h2>
          <Link
            href="/topics/novosti"
            className="text-xs font-semibold text-violet-600 transition hover:text-violet-800"
          >
            Все новости →
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          {articles.map((article) => {
            const accent = disciplineAccents[article.discipline];
            const disc = disciplines.find((d) => d.slug === article.discipline);
            const fullName = disc?.name ?? article.discipline;
            const href = `/posts/${article.slug}`;

            return (
              <article key={article.id} className="h-full">
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-950/[0.06] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md"
                >
                  {article.image?.trim() ? (
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-zinc-100">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 17vw"
                      />
                      <div
                        className="absolute left-0 top-0 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/95"
                        style={{ backgroundColor: accent.gradFrom }}
                      >
                        {fullName}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/95"
                      style={{ backgroundColor: accent.gradFrom }}
                    >
                      {fullName}
                    </div>
                  )}

                  <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2.5">
                    <h3 className="font-display text-xs font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-700 md:text-[0.8125rem]">
                      {article.title}
                    </h3>
                    <time
                      dateTime={article.date}
                      className="mt-auto pt-2 text-[10px] font-medium text-zinc-400"
                    >
                      {formatDate(article.date)}
                    </time>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
