import Link from "next/link";
import { HeroMotion } from "./hero-motion";
import { TagCloud } from "./tag-cloud";

const TELEGRAM_HERO = "https://t.me/gymacro";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-4 pt-4 md:pb-5 md:pt-5">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[18px] border border-zinc-200/80 bg-gradient-to-br from-white via-violet-50/50 to-sky-50/60 shadow-[var(--shadow-soft)]">
        <HeroMotion />
        <div className="relative z-10 grid grid-cols-1 items-center lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
          <div className="px-5 py-5 text-center md:px-10 md:py-6 md:text-left">
            <h1 className="font-display text-[1.35rem] font-bold leading-[1.15] tracking-tight text-zinc-900 sm:text-2xl md:text-3xl lg:text-[2rem]">
              Гимнастика: статьи и гайды для спортсменов, тренеров и родителей
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs font-semibold tracking-wide text-violet-700 md:mx-0 md:text-sm">
              Энергия · Эстетика · Победы
            </p>
            <p className="hero-intro mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 md:mx-0 md:text-base">
              <span className="font-semibold text-zinc-800">Gymacro</span> — медиа о гимнастике в широком смысле: спортивная и
              художественная гимнастика, акробатика, аэробика и прыжки на батуте. Разборы по технике, ОФП, растяжке, психологии
              и соревнованиям — на понятном языке. Материалы для спортсменов, тренеров и родителей из{" "}
              <span className="font-medium text-zinc-700">России</span>.
            </p>
            <div className="mx-auto mt-5 flex w-full max-w-md flex-col items-stretch gap-2.5 md:mx-0 md:max-w-none md:flex-row md:flex-wrap md:items-center">
              <Link
                href="#feed"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0d9488] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f766e]"
              >
                Читать последние статьи
              </Link>
              <Link
                href={TELEGRAM_HERO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-zinc-200/90 bg-white/90 px-5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-violet-200 hover:bg-white"
              >
                <TelegramIcon className="h-[16px] w-[16px] text-[#229ED9]" />
                Наш Telegram
              </Link>
            </div>
          </div>
          <div className="hidden h-[220px] lg:block xl:h-[250px]">
            <TagCloud />
          </div>
        </div>
      </div>
    </section>
  );
}
