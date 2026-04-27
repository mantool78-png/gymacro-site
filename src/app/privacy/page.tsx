import type { Metadata } from "next";
import { WpStaticPage } from "@/components/legal/wp-static-page";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Gymacro",
  description: "Политика конфиденциальности сайта Gymacro: обработка данных и использование сервисов.",
};

export default function PrivacyPage() {
  return (
    <WpStaticPage
      slugs={[
        "privacy",
        "privacy-policy",
        "politika-konfidentsialnosti",
        "politika",
      ]}
      fallbackTitle="Политика конфиденциальности"
    />
  );
}
