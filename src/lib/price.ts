import { getLocale } from "next-intl/server";

/**
 * Fiyat gösterimi — dile göre para birimi.
 *
 * Türkçe sayfada TL, Arapça ve İngilizce sayfada euro (yanında dolar
 * karşılığıyla). Sebep: site iki ayrı kitleye bakıyor. Türkiye'den bakan
 * kişi için euro rakamı zihinsel bir çeviri işi; Körfez'den bakan misafir
 * içinse TL rakamı hiçbir şey ifade etmiyor, o dolarla düşünüyor
 * (rakip analizi, madde 4).
 *
 * TL rakamları `priceTryFrom` alanlarında ELLE tutuluyor, kurdan
 * hesaplanmıyor. Otomatik çeviri iki şeyi bozardı: rakamlar yuvarlak
 * durmaz (2.511 ₺ gibi) ve fiyat bir dış servise bağlanır. Kur ciddi
 * oynadığında bu alanlar elle güncellenir — bilinçli tercih.
 */
export interface PriceInput {
  /** Euro fiyatı — Arapça ve İngilizce sayfalarda gösterilen rakam. */
  eur: number;
  /** TL fiyatı — Türkçe sayfada gösterilen rakam. */
  tryLira: number;
  /** Dolar karşılığı — yalnız euro gösterilirken ikincil rakam olur. */
  usd?: number;
}

export interface PriceDisplay {
  /** Ekrana basılan ana rakam, para birimi işaretiyle. */
  main: string;
  /** Ana rakamın yanındaki ikincil rakam; Türkçede yok. */
  secondary: string | null;
  /** Şema için sayı — gösterilen rakamla aynı olmalı. */
  amount: number;
  /** Şema için para birimi kodu. */
  currency: "EUR" | "TRY";
}

export function formatPrice(locale: string, price: PriceInput): PriceDisplay {
  if (locale === "tr") {
    return {
      main: `${price.tryLira.toLocaleString("tr-TR")} ₺`,
      secondary: null,
      amount: price.tryLira,
      currency: "TRY",
    };
  }

  /*
   * ARAPÇA SAYFADA SUUDİ RİYALİ DE GÖSTERİLİYOR.
   *
   * Google'ın çok bölgeli site belgesi, bir sitenin hangi ülkeyi
   * hedeflediğini anlamak için saydığı sinyaller arasında "yerel para
   * birimi kullanımı"nı açıkça sayıyor. Site tarafındaki ülke
   * sinyallerinden kullanmadığımız tek madde buydu: adres ve telefon
   * Türkiye'de, ülke uzantılı alan adımız yok, sunucu konumu ise
   * belgenin kendi ifadesiyle "kesin bir sinyal değil".
   *
   * RİYAL DOLARA SABİT: 1 USD = 3,75 SAR ve bu oran 1986'dan beri
   * değişmedi. Yani çarpan kurla oynamıyor; TL'de olduğu gibi elle
   * güncellenmesi gerekmiyor.
   *
   * ÜLKEYE GÖRE DEĞİŞMİYOR. Aynı belge "içeriği IP analizine göre
   * uyarlamayın" diyor; Arapça sayfayı açan herkes aynı satırı görüyor,
   * Riyad'dan da İstanbul'dan da.
   */
  const sar = price.usd ? Math.round(price.usd * 3.75) : null;

  return {
    main: `€${price.eur}`,
    secondary:
      price.usd && locale === "ar"
        ? `≈ $${price.usd} · ${sar} ﷼`
        : price.usd
          ? `≈ $${price.usd}`
          : null,
    amount: price.eur,
    currency: "EUR",
  };
}

/** Sunucu bileşenleri için: dili kendi okur. */
export async function getPrice(price: PriceInput): Promise<PriceDisplay> {
  return formatPrice(await getLocale(), price);
}
