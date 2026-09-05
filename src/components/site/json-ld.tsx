import type { TravelAgency, WebSite, WithContext } from "schema-dts";
import { siteConfig } from "@/config/site";

/**
 * Yapısal veri. Rakip analizinden: en güçlü SEO'ya sahip rakip
 * TravelAgency + WebSite + FAQPage bloklarını birlikte kullanıyor.
 */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function TravelAgencySchema({
  locale,
  name,
  description,
}: {
  locale: string;
  name: string;
  description: string;
}) {
  const data: WithContext<TravelAgency> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name,
    url: siteConfig.url,
    description,
    telephone: siteConfig.phoneHref,
    email: siteConfig.email,
    priceRange: "€€",
    image: `${siteConfig.url}/images/og.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
    areaServed: { "@type": "Country", name: "Türkiye" },
    knowsLanguage: ["ar", "tr", "en"],
  };

  return <JsonLd data={data} />;
}

export function WebSiteSchema({ name }: { name: string }) {
  const data: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: siteConfig.url,
    inLanguage: ["ar", "tr", "en"],
  };

  return <JsonLd data={data} />;
}
