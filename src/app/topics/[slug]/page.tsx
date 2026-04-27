import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/home";
import { IMAGE_CARD_16_10 } from "@/lib/image-dimensions";
import { getLatestPostsByCategorySlug, getLatestPostsByCategoryId } from "@/lib/wp";

type Props = { params: Promise<{ slug: string }> };

const TOPIC_TO_CATEGORY_SLUGS: Record<string, string[]> = {
  novosti: ["novosti", "news", "novosti-sporta"],
  technique: ["tehnika", "technique"],
  ofp: ["ofp"],
  stretch: ["stretch", "rastjazhka", "rastyazhka", "rastyazhca"],
  injuries: ["injuries", "travmy", "travmy-i-profilaktika"],
  psychology: ["psychology", "psihologiya", "psihologija", "psycology"],
  competitions: ["competitions", "sorevnovaniya", "sorevnovanija", "sorevy"],
  gear: ["gear", "ekipirovka", "ecip"],
  parents: ["parents", "roditeli", "dlya-roditeley", "dlya-roditelej"],
};

const TOPIC_TITLES: Record<string, string> = {
  novosti: "Новости",
  technique: "Техника",
  ofp: "ОФП",
  stretch: "Растяжка",
  injuries: "Травмы и профилактика",
  psychology: "Психология",
  competitions: "Соревнования",
  gear: "Экипировка",
  parents: "Для родителей",
};


const NEWS_CATEGORY_ID = 23;

async function getTopicPosts(routeSlug: string) {
  const title = TOPIC_TITLES[routeSlug] ?? routeSlug;

  // Для рубрики «Новости» используем категорию с известным ID
  if (routeSlug === "novosti") {
    const posts = await getLatestPostsByCategoryId(NEWS_CATEGORY_ID, 24);
    return { title, posts };
  }

  const categoryCandidates = TOPIC_TO_CATEGORY_SLUGS[routeSlug];
  if (!categoryCandidates?.length) return { title: "", posts: [] };

  for (const categorySlug of categoryCandidates) {
    const posts = await getLatestPostsByCategorySlug(categorySlug, 24);
    if (posts.length > 0) return { title, posts };
  }

  return { title, posts: [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = TOPIC_TITLES[slug];
  if (!title) return { title: "Тема не найдена" };
  return {
    title: `${title} — Gymacro`,
    description: `Подборка статей по теме «${title}»: практика зала, безопасность и подготовка. Gymacro.`,
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  if (!TOPIC_TO_CATEGORY_SLUGS[slug]) notFound();

  const { title, posts } = await getTopicPosts(slug);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] bg-[var(--color-surface)] px-4 pb-16 pt-6">
        <section className="mx-auto max-w-6xl">
          <Link
            href="/#topics"
            className="inline-flex text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
          >
            ← К темам
          </Link>

          <header className="mt-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-zinc-500">Статьи и материалы по этой теме.</p>
          </header>

          {!posts.length ? (
            <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 text-sm text-zinc-500">
              Пока нет материалов в этом разделе.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                    <h2 className="font-display text-lg font-bold leading-snug tracking-tight text-zinc-900">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">{post.excerpt}</p>
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
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
