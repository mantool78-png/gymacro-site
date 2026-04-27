"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import type { ElementType, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
}

export function ScrollReveal({ children, className = "", delayMs = 0, as: Tag = "div" }: ScrollRevealProps) {
  const [mounted, setMounted] = useState(false);
  const { ref, isVisible } = useInView<HTMLElement>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // До монтирования (SSR + первый рендер клиента) — показываем сразу,
  // без скрытия, чтобы Speed Index не падал от invisible-контента.
  const revealClass = mounted
    ? `reveal-on-scroll ${isVisible ? "is-visible" : ""}`
    : "reveal-on-scroll is-visible";

  return (
    <Tag
      ref={ref}
      className={`${revealClass} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
