import Link from "next/link";
import { disciplines, topics } from "@/lib/mock-data";

const footerLinks = {
  legal: [
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Условия использования" },
  ],
  social: [
    { href: "https://t.me/ACROTIM", label: "Telegram" },
    { href: "https://vk.com/club237106766", label: "ВКонтакте" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-white px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Gymacro</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Медиа о гимнастике в широком смысле: статьи, гайды и сообщество.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Дисциплины</p>
          <ul className="mt-3 space-y-2">
            {disciplines.map((d) => (
              <li key={d.slug}>
                <Link href={d.href} className="text-sm text-[var(--color-ink)] hover:text-[#6d28d9]">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Темы</p>
          <ul className="mt-3 space-y-2">
            {topics.map((t) => (
              <li key={t.id}>
                <Link href={t.href} className="text-sm text-[var(--color-ink)] hover:text-[#0d9488]">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Контакты и право</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/contact" className="text-sm text-[var(--color-ink)] hover:text-[#6d28d9]">
                Связаться
              </Link>
            </li>
            {footerLinks.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
                  {l.label}
                </Link>
              </li>
            ))}
            {footerLinks.social.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-center text-xs leading-relaxed text-[var(--color-ink-muted)] md:text-left">
        © {new Date().getFullYear()} Gymacro · gymacro.ru
      </p>
      <p className="mx-auto mt-4 max-w-6xl text-center text-xs leading-relaxed text-[var(--color-ink-muted)] md:text-left">
        Редакция готовит материалы для читателей из России и для русскоязычной аудитории. Юридическая информация:{" "}
        <Link href="/privacy" className="text-[var(--color-ink)] underline decoration-zinc-300 underline-offset-2 hover:text-[#6d28d9]">
          политика конфиденциальности
        </Link>
        ,{" "}
        <Link href="/terms" className="text-[var(--color-ink)] underline decoration-zinc-300 underline-offset-2 hover:text-[#6d28d9]">
          условия использования
        </Link>
        .
      </p>
    </footer>
  );
}
