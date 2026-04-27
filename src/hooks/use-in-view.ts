"use client";

import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit;

const DEFAULT_ROOT_MARGIN = "0px 0px -8% 0px";
const DEFAULT_THRESHOLD = 0.08;

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: Options) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const root = options?.root;
  const rootMargin = options?.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        obs.disconnect();
      }
    }, { root, rootMargin, threshold });

    obs.observe(el);
    return () => obs.disconnect();
  }, [root, rootMargin, threshold]);

  return { ref, isVisible };
}
