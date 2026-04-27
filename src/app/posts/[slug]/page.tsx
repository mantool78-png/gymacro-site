import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/home";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { disciplineCardBadge } from "@/lib/mock-data";
import { IMAGE_FEATURE_16_9 } from "@/lib/image-dimensions";
import {
  decodeHtmlEntities,
  estimateReadMinutes,
  getPostBySlug,
  getPostCategoryTerms,
  mapWpCategoriesToDiscipline,
  stripHtml,
} from "@/lib/wp";

type Props = { params: Promise<{ slug: string }> };

function stripUnsafeFromHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/on\w+="[^"]*"/gi, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Статья не найдена" };
  }
  const title = decodeHtmlEntities(stripHtml(post.title?.rendered ?? "")).trim();
  const excerptRaw = decodeHtmlEntities(stripHtml(post.excerpt?.rendered ?? "")).trim();
  const excerpt = excerptRaw.slice(0, 160);
  const description =
    excerpt ||
    (title
      ? `${title} — материал на Gymacro: гимнастика, акробатика, материалы для тренеров и родителей.`.slice(
          0,
          160,
        )
      : undefined);
  return {
    title: title ? `${title} — Gymacro` : "Gymacro",
    description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categories = getPostCategoryTerms(post);
  const discipline = mapWpCategoriesToDiscipline(categories);
  const badge = disciplineCardBadge[discipline];
  const title = decodeHtmlEntities(stripHtml(post.title?.rendered ?? "")).trim() || "Без названия";
  const categoryLabel =
    categories.length > 0 ? categories.map((c) => c.name).join(" · ") : "Материал";
  const readMin = estimateReadMinutes(post.content?.rendered ?? "");
  const dateFormatted = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.date));

  const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const html = stripUnsafeFromHtml(post.content?.rendered ?? "");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Материалы", href: "/#feed" },
          { name: title, href: `/posts/${slug}` },
        ]}
      />
      <SiteHeader />
      <main className="min-h-[60vh] bg-[var(--color-surface)] pb-16 pt-6">
        <article className="mx-auto max-w-3xl px-4">
          <Link
            href="/#feed"
            className="inline-flex text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
          >
            ← На главную
          </Link>

          <header className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md ring-1 ring-zinc-950/[0.04]">
            <div className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95 ${badge.barClass}`}>
              {badge.label}
            </div>
            {featured ? (
              <div className="relative aspect-[16/9] w-full bg-zinc-100">
                <Image
                  src={featured}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 48rem"
                  priority
                />
              </div>
            ) : null}
            <div className="px-5 py-6 md:px-8 md:py-8">
              <p className="text-sm font-medium text-zinc-500">{categoryLabel}</p>
              <h1 className="font-display mt-2 text-2xl font-bold leading-tight tracking-tight text-zinc-900 md:text-3xl lg:text-[2rem]">
                {title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
                <time dateTime={post.date}>{dateFormatted}</time>
                <span aria-hidden>·</span>
                <span>{readMin} мин чтения</span>
              </div>
            </div>
          </header>

          <div
            className="post-body mt-8 rounded-2xl border border-zinc-200/80 bg-white px-5 py-8 shadow-sm md:px-8 md:py-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />

        </article>
      </main>
      <SiteFooter />
    </>
  );
}
