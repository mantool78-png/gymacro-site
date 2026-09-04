import type { Metadata } from "next";
import { WpStaticPage } from "@/components/legal/wp-static-page";
import { siteCanonical } from "@/lib/site";
import { SITE_EDITORIAL_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Условия использования — Gymacro",
  description: "Условия использования материалов и сервисов сайта Gymacro.",
  alternates: {
    canonical: siteCanonical("/terms"),
  },
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
      fallbackHtml={`<p>Используя сайт gymacro.ru, вы соглашаетесь с этими условиями. Материалы носят информационный характер и не заменяют консультацию специалиста.</p>
<p>По вопросам, связанным с работой сайта, пишите на <a href="mailto:${SITE_EDITORIAL_EMAIL}">${SITE_EDITORIAL_EMAIL}</a>.</p>`}
    />
  );
}
