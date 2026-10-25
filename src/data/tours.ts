/**
 * Tur destinasyonları. İsim, şehir ve açıklama i18n'den (`tours.<key>`) okunur.
 */
export type TourKey = "istanbul" | "bursa" | "sapanca" | "trabzon" | "bodrum" | "antalya";

type Text = { tr: string; ar: string; en: string };

export interface Tour {
  key: TourKey;
  slug: string;
  priceFrom: number;
  currency: "EUR";
  /**
   * USD karşılığı. Körfez müşterisi dolarla düşündüğü için kartlarda
   * euro fiyatın yanında gösterilir. Kur değişince elle güncellenir —
   * bilinçli tercih: bayat bir çarpan yanlış fiyat göstermesin.
   */
  priceUsdFrom: number;
  /**
   * TL fiyatı — yalnız Türkçe sayfada gösterilir (`src/lib/price.ts`).
   * Kurdan hesaplanmıyor, elle tutuluyor; kur oynayınca güncellenir.
   */
  priceTryFrom: number;
  /**
   * Üstü çizili liste fiyatı. Yalnız GERÇEK bir indirim varken doldurulur;
   * boşken kartta hiç görünmez ve yerine USD karşılığı basılır. Sürekli
   * duran sahte bir "eski fiyat" güveni kıran ilk şeydir.
   */
  priceListFrom?: number;
  /** Üstü çizili liste fiyatının TL karşılığı — `priceListFrom` ile birlikte doldurulur. */
  priceListTryFrom?: number;
  durationHours: number;
  image: string;
  /*
   * Aynı bölgeyi kapsayan çok günlü program.
   *
   * Tur sayfası günübirlik gezinin sayfası; aynı yeri birkaç güne yaymak
   * isteyen misafirin oradan paket programa geçebilmesi gerekiyor.
   * Bağlantı denetiminde çıktı: paket detay sayfaları siteye en zayıf
   * bağlanan sayfalardı ve tur sayfalarından hiç bağlantı almıyorlardı.
   */
  packageSlug?: string;
  /*
   * Bölgenin gezi rehberi.
   *
   * Tur sayfası "bugün ne göreceksiniz" diyor; rehber aynı bölgeyi
   * daha geniş anlatıyor (hangi ilçe kime uyar, mevsim, program kurma).
   * Bağlantı denetiminde rehberler sitenin en zayıf bağlanan sayfaları
   * çıktı ve ticari sayfalardan hiç bağlantı almıyorlardı.
   */
  guideSlug?: string;
  /** Arama motoru ve harita için konum. */
  geo: { lat: number; lng: number };
  /*
   * Tura özel soru-cevap.
   *
   * Sitedeki diğer ticari sayfa tiplerinin hepsinde (güzergâh, paket,
   * şehir, hizmet, otel-şehir) soru-cevap ve FAQPage şeması vardı;
   * tur sayfalarında yoktu — yalnız genel SSS önizlemesi basılıyordu.
   * Oysa tur sayfası sitenin en ticari yüzeylerinden biri ve misafirin
   * sorduğu sorular turdan tura değişiyor.
   *
   * Cevaplarda RAKAM YOK: süre ve fiyat zaten aynı sayfada veriden
   * basılıyor; burada tekrar yazılsaydı fiyat değiştiğinde ikisi
   * ayrışırdı (bu dosyada daha önce yaşandı).
   */
  faq: { question: Text; answer: Text }[];
}

export const tours: Tour[] = [
  { key: "istanbul", slug: "istanbul-turu", priceFrom: 110, priceUsdFrom: 123, priceTryFrom: 6100, currency: "EUR", durationHours: 8, image: "/images/tours/istanbul.jpg", packageSlug: "istanbul-4-gun", guideSlug: "bogaz-turu-rehberi", geo: { lat: 41.0082, lng: 28.9784 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Müze biletleri dahil mi?", ar: "هل تذاكر المتاحف مشمولة؟", en: "Are museum tickets included?" }, answer: { tr: "Hayır. Giriş biletleri, öğle yemeği ve tekne bileti fiyata dahil değil; hangi müzeye girileceğine siz karar veriyorsunuz ve bilet gişede alınıyor.", ar: "لا. فتذاكر الدخول والغداء وتذكرة القارب غير مشمولة بالسعر؛ وأنتم من يقرّر أي متحف تدخلون، وتُشترى التذكرة من الشبّاك.", en: "No. Entry tickets, lunch and the boat ticket are not included; you decide which museums to enter and the ticket is bought at the gate." } }] },
  { key: "bursa", slug: "bursa-turu", priceFrom: 300, priceUsdFrom: 336, priceTryFrom: 16500, currency: "EUR", durationHours: 10, image: "/images/tours/bursa.jpg", packageSlug: "istanbul-bursa-6-gun", guideSlug: "bursa-uludag-gunubirlik", geo: { lat: 40.1826, lng: 29.0665 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Bursa tek günde gezilir mi?", ar: "هل تكفي بورصة في يوم واحد؟", en: "Is one day enough for Bursa?" }, answer: { tr: "Evet, günübirlik olarak kurulabiliyor ama yol tek yön yaklaşık üç saat. Uludağ'ı ve Cumalıkızık'ı aynı güne sıkıştırmak tempoyu zorluyor; gecelemeli program daha rahat.", ar: "نعم، يمكن ترتيبها كرحلة يوم واحد، غير أنّ الطريق نحو ثلاث ساعات في الاتجاه الواحد. وحشر أولوداغ وجومالي كيزيك في اليوم نفسه يُرهق الإيقاع؛ والبرنامج مع مبيت أريح.", en: "Yes, it can be run as a day trip, but the road is about three hours each way. Squeezing Uludağ and Cumalıkızık into the same day tightens the pace; an overnight programme is easier." } }] },
  { key: "sapanca", slug: "sapanca-turu", priceFrom: 230, priceUsdFrom: 258, priceTryFrom: 12700, currency: "EUR", durationHours: 9, image: "/images/tours/sapanca.jpg", packageSlug: "istanbul-sapanca-bursa-8-gun", guideSlug: "sapanca-masukiye-rehberi", geo: { lat: 40.6911, lng: 30.2661 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Sapanca turu hangi mevsimde iyi?", ar: "في أي موسم تكون جولة سبانجا أفضل؟", en: "Which season suits the Sapanca tour?" }, answer: { tr: "İlkbahar ve sonbahar en dengeli dönem. Kışın göl ve yayla sisli olabiliyor, yazın ise kalabalık artıyor. Her mevsim gidilebiliyor, manzara değişiyor.", ar: "الربيع والخريف أكثر الفترات توازناً. ففي الشتاء قد تغطّي الضباب البحيرة والمرتفعات، وفي الصيف يزداد الازدحام. ويمكن الذهاب في كل موسم، لكنّ المنظر يختلف.", en: "Spring and autumn are the most balanced. In winter the lake and the highlands can be misty; in summer it gets busier. It works in any season, but the view changes." } }] },
  { key: "trabzon", slug: "trabzon-turu", priceFrom: 140, priceUsdFrom: 157, priceTryFrom: 7700, currency: "EUR", durationHours: 12, image: "/images/tours/trabzon.jpg", packageSlug: "trabzon-karadeniz-5-gun", guideSlug: "trabzon-uzungol-karadeniz", geo: { lat: 41.0015, lng: 39.7178 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Uzungöl aynı güne sığar mı?", ar: "هل تتّسع أوزنجول في اليوم نفسه؟", en: "Does Uzungöl fit into the same day?" }, answer: { tr: "Uzungöl tek yön yaklaşık iki saat, yani gün büyük ölçüde ona ayrılıyor. Sümela'yı ayrı bir güne koymak gerekiyor; ikisini aynı güne sıkıştırmayı önermiyoruz.", ar: "أوزنجول نحو ساعتين في الاتجاه الواحد، أي أنّ اليوم يُخصَّص لها في معظمه. وسوميلا تحتاج يوماً مستقلاً؛ ولا نقترح حشرهما في يوم واحد.", en: "Uzungöl is about two hours each way, so the day largely belongs to it. Sümela needs its own day; we do not recommend squeezing both into one." } }] },
  { key: "bodrum", slug: "bodrum-turu", priceFrom: 200, priceUsdFrom: 224, priceTryFrom: 11000, currency: "EUR", durationHours: 10, image: "/images/tours/bodrum.jpg", packageSlug: "bodrum-ege-5-gun", guideSlug: "bodrum-ege-rehberi", geo: { lat: 37.0344, lng: 27.4305 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Tekne turu dahil mi?", ar: "هل الجولة البحرية مشمولة؟", en: "Is the boat trip included?" }, answer: { tr: "Hayır. Sizi iskeleye götürüp dönüşte bekliyoruz ama tekneyi biz işletmiyoruz; yat ve tekne kiralama verdiğimiz hizmetler arasında değil.", ar: "لا. ننقلكم إلى المرفأ وننتظركم عند العودة، لكنّنا لا نشغّل القارب؛ فتأجير اليخوت والقوارب ليس من خدماتنا.", en: "No. We take you to the pier and wait for you on the way back, but we do not run the boat; yacht and boat charter is not one of our services." } }] },
  { key: "antalya", slug: "antalya-turu", priceFrom: 170, priceUsdFrom: 190, priceTryFrom: 9400, currency: "EUR", durationHours: 10, image: "/images/tours/antalya.jpg", packageSlug: "antalya-akdeniz-5-gun", guideSlug: "antalya-bolge-rehberi", geo: { lat: 36.8841, lng: 30.7056 }, faq: [{ question: { tr: "Tur otelden mi başlıyor?", ar: "هل تبدأ الجولة من الفندق؟", en: "Does the tour start from the hotel?" }, answer: { tr: "Evet, sabah otelin kapısından alıyoruz ve akşam aynı yere bırakıyoruz. Nerede kaldığınızı rezervasyonda yazmanız yeterli; güzergâhı ona göre kuruyoruz.", ar: "نعم، نقلّكم صباحاً من باب الفندق ونعيدكم إليه مساءً. ويكفي أن تذكروا مكان إقامتكم عند الحجز؛ ونرتّب خطّ السير على أساسه.", en: "Yes, we collect you from the hotel door in the morning and bring you back there in the evening. Just tell us where you are staying when you book and we build the route around it." } }, { question: { tr: "Fiyat kişi başına mı?", ar: "هل السعر للشخص؟", en: "Is the price per person?" }, answer: { tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmediği için kalabalık ailelerde kişi başına düşen tutar belirgin iniyor.", ar: "للسيارة. ولأنّ الجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ينخفض نصيب الفرد بوضوح في العائلات الكبيرة.", en: "Per vehicle. Because the vehicle side does not change between two people and six, the per-person figure drops noticeably for larger families." } }, { question: { tr: "Alanya bu tura eklenir mi?", ar: "هل يمكن إضافة ألانيا إلى هذه الجولة؟", en: "Can Alanya be added to this tour?" }, answer: { tr: "Aynı güne önermiyoruz: Alanya merkeze bir saat kırk beş dakika–iki buçuk saat uzaklıkta ve gidiş dönüş günün dört saatini alıyor. Alanya ayrı bir gün olarak planlanmalı.", ar: "لا نقترحها في اليوم نفسه: فألانيا تبعد عن المركز ساعة و45 دقيقة إلى ساعتين ونصف، والذهاب والعودة يأخذان أربع ساعات من اليوم. وينبغي تخطيط ألانيا كيوم مستقل.", en: "We do not recommend it on the same day: Alanya is 1 hour 45 minutes to 2.5 hours from the centre, and the round trip takes four hours of the day. Alanya should be planned as its own day." } }] },
];

export function tourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}
