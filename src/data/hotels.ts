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
  hotels?: {
    name: string;
    desc: Text;
    tags: string[];
    /*
     * Otelin KENDİ fotoğrafı — yalnız kullanım hakkımız varsa.
     *
     * Bugün hiçbirinde yok ve alan bilerek isteğe bağlı: kart fotoğraflı
     * da fotoğrafsız da düzgün duruyor, yani izin alındığı gün tasarımı
     * yeniden kurmak gerekmiyor, dosya yolunu yazmak yetiyor.
     *
     * Doldurmanın üç meşru yolu var: otelin basın/medya kiti, otelden
     * yazılı izin, ya da Google Places "Place Photos" (lisanslı ama
     * atıf zorunlu, fotoğraf referansı önbelleğe alınamıyor ve her
     * sayfa görüntülemesinde yeniden isteniyor — 33 otellik bir liste
     * sayfasında ayda ~150 görüntülemeden sonra ücretli hale geliyor).
     *
     * Booking'den ya da otelin sitesinden indirilen fotoğraf bu üçünden
     * biri DEĞİL. Başka bir karenin otelin fotoğrafı gibi konması da
     * olmaz — dosyanın başındaki nota bak.
     */
    image?: string;
    /** Fotoğrafın kaynağı/atfı. `image` varsa doldurulmalı. */
    imageCredit?: string;
  }[];
  /*
   * Sahil bölgelerinde otel yerine ALT BÖLGE listesi.
   *
   * İstanbul'da misafir önce semti seçip sonra otele bakıyor; Antalya ve
   * Bodrum'da ise karar neredeyse tümüyle bölge kararı ve havalimanına
   * mesafe yarım saat ile iki buçuk saat arasında değişiyor. Otel adı
   * vermiyoruz çünkü sayfanın İstanbul bölümündeki "misafirlerimizin en
   * çok tercih ettiği oteller" cümlesi gerçek rezervasyon geçmişine
   * dayanıyor ve yeni açtığımız bölgelerde aynı şeyi söyleyemeyiz.
   */
  subAreas?: { name: Text; desc: Text; airport: Text }[];
  /*
   * Bölgenin gezi rehberi.
   *
   * Antalya ve Bodrum için 'hangi bölge' sorusu iki yerde geçiyor: burada
   * ve seyahat rehberlerinde. Konu aynı ama niyet farklı — bu sayfa NEREDE
   * KALINIR (otel tipi, plaj, havalimanı mesafesi, rezervasyon), rehber ise
   * GEZİ PLANI (ne görülür, günler nasıl kurulur) anlatıyor. İki sayfayı
   * birbirine bağlamazsak Google ikisini aynı sorunun iki cevabı sanıp
   * birini bastırır; bağlayınca ilişkiyi kendimiz söylemiş oluyoruz.
   */
  guideSlug?: string;
}

export const hotelAreas: HotelArea[] = [
  {
    key: "sultanahmet",
    image: "/images/places/sultanahmet.jpg",
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
  /*
   * ─── Sahil bölgeleri ─────────────────────────────────────────────
   *
   * Burada OTEL ADI YOK ve bu bilinçli. Sayfanın İstanbul bölümü
   * "misafirlerimizin en çok tercih ettiği oteller" diyor — bu, gerçek
   * rezervasyon geçmişine dayanan bir cümle. Antalya ve Bodrum'da
   * yeni çalışmaya başladık; aynı cümleyi oralar için kurmak yanlış
   * olurdu ve sayfanın en başındaki "anlaşmalı otel listesi değildir"
   * uyarısıyla da çelişirdi.
   *
   * Onun yerine sahilde asıl sorulan şey cevaplanıyor. İstanbul'da
   * misafir önce semti seçip sonra otele bakıyor; Antalya'da ise karar
   * neredeyse tümüyle BÖLGE kararı — Kemer ile Alanya arasındaki fark
   * iki farklı tatil demek ve havalimanına mesafe iki saat değişiyor.
   * Otel zaten rezervasyon sitesinden fiyata ve pansiyona göre
   * seçiliyor; bizim ekleyebileceğimiz bilgi bölgenin karakteri.
   */
  {
    key: "antalya",
    guideSlug: "antalya-bolge-rehberi",
    image: "/images/places/kemer.jpg",
    name: {
      tr: "Antalya ve Akdeniz kıyısı",
      ar: "أنطاليا وساحل البحر المتوسط",
      en: "Antalya and the Mediterranean coast",
    },
    note: {
      tr: "Antalya tek bir şehir değil, Kemer'den Alanya'ya iki yüz kilometrelik bir sahil şeridi. \"Antalya'da kalıyoruz\" cümlesi tek başına bir şey anlatmıyor: hangi bölgede kaldığınız tatilin tamamını belirliyor.",
      ar: "أنطاليا ليست مدينة واحدة بل شريط ساحلي يمتد مئتي كيلومتر من كمر إلى ألانيا. وجملة \"سنقيم في أنطاليا\" لا تقول شيئاً بمفردها: فالمنطقة التي تقيم فيها هي التي تحدّد الإجازة كلها.",
      en: "Antalya is not one city but a two-hundred-kilometre coast from Kemer to Alanya. \"We are staying in Antalya\" says nothing on its own: which stretch you stay on decides the whole holiday.",
    },
    practical: {
      gettingAround: {
        tr: "Bölgeler arası mesafeler uzun ve toplu taşıma otellerin çoğuna uğramıyor; sahil şeridinde araçsız hareket etmek zor. Otel içinde kalmayı planlamıyorsanız günlük araç ya da tur planı gerekiyor.",
        ar: "المسافات بين المناطق طويلة ووسائل النقل العام لا تمرّ على معظم الفنادق؛ والتنقّل على الشريط الساحلي دون سيارة صعب. فإن لم تكن تنوي البقاء داخل الفندق فستحتاج إلى سيارة يومية أو خطة جولات.",
        en: "Distances between areas are long and public transport does not reach most hotels; moving along the coast without a car is hard. If you do not plan to stay inside the hotel, you need a daily car or a tour plan.",
      },
      watchOut: {
        tr: "Otel adresinde geçen bölge adı yanıltıcı olabiliyor: \"Kemer\" 25 kilometrelik bir şeridi, \"Side\" ise Manavgat'a kadar uzanan bir alanı kapsıyor. Temmuz ve ağustosta sıcaklık kırk dereceyi geçiyor; küçük çocuklu aileler için mayıs, haziran ve eylül daha rahat.",
        ar: "قد يكون اسم المنطقة في عنوان الفندق مضلّلاً: فـ\"كمر\" تشمل شريطاً بطول 25 كيلومتراً، و\"سيدي\" تمتد حتى مانافغات. وفي تموز وآب تتجاوز الحرارة الأربعين درجة؛ وأيار وحزيران وأيلول أريح للعائلات ذات الأطفال الصغار.",
        en: "The area name in a hotel address can mislead: \"Kemer\" covers a 25 km strip and \"Side\" reaches as far as Manavgat. In July and August temperatures pass forty degrees; May, June and September are easier for families with small children.",
      },
      airport: {
        tr: "Antalya Havalimanı (AYT) şehrin doğusunda. Belek'e yaklaşık 35, Side'ye 65, Kemer'e 57 ve Alanya'ya 125 kilometre — yani aynı havalimanından yolculuk yarım saat ile iki buçuk saat arasında değişiyor.",
        ar: "يقع مطار أنطاليا (AYT) شرق المدينة. وتبعد بيليك نحو 35 كيلومتراً، وسيدي 65، وكمر 57، وألانيا 125 — أي أن الرحلة من المطار نفسه تتراوح بين نصف ساعة وساعتين ونصف.",
        en: "Antalya Airport (AYT) is east of the city. Belek is about 35 km away, Side 65, Kemer 57 and Alanya 125 — so the drive from the same airport ranges from half an hour to two and a half.",
      },
    },
    subAreas: [
      {
        name: { tr: "Lara ve Konyaaltı (şehir)", ar: "لارا وكونيا آلتي (المدينة)", en: "Lara and Konyaaltı (city)" },
        desc: {
          tr: "Şehrin kendi sahilleri. Kaleiçi, çarşı ve restoranlar araçla on beş dakikada; otel dışına çıkmak isteyen için en pratik seçenek. Lara kum, Konyaaltı çakıl.",
          ar: "شواطئ المدينة نفسها. كالي إيتشي والسوق والمطاعم على بُعد خمس عشرة دقيقة بالسيارة؛ وهو أنسب خيار لمن يريد الخروج من الفندق. لارا رملية وكونيا آلتي حصوية.",
          en: "The city's own beaches. Kaleiçi, the bazaar and restaurants are fifteen minutes away by car — the most practical choice if you want to leave the hotel. Lara is sand, Konyaaltı pebble.",
        },
        airport: { tr: "havalimanına 10–20 dk", ar: "10–20 دقيقة إلى المطار", en: "10–20 min to the airport" },
      },
      {
        name: { tr: "Belek", ar: "بيليك", en: "Belek" },
        desc: {
          tr: "Geniş bahçeli her şey dahil oteller ve golf sahaları; uzun kumsal. Küçük çocuklu aileler için en rahat bölge. Gezilecek bir kasaba merkezi yok, çarşı beklentisiyle gelen hayal kırıklığına uğrar.",
          ar: "فنادق \"كل شيء مشمول\" بحدائق واسعة وملاعب غولف؛ وشاطئ رملي طويل. أريح منطقة للعائلات ذات الأطفال الصغار. لا يوجد مركز بلدة للتجوّل، ومن يأتي متوقعاً سوقاً يُصاب بخيبة أمل.",
          en: "All-inclusive hotels with generous grounds and golf courses; a long sandy beach. The easiest area for families with small children. There is no town centre to wander, so anyone expecting a bazaar will be disappointed.",
        },
        airport: { tr: "havalimanına 30–45 dk", ar: "30–45 دقيقة إلى المطار", en: "30–45 min to the airport" },
      },
      {
        name: { tr: "Kemer", ar: "كمر", en: "Kemer" },
        desc: {
          tr: "Toroslar'ın denize indiği taraf; çam ormanı ve çakıl koylar. Manzarası Antalya'nın en güçlüsü. \"Kemer\" adı Beldibi'nden Tekirova'ya 25 kilometrelik bir şeridi kapsıyor, otelin tam yeri önemli.",
          ar: "الجهة التي تنزل فيها جبال طوروس إلى البحر؛ غابات صنوبر وخلجان حصوية. منظرها الأقوى في أنطاليا. واسم \"كمر\" يشمل شريطاً بطول 25 كيلومتراً من بلديبي إلى تكيروفا، لذا فموقع الفندق بالضبط مهم.",
          en: "Where the Taurus mountains meet the sea: pine forest and pebble coves. The strongest scenery in Antalya. The name \"Kemer\" covers 25 km from Beldibi to Tekirova, so the hotel's exact spot matters.",
        },
        airport: { tr: "havalimanına 50 dk – 1,5 saat", ar: "50 دقيقة – ساعة ونصف إلى المطار", en: "50 min – 1.5 hrs to the airport" },
      },
      {
        name: { tr: "Side ve Manavgat", ar: "سيدي ومانافغات", en: "Side and Manavgat" },
        desc: {
          tr: "Antik kent ile tatil bölgesi iç içe: Apollon Tapınağı ve antik tiyatro otellerin arasında. Tarihi merak eden aileler için Antalya'nın en dengeli tarafı. Eski yerleşimin içine araç girmiyor.",
          ar: "المدينة الأثرية ومنطقة الاصطياف متداخلتان: معبد أبولو والمسرح الأثري بين الفنادق. وهي أكثر جهات أنطاليا توازناً للعائلات المهتمة بالتاريخ. ولا تدخل السيارات إلى المدينة القديمة.",
          en: "Ancient town and resort area interwoven: the Temple of Apollo and the ancient theatre sit among the hotels. The most balanced part of Antalya for families interested in history. Cars do not enter the old settlement.",
        },
        airport: { tr: "havalimanına 55 dk – 1,5 saat", ar: "55 دقيقة – ساعة ونصف إلى المطار", en: "55 min – 1.5 hrs to the airport" },
      },
      {
        name: { tr: "Alanya", ar: "ألانيا", en: "Alanya" },
        desc: {
          tr: "Kale, Kızıl Kule ve uzun sahiliyle kendi başına bir şehir; çarşısı ve gece hayatı canlı. Ama havalimanına iki saat: kısa tatilde gidiş-dönüş dört saat yolda geçiyor. Bir haftadan uzun kalacaklar için mantıklı.",
          ar: "مدينة قائمة بذاتها بقلعتها والبرج الأحمر وشاطئها الطويل؛ سوقها وحياتها الليلية نابضة. لكنها على ساعتين من المطار: ففي إجازة قصيرة تذهب أربع ساعات على الطريق ذهاباً وإياباً. وهي منطقية لمن سيقيم أكثر من أسبوع.",
          en: "A city in its own right, with the castle, the Red Tower and a long beach; the bazaar and nightlife are lively. But it is two hours from the airport: on a short break the round trip costs four hours on the road. It makes sense for stays longer than a week.",
        },
        airport: { tr: "havalimanına 1,5 – 2,5 saat", ar: "ساعة ونصف – ساعتان ونصف إلى المطار", en: "1.5 – 2.5 hrs to the airport" },
      },
    ],
  },
  {
    key: "bodrum",
    guideSlug: "bodrum-ege-rehberi",
    image: "/images/tours/bodrum.jpg",
    name: {
      tr: "Bodrum yarımadası",
      ar: "شبه جزيرة بودروم",
      en: "The Bodrum peninsula",
    },
    note: {
      tr: "Yarımada uçtan uca araçla kırk dakika, ama her koyun karakteri farklı. Sakinlik mi hareket mi istediğiniz sorusu, Bodrum'da otel seçiminden önce gelir.",
      ar: "يُقطع طرفا شبه الجزيرة بالسيارة في أربعين دقيقة، لكن طابع كل خليج مختلف. وسؤال \"هدوء أم حركة\" يأتي في بودروم قبل اختيار الفندق.",
      en: "The peninsula is forty minutes end to end by car, yet every bay has its own character. In Bodrum the question of quiet or lively comes before the choice of hotel.",
    },
    practical: {
      gettingAround: {
        tr: "Koylar arası dolmuş var ama seferler akşam erken bitiyor ve yollar virajlı. Yarımadanın farklı yerlerini görmek isteyen için günlük araç en rahatı; tek bir koyda kalıp denize girecekseniz gerekmiyor.",
        ar: "توجد حافلات صغيرة بين الخلجان لكن رحلاتها تنتهي مبكراً مساءً والطرق متعرّجة. ولمن يريد رؤية أنحاء شبه الجزيرة فالسيارة اليومية أريح؛ أما إن كنت ستبقى في خليج واحد للسباحة فلا حاجة لها.",
        en: "Minibuses run between the bays but stop early in the evening and the roads wind. For seeing different parts of the peninsula a daily car is easiest; if you are staying in one bay to swim, you do not need one.",
      },
      watchOut: {
        tr: "Kasım–nisan arası yarımadanın büyük bölümü kapanıyor: oteller, restoranlar ve tekne turları kışın çalışmıyor, deniz de girilecek sıcaklıkta değil. Bodrum bir yaz destinasyonu ve bunu baştan söylemek gerekiyor.",
        ar: "بين تشرين الثاني ونيسان يُغلق معظم شبه الجزيرة: الفنادق والمطاعم وجولات القوارب لا تعمل شتاءً، والبحر ليس بدرجة حرارة تسمح بالسباحة. بودروم وجهة صيفية ولا بد من قول ذلك من البداية.",
        en: "From November to April much of the peninsula shuts: hotels, restaurants and boat trips do not operate in winter, and the sea is not warm enough to swim. Bodrum is a summer destination and that has to be said upfront.",
      },
      airport: {
        tr: "Milas-Bodrum Havalimanı (BJV) yarımadanın dışında, Milas ilçesinde. Torba'ya yaklaşık 20, Bodrum merkeze 36, Turgutreis'e 53 ve Yalıkavak'a 56 kilometre.",
        ar: "يقع مطار ميلاس-بودروم (BJV) خارج شبه الجزيرة في قضاء ميلاس. وتبعد توربا نحو 20 كيلومتراً، ومركز بودروم 36، وتورغوتريس 53، ويالي كافاك 56.",
        en: "Milas–Bodrum Airport (BJV) is outside the peninsula, in the Milas district. Torba is about 20 km away, Bodrum centre 36, Turgutreis 53 and Yalıkavak 56.",
      },
    },
    subAreas: [
      {
        name: { tr: "Bodrum merkez", ar: "مركز بودروم", en: "Bodrum centre" },
        desc: {
          tr: "Kale, marina ve çarşı; yürüyerek gezilen tek yer. Restoran ve gece hayatı en yoğun burada. Sokaklar dar, bazı butik otellere araç kapıya kadar gidemiyor.",
          ar: "القلعة والمارينا والسوق؛ وهو المكان الوحيد الذي يُتجوّل فيه مشياً. والمطاعم والحياة الليلية أكثف ما تكون هنا. الشوارع ضيّقة، وبعض الفنادق البوتيكية لا تصلها السيارة حتى الباب.",
          en: "The castle, the marina and the bazaar — the only part you walk. Restaurants and nightlife are densest here. The streets are narrow and some boutique hotels cannot be reached by car to the door.",
        },
        airport: { tr: "havalimanına 40 dk – 1 saat", ar: "40 دقيقة – ساعة إلى المطار", en: "40 min – 1 hr to the airport" },
      },
      {
        name: { tr: "Gümbet ve Bitez", ar: "غومبيت وبيتيز", en: "Gümbet and Bitez" },
        desc: {
          tr: "Merkeze en yakın iki koy. Gümbet hareketli ve genç kalabalığa dönük, Bitez daha sakin ve mandalina bahçeleriyle çevrili. İkisi de merkeze on beş dakika.",
          ar: "أقرب خليجين إلى المركز. غومبيت نابضة وموجّهة إلى جمهور شاب، وبيتيز أهدأ وتحيط بها بساتين اليوسفي. وكلاهما على بُعد خمس عشرة دقيقة من المركز.",
          en: "The two bays closest to town. Gümbet is lively and aimed at a young crowd; Bitez is quieter, ringed by tangerine groves. Both are fifteen minutes from the centre.",
        },
        airport: { tr: "havalimanına yaklaşık 45 dk", ar: "نحو 45 دقيقة إلى المطار", en: "about 45 min to the airport" },
      },
      {
        name: { tr: "Yalıkavak", ar: "يالي كافاك", en: "Yalıkavak" },
        desc: {
          tr: "Yarımadanın en pahalı tarafı: büyük marina, tasarım otelleri ve sakin koylar. Havalimanına en uzak nokta ve merkeze yarım saat; buraya kalanlar çoğunlukla bölgeden çıkmıyor.",
          ar: "الجهة الأغلى في شبه الجزيرة: مارينا كبيرة وفنادق تصميم وخلجان هادئة. وهي أبعد نقطة عن المطار وعلى نصف ساعة من المركز؛ ومن يقيم هنا غالباً لا يغادر المنطقة.",
          en: "The peninsula's most expensive side: a large marina, design hotels and quiet coves. It is the furthest point from the airport and half an hour from town; people who stay here mostly do not leave the area.",
        },
        airport: { tr: "havalimanına yaklaşık 1 saat", ar: "نحو ساعة إلى المطار", en: "about 1 hr to the airport" },
      },
      {
        name: { tr: "Turgutreis", ar: "تورغوتريس", en: "Turgutreis" },
        desc: {
          tr: "Batı ucu: uzun sahil, haftalık pazar ve batıya bakan gün batımı. Aile tatiline dönük ve merkeze göre belirgin biçimde sakin. İstanköy'e (Kos) feribot iskelesi burada.",
          ar: "الطرف الغربي: شاطئ طويل وسوق أسبوعي وغروب يطلّ غرباً. موجّهة إلى عطلة العائلة وأهدأ بوضوح من المركز. ومرفأ العبّارات إلى جزيرة كوس هنا.",
          en: "The western tip: a long beach, a weekly market and a west-facing sunset. Family-oriented and noticeably calmer than town. The ferry pier for Kos is here.",
        },
        airport: { tr: "havalimanına 50 dk – 1,5 saat", ar: "50 دقيقة – ساعة ونصف إلى المطار", en: "50 min – 1.5 hrs to the airport" },
      },
      {
        name: { tr: "Torba ve Türkbükü", ar: "توربا وتوركبوكو", en: "Torba and Türkbükü" },
        desc: {
          tr: "Kuzey kıyısı. Torba havalimanına en yakın yer ve kısa konaklamalarda yolu en aza indiriyor; Türkbükü iskeleli plaj kulüpleriyle bilinen sakin ve pahalı bir koy.",
          ar: "الساحل الشمالي. توربا أقرب مكان إلى المطار وتقلّل الطريق إلى أدناه في الإقامات القصيرة؛ أما توركبوكو فخليج هادئ وغالٍ يُعرف بنواديه الشاطئية ذات الأرصفة الخشبية.",
          en: "The north shore. Torba is the closest point to the airport and keeps driving to a minimum on short stays; Türkbükü is a quiet, expensive bay known for its jetty beach clubs.",
        },
        airport: { tr: "havalimanına 20–40 dk", ar: "20–40 دقيقة إلى المطار", en: "20–40 min to the airport" },
      },
    ],
  },
];
