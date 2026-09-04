"use client";

import type { MouseEvent, ReactNode } from "react";

type InPageAnchorProps = {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
};

/**
 * Same-page hash link. Next.js `<Link href="#id">` often does not scroll
 * (especially on mobile), so we use a native anchor + scrollIntoView.
 */
export function InPageAnchor({ href, className, children }: InPageAnchorProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", href);
  };

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
