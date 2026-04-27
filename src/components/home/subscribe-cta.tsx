import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

const TELEGRAM_URL = "https://t.me/ACROTIM";

export function SubscribeCta() {
  return (
    <section className="px-4 pb-12 pt-4 md:pb-16">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[18px] border border-[var(--color-border-subtle)] bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] px-6 py-10 text-center shadow-[var(--shadow-hover)] md:px-12 md:text-left">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 md:mx-0 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">Не пропускайте новые разборы</h2>
              <p className="mt-2 text-sm leading-relaxed text-violet-100 md:text-base">
                Короткие дайджесты в Telegram: техника, подготовка к стартам и материалы для родителей.
              </p>
            </div>
            <Link
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-[16px] bg-white px-8 text-sm font-semibold text-[#6d28d9] shadow-lg transition hover:bg-violet-50"
            >
              Подписаться в Telegram
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
