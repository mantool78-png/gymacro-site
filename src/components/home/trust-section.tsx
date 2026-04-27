import { trustPoints } from "@/lib/mock-data";
import { ScrollReveal } from "./scroll-reveal";

function TrustIcon({ index }: { index: number }) {
  const paths = [
    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  ];
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[index % paths.length]} />
    </svg>
  );
}

export function TrustSection() {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl rounded-[18px] border border-[var(--color-border-subtle)] bg-gradient-to-br from-[#fafafa] to-white px-6 py-10 shadow-[var(--shadow-soft)] md:px-12 md:py-12">
        <ScrollReveal>
          <h2 className="font-display max-w-2xl text-2xl font-bold leading-snug text-[var(--color-ink)] md:text-3xl">
            Мы собираем знания для большой гимнастической семьи
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)] leading-relaxed">
            Спортсмены, тренеры, родители и те, кто просто любит гимнастику — всем нужны ясные ответы без шума.
          </p>
        </ScrollReveal>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((p, i) => (
            <ScrollReveal key={p.title} as="li" delayMs={i * 50} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#ede9fe] text-[#6d28d9]">
                <TrustIcon index={i} />
              </span>
              <div>
                <h3 className="font-display font-semibold text-[var(--color-ink)]">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{p.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
