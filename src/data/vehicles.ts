/**
 * Transfer ve turlarda kullanılan araçlar.
 *
 * Şu an tek araç var ve bu bilinçli: rakipler "filomuz" başlığı altında dört
 * araç sınıfı gösteriyor, biz sahip olmadığımız aracı listelemiyoruz —
 * havalimanında Vito yerine sedan gelmesi, bu sayfanın kazandırdığı güvenin
 * tamamını bir anda geri verir.
 *
 * Dizi olarak duruyor ki ikinci araç alındığında tek satır eklemek yetsin;
 * bölüm araç sayısına göre kendini düzenliyor.
 *
 * Metinler (ad, açıklama, özellikler) i18n'den `fleet.<key>` altından okunur.
 */
export interface Vehicle {
  key: "vito";
  /** Kaç yolcu — gösterim metni i18n'de. */
  seats: number;
  /** Kaç büyük valiz. */
  luggage: number;
  photos: { src: string; altKey: string }[];
  /** Transferde başlangıç fiyatı (EUR). */
  priceFrom?: number;
  /** Öne çıkan donanım — i18n anahtarları. */
  featureKeys: string[];
}

export const vehicles: Vehicle[] = [
  {
    key: "vito",
    seats: 6,
    luggage: 6,
    priceFrom: 35,
    photos: [
      { src: "/images/vito-black.jpg", altKey: "exteriorAlt" },
      { src: "/images/fleet/vito-interior.jpg", altKey: "interiorAlt" },
      { src: "/images/fleet/vito-cockpit.jpg", altKey: "cockpitAlt" },
      { src: "/images/fleet/vito-exterior.jpg", altKey: "exteriorAlt" },
    ],
    featureKeys: ["f1", "f2", "f3", "f4", "f5", "f6"],
  },
];
