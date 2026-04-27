import Image from "next/image";
import Link from "next/link";
import {
  disciplines,
  disciplineAccents,
  disciplineCoverImages,
} from "@/lib/mock-data";
import { ScrollReveal } from "./scroll-reveal";

export function DisciplinesSection() {
  return (
    <section id="disciplines" className="scroll-mt-24 bg-white/60 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl">
            Дисциплины
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)] leading-relaxed">
            Один сайт — разные направления. Загляните в раздел, который отвечает вашим вопросам.
          </p>
        </ScrollReveal>

        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d, i) => {
            const accent = disciplineAccents[d.slug];
            const cover = disciplineCoverImages[d.slug];
            return (
              <ScrollReveal key={d.slug} as="li" delayMs={i * 45}>
                <div
                  className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--color-border-subtle)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
                  style={{ background: `linear-gradient(180deg, #ffffff 0%, ${accent.soft}55 100%)` }}
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-100">
                    <Image
                      src={cover}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6 pt-5">
                    <div>
                      <h3
                        className="font-display text-lg font-bold"
                        style={{ color: accent.gradFrom }}
                      >
                        {d.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {d.description}
                      </p>
                    </div>
                    <Link
                      href={d.href}
                      className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[14px] text-sm font-semibold text-white transition hover:brightness-90 md:w-auto md:self-start md:px-6"
                      style={{ backgroundColor: accent.gradFrom }}
                    >
                      Статьи и материалы: {d.name}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
