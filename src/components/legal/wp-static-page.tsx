import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/home";
import { sanitizePublicPageHtml } from "@/lib/public-html";
import { decodeHtmlEntities, getPageByAnySlug, stripHtml } from "@/lib/wp";

function stripUnsafeFromHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/on\w+="[^"]*"/gi, "");
}

type WpStaticPageProps = {
  slugs: string[];
  fallbackTitle: string;
  fallbackHtml?: string;
};

export async function WpStaticPage({ slugs, fallbackTitle, fallbackHtml }: WpStaticPageProps) {
  const page = await getPageByAnySlug(slugs);

  const title = page
    ? decodeHtmlEntities(stripHtml(page.title?.rendered ?? "")).trim() || fallbackTitle
    : fallbackTitle;
  const rawHtml = page
    ? stripUnsafeFromHtml(page.content?.rendered ?? "")
    : fallbackHtml ?? `<p>Содержимое страницы пока не заполнено.</p>`;
  const html = sanitizePublicPageHtml(rawHtml);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] bg-[var(--color-surface)] pb-16 pt-6">
        <article className="mx-auto max-w-3xl px-4">
          <Link
            href="/#feed"
            className="inline-flex text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
          >
            ← На главную
          </Link>

          <header className="mt-6 rounded-2xl border border-zinc-200/90 bg-white px-5 py-6 shadow-md ring-1 ring-zinc-950/[0.04] md:px-8 md:py-8">
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-zinc-900 md:text-3xl">
              {title}
            </h1>
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
