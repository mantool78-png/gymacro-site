import type { Article } from "@/lib/mock-data";
import { mapWpPostToArticle, type WpPost } from "@/lib/wp";

const LATEST_POSTS_URL =
  "https://gymacro.ru/cms/wp-json/wp/v2/posts?_embed&per_page=6&categories_exclude=23";

const NEWS_POSTS_URL =
  "https://gymacro.ru/cms/wp-json/wp/v2/posts?_embed&per_page=4&categories=23";

/**
 * Клиентский fetch (если понадобится на клиенте).
 */
export async function getLatestPosts(): Promise<Article[]> {
  const res = await fetch(LATEST_POSTS_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WordPress REST: ${res.status} ${res.statusText}`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];

  return (data as WpPost[]).map(mapWpPostToArticle);
}

/**
 * Загрузка ленты на сервере (ISR, раз в час).
 * Используйте на страницах Next.js App Router.
 */
export async function getLatestPostsServer(): Promise<Article[]> {
  const res = await fetch(LATEST_POSTS_URL, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WordPress REST: ${res.status} ${res.statusText}`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];

  return (data as WpPost[]).map(mapWpPostToArticle);
}

/**
 * Загрузка постов из рубрики «Новости» (категория 23) на сервере.
 */
export async function getNewsPostsServer(): Promise<Article[]> {
  const res = await fetch(NEWS_POSTS_URL, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return [];

  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];

  return (data as WpPost[]).map(mapWpPostToArticle);
}
