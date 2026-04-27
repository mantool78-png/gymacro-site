import type { Metadata } from "next";
import {
  ArticleFeed,
  HeroSection,
  NewsFeed,
  SiteFooter,
  SiteHeader,
} from "@/components/home";
import {
  DisciplinesSectionLazy,
  DisciplinesFaqSectionLazy,
  QuickTopicsLazy,
  SubscribeCtaLazy,
  TrustSectionLazy,
} from "@/components/home/home-lazy-blocks";
import { HomeWebPageJsonLd } from "@/components/seo/home-web-page-json-ld";
import { getLatestPostsServer, getNewsPostsServer } from "@/lib/wordpress";
import type { Article } from "@/lib/mock-data";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "гимнастика",
    "спортивная гимнастика",
    "художественная гимнастика",
    "спортивная акробатика",
    "аэробика",
    "батут",
    "статьи для тренеров",
    "гимнастика для детей",
  ],
};

export default async function HomePage() {
  let articles: Article[] = [];
  let newsArticles: Article[] = [];
  try {
    [articles, newsArticles] = await Promise.all([
      getLatestPostsServer(),
      getNewsPostsServer(),
    ]);
  } catch {
    articles = [];
    newsArticles = [];
  }

  return (
    <>
      <HomeWebPageJsonLd />
      <SiteHeader />
      <main>
        <HeroSection />
        <NewsFeed articles={newsArticles} />
        <QuickTopicsLazy />
        <ArticleFeed articles={articles} />
        <DisciplinesSectionLazy />
        <TrustSectionLazy />
        <DisciplinesFaqSectionLazy />
        <SubscribeCtaLazy />
      </main>
      <SiteFooter />
    </>
  );
}
