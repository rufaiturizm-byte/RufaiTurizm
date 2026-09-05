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

/**
 * Rehber yazıları için Article şeması.
 *
 * Rehberler sitenin arama motorundaki asıl tutunma yüzeyi; yazıyı
 * işaretlemek Google'a bunun bir hizmet sayfası değil bilgi içeriği
 * olduğunu söyler ve "kim yazdı" sorusuna kurumsal bir cevap verir.
 *
 * `datePublished` bilerek yok: uydurma bir tarih, içeriğin tazeliği
 * konusunda yanlış sinyal verir. Yazılar CMS'e taşındığında gerçek
 * tarihle birlikte eklenecek.
 */
export function ArticleSchema({
  headline,
  description,
  image,
  url,
  locale,
}: {
  headline: string;
  description: string;
  image: string;
  url: string;
  locale: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: `${siteConfig.url}${image}`,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}${url}` },
    author: { "@type": "Organization", name: siteConfig.legalName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/logo.png` },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Liste sayfaları için ItemList.
 *
 * Turlar ve rehberler sayfası bir dizi kart basıyor ama arama motoru
 * için bunlar birbirinden bağımsız bağlantılardı. ItemList, sayfanın bir
 * KOLEKSİYON olduğunu ve öğelerin sırasını söylüyor.
 */
export function ItemListSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}
