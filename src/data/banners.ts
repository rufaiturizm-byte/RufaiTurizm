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
  {
    /*
      Transfer sayfasının bandı. Sayfa sitenin en yüksek niyetli yeri —
      buraya gelen kişi zaten transfer arıyor — ama bant yuvası boştu.
      Söylediği her şey sitede zaten yazılı ve doğrulanabilir: uçuş
      numarasından takip, isimli tabelayla karşılama, rötarda ek ücret
      çıkmaması. Kampanya ya da indirim yok.
    */
    id: "transfer-ucus-takibi",
    placement: "transfer",
    eyebrow: { tr: "Karşılama", ar: "الاستقبال", en: "The meeting" },
    title: {
      tr: "Uçağınız gecikse de şoför orada olur",
      ar: "حتى إن تأخرت طائرتك يكون السائق هناك",
      en: "Even if your flight is late, the driver is there",
    },
    description: {
      tr: "Uçuşu numarasından takip ediyoruz; şoför yeni saate göre gelir ve bekleme için ek ücret çıkmaz. Karşılama geliş kapısında, isminizin yazılı olduğu tabelayla.",
      ar: "نتابع الرحلة برقمها؛ فيأتي السائق على الموعد الجديد ولا يُحتسب مقابل للانتظار. والاستقبال عند بوابة الوصول بلافتة تحمل اسمك.",
      en: "We track the flight by its number; the driver comes at the new time and waiting is not charged. You are met at the arrivals gate with a name board.",
    },
    terms: {
      tr: "Bagajınız gecikirse de şoför bekler",
      ar: "وإن تأخرت أمتعتك ينتظر السائق أيضاً",
      en: "If your luggage is delayed, the driver waits too",
    },
  },
  {
    /*
      Turlar sayfasının bandı. Rakiplerin çoğu turu gruba katarak
      ucuzlatıyor; bizim ayrıştığımız yer tam olarak burası ve tur
      listesinde bunu söyleyen bir bant yoktu.
    */
    id: "turlar-gruba-katilmadan",
    placement: "tours",
    eyebrow: { tr: "Nasıl geziyoruz", ar: "كيف نتجوّل", en: "How we travel" },
    title: {
      tr: "Yabancı bir gruba katılmıyorsunuz",
      ar: "لا تنضمّون إلى مجموعة غريبة",
      en: "You do not join a group of strangers",
    },
    description: {
      tr: "Turlar özel: araç yalnız size ait, otelden alıp otele bırakıyoruz. Kalkış saati, namaz ve yemek molaları ile günün temposu sizin programınıza göre kuruluyor.",
      ar: "الجولات خاصة: السيارة لكم وحدكم، ونأخذكم من الفندق ونعيدكم إليه. وموعد الانطلاق واستراحات الصلاة والطعام وإيقاع اليوم تُبنى على برنامجكم أنتم.",
      en: "The tours are private: the vehicle is yours alone, and we collect you from the hotel and return you there. The departure time, prayer and meal breaks and the pace of the day are built around your plan.",
    },
    terms: {
      tr: "Fiyat araç başına, kişi başı değil",
      ar: "السعر للسيارة لا للشخص",
      en: "Priced per car, not per person",
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
