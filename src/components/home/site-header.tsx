"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { disciplines, disciplineAccents } from "@/lib/mock-data";
import { SITE_TELEGRAM_URL } from "@/lib/site-contact";

const DISCIPLINE_LINKS = {
  acrobatic: disciplines.find((d) => d.slug === "acrobatic")?.href ?? "/disciplines/acrobatic",
  artistic: disciplines.find((d) => d.slug === "artistic")?.href ?? "/disciplines/artistic",
  rhythmic: disciplines.find((d) => d.slug === "rhythmic")?.href ?? "/disciplines/rhythmic",
  aerobic: disciplines.find((d) => d.slug === "aerobic")?.href ?? "/disciplines/aerobic",
  trampoline: disciplines.find((d) => d.slug === "trampoline")?.href ?? "/disciplines/trampoline",
} as const;

/** Основные разделы — навигация шапки (десктоп + мобильное меню) */
const HEADER_NAV = [
  { href: DISCIPLINE_LINKS.acrobatic,  label: "Акробатика",              color: disciplineAccents.acrobatic.gradFrom  },
  { href: DISCIPLINE_LINKS.artistic,   label: "Спортивная гимнастика",   color: disciplineAccents.artistic.gradFrom   },
  { href: DISCIPLINE_LINKS.rhythmic,   label: "Художественная гимнастика", color: disciplineAccents.rhythmic.gradFrom },
  { href: DISCIPLINE_LINKS.aerobic,    label: "Спортивная аэробика",     color: disciplineAccents.aerobic.gradFrom    },
  { href: DISCIPLINE_LINKS.trampoline, label: "Батут",                   color: disciplineAccents.trampoline.gradFrom },
];

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
          <header className="animate-header-enter sticky top-0 z-50 border-b border-violet-100/80 bg-gradient-to-r from-violet-50/90 via-white/95 to-sky-50/90 backdrop-blur-md supports-[backdrop-filter]:from-violet-50/80 supports-[backdrop-filter]:via-white/90 supports-[backdrop-filter]:to-sky-50/80">
        <div className="mx-auto grid min-h-[56px] max-w-6xl grid-cols-[1fr_auto] items-center gap-x-2 px-3 py-2 sm:gap-x-3 sm:px-5 md:grid-cols-[auto_1fr_auto] md:gap-x-8 md:py-0">
          {/* Логотип: GYM + ACRO — крупнее и контрастнее */}
          <Link
            href="/"
            className="font-display justify-self-start text-lg font-extrabold leading-none tracking-[0.07em] sm:text-xl md:text-[1.375rem]"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-zinc-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">GYM</span>
            <span className="text-violet-600 drop-shadow-[0_1px_1px_rgba(124,58,237,0.28)]">ACRO</span>
          </Link>

          {/* Навигация — только ≥ md */}
          <nav
            className="hidden min-w-0 items-center justify-center gap-5 lg:gap-8 md:flex"
            aria-label="Основные разделы"
          >
            {HEADER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-header-link whitespace-nowrap text-sm font-semibold transition-opacity hover:opacity-75"
                style={{ color: item.color }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
            {/* На узком экране — только иконка; от md — подпись */}
            <Link
              href={SITE_TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Наш Telegram — открыть канал"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#1e8bc2] md:h-9 md:px-4"
            >
              <TelegramIcon className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden md:inline">Наш Telegram</span>
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition-colors duration-200 hover:bg-zinc-200/60 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Открыть меню"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" id="mobile-menu">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
            aria-label="Закрыть меню"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-l border-zinc-200 bg-white shadow-xl">
            <div className="flex min-h-[56px] shrink-0 items-center justify-between border-b border-zinc-100 px-4">
              <span className="text-sm font-medium text-zinc-500">Разделы</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 overflow-y-auto p-3" aria-label="Основные разделы">
              {HEADER_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors duration-200 hover:bg-zinc-50"
                  style={{ color: item.color }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
