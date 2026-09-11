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
    /*
     * Tam adres.
     *
     * Buraya kadar yalnız şehir ve ülke vardı ("İstanbul, TR") — yani
     * arama motoruna "İstanbul'dayız" demekten öteye gitmiyordu. Yerel
     * aramada ve Google'ın işletme eşleştirmesinde ağırlığı olan alanlar
     * sokak ve posta kodu; ikisi de artık `siteConfig`'te.
     *
     * `addressRegion` İstanbul çünkü şehir aynı zamanda il. `streetAddress`
     * yalnız DOLUYSA basılıyor: boş bir alan göndermek, eksik bırakmaktan
     * daha kötü — şema doğrulayıcıları onu hatalı kayıt sayıyor.
     */
    address: {
      "@type": "PostalAddress",
      ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
      ...(siteConfig.address.postalCode ? { postalCode: siteConfig.address.postalCode } : {}),
      ...(siteConfig.address.district ? { addressLocality: siteConfig.address.district } : {}),
      addressRegion: siteConfig.address.city,
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

/**
 * Tur, hizmet ve paket detay sayfaları için ürün benzeri kart.
 *
 * `durationHours`, `geo` ve `itinerary` sonradan eklendi: üçünün de
 * verisi zaten dosyalarda duruyordu ama şemaya girmiyordu. Sayfa "10 saat"
 * yazıyor, tours.ts turun koordinatını tutuyor, paket sayfası gün gün
 * programı basıyor — makineye verdiğimiz özet ise yalnız ad, açıklama ve
 * görselden ibaretti. Yapay zekâ aramaları (ChatGPT, Perplexity, Google'ın
 * özetleri) bu alanları düz metni yorumlamak yerine doğrudan okuyor.
 */
export function TouristTripSchema({
  name,
  description,
  image,
  price,
  currency,
  durationHours,
  geo,
  itinerary,
}: {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  /** Turun sürdüğü saat — ISO 8601 süresine çevrilir. */
  durationHours?: number;
  /** Turun geçtiği yerin koordinatı ve adı. */
  geo?: { lat: number; lng: number; name: string };
  /** Paketin gün gün programı; her gün bir durak olarak veriliyor. */
  itinerary?: string[];
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
    ...(durationHours ? { duration: `PT${durationHours}H` } : {}),
    ...(geo
      ? {
          itinerary: {
            "@type": "Place",
            name: geo.name,
            geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
          },
        }
      : {}),
    ...(itinerary && itinerary.length
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: itinerary.length,
            itemListElement: itinerary.map((label, index) => ({
              "@type": "ListItem" as const,
              position: index + 1,
              item: { "@type": "Place" as const, name: label },
            })),
          },
        }
      : {}),
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
 * Güzergâh sayfaları için yolculuk şeması.
 *
 * Şema denetiminde çıktı: güzergâh sayfalarında yalnız BreadcrumbList
 * vardı. Turlar TouristTrip + Offer alıyor, hizmetler ve paketler bunun
 * üstüne FAQPage alıyor; güzergâhlar ise sitenin ticari niyeti en yüksek
 * sayfaları olmasına rağmen işaretsizdi.
 *
 * `itinerary` iki noktayı sırayla veriyor — bu sayfanın konusu bir yer
 * değil, iki yer ARASINDAKİ yolculuk ve şemanın bunu söyleyebildiği tek
 * yer burası.
 *
 * `offers` bilerek yok: güzergâh bazlı fiyat listesi yayınlamıyoruz
 * (bkz. data/transfer-routes.ts). Şemaya rakam yazmak, sayfada
 * söylemediğimiz bir fiyatı Google'a söylemek olurdu.
 */
export function TransferRouteSchema({
  name,
  description,
  image,
  from,
  to,
}: {
  name: string;
  description: string;
  image: string;
  from: string;
  to: string;
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
    itinerary: {
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@type": "Place", name: from } },
        { "@type": "ListItem", position: 2, item: { "@type": "Place", name: to } },
      ],
    },
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
 * `datePublished` uzun süre yoktu çünkü uydurma bir tarih, içeriğin
 * tazeliği konusunda yanlış sinyal verir. Artık gerçek tarih var:
 * guide-dates.ts, her rehberin hangi gün yazıldığını git geçmişinden
 * alıyor. Tarih bulunamayan bir slug için alan yine basılmıyor —
 * yanlış tarih basmaktansa eksik kalsın.
 *
 * `dateModified` hâlâ yok; gerekçesi guide-dates.ts'in başında.
 */
export function ArticleSchema({
  headline,
  description,
  image,
  url,
  locale,
  datePublished,
}: {
  headline: string;
  description: string;
  image: string;
  url: string;
  locale: string;
  /** ISO tarih (YYYY-MM-DD). Bilinmiyorsa alan hiç basılmaz. */
  datePublished?: string;
}) {
  const kurum = {
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
  };

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: `${siteConfig.url}${image}`,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}${url}` },
    ...(datePublished ? { datePublished } : {}),
    author: kurum,
    publisher: {
      ...kurum,
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
