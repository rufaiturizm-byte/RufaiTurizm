import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, routing } from "@/i18n/routing";
import { tours } from "@/data/tours";
import { services } from "@/data/services";
import { guides } from "@/data/guides";
import { transferRoutes } from "@/data/transfer-routes";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { siteConfig } from "@/config/site";

const base = siteConfig.url;

/**
 * İçeriğin son elden geçtiği tarih.
 *
 * Bu değer bilerek sabit; önceki hali `new Date()` idi ve her dağıtımda
 * 53 sayfanın hepsine aynı, o anki zaman damgasını basıyordu. Yani tek
 * bir yazım hatası düzeltmesi bile Google'a "sitedeki her sayfa yeniden
 * yazıldı" diyordu. Google bu alanın güvenilirliğini böyle ölçer: hepsi
 * aynıysa ve her seferinde değişiyorsa alanı tümden yok sayar — yani
 * gerçekten yeni bir rehber eklediğimizde elimizde kullanılabilir bir
 * sinyal kalmıyordu.
 *
 * İçerik anlamlı biçimde değiştiğinde (yeni tur, yeni rehber, metin
 * revizyonu) elle güncellenir. Tek bir sayfanın kendi tarihi varsa
 * aşağıdaki `updated` alanı bunu geçersiz kılar.
 */
const CONTENT_REVISION = new Date("2026-09-08T00:00:00Z");

type Entry = {
  /** routing.ts'teki mantıksal yol; Arapça/Türkçe karşılıkları oradan çözülür. */
  href: Parameters<typeof getPathname>[0]["href"];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** Sayfaya özel son güncelleme; yoksa CONTENT_REVISION kullanılır. */
  updated?: Date;
};

/**
 * Yolu mutlak adrese çevirir.
 *
 * Arapça yollar sitemap'e ham UTF-8 olarak yazılıyordu (`/جولاتنا`), oysa
 * sayfanın kendi `<link rel="canonical">` etiketi yüzde-kodlu biçimi
 * veriyor (`/%D8%AC%D9%88...`). Artık ikisi de aynı kaynaktan geliyor:
 * `getPathname` yolu zaten yüzde-kodlu döndürür, bu yüzden burada TEKRAR
 * kodlanmamalı — `encodeURI` yüzde işaretinin kendisini de kodlar
 * (`%D8` → `%25D8`) ve ortaya 404 veren bir adres çıkar.
 *
 * Ana sayfada sondaki eğik çizgi atılıyor: canonical etiketi
 * `https://rufaiturizm.com` diyor, sitemap `.../` deseydi aynı sayfa iki
 * ayrı adresle anılmış olurdu.
 */
function abs(path: string) {
  return `${base}${path === "/" ? "" : path.replace(/\/$/, "")}`;
}

function urlFor(href: Entry["href"], locale: (typeof locales)[number]) {
  return abs(getPathname({ locale, href }));
}

function toSitemapEntry(entry: Entry): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, urlFor(entry.href, locale)]),
  ) as Record<(typeof locales)[number], string>;

  return {
    url: languages[routing.defaultLocale],
    lastModified: entry.updated ?? CONTENT_REVISION,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: {
      languages: { ...languages, "x-default": languages[routing.defaultLocale] },
    },
  };
}

/**
 * Site haritası.
 *
 * Yollar routing.ts'ten çözülüyor, burada elle yazılmıyor: önceki hali
 * Arapça bölüm adlarının ikinci bir kopyasını tutuyordu ve routing.ts
 * değiştiğinde sitemap sessizce yanlış adres yayınlayabilirdi.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { href: "/", priority: 1, changeFrequency: "weekly" },

    { href: "/tours", priority: 0.9, changeFrequency: "monthly" },
    { href: "/packages", priority: 0.9, changeFrequency: "monthly" },
    { href: "/services", priority: 0.9, changeFrequency: "monthly" },
    { href: "/transfer", priority: 0.9, changeFrequency: "monthly" },
    { href: "/destinations", priority: 0.9, changeFrequency: "monthly" },
    { href: "/guides", priority: 0.8, changeFrequency: "monthly" },
    { href: "/hotels", priority: 0.8, changeFrequency: "monthly" },
    { href: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { href: "/about", priority: 0.6, changeFrequency: "yearly" },
    { href: "/faq", priority: 0.6, changeFrequency: "monthly" },

    ...services.map((service) => ({
      href: { pathname: "/services/[slug]" as const, params: { slug: service.slug } },
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...tours.map((tour) => ({
      href: { pathname: "/tours/[slug]" as const, params: { slug: tour.slug } },
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...packages.map((item) => ({
      href: { pathname: "/packages/[slug]" as const, params: { slug: item.slug } },
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...destinations.map((item) => ({
      href: { pathname: "/destinations/[city]" as const, params: { city: item.slug } },
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    ...guides.map((guide) => ({
      href: { pathname: "/guides/[slug]" as const, params: { slug: guide.slug } },
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...transferRoutes.map((route) => ({
      href: { pathname: "/transfer/[route]" as const, params: { route: route.slug } },
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  return entries.map(toSitemapEntry);
}
