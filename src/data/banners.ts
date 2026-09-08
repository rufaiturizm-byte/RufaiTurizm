/**
 * Kampanya bantları.
 *
 * KASITLI OLARAK BOŞ. Rakiplerde ("6 gün 5 gece, 4 yıldız otel, özel
 * fiyat") sürekli duran kampanya kartları var; bizde gerçek bir kampanya
 * olmadan böyle bir kart göstermek, olmayan bir indirimi varmış gibi
 * sunmak olur — sitenin geri kalanında kurduğumuz güveni ilk WhatsApp
 * mesajında bozar.
 *
 * Dizi boşken bant hiç render edilmez (bkz. `promo-banner.tsx`), yani
 * sayfada boşluk da bırakmaz. Gerçek bir kampanya çıktığında buraya bir
 * kayıt eklemek yeterli: yeri, tasarımı ve üç dildeki metni hazır.
 *
 * `placement` bandın nerede görüneceğini söyler; aynı anda birden çok
 * yerde aynı kampanyayı göstermek için birden çok kayıt gerekir.
 */

type Text = { tr: string; ar: string; en: string };

export type BannerPlacement =
  | "home"
  | "tours"
  | "packages"
  | "transfer"
  | "destinations"
  | `destination:${string}`;

export interface PromoBanner {
  id: string;
  placement: BannerPlacement;
  /** Sol üstteki küçük etiket — "KAMPANYA", "SEZON SONU" gibi. */
  eyebrow: Text;
  title: Text;
  /** İki satırı geçmemeli; bant kartı yüksek olmamalı. */
  description: Text;
  /** Kampanyanın somut şartları — "6 gün 5 gece", "iki kişi" gibi. */
  terms?: Text;
  /** Düğme metni; boşsa varsayılan WhatsApp çağrısı kullanılır. */
  cta?: Text;
  /** Arka plan görseli; yoksa marka gradyanı. */
  image?: string;
  /**
   * Bitiş tarihi (ISO). Geçmiş tarihli bant gösterilmez — süresi dolmuş
   * bir kampanyayı sitede unutmak, olmayan bir fiyatı vaat etmektir.
   */
  endsAt?: string;
}

export const banners: PromoBanner[] = [];

/** Bir yer için geçerli (süresi dolmamış) bantları verir. */
export function bannersFor(placement: BannerPlacement) {
  const now = Date.now();
  return banners.filter(
    (banner) =>
      banner.placement === placement &&
      (!banner.endsAt || new Date(banner.endsAt).getTime() > now),
  );
}
