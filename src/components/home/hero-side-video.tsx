"use client";

import { useEffect, useState } from "react";

/**
 * Боковое медиа hero только на md+:
 * сжатый autoplay-loop без звука + лёгкий poster.
 * На узких экранах не монтируем video/img — не тянем трафик.
 */
export function HeroSideVideo() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!desktop) {
    return (
      <div
        className="hero-float relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-[#0a1620] ring-1 ring-white/20"
        aria-hidden
      />
    );
  }

  return (
    <div className="hero-float relative aspect-[3/4] overflow-hidden rounded-[1.25rem] ring-1 ring-white/20">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero/hero-side-poster.jpg"
        aria-label="Спортивная акробатика: фрагмент выступления"
      >
        <source src="/images/hero/hero-side.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#08121c]/70 via-transparent to-transparent"
        aria-hidden
      />
            <p className="absolute bottom-4 left-4 right-4 font-display text-sm font-semibold tracking-wide text-white/90">
              От первого занятия — до первого старта
            </p>
    </div>
  );
}
