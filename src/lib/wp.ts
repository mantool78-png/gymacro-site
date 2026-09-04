import type { Article, ArticleTab, CompetitionEvent, DisciplineSlug, FunPost } from "@/lib/mock-data";

/** WordPress в подкаталоге /cms */
const WP_BASE = "https://gymacro.ru/cms";

/** Slug категории WP → дисциплина карточки. Дополняйте по мере появления рубрик на сайте. */
const CATEGORY_SLUG_TO_DISCIPLINE: Record<string, DisciplineSlug> = {
  acro: "acrobatic",
  akrobatika: "acrobatic",
  "sportivnaya-akrobatika": "acrobatic",
  acrobatic: "acrobatic",

  artistic: "artistic",
  "sportivnaya-gimnastika": "artistic",
  "sportivnaya-gimnastica": "artistic",
  sg: "artistic",
  gimnastika: "artistic",

  hudozhestvennaya: "rhythmic",
  "hudozhestvennaya-gimnastika": "rhythmic",
  "hudozhestvennaya-gimnastica": "rhythmic",
  hgg: "rhythmic",
  rhythmic: "rhythmic",

  aerobika: "aerobic",
  aerobica: "aerobic",
  aerobic: "aerobic",

  batut: "trampoline",
  trampoline: "trampoline",
  "pryzhki-na-batute": "trampoline",
};

const PARENT_CATEGORY_SLUGS = new Set([
  "roditeli",
  "dlya-roditeley",
  "parents",
  "semja",
  "dlya-roditelej",
]);

const COACH_CATEGORY_SLUGS = new Set([
  "dlya-trenerov",
  "trenery",
  "coaches",
  "trenerskaya",
  "metodika",
]);

interface WpRendered {
  rendered: string;
  protected?: boolean;
}

export interface WpTerm {
  id: number;
  slug: string;
  name: string;
  taxonomy: string;
}

interface WpFeaturedMedia {
  source_url?: string;
}

interface WpContent {
  rendered: string;
  protected?: boolean;
}

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  date_gmt?: string;
  guid?: { rendered?: string };
  link: string;
  sticky?: boolean;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
    "wp:term"?: WpTerm[][];
  };
}

export interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: WpRendered;
  content: WpContent;
  excerpt?: WpRendered;
}

export interface WpCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Декодирует типичные HTML-сущности из выдачи WordPress */
export function decodeHtmlEntities(text: string): string {
  const named: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&hellip;": "…",
    "&mdash;": "—",
    "&ndash;": "–",
  };
  let s = text;
  for (const [entity, ch] of Object.entries(named)) {
    s = s.split(entity).join(ch);
  }
  s = s.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return s;
}

export function estimateReadMinutes(html: string): number {
  const plain = stripHtml(html);
  const words = plain.split(/\s+/).filter(Boolean).length;
  if (words <= 0) return 4;
  return Math.max(2, Math.min(30, Math.round(words / 200)));
}

function getCategoryTerms(post: WpPost): WpTerm[] {
  const groups = post._embedded?.["wp:term"];
  if (!groups?.length) return [];
  const first = groups[0];
  return Array.isArray(first) ? first.filter((t) => t.taxonomy === "category") : [];
}

function getTagTerms(post: WpPost): WpTerm[] {
  const groups = post._embedded?.["wp:term"];
  if (!groups?.length) return [];
  const allTerms = groups.flat();
  return allTerms.filter((t) => t.taxonomy === "post_tag");
}

/** Slug тега/категории → дисциплина (включая прямые slug дисциплин) */
const TAG_SLUG_TO_DISCIPLINE: Record<string, DisciplineSlug> = {
  acrobatic: "acrobatic",
  akrobatika: "acrobatic",
  "sportivnaya-akrobatika": "acrobatic",
  artistic: "artistic",
  "sportivnaya-gimnastika": "artistic",
  sportgim: "artistic",
  sg: "artistic",
  rhythmic: "rhythmic",
  "hudozhestvennaya-gimnastika": "rhythmic",
  hudozhestvennaya: "rhythmic",
  hgg: "rhythmic",
  aerobic: "aerobic",
  aerobika: "aerobic",
  aerobica: "aerobic",
  trampoline: "trampoline",
  batut: "trampoline",
  "pryzhki-na-batute": "trampoline",
};

export function mapWpCategoriesToDiscipline(categories: WpTerm[]): DisciplineSlug {
  for (const cat of categories) {
    const slug = cat.slug.toLowerCase();
    const mapped = CATEGORY_SLUG_TO_DISCIPLINE[slug];
    if (mapped) return mapped;
  }
  return "artistic";
}

function mapWpTermsToDiscipline(categories: WpTerm[], tags: WpTerm[]): DisciplineSlug {
  // Сначала проверяем теги (они специально для дисциплин)
  for (const tag of tags) {
    const slug = tag.slug.toLowerCase();
    const mapped = TAG_SLUG_TO_DISCIPLINE[slug];
    if (mapped) return mapped;
    // Также по имени тега
    const name = tag.name.toLowerCase();
    if (name.includes("акробатик")) return "acrobatic";
    if (name.includes("художественн")) return "rhythmic";
    if (name.includes("аэробик")) return "aerobic";
    if (name.includes("батут") || name.includes("прыжк")) return "trampoline";
  }
  // Затем категории
  return mapWpCategoriesToDiscipline(categories);
}

const NEWS_CATEGORY_SLUGS = new Set(["novosti", "news", "novosti-sporta"]);

function getWpCategoryName(categories: WpTerm[]): string | undefined {
  // Возвращаем имя первой «значимой» категории (не «Новости»)
  const nonNews = categories.find((c) => !NEWS_CATEGORY_SLUGS.has(c.slug.toLowerCase()));
  return (nonNews ?? categories[0])?.name;
}

function mapCategoriesToTabs(categories: WpTerm[]): ArticleTab[] {
  const tabs = new Set<ArticleTab>(["new", "popular"]);

  for (const cat of categories) {
    const slug = cat.slug.toLowerCase();
    if (PARENT_CATEGORY_SLUGS.has(slug)) tabs.add("parents");
    if (COACH_CATEGORY_SLUGS.has(slug)) tabs.add("coaches");
  }

  return Array.from(tabs);
}

function getFeaturedImageUrl(post: WpPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  return url && typeof url === "string" ? url : null;
}

export function mapWpPostToArticle(post: WpPost): Article {
  const categories = getCategoryTerms(post);
  const tags = getTagTerms(post);
  const title = decodeHtmlEntities(stripHtml(post.title?.rendered ?? "")).trim();
  const excerptRaw = post.excerpt?.rendered ?? "";
  const excerpt = decodeHtmlEntities(stripHtml(excerptRaw)).trim();

  return {
    id: String(post.id),
    slug: post.slug,
    title: title || "Без названия",
    excerpt: excerpt || decodeHtmlEntities(stripHtml(post.content?.rendered ?? "")).slice(0, 220).trim() + "…",
    discipline: mapWpTermsToDiscipline(categories, tags),
    readMinutes: estimateReadMinutes(post.content?.rendered ?? ""),
    date: post.date,
    featured: Boolean(post.sticky),
    tabs: mapCategoriesToTabs(categories),
    href: post.link,
    image: getFeaturedImageUrl(post),
    wpCategoryName: getWpCategoryName(categories),
  };
}

/** Родительские гайды с главной «Материалы» — запасной «Читайте также», если WP не отдал related. */
export const PARENT_GUIDE_FALLBACK: { slug: string; title: string }[] = [
  {
    slug: "vo-skolko-let-otdavat-rebenka-v-gimnastiku",
    title: "Во сколько лет отдавать ребёнка в гимнастику: возраст по дисциплинам",
  },
  {
    slug: "sportivnaya-hudozhestvennaya-ili-akrobatika",
    title: "Спортивная, художественная гимнастика или акробатика: как выбрать ребёнку",
  },
  {
    slug: "rastyazhka-cherez-slyozy-norma-ili-peregib",
    title: "Растяжка через слёзы: норма или перегиб, что делать родителю",
  },
];

/**
 * Последние посты с gymacro.ru. ISR: список обновляется не чаще чем раз в час.
 */
export async function getLatestPosts(count = 9): Promise<Article[]> {
  const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=${count}&_embed=1&categories_exclude=23`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WordPress REST: ${res.status} ${res.statusText}`);
  }

  const posts: WpPost[] = await res.json();
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWpPostToArticle);
}

/**
 * Все опубликованные записи (slug + modified) для sitemap, с пагинацией WP REST.
 */
export async function getAllPublishedPostEntriesForSitemap(): Promise<
  { slug: string; modified: string }[]
> {
  const out: { slug: string; modified: string }[] = [];
  let page = 1;
  const perPage = 100;

  while (page <= 500) {
    const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("_fields", "slug,modified");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) break;

    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    for (const row of data) {
      const o = row as { slug?: string; modified?: string };
      if (typeof o.slug === "string" && typeof o.modified === "string") {
        out.push({ slug: o.slug, modified: o.modified });
      }
    }

    if (data.length < perPage) break;
    page += 1;
  }

  return out;
}

/** Категории записи (таксономия category) из _embedded */
export function getPostCategoryTerms(post: WpPost): WpTerm[] {
  return getCategoryTerms(post);
}

/**
 * Одна запись по slug (как в URL WordPress).
 * @see https://developer.wordpress.org/rest-api/reference/posts/
 */
export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  // WordPress slug может приходить в URL-энкоде вида "%d1%81%d0%bf...".
  // Если дополнительно кодировать через encodeURIComponent, получим double-encoding (%25...),
  // и WordPress вернёт пустой массив.
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  return data[0] as WpPost;
}

/**
 * Соседние материалы для блока «Читайте также»: сначала та же рубрика,
 * затем лента главной, затем известные родительские гайды.
 */
export async function getRelatedPosts(
  post: WpPost,
  count = 3,
): Promise<{ slug: string; title: string }[]> {
  const seen = new Set<string>([post.slug]);
  const out: { slug: string; title: string }[] = [];

  const push = (items: { slug: string; title: string }[]) => {
    for (const item of items) {
      if (!item.slug || seen.has(item.slug)) continue;
      seen.add(item.slug);
      out.push(item);
      if (out.length >= count) return;
    }
  };

  const categoryIds = getCategoryTerms(post).map((c) => c.id);
  if (categoryIds.length) {
    try {
      const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
      url.searchParams.set("_embed", "1");
      url.searchParams.set("per_page", String(count));
      url.searchParams.set("exclude", String(post.id));
      url.searchParams.set("categories", categoryIds.join(","));

      const res = await fetch(url.toString(), {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data: unknown = await res.json();
        if (Array.isArray(data)) {
          push((data as WpPost[]).map(mapWpPostToArticle));
        }
      }
    } catch {
      // дальше — лента и статический запас
    }
  }

  if (out.length < count) {
    try {
      const latest = await getLatestPosts(count + 3);
      push(latest);
    } catch {
      // ignore
    }
  }

  if (out.length < count) {
    push(PARENT_GUIDE_FALLBACK);
  }

  return out.slice(0, count);
}

/**
 * Все рубрики WordPress (category).
 */
export async function getAllCategories(): Promise<WpCategory[]> {
  const url = `${WP_BASE}/wp-json/wp/v2/categories?per_page=100&orderby=name&order=asc`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as WpCategory[]) : [];
}

/**
 * Одна рубрика WP по slug.
 */
export async function getCategoryBySlug(slug: string): Promise<WpCategory | null> {
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/categories`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as WpCategory;
}

/**
 * Последние записи по ID рубрики (когда slug неизвестен).
 */
export async function getLatestPostsByCategoryId(
  categoryId: number,
  count = 24,
): Promise<Article[]> {
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("categories", String(categoryId));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];

  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return (data as WpPost[]).map(mapWpPostToArticle);
}

/**
 * Последние записи по slug рубрики.
 */
export async function getLatestPostsByCategorySlug(
  categorySlug: string,
  count = 18,
): Promise<Article[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("categories", String(category.id));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];

  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return (data as WpPost[]).map(mapWpPostToArticle);
}

/**
 * Одна страница WP по slug.
 */
export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/pages`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as WpPage;
}

/**
 * Ищет первую подходящую страницу по списку slug.
 */
export async function getPageByAnySlug(slugs: string[]): Promise<WpPage | null> {
  for (const slug of slugs) {
    const page = await getPageBySlug(slug);
    if (page) return page;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Типы и функции для динамических блоков на страницах дисциплин
//
// НАСТРОЙКА WORDPRESS (выполнить в WP Admin → Рубрики и Метки):
//
// Категории (content-type):
//   news         — текущие новости
//   competitions — соревнования (дата поста = дата старта соревнования,
//                  excerpt = "Город · Уровень соревнования")
//   athletes     — профили спортсменов-легенд
//   documents    — регламенты, кодексы оценок (excerpt = ссылка на PDF)
//   checklists   — чек-листы и практические гайды
//   fun          — мемы, смешные видео (YouTube/VK embed в теле поста)
//
// Метки (discipline tags):
//   acrobatic, artistic, rhythmic, aerobic, trampoline
//
// Каждый пост: 1 категория контента + 1 метка дисциплины
// ---------------------------------------------------------------------------

export interface WpTag {
  id: number;
  slug: string;
  name: string;
  taxonomy: string;
}

/** Получить тег WP по slug */
export async function getTagBySlug(slug: string): Promise<WpTag | null> {
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/tags`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as WpTag;
}

/** Дисциплина → возможные slug тегов */
const DISCIPLINE_TAG_SLUGS: Record<DisciplineSlug, string[]> = {
  acrobatic: ["acrobatic", "akrobatika", "sportivnaya-akrobatika"],
  artistic: ["artistic", "sportivnaya-gimnastika", "sportgim", "sg"],
  rhythmic: ["rhythmic", "hudozhestvennaya-gimnastika", "hudozhestvennaya", "hgg"],
  aerobic: ["aerobic", "aerobika", "aerobica"],
  trampoline: ["trampoline", "batut", "pryzhki-na-batute"],
};

/** Найти первый существующий тег дисциплины */
async function getDisciplineTag(disciplineSlug: DisciplineSlug): Promise<WpTag | null> {
  for (const slug of DISCIPLINE_TAG_SLUGS[disciplineSlug]) {
    const tag = await getTagBySlug(slug);
    if (tag) return tag;
  }
  return null;
}

/**
 * Общий fetcher: посты по категории + тегу дисциплины.
 * Если категория или тег не найдены — возвращает [].
 */
async function fetchPostsByTypeAndDiscipline(
  contentTypeSlugs: string[],
  disciplineSlug: DisciplineSlug,
  options: {
    count: number;
    orderby?: "date" | "modified";
    order?: "asc" | "desc";
    /** Только посты с датой ≥ этой (ISO) */
    after?: string;
    /** Период ISR-кэша в секундах */
    revalidateSeconds?: number;
  },
): Promise<WpPost[]> {
  // Параллельно ищем категорию и тег дисциплины
  let category: WpCategory | null = null;
  for (const slug of contentTypeSlugs) {
    category = await getCategoryBySlug(slug);
    if (category) break;
  }
  if (!category) return [];

  const tag = await getDisciplineTag(disciplineSlug);
  // Тег необязателен — если ещё не создан, возвращаем посты без фильтра по дисциплине
  const url = new URL(`${WP_BASE}/wp-json/wp/v2/posts`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", String(options.count));
  url.searchParams.set("categories", String(category.id));
  if (tag) url.searchParams.set("tags", String(tag.id));
  url.searchParams.set("orderby", options.orderby ?? "date");
  url.searchParams.set("order", options.order ?? "desc");
  if (options.after) url.searchParams.set("after", options.after);

  const res = await fetch(url.toString(), {
    next: { revalidate: options.revalidateSeconds ?? 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return data as WpPost[];
}

/** Новости дисциплины (категория «news») */
export async function getNewsByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 8,
): Promise<Article[]> {
  const posts = await fetchPostsByTypeAndDiscipline(["news", "novosti"], disciplineSlug, {
    count: limit,
    order: "desc",
    revalidateSeconds: 60,
  });
  return posts.map(mapWpPostToArticle);
}

/** Ближайшие соревнования (категория «competitions», дата ≥ сегодня) */
export async function getCompetitionsByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 6,
): Promise<CompetitionEvent[]> {
  const after = new Date().toISOString();
  const posts = await fetchPostsByTypeAndDiscipline(
    ["competitions", "sorevnovaniya", "sorevnovanie"],
    disciplineSlug,
    { count: limit, orderby: "date", order: "asc", after },
  );

  return posts.map((p) => ({
    id: String(p.id),
    title: decodeHtmlEntities(stripHtml(p.title?.rendered ?? "")).trim(),
    date: p.date,
    excerpt: decodeHtmlEntities(stripHtml(p.excerpt?.rendered ?? "")).trim(),
    link: p.link,
    slug: p.slug,
  }));
}

/** Профили спортсменов-легенд (категория «athletes») */
export async function getAthletesByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 3,
): Promise<Article[]> {
  const posts = await fetchPostsByTypeAndDiscipline(
    ["athletes", "sportsmeny", "legends", "legendy"],
    disciplineSlug,
    { count: limit },
  );
  return posts.map(mapWpPostToArticle);
}

/** Документы: регламенты, кодексы (категория «documents») */
export async function getDocumentsByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 8,
): Promise<Article[]> {
  const posts = await fetchPostsByTypeAndDiscipline(
    ["documents", "dokumenty", "docs"],
    disciplineSlug,
    { count: limit },
  );
  return posts.map(mapWpPostToArticle);
}

/** Чек-листы и гайды (категория «checklists») */
export async function getChecklistsByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 6,
): Promise<Article[]> {
  const posts = await fetchPostsByTypeAndDiscipline(
    ["checklists", "chek-listy", "checklists-guides", "gajdy"],
    disciplineSlug,
    { count: limit },
  );
  return posts.map(mapWpPostToArticle);
}

/** Фан-зона: мемы и видео (категория «fun») */
export async function getFunByDiscipline(
  disciplineSlug: DisciplineSlug,
  limit = 6,
): Promise<FunPost[]> {
  const posts = await fetchPostsByTypeAndDiscipline(["fun", "memy", "yumor"], disciplineSlug, {
    count: limit,
  });

  return posts.map((p) => ({
    id: String(p.id),
    title: decodeHtmlEntities(stripHtml(p.title?.rendered ?? "")).trim(),
    excerpt: decodeHtmlEntities(stripHtml(p.excerpt?.rendered ?? "")).trim(),
    content: p.content?.rendered ?? "",
    image: getFeaturedImageUrl(p),
    slug: p.slug,
    date: p.date,
  }));
}

