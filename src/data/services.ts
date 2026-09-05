/**
 * Hizmetler. Metinler i18n mesaj dosyalarından (`services.<key>`) gelir;
 * burada yalnızca dilden bağımsız veriler tutulur.
 * CMS'e geçişte bu dosya Payload koleksiyonuyla değiştirilecek.
 */
export type ServiceKey = "vitoVip" | "transfer" | "tours" | "flightHotel";

export interface Service {
  key: ServiceKey;
  slug: string;
  icon: "car" | "plane-landing" | "map" | "ticket";
  priceFrom?: number;
  currency?: "EUR" | "USD" | "TRY";
  image: string;
}

export const services: Service[] = [
  { key: "vitoVip", slug: "vito-vip", icon: "car", priceFrom: 60, currency: "EUR", image: "/images/vito-black.jpg" },
  { key: "transfer", slug: "transfer", icon: "plane-landing", priceFrom: 35, currency: "EUR", image: "/images/chauffeur.jpg" },
  { key: "tours", slug: "tours", icon: "map", priceFrom: 45, currency: "EUR", image: "/images/tours/istanbul.jpg" },
  { key: "flightHotel", slug: "flight-hotel", icon: "ticket", image: "/images/kizkulesi.jpg" },
];

export function serviceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
