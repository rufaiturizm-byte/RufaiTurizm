/**
 * Çok günlük paket programları (rakip analizi, madde 1 — ★ öncelik).
 *
 * Körfezli aile günübirlik tur değil, 5–10 günlük program arıyor; rakiplerin
 * en çok yer ayırdığı ürün bu. Dizi boşken paket bölümü hiç render edilmez,
 * yani uydurma program/fiyat yayınlanmaz.
 *
 * Metinler bilerek burada, mesaj dosyalarında değil: bir paket eklemek üç
 * ayrı JSON'a dokunmayı gerektirmesin diye adlar üç dilde tek yerde duruyor.
 *
 * Örnek (yorumu kaldırıp kendi programınızla doldurun):
 *
 * {
 *   slug: "istanbul-tarihi-kent",
 *   name: { tr: "İstanbul Tarihi Kent Paketi", ar: "باقة إسطنبول التاريخية", en: "Historic Istanbul Package" },
 *   city: { tr: "İstanbul", ar: "إسطنبول", en: "Istanbul" },
 *   days: 5,
 *   priceUsdFrom: 657,   // fiyat yoksa alanı hiç yazmayın: "Fiyat talep üzerine" görünür
 *   image: "/images/tours/istanbul.jpg",
 *   discountPercent: 20, // yalnız GERÇEK indirimde; sürekli duran sahte indirim güveni kırar
 * }
 */
export interface Package {
  slug: string;
  name: { tr: string; ar: string; en: string };
  city: { tr: string; ar: string; en: string };
  days: number;
  /** Başlangıç fiyatı (USD). Yazılmazsa kart "Fiyat talep üzerine" gösterir. */
  priceUsdFrom?: number;
  image: string;
  /** Yalnız gerçek indirim varken doldurun. */
  discountPercent?: number;
}

export const packages: Package[] = [];
