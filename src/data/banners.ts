/**
 * Kampanya ve vurgu bantları.
 *
 * NE OLMAYACAĞI ÖNCE. Rakiplerde sürekli duran "6 gün 5 gece, 4 yıldız
 * otel, ÖZEL FİYAT" kartları var. Gerçek bir kampanya olmadan böyle bir
 * kart göstermek, olmayan bir indirimi varmış gibi sunmaktır ve sitenin
 * geri kalanında kurduğumuz güveni ilk WhatsApp mesajında bozar. Bu
 * yüzden aşağıdaki üç kayıtta TEK BİR fiyat, indirim ya da yüzde yok.
 *
 * AŞAĞIDAKİLER ÖRNEKTİR. Amaçları bandın nerede durduğunu ve nasıl
 * göründüğünü göstermek. Üçünün de söylediği şey sitenin başka
 * yerlerinde zaten yazılı ve doğru; yani tasarım beğenilmezse silinir,
 * beğenilirse olduğu gibi kalabilir — ikisi de sorun değil.
 *
 * Gerçek bir kampanya çıktığında buraya bir kayıt eklemek yeterli:
 * `endsAt` yazın, tarih geçince bant kendiliğinden kaybolur. Süresi
 * dolmuş bir kampanyayı sitede unutmak, olmayan bir fiyatı vaat etmektir.
 *
 * Dizi boşken ya da bir `placement` için kayıt yokken bant hiç render
 * edilmez (bkz. `promo-banner.tsx`), sayfada boşluk da bırakmaz.
 * Şu an slot açık olan yerler: home, tours, packages, transfer,
 * destinations ve her şehir için `destination:<slug>`.
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

export const banners: PromoBanner[] = [
  {
    id: "ornek-sabit-fiyat",
    placement: "home",
    eyebrow: { tr: "Nasıl çalışıyoruz", ar: "كيف نعمل", en: "How we work" },
    title: {
      tr: "Fiyatı yazışırken söylüyoruz, varışta değişmiyor",
      ar: "نقول لك السعر أثناء المحادثة، ولا يتغيّر عند الوصول",
      en: "We give you the price while we talk, and it does not change on arrival",
    },
    description: {
      tr: "Tarihinizi ve kişi sayısını yazın; aynı gün sabit fiyat ve program taslağı gönderelim. Şoför Arapça konuşuyor, uçuşunuz numarasından takip ediliyor.",
      ar: "اكتب لنا تاريخك وعدد الأشخاص؛ نرسل لك في اليوم نفسه سعراً ثابتاً ومسودة برنامج. السائق يتحدث العربية، ورحلتك تُتابع برقمها.",
      en: "Send us your dates and how many you are; the same day we send a fixed price and a draft itinerary. The driver speaks Arabic and your flight is tracked by its number.",
    },
    terms: {
      tr: "Rötarda bekleme için ek ücret çıkmaz",
      ar: "لا رسوم إضافية على الانتظار عند تأخّر الرحلة",
      en: "No extra charge for waiting if your flight is late",
    },
    image: "/images/places/galata-sokak.jpg",
  },
  {
    id: "ornek-program-kisisel",
    placement: "packages",
    eyebrow: { tr: "Program size göre", ar: "البرنامج على مقاسك", en: "Built around you" },
    title: {
      tr: "Hazır programı olduğu gibi almak zorunda değilsiniz",
      ar: "لستَ مضطراً لأخذ البرنامج الجاهز كما هو",
      en: "You do not have to take the ready-made programme as it is",
    },
    description: {
      tr: "Gün sayısını, durakları ve günün temposunu birlikte ayarlıyoruz. Küçük çocuk, tekerlekli sandalye, namaz molası ya da geç kalkmak — söyleyin, programı ona göre yazalım.",
      ar: "نضبط معاً عدد الأيام والمحطات وإيقاع اليوم. طفل صغير أو كرسي متحرك أو وقفة للصلاة أو الاستيقاظ متأخراً — قل لنا، ونكتب البرنامج على هذا الأساس.",
      en: "We set the number of days, the stops and the pace of the day together. A small child, a wheelchair, a break for prayer, a late start — tell us and we write the programme around it.",
    },
    cta: {
      tr: "Programı birlikte kuralım",
      ar: "لنضع البرنامج معاً",
      en: "Let us build it together",
    },
  },
  {
    id: "ornek-otel-antalya",
    placement: "destination:antalya",
    eyebrow: { tr: "Otel seçimi", ar: "اختيار الفندق", en: "Choosing a hotel" },
    title: {
      tr: "Oteli siz seçin, rezervasyonu biz yapalım",
      ar: "اختر الفندق أنت، ونتولّى نحن الحجز",
      en: "You choose the hotel, we make the booking",
    },
    description: {
      tr: "Anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Bölgeyi, bütçeyi ve kaç kişi olduğunuzu söyleyin; uygun seçenekleri çıkarıp adınıza rezerve edelim.",
      ar: "ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. قل لنا المنطقة والميزانية وعدد الأشخاص؛ نستخرج الخيارات المناسبة ونحجز باسمك.",
      en: "We have no list of partner hotels and we add no commission to the price. Tell us the area, the budget and how many you are; we will find the options and book in your name.",
    },
  },
];

/** Bir yer için geçerli (süresi dolmamış) bantları verir. */
export function bannersFor(placement: BannerPlacement) {
  const now = Date.now();
  return banners.filter(
    (banner) =>
      banner.placement === placement &&
      (!banner.endsAt || new Date(banner.endsAt).getTime() > now),
  );
}
