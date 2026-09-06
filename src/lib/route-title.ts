import { isRtl } from "@/i18n/routing";

/**
 * Güzergâh başlığı: "kalkış → varış".
 *
 * Ok yöne göre değişiyor. Arapçada metin sağdan sola okunuyor ve sabit bir
 * "→" kullanılınca ok yolculuğun tersini, yani varıştan kalkışa doğru
 * gösteriyordu — iki yönlü metinde ok karakteri yön bilgisi taşıdığı için
 * çevrilmesi gerekiyor.
 */
export function routeTitle(from: string, to: string, locale: string) {
  return `${from} ${isRtl(locale) ? "←" : "→"} ${to}`;
}
