/**
 * Tur destinasyonları. İsim, şehir ve açıklama i18n'den (`tours.<key>`) okunur.
 */
export type TourKey = "istanbul" | "bursa" | "sapanca" | "trabzon" | "bodrum" | "antalya";

export interface Tour {
  key: TourKey;
  slug: string;
  priceFrom: number;
  currency: "EUR";
  /**
   * USD karşılığı. Körfez müşterisi dolarla düşündüğü için kartlarda
   * euro fiyatın yanında gösterilir. Kur değişince elle güncellenir —
   * bilinçli tercih: bayat bir çarpan yanlış fiyat göstermesin.
   */
  priceUsdFrom: number;
  /**
   * Üstü çizili liste fiyatı. Yalnız GERÇEK bir indirim varken doldurulur;
   * boşken kartta hiç görünmez ve yerine USD karşılığı basılır. Sürekli
   * duran sahte bir "eski fiyat" güveni kıran ilk şeydir.
   */
  priceListFrom?: number;
  durationHours: number;
  image: string;
  /*
   * Aynı bölgeyi kapsayan çok günlü program.
   *
   * Tur sayfası günübirlik gezinin sayfası; aynı yeri birkaç güne yaymak
   * isteyen misafirin oradan paket programa geçebilmesi gerekiyor.
   * Bağlantı denetiminde çıktı: paket detay sayfaları siteye en zayıf
   * bağlanan sayfalardı ve tur sayfalarından hiç bağlantı almıyorlardı.
   */
  packageSlug?: string;
  /** Arama motoru ve harita için konum. */
  geo: { lat: number; lng: number };
}

export const tours: Tour[] = [
  { key: "istanbul", slug: "istanbul-turu", priceFrom: 45, priceUsdFrom: 49, currency: "EUR", durationHours: 8, image: "/images/tours/istanbul.jpg", packageSlug: "istanbul-4-gun", geo: { lat: 41.0082, lng: 28.9784 } },
  { key: "bursa", slug: "bursa-turu", priceFrom: 55, priceUsdFrom: 60, currency: "EUR", durationHours: 10, image: "/images/tours/bursa.jpg", packageSlug: "istanbul-bursa-6-gun", geo: { lat: 40.1826, lng: 29.0665 } },
  { key: "sapanca", slug: "sapanca-turu", priceFrom: 50, priceUsdFrom: 54, currency: "EUR", durationHours: 9, image: "/images/tours/sapanca.jpg", packageSlug: "istanbul-sapanca-bursa-8-gun", geo: { lat: 40.6911, lng: 30.2661 } },
  { key: "trabzon", slug: "trabzon-turu", priceFrom: 75, priceUsdFrom: 81, currency: "EUR", durationHours: 12, image: "/images/tours/trabzon.jpg", packageSlug: "trabzon-karadeniz-5-gun", geo: { lat: 41.0015, lng: 39.7178 } },
  { key: "bodrum", slug: "bodrum-turu", priceFrom: 65, priceUsdFrom: 70, currency: "EUR", durationHours: 10, image: "/images/tours/bodrum.jpg", packageSlug: "bodrum-ege-5-gun", geo: { lat: 37.0344, lng: 27.4305 } },
  { key: "antalya", slug: "antalya-turu", priceFrom: 70, priceUsdFrom: 76, currency: "EUR", durationHours: 10, image: "/images/tours/antalya.jpg", packageSlug: "antalya-akdeniz-5-gun", geo: { lat: 36.8841, lng: 30.7056 } },
];

export function tourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}
