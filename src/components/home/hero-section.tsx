import { SITE_TELEGRAM_URL } from "@/lib/site-contact";
import { HeroMotion } from "./hero-motion";
import { HeroSideVideo } from "./hero-side-video";
import { InPageAnchor } from "./in-page-anchor";
import Image from "next/image";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="hero-stage relative isolate overflow-hidden md:min-h-[calc(100dvh-56px)]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-main.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover object-[68%_28%] md:object-[72%_24%]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,18,28,0.92)_0%,rgba(8,18,28,0.78)_38%,rgba(8,28,36,0.45)_62%,rgba(8,28,36,0.22)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(8,18,28,0.35)_70%)]"
          aria-hidden
        />
        <HeroMotion />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[min(88vh,720px)] max-w-6xl grid-cols-1 items-end gap-8 px-4 pb-10 pt-16 md:min-h-[calc(100dvh-56px)] md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.9fr)] md:items-center md:gap-12 md:px-6 md:py-0 lg:gap-16">
        <div className="max-w-xl text-left">
          <p className="hero-reveal font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-[3.5rem]">
            Gymacro
          </p>
          <h1 className="hero-reveal hero-reveal-delay-1 mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-white/95 sm:text-2xl md:text-[1.85rem] md:leading-tight">
            Понятная гимнастика для родителей
          </h1>
          <p className="hero-reveal hero-reveal-delay-2 mt-4 max-w-md text-base leading-relaxed text-white/78 md:text-[1.05rem]">
            Ваш ребёнок ходит в секцию — мы объясняем всё остальное: выбор дисциплины, растяжка без слёз, разряды,
            соревнования и как поддержать после неудачи. Простым языком, без тренерского жаргона.
          </p>
          <div className="hero-reveal hero-reveal-delay-3 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <InPageAnchor
              href="#feed"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent-teal)] px-6 text-sm font-semibold text-white transition hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08121c]"
            >
              Читать статьи
            </InPageAnchor>
            <a
              href={SITE_TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:border-white/40 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08121c]"
            >
              <TelegramIcon className="h-4 w-4 text-[#7dd3fc]" />
              Telegram
            </a>
          </div>
        </div>

        <div className="hero-reveal hero-reveal-delay-2 relative mx-auto hidden w-full max-w-md md:mx-0 md:block lg:max-w-lg">
          <HeroSideVideo />
        </div>
      </div>
    </section>
  );
}
