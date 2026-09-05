/**
 * Gerçek müşteri yorumları.
 *
 * Kasıtlı olarak boş: uydurma isim/ülke/tarih ile yorum yayınlamak
 * güven kıran bir davranış. Dizi boşken yorum bölümü hiç render edilmez
 * (bkz. `src/components/site/reviews.tsx`).
 *
 * Google'dan gelen gerçek yorumları buraya eklemek yeterli; bölüm
 * kendiliğinden görünür. Yorum metni ÇEVRİLMEZ — müşterinin yazdığı
 * dilde kalması gerçekliğin kanıtı gibi çalışır (rakip analizi, madde 9).
 */
export interface Review {
  /** Yorumu yazan kişinin adı, Google'da göründüğü gibi. */
  name: string;
  /** Ülke veya şehir — "Kuveyt", "السعودية" gibi. */
  country: string;
  /** ISO tarih: "2026-08-26" */
  date: string;
  /** 1–5 arası puan. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Yorum metni — orijinal dilinde bırakılır. */
  text: string;
  /** Metnin dili; RTL yönü için gerekli. */
  lang: "ar" | "tr" | "en" | "ru";
}

export const reviews: Review[] = [];

/**
 * Puan kırılımı. Gerçek yorumlar geldiğinde ortalamalar buradan beslenir;
 * şimdilik boş olduğu için bölüm görünmez.
 */
export const ratingBreakdown: { key: "punctuality" | "professionalism" | "comfort" | "value"; score: number }[] = [];
