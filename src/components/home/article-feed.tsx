import Image from "next/image";
import Link from "next/link";
import { disciplineCardBadge, type Article } from "@/lib/mock-data";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function ArticleFeed({ articles }: { articles: Article[] }) {
  if (!articles.length) {
    return (
      <section id="feed" className="scroll-mt-28 px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Материалы
          </h2>
          <p className="mt-4 text-[15px] text-zinc-500">
            Сейчас не удалось загрузить материалы. Попробуйте обновить страницу позже.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="feed" className="scroll-mt-28 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Материалы
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {articles.map((article) => {
            const badge = disciplineCardBadge[article.discipline];
            const href = `/posts/${article.slug}`;

            return (
              <article key={article.id} className="h-full">
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-zinc-950/[0.04] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-xl hover:ring-zinc-950/[0.07]"
                >
                  <div
                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95 ${badge.barClass}`}
                  >
                    {badge.label}
                  </div>

                  {article.image?.trim() ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-[16/10] w-full shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50/50 to-sky-50/60">
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

                  <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4">
                    <h3 className="font-display text-[1.0625rem] font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-700 md:text-lg">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{article.excerpt}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-400">
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                      <span className="text-zinc-300" aria-hidden>
                        ·
                      </span>
                      <span>{article.readMinutes} мин чтения</span>
                    </div>
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
