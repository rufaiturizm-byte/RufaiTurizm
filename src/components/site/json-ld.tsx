import type {
  BreadcrumbList,
  FAQPage,
  TouristTrip,
  TravelAgency,
  WebSite,
  WithContext,
} from "schema-dts";
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
    image: `${siteConfig.url}/images/hero-ortakoy.jpg`,
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

/**
 * SSS sayfası için FAQPage. Google'ın zengin sonuçlarında soru-cevap
 * açılımı çıkarır — rakiplerin en güçlüsü bunu kullanıyor.
 */
export function FaqSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const data: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <JsonLd data={data} />;
}

/** Tur ve hizmet detay sayfaları için ürün benzeri kart. */
export function TouristTripSchema({
  name,
  description,
  image,
  price,
  currency,
}: {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
}) {
  const data: WithContext<TouristTrip> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    image: `${siteConfig.url}${image}`,
    provider: {
      "@type": "TravelAgency",
      name: "Rufai Turizm",
      url: siteConfig.url,
    },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price: String(price),
            priceCurrency: currency ?? "EUR",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return <JsonLd data={data} />;
}

/**
 * Kırıntı yolu. Google arama sonucunda adresin yerine
 * "Ana Sayfa › Turlar › İstanbul Turu" satırını gösterir; tıklama oranını
 * yükselten ucuz bir kazanç.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}
