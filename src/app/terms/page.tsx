import type { Metadata } from "next";
import { WpStaticPage } from "@/components/legal/wp-static-page";

export const metadata: Metadata = {
  title: "Условия использования — Gymacro",
  description: "Условия использования материалов и сервисов сайта Gymacro.",
};

export default function TermsPage() {
  return (
    <WpStaticPage
      slugs={[
        "terms",
        "terms-of-use",
        "usloviya-ispolzovaniya",
        "usloviya",
      ]}
      fallbackTitle="Условия использования"
    />
  );
}
