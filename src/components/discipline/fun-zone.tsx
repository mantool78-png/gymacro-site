import Image from "next/image";
import Link from "next/link";
import type { FunPost } from "@/lib/mock-data";

const PLACEHOLDER_IMAGE = "/images/article-placeholder.svg";

interface FunZoneProps {
  fun: FunPost[];
}

/** Пытается извлечь первый iframe-embed из HTML */
function extractEmbed(html: string): string | null {
  const match = html.match(/<iframe[^>]*src="([^"]+)"[^>]*>/i);
  return match ? match[1] : null;
}

function FunCard({ item }: { item: FunPost }) {
  const embedSrc = extractEmbed(item.content);
  const imageSrc = item.image?.trim() ? item.image : PLACEHOLDER_IMAGE;
  const isRemote = imageSrc.startsWith("http");

  if (embedSrc) {
    return (
      <div className="w-[300px] flex-none overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
        <div className="relative aspect-video w-full overflow-hidden">
          <iframe
            src={embedSrc}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={item.title}
          />
        </div>
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/posts/${item.slug}`}
      className="group w-[260px] flex-none overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-36 w-full overflow-hidden bg-zinc-100">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="260px"
          unoptimized={!isRemote}
        />
        {/* Emoji-стикер в углу */}
        <div className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xl shadow-sm backdrop-blur-sm">
          😄
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{item.title}</p>
        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export function FunZone({ fun }: FunZoneProps) {
  if (!fun.length) return null;

  return (
    <section className="border-b border-zinc-100 bg-amber-50/50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-zinc-900">
            😄 Фан-зона
          </h2>
          <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
            мемы и видео
          </span>
        </div>

        <div className="scroll-snap-x scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
          {fun.map((item) => (
            <FunCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
