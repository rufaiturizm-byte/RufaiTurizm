import type {
  BreadcrumbList,
  FAQPage,
  TouristTrip,
  TravelAgency,
  WebSite,
  WithContext,
} from "schema-dts";
import { siteConfig, hasRealPhone, hasGoogleProfileUrl } from "@/config/site";

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
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const data: WithContext<TravelAgency> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name,
    /*
     * Ticari unvan ayrıca veriliyor: TÜRSAB kaydında ve faturada
     * "RUFAİ İSTANBUL TURİZM" yazıyor, sitede ise "Rufai Turizm". Belgeyi
     * doğrulamaya giden birinin iki adı eşleştirebilmesi gerekiyor.
     */
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description,
    /*
     * Telefon yalnız GERÇEK numara girildiğinde yayınlanıyor.
     * Arayüz yer tutucu numarayı zaten gizliyordu (hasRealPhone) ama
     * yapısal veri onu Google'a gönderiyordu: arama sonucunda çalışmayan
     * bir numara görünmesi, hiç görünmemesinden çok daha kötü.
     */
    ...(hasRealPhone ? { telephone: siteConfig.phoneHref } : {}),
    email: siteConfig.email,
    priceRange: "€€",
    image: `${siteConfig.url}/images/hero-ortakoy.jpg`,
    logo: `${siteConfig.url}/brand/logo.png`,
    /*
     * Google işletme profiline bağ.
     *
     * `sameAs` Google'ın "bu site ile şu işletme kaydı aynı varlık mı"
     * sorusunu cevapladığı alan; bağlandığında profildeki puan, fotoğraf
     * ve yorumlar aramada bu siteyle birlikte anılır. Yerel aramadaki en
     * ucuz kazanç bu.
     *
     * Ama yalnız GERÇEK profil adresiyle yayınlanıyor (bkz.
     * `hasGoogleProfileUrl`): elimizdeki kısa bağlantı takip edildiğinde
     * profile değil bir arama sonucuna düşüyor ve arama sonucunu kimlik
     * diye işaretlemek yanlış bir iddia olur.
     */
    ...(hasGoogleProfileUrl ? { sameAs: [siteConfig.googleReviewsUrl] } : {}),
    /*
     * TÜRSAB belge numarası makine okunur biçimde.
     * Sayfada zaten yazılı ve doğrulama bağlantısı var; burada olması
     * belgeyi bir metin parçası değil, kimlik bilgisi yapıyor.
     */
    identifier: {
      "@type": "PropertyValue",
      name: "TÜRSAB",
      value: siteConfig.credentials.tursab,
    },
    /*
     * Hizmet verilen yerler tek tek sayılıyor.
     *
     * Önceki hali yalnız "Türkiye" diyordu; oysa turlar ve paketler altı
     * belirli şehirde yapılıyor ve arama da şehir adıyla geliyor
     * ("جولة انطاليا", "bodrum transfer"). Buraya sunmadığımız bir şehir
     * yazılmıyor: liste tours.ts'teki gerçek destinasyonlarla aynı.
     */
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      ...["İstanbul", "Antalya", "Bodrum", "Trabzon", "Bursa", "Sapanca"].map(
        (city) => ({ "@type": "City" as const, name: city }),
      ),
    ],
    /*
     * 7/24 — altbilginin ve iletişim sayfasının zaten söylediği şey.
     * WhatsApp hattı için geçerli; ayrı bir vaat eklenmiyor, var olan
     * vaat makine okunur hale getiriliyor.
     */
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
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
