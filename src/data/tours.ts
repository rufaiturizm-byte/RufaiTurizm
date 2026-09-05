/**
 * Tur destinasyonları. İsim ve açıklama i18n'den (`tours.<key>`) okunur.
 */
export type TourKey = "istanbul" | "bursa" | "sapanca" | "trabzon" | "bodrum";

export interface Tour {
  key: TourKey;
  slug: string;
  priceFrom: number;
  currency: "EUR";
  durationHours: number;
  image: string;
  /** Arama motoru ve harita için konum. */
  geo: { lat: number; lng: number };
}

export const tours: Tour[] = [
  { key: "istanbul", slug: "istanbul-turu", priceFrom: 45, currency: "EUR", durationHours: 8, image: "/images/tours/istanbul.jpg", geo: { lat: 41.0082, lng: 28.9784 } },
  { key: "bursa", slug: "bursa-turu", priceFrom: 55, currency: "EUR", durationHours: 10, image: "/images/tours/bursa.jpg", geo: { lat: 40.1826, lng: 29.0665 } },
  { key: "sapanca", slug: "sapanca-turu", priceFrom: 50, currency: "EUR", durationHours: 9, image: "/images/tours/sapanca.jpg", geo: { lat: 40.6911, lng: 30.2661 } },
  { key: "trabzon", slug: "trabzon-turu", priceFrom: 75, currency: "EUR", durationHours: 12, image: "/images/tours/trabzon.jpg", geo: { lat: 41.0015, lng: 39.7178 } },
  { key: "bodrum", slug: "bodrum-turu", priceFrom: 65, currency: "EUR", durationHours: 10, image: "/images/tours/bodrum.jpg", geo: { lat: 37.0344, lng: 27.4305 } },
];
