import dynamic from "next/dynamic";

function foldFallback(className: string) {
  return function FoldFallback() {
    return <div className={`px-4 ${className}`} aria-busy="true" />;
  };
}

/** Ниже первого экрана: отдельные чанки, меньше начальный JS (IntersectionObserver + обвязка). */
export const QuickTopicsLazy = dynamic(
  () => import("./quick-topics").then((m) => ({ default: m.QuickTopics })),
  { loading: foldFallback("min-h-[260px] md:min-h-[300px]") },
);

export const DisciplinesSectionLazy = dynamic(
  () => import("./disciplines-section").then((m) => ({ default: m.DisciplinesSection })),
  { loading: foldFallback("min-h-[400px] md:min-h-[480px]") },
);

export const TrustSectionLazy = dynamic(
  () => import("./trust-section").then((m) => ({ default: m.TrustSection })),
  { loading: foldFallback("min-h-[280px] md:min-h-[320px]") },
);

export const SubscribeCtaLazy = dynamic(
  () => import("./subscribe-cta").then((m) => ({ default: m.SubscribeCta })),
  { loading: foldFallback("min-h-[180px] md:min-h-[200px]") },
);

export const DisciplinesFaqSectionLazy = dynamic(
  () => import("./disciplines-faq-section").then((m) => ({ default: m.DisciplinesFaqSection })),
  { loading: foldFallback("min-h-[480px] md:min-h-[560px]") },
);
