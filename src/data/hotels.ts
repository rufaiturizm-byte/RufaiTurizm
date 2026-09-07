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
  /*
   * Semtin pratik gerçeği. `note` "kime uygun" diyor; asıl karar bundan
   * sonra veriliyor: oraya nasıl gidilir, neyi göze almak gerekir,
   * havalimanı ne kadar uzak. `watchOut` bilerek olumsuz — her semtin bir
   * bedeli var ve onu söylemeyen liste işe yaramaz.
   */
  practical: { gettingAround: Text; watchOut: Text; airport: Text };
  /*
   * Etiketler kapalı bir sözlükten geliyor (messages hotelTags.*) ve
   * hepsi KONUM ya da YAPI temelli: "Boğaz manzarası", "tramvaya yakın",
   * "tarihî yapı" gibi doğrulanabilir şeyler. Yıldız, hizmet kalitesi ya
   * da "en iyi" türü sıfatlar bilerek yok — onları doğrulayamayız.
   */
  hotels: { name: string; desc: Text; tags: string[] }[];
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
    practical: {
      gettingAround: {
        tr: "T1 tramvay hattının tam üzerinde; Eminönü vapur iskelesi yürüme mesafesinde. Taksim'e tramvay ve füniküler aktarmasıyla yaklaşık 25 dakika.",
        ar: "يقع مباشرة على خط الترام T1؛ ومرفأ العبّارات في إمينونو على مسافة سير. وإلى تقسيم نحو 25 دقيقة بالترام مع تبديل إلى القطار المائل.",
        en: "Right on the T1 tram line, with the Eminönü ferry pier within walking distance. Taksim is about 25 minutes by tram with a funicular change.",
      },
      watchOut: {
        tr: "Akşam sekizden sonra sokaklar sakinleşir ve restoran seçeneği azalır. Sokaklar arnavut kaldırımı ve yokuşlu — bavulla ve bebek arabasıyla zorlar.",
        ar: "بعد الثامنة مساءً تهدأ الشوارع وتقلّ خيارات المطاعم. والأزقة مرصوفة بالحجارة ومائلة — وهو ما يُتعب مع الحقائب وعربات الأطفال.",
        en: "After eight in the evening the streets quieten and restaurant choices thin out. The lanes are cobbled and sloped — hard going with suitcases and a pushchair.",
      },
      airport: {
        tr: "İstanbul Havalimanı'na trafiğe göre yaklaşık 45–70 dakika, Sabiha Gökçen'e köprü geçişiyle 60–90 dakika.",
        ar: "إلى مطار إسطنبول نحو 45–70 دقيقة بحسب حركة المرور، وإلى صبيحة كوكجن 60–90 دقيقة مع عبور الجسر.",
        en: "Roughly 45–70 minutes to Istanbul Airport depending on traffic, and 60–90 minutes to Sabiha Gökçen across the bridge.",
      },
    },
    hotels: [
      {
        name: "Four Seasons Hotel Istanbul at Sultanahmet",
        desc: {
          tr: "Ayasofya ile Sultanahmet Camii arasında, tarihî bir yapıda.",
          ar: "بين آيا صوفيا وجامع السلطان أحمد، في مبنى تاريخي.",
          en: "Between Hagia Sophia and the Blue Mosque, in a historic building.",
        },
        tags: ["historic", "walkToSights"],
      },
      {
        name: "Sura Hagia Sophia Hotel",
        desc: {
          tr: "Ayasofya'ya çok yakın, aile odaları olan büyük bir otel.",
          ar: "قريب جداً من آيا صوفيا، فندق كبير يضم غرفاً عائلية.",
          en: "Very close to Hagia Sophia; a large hotel with family rooms.",
        },
        tags: ["walkToSights", "nearTram"],
      },
      {
        name: "Levni Hotel & Spa",
        desc: {
          tr: "Laleli–Beyazıt hattında, Kapalıçarşı ve tramvaya yakın.",
          ar: "على خط لاليلي–بايزيد، قريب من البازار المسقوف والترام.",
          en: "On the Laleli–Beyazit line, close to the Grand Bazaar and the tram.",
        },
        tags: ["nearTram", "quiet"],
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
    practical: {
      gettingAround: {
        tr: "M2 metro hattı üzerinde; Kabataş'a fünikülerle inilir, oradan vapur ve tramvaya bağlanır. Şehrin her iki yönüne de en kolay ulaşılan bölge.",
        ar: "على خط المترو M2؛ يُنزل إلى كاباتاش بالقطار المائل ومنه تتصل بالعبّارة والترام. وهي المنطقة الأسهل وصولاً إلى طرفي المدينة معاً.",
        en: "On the M2 metro line; the funicular drops you at Kabataş, where the ferry and tram connect. The easiest area to reach both halves of the city from.",
      },
      watchOut: {
        tr: "İstiklal ve çevresi gece geç saate kadar hareketli; sessizlik isteyen için arka sokaklardaki oteller daha uygun. Trafik yoğun, araçla kısa mesafeler uzun sürebilir.",
        ar: "شارع الاستقلال وما حوله ينبض بالحركة حتى وقت متأخر؛ ومن يبحث عن الهدوء تناسبه فنادق الأزقة الخلفية. والازدحام شديد، فقد تطول المسافات القصيرة بالسيارة.",
        en: "İstiklal and its surroundings stay lively until late; for quiet, hotels on the back streets suit better. Traffic is heavy, so short distances by car can take a while.",
      },
      airport: {
        tr: "İstanbul Havalimanı'na yaklaşık 45–70 dakika, Sabiha Gökçen'e 60–90 dakika. İki havalimanına da benzer mesafede.",
        ar: "إلى مطار إسطنبول نحو 45–70 دقيقة، وإلى صبيحة كوكجن 60–90 دقيقة. والمسافة متقاربة إلى المطارين.",
        en: "About 45–70 minutes to Istanbul Airport and 60–90 to Sabiha Gökçen — a similar distance to both.",
      },
    },
    hotels: [
      {
        name: "The Marmara Taksim",
        desc: {
          tr: "Taksim Meydanı'nın hemen üstünde, şehir ve Boğaz manzaralı.",
          ar: "فوق ميدان تقسيم مباشرة، بإطلالة على المدينة والبوسفور.",
          en: "Right above Taksim Square, with city and Bosphorus views.",
        },
        tags: ["nearMetro", "bosphorusView"],
      },
      {
        name: "Pera Palace Hotel",
        desc: {
          tr: "Tepebaşı'nda, 1892'den beri açık tarihî bir otel.",
          ar: "في تبه باشي، فندق تاريخي مفتوح منذ عام 1892.",
          en: "In Tepebasi; a historic hotel open since 1892.",
        },
        tags: ["historic", "nearMetro"],
      },
      {
        name: "Hilton Istanbul Bosphorus",
        desc: {
          tr: "Harbiye'de geniş bahçesi olan, aileye uygun büyük otel.",
          ar: "في حربية، فندق كبير بحديقة واسعة يناسب العائلات.",
          en: "In Harbiye; a large, family-friendly hotel with extensive grounds.",
        },
        tags: ["garden", "nearMalls"],
      },
      {
        name: "Divan Istanbul",
        desc: {
          tr: "Elmadağ'da, Nişantaşı alışveriş bölgesine yürüme mesafesinde.",
          ar: "في إلمَداغ، على مسافة سير من منطقة نيشانتاشي للتسوّق.",
          en: "In Elmadag, walking distance from the Nisantasi shopping district.",
        },
        tags: ["nearMalls", "nearMetro"],
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
    practical: {
      gettingAround: {
        tr: "Sahil boyunca vapur iskeleleri var; Beşiktaş'tan Üsküdar ve Kadıköy'e vapurla geçilir. Metro doğrudan sahile inmez, kısa bir araç ya da otobüs yolculuğu gerekir.",
        ar: "تمتد مرافئ العبّارات على طول الساحل؛ ومن بشيكتاش تُعبر إلى أسكودار وكاديكوي بالعبّارة. أما المترو فلا ينزل إلى الساحل مباشرة، ويلزم قبله مشوار قصير بالسيارة أو الحافلة.",
        en: "Ferry piers run along the shore; from Beşiktaş you cross to Üsküdar and Kadıköy by boat. The metro does not reach the waterfront directly — a short car or bus ride is needed.",
      },
      watchOut: {
        tr: "Tarihî yarımadaya her gidiş bir yolculuk demek; sahil trafiği akşam saatlerinde ağırlaşır. Manzaralı oda otelin her tarafında olmaz, rezervasyonda ayrıca sorulmalı.",
        ar: "كل ذهاب إلى شبه الجزيرة التاريخية يعني رحلة؛ ويثقل ازدحام الساحل في ساعات المساء. كما أن الغرفة المطلة ليست في كل أجزاء الفندق، فينبغي السؤال عنها تحديداً عند الحجز.",
        en: "Every trip to the historic peninsula is a journey, and shore traffic thickens in the evening. A view room is not on every side of the hotel — ask for it specifically when booking.",
      },
      airport: {
        tr: "İstanbul Havalimanı'na yaklaşık 40–65 dakika, Sabiha Gökçen'e 45–80 dakika. Sahil yolu akşam saatlerinde bu süreleri uzatır.",
        ar: "إلى مطار إسطنبول نحو 40–65 دقيقة، وإلى صبيحة كوكجن 45–80 دقيقة. ويطيل طريق الساحل هذه المدد في ساعات المساء.",
        en: "Roughly 40–65 minutes to Istanbul Airport and 45–80 to Sabiha Gökçen. The coast road stretches those times in the evening.",
      },
    },
    hotels: [
      {
        name: "Çırağan Palace Kempinski Istanbul",
        desc: {
          tr: "Boğaz kıyısında, eski bir Osmanlı sarayının içinde.",
          ar: "على ضفة البوسفور، داخل قصر عثماني قديم.",
          en: "On the Bosphorus shore, inside a former Ottoman palace.",
        },
        tags: ["palace", "seaside"],
      },
      {
        name: "Shangri-La Bosphorus, Istanbul",
        desc: {
          tr: "Beşiktaş'ta, Dolmabahçe Sarayı'nın yanında.",
          ar: "في بشكتاش، بجوار قصر دولمة بهجة.",
          en: "In Besiktas, next to Dolmabahce Palace.",
        },
        tags: ["bosphorusView", "seaside"],
      },
      {
        name: "Swissôtel The Bosphorus, Istanbul",
        desc: {
          tr: "Maçka'da tepede; geniş bahçesi ve havuzuyla bilinir.",
          ar: "على تلة في ماتشكا؛ معروف بحديقته الواسعة ومسبحه.",
          en: "On the hill in Macka; known for its large garden and pool.",
        },
        tags: ["garden", "bosphorusView"],
      },
      {
        name: "Conrad Istanbul Bosphorus",
        desc: {
          tr: "Beşiktaş sırtlarında, Boğaz manzaralı odalarıyla.",
          ar: "على مرتفعات بشكتاش، بغرف تطلّ على البوسفور.",
          en: "On the Besiktas heights, with Bosphorus-view rooms.",
        },
        tags: ["bosphorusView", "nearMalls"],
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
    practical: {
      gettingAround: {
        tr: "Kadıköy'den Avrupa yakasına vapurla yaklaşık 20–25 dakika — şehrin en keyifli geçişi. Marmaray ve M4 metro hattı bölgeyi hem havalimanına hem karşı yakaya bağlar.",
        ar: "من كاديكوي إلى الجانب الأوروبي نحو 20–25 دقيقة بالعبّارة — وهو أمتع عبور في المدينة. ويربط مرمراي وخط المترو M4 المنطقة بالمطار وبالضفة المقابلة معاً.",
        en: "From Kadıköy to the European side is about 20–25 minutes by ferry — the most enjoyable crossing in the city. Marmaray and the M4 metro link the area to both the airport and the far shore.",
      },
      watchOut: {
        tr: "Tarihî yarımada her gün karşı yakada kalır; günlük geçiş süresini programa eklemek gerekir. Semt turistik değil, daha yerel bir yaşam alanı — sessizlik isteyen için avantaj, merkezde olmak isteyen için değil.",
        ar: "تبقى شبه الجزيرة التاريخية في الضفة المقابلة كل يوم؛ ويجب إضافة وقت العبور اليومي إلى البرنامج. والحي ليس سياحياً بل أقرب إلى الحياة المحلية — وهو ميزة لمن يريد الهدوء لا لمن يريد أن يكون في المركز.",
        en: "The historic peninsula stays on the other side every day, so the daily crossing has to be built into the plan. The district is local rather than touristy — an advantage if you want quiet, not if you want to be central.",
      },
      airport: {
        tr: "Sabiha Gökçen'e yaklaşık 30–50 dakika — iki yakanın havalimanına en yakın bölgesi. İstanbul Havalimanı'na ise köprü geçişiyle 60–90 dakika.",
        ar: "إلى صبيحة كوكجن نحو 30–50 دقيقة — وهي أقرب مناطق الضفتين إلى المطار. أما إلى مطار إسطنبول فـ60–90 دقيقة مع عبور الجسر.",
        en: "About 30–50 minutes to Sabiha Gökçen — the closest area on either side to that airport. Istanbul Airport is 60–90 minutes away across the bridge.",
      },
    },
    hotels: [
      {
        name: "The Ritz-Carlton Residences, Istanbul",
        desc: {
          tr: "Ataşehir'de, iş bölgesine ve havalimanı yoluna yakın.",
          ar: "في آتاشهير، قريب من منطقة الأعمال وطريق المطار.",
          en: "In Atasehir, close to the business district and the airport road.",
        },
        tags: ["nearMalls", "quiet"],
      },
      {
        name: "DoubleTree by Hilton Istanbul Moda",
        desc: {
          tr: "Kadıköy Moda'da, sahil yürüyüş hattına yakın.",
          ar: "في مودا بكاديكوي، قريب من ممشى الساحل.",
          en: "In Kadikoy Moda, close to the seaside promenade.",
        },
        tags: ["seaside", "quiet"],
      },
      {
        name: "Wyndham Grand Istanbul Kalamış Marina",
        desc: {
          tr: "Kalamış Marina'da, deniz kenarında ve sakin bir bölgede.",
          ar: "في مارينا كالاميش، على البحر وفي منطقة هادئة.",
          en: "At Kalamis Marina, on the water in a quiet area.",
        },
        tags: ["seaside", "nearSawAirport"],
      },
    ],
  },
];
