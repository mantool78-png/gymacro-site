import type { Metadata } from "next";
import { WpStaticPage } from "@/components/legal/wp-static-page";
import { SITE_EDITORIAL_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Связаться — Gymacro",
  description:
    "Как связаться с редакцией Gymacro: электронная почта, Telegram и сообщество ВКонтакте.",
};

export default function ContactPage() {
  return (
    <WpStaticPage
      slugs={[
        "contact",
        "contacts",
        "kontakt",
        "kontakty",
        "svyazatsya",
      ]}
      fallbackTitle="Связаться"
      fallbackHtml={`<p>Напишите нам на e-mail: <a href="mailto:${SITE_EDITORIAL_EMAIL}">${SITE_EDITORIAL_EMAIL}</a>.</p>
<p>Telegram: <a href="https://t.me/ACROTIM" target="_blank" rel="noopener noreferrer">t.me/ACROTIM</a><br/>
ВКонтакте: <a href="https://vk.com/club237106766" target="_blank" rel="noopener noreferrer">vk.com/club237106766</a></p>`}
    />
  );
}
