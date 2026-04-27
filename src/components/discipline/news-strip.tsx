import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/mock-data";


interface NewsStripProps {
  news: Article[];
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function NewsStrip({ news }: NewsStripProps) {
  if (!news.length) return null;

  return (
    <section className="border-b border-zinc-100 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Новости
          </h2>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {news.length} материалов
          </span>
        </div>

        <div className="scroll-snap-x scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
          {news.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/posts/${item.slug}`}
                className="group flex w-[260px] flex-none flex-col overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/5 transition hover:bg-zinc-700 hover:ring-white/10"
              >
                {item.image?.trim() ? (
                  <div className="relative h-32 w-full shrink-0 overflow-hidden bg-zinc-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="260px"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-full shrink-0 flex-col items-center justify-center bg-zinc-800 bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="rounded-[18px] border border-zinc-600/30 bg-zinc-900/60 px-6 py-4 text-center shadow-md backdrop-blur-md">
                      <span className="block font-display text-[26px] font-black uppercase tracking-widest text-zinc-100">
                        Новости
                      </span>
                      <span className="mt-1 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
                        Спорта
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                    {item.excerpt}
                  </p>
                  <time className="mt-auto pt-2 text-xs text-zinc-500">
                    {formatShortDate(item.date)}
                  </time>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
