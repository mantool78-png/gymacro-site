import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/home";
import {
  SITE_EDITORIAL_EMAIL,
  SITE_TELEGRAM_URL,
  SITE_VK_URL,
} from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Связаться — Gymacro",
  description:
    "Как связаться с редакцией медиа Gymacro: электронная почта и официальный Telegram-канал.",
};

export default function ContactPage() {
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
              Связаться
            </h1>
          </header>

          <div className="post-body mt-8 rounded-2xl border border-zinc-200/80 bg-white px-5 py-8 shadow-sm md:px-8 md:py-10">
            <p>
              Есть вопрос по материалам сайта Gymacro — медиа о гимнастике для спортсменов,
              тренеров и родителей? Напишите в редакцию: ответим по почте или в Telegram.
            </p>
            <p>
              Электронная почта:{" "}
              <a href={`mailto:${SITE_EDITORIAL_EMAIL}`}>{SITE_EDITORIAL_EMAIL}</a>
            </p>
            <p>
              Официальный Telegram:{" "}
              <a href={SITE_TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                t.me/ACROTIM
              </a>
            </p>
            <p>
              ВКонтакте:{" "}
              <a href={SITE_VK_URL} target="_blank" rel="noopener noreferrer">
                vk.com/club237106766
              </a>
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
