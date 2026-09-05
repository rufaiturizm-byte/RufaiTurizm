/**
 * Otel rehberi — semt semt.
 *
 * ÖNEMLİ: Bunlar "anlaşmalı otellerimiz" DEĞİL. Elimizde otellerle
 * imzalanmış bir anlaşma yok ve olmayan bir ortaklığı ima etmek, sitenin
 * geri kalanında kurmaya çalıştığımız güveni ilk rezervasyonda bozar.
 * Bölüm bilerek "misafirlerimizin en çok tercih ettiği oteller" diye
 * konumlanıyor ve hizmet gerçek olanı söylüyor: rezervasyonu misafir
 * adına biz yapıyoruz (services.flightHotel).
 *
 * Bu yüzden burada FİYAT, YILDIZ ve MÜSAİTLİK yok — doğrulayamadığımız
 * üç bilgi. Oteller yalnız semt ve karakterle tarif ediliyor; bu hem
 * doğru hem de ziyaretçinin asıl sorusuna ("nerede kalmalıyım") cevap.
 *
 * Otel fotoğrafı da yok: elimizde o otellerin kullanım hakkına sahip
 * olduğumuz görsel yok, başka bir fotoğrafı otelin fotoğrafı gibi
 * göstermek olmaz. Görseller SEMT fotoğrafı ve öyle etiketleniyor.
 */

type Text = { tr: string; ar: string; en: string };

export interface HotelArea {
  key: string;
  /** Semt fotoğrafı — otelin değil, bölgenin. */
  image: string;
  imageAltKey: string;
  name: Text;
  /** Bölgenin kime uygun olduğu. */
  note: Text;
  hotels: { name: string; desc: Text }[];
}

export const hotelAreas: HotelArea[] = [
  {
    key: "sultanahmet",
    image: "/images/places/sultanahmet.jpg",
    imageAltKey: "istanbul",
    name: { tr: "Sultanahmet ve Tarihî Yarımada", ar: "السلطان أحمد وشبه الجزيرة التاريخية", en: "Sultanahmet and the Historic Peninsula" },
    note: {
      tr: "Ayasofya, Sultanahmet Camii ve Topkapı yürüme mesafesinde. Erken kalkıp gezmek isteyen aileler için.",
      ar: "آيا صوفيا وجامع السلطان أحمد وتوبكابي على مسافة سير. مناسبة للعائلات التي تفضّل الاستيقاظ مبكراً والتجوّل.",
      en: "Hagia Sophia, the Blue Mosque and Topkapi within walking distance. For families who rise early to sightsee.",
    },
    hotels: [
      {
        name: "Four Seasons Hotel Istanbul at Sultanahmet",
        desc: {
          tr: "Ayasofya ile Sultanahmet Camii arasında, tarihî bir yapıda.",
          ar: "بين آيا صوفيا وجامع السلطان أحمد، في مبنى تاريخي.",
          en: "Between Hagia Sophia and the Blue Mosque, in a historic building.",
        },
      },
      {
        name: "Sura Hagia Sophia Hotel",
        desc: {
          tr: "Ayasofya'ya çok yakın, aile odaları olan büyük bir otel.",
          ar: "قريب جداً من آيا صوفيا، فندق كبير يضم غرفاً عائلية.",
          en: "Very close to Hagia Sophia; a large hotel with family rooms.",
        },
      },
      {
        name: "Levni Hotel & Spa",
        desc: {
          tr: "Laleli–Beyazıt hattında, Kapalıçarşı ve tramvaya yakın.",
          ar: "على خط لاليلي–بايزيد، قريب من البازار المسقوف والترام.",
          en: "On the Laleli–Beyazit line, close to the Grand Bazaar and the tram.",
        },
      },
    ],
  },
  {
    key: "taksim",
    /* Önce Kız Kulesi vardı — o Üsküdar'da, yani tam ters yakada.
       Galata Kulesi ve köprü Beyoğlu'nun kendisi. */
    image: "/images/places/galata.jpg",
    imageAltKey: "taksim",
    name: { tr: "Taksim, Beyoğlu ve Şişli", ar: "تقسيم وبيوغلو وشيشلي", en: "Taksim, Beyoglu and Sisli" },
    note: {
      tr: "Metroya, İstiklal Caddesi'ne ve alışveriş merkezlerine yakın. Geç saate kadar açık restoranlar burada.",
      ar: "قريبة من المترو وشارع الاستقلال والمولات. المطاعم المفتوحة حتى وقت متأخر هنا.",
      en: "Close to the metro, Istiklal Street and the malls. This is where restaurants stay open late.",
    },
    hotels: [
      {
        name: "The Marmara Taksim",
        desc: {
          tr: "Taksim Meydanı'nın hemen üstünde, şehir ve Boğaz manzaralı.",
          ar: "فوق ميدان تقسيم مباشرة، بإطلالة على المدينة والبوسفور.",
          en: "Right above Taksim Square, with city and Bosphorus views.",
        },
      },
      {
        name: "Pera Palace Hotel",
        desc: {
          tr: "Tepebaşı'nda, 1892'den beri açık tarihî bir otel.",
          ar: "في تبه باشي، فندق تاريخي مفتوح منذ عام 1892.",
          en: "In Tepebasi; a historic hotel open since 1892.",
        },
      },
      {
        name: "Hilton Istanbul Bosphorus",
        desc: {
          tr: "Harbiye'de geniş bahçesi olan, aileye uygun büyük otel.",
          ar: "في حربية، فندق كبير بحديقة واسعة يناسب العائلات.",
          en: "In Harbiye; a large, family-friendly hotel with extensive grounds.",
        },
      },
      {
        name: "Divan Istanbul",
        desc: {
          tr: "Elmadağ'da, Nişantaşı alışveriş bölgesine yürüme mesafesinde.",
          ar: "في إلمَداغ، على مسافة سير من منطقة نيشانتاشي للتسوّق.",
          en: "In Elmadag, walking distance from the Nisantasi shopping district.",
        },
      },
    ],
  },
  {
    key: "bosphorus",
    image: "/images/places/bogaz-kopru.jpg",
    imageAltKey: "bosphorus",
    name: { tr: "Boğaz Kıyısı — Beşiktaş ve Ortaköy", ar: "ضفاف البوسفور — بشكتاش وأورتاكوي", en: "The Bosphorus Shore: Besiktas and Ortakoy" },
    note: {
      tr: "Manzara İstanbul'da fiyatı en çok değiştiren unsur. Merkeze yakın ama tarihî noktalara yürüme mesafesinde değil.",
      ar: "الإطلالة هي العامل الأكثر تأثيراً في السعر بإسطنبول. قريبة من المركز لكنها ليست على مسافة سير من المعالم التاريخية.",
      en: "The view is the biggest price lever in Istanbul. Central, but not walking distance from the historic sights.",
    },
    hotels: [
      {
        name: "Çırağan Palace Kempinski Istanbul",
        desc: {
          tr: "Boğaz kıyısında, eski bir Osmanlı sarayının içinde.",
          ar: "على ضفة البوسفور، داخل قصر عثماني قديم.",
          en: "On the Bosphorus shore, inside a former Ottoman palace.",
        },
      },
      {
        name: "Shangri-La Bosphorus, Istanbul",
        desc: {
          tr: "Beşiktaş'ta, Dolmabahçe Sarayı'nın yanında.",
          ar: "في بشكتاش، بجوار قصر دولمة بهجة.",
          en: "In Besiktas, next to Dolmabahce Palace.",
        },
      },
      {
        name: "Swissôtel The Bosphorus, Istanbul",
        desc: {
          tr: "Maçka'da tepede; geniş bahçesi ve havuzuyla bilinir.",
          ar: "على تلة في ماتشكا؛ معروف بحديقته الواسعة ومسبحه.",
          en: "On the hill in Macka; known for its large garden and pool.",
        },
      },
      {
        name: "Conrad Istanbul Bosphorus",
        desc: {
          tr: "Beşiktaş sırtlarında, Boğaz manzaralı odalarıyla.",
          ar: "على مرتفعات بشكتاش، بغرف تطلّ على البوسفور.",
          en: "On the Besiktas heights, with Bosphorus-view rooms.",
        },
      },
    ],
  },
  {
    key: "asian",
    /* Önce Sapanca vardı — Sakarya'da, İstanbul'un Anadolu yakası değil.
       Kadıköy iskelesi bölgenin kendisi. */
    image: "/images/places/kadikoy.jpg",
    imageAltKey: "asian",
    name: { tr: "Anadolu Yakası — Kadıköy ve Ataşehir", ar: "الجانب الآسيوي — كاديكوي وآتاشهير", en: "The Asian Side: Kadikoy and Atasehir" },
    note: {
      tr: "Sabiha Gökçen'e yakınlık en büyük avantajı. Avrupa yakasındaki tarihî noktalara geçmek için Boğaz'ı geçmek gerekir.",
      ar: "أكبر ميزة هي القرب من مطار صبيحة كوكجن. للانتقال إلى المعالم التاريخية في الجانب الأوروبي يلزم عبور البوسفور.",
      en: "Proximity to Sabiha Gokcen is the main advantage. Reaching the historic sights means crossing the Bosphorus.",
    },
    hotels: [
      {
        name: "The Ritz-Carlton Residences, Istanbul",
        desc: {
          tr: "Ataşehir'de, iş bölgesine ve havalimanı yoluna yakın.",
          ar: "في آتاشهير، قريب من منطقة الأعمال وطريق المطار.",
          en: "In Atasehir, close to the business district and the airport road.",
        },
      },
      {
        name: "DoubleTree by Hilton Istanbul Moda",
        desc: {
          tr: "Kadıköy Moda'da, sahil yürüyüş hattına yakın.",
          ar: "في مودا بكاديكوي، قريب من ممشى الساحل.",
          en: "In Kadikoy Moda, close to the seaside promenade.",
        },
      },
      {
        name: "Wyndham Grand Istanbul Kalamış Marina",
        desc: {
          tr: "Kalamış Marina'da, deniz kenarında ve sakin bir bölgede.",
          ar: "في مارينا كالاميش، على البحر وفي منطقة هادئة.",
          en: "At Kalamis Marina, on the water in a quiet area.",
        },
      },
    ],
  },
];
