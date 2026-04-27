import Link from "next/link";
import { topics } from "@/lib/mock-data";
import { ScrollReveal } from "./scroll-reveal";
import { TopicIcon } from "./topic-icon";

export function QuickTopics() {
  return (
    <section id="topics" className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl">
              Быстрый вход по темам
            </h2>
            <p className="mt-2 text-[var(--color-ink-muted)] leading-relaxed">
              Выберите направление — от техники до вопросов родителям на трибуне.
            </p>
          </div>
        </ScrollReveal>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t, i) => (
            <ScrollReveal key={t.id} as="li" delayMs={i * 40}>
              <Link
                href={t.href}
                className="group flex h-full flex-col gap-3 rounded-[16px] border border-[var(--color-border-subtle)] bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-violet-200/80 hover:shadow-[var(--shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#ede9fe] text-[#6d28d9] shadow-sm transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:scale-110 group-hover:bg-[#ccfbf1] group-hover:text-[#0d9488] group-hover:shadow-md group-active:scale-95 motion-safe:group-hover:-rotate-2 motion-safe:group-focus-visible:scale-110 motion-safe:group-focus-visible:-rotate-2">
                  <TopicIcon icon={t.icon} />
                </span>
                <div>
                  <span className="font-display text-base font-semibold text-[var(--color-ink)]">{t.title}</span>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{t.description}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
