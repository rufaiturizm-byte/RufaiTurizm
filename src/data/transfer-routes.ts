/**
 * Güzergâh sayfaları.
 *
 * Müşteri "havalimanı transferi" diye değil, "مطار اسطنبول الى تقسيم" ya da
 * "İstanbul havalimanından Sultanahmet'e" diye arıyor. Transfer sayfası bu
 * aramaların hepsini tek başına karşılayamaz.
 *
 * NEDEN 43 DEĞİL 7: `routes.ts` içinde 43 semt var ve bunların hepsi için
 * şablondan sayfa üretmek teknik olarak kolay. Üretmedik — aralarındaki tek
 * fark semt adı olan 43 sayfa ince içeriktir (thin content) ve arama
 * motorunda faydadan çok zarar getirir. Buradaki yedi güzergâhın her biri
 * gerçekten farklı bir yolculuk: farklı mesafe, farklı köprü, farklı trafik
 * saati, varışta farklı semt. Anlatacak ayrı şeyi olmayan bir güzergâh
 * buraya girmiyor.
 *
 * Mesafe ve süreler YAKLAŞIK ve öyle yazılıyor: dakika taahhüdü vermek,
 * trafiğin belirlediği bir şeyi garanti etmek olur.
 */

type Text = { tr: string; ar: string; en: string };

export interface RouteSection {
  heading: Text;
  body: Text;
}

export interface TransferRoute {
  slug: string;
  /**
   * Kalkış havalimanı kodu — kartlarda rozet olarak görünür.
   *
   * Antalya (AYT) ve Bodrum-Milas (BJV) eklendi: turlar ve paketler bu iki
   * bölgede de yapılıyor ama güzergâh sayfalarının tamamı İstanbul'du.
   */
  airport: "IST" | "SAW" | "AYT" | "BJV";
  image: string;
  from: Text;
  to: Text;
  distance: Text;
  duration: Text;
  excerpt: Text;
  sections: RouteSection[];
}

export const transferRoutes: TransferRoute[] = [
  {
    slug: "istanbul-havalimani-taksim-transfer",
    airport: "IST",
    image: "/images/places/galata.jpg",
    from: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
    to: { tr: "Taksim", ar: "تقسيم", en: "Taksim" },
    distance: { tr: "yaklaşık 40 km", ar: "نحو 40 كم", en: "about 40 km" },
    duration: { tr: "45 dk – 1,5 saat", ar: "45 دقيقة – ساعة ونصف", en: "45 min – 1.5 hrs" },
    excerpt: {
      tr: "Havalimanından şehrin merkezine: mesafe, güzergâh ve akşam trafiğinde ne beklemeli.",
      ar: "من المطار إلى قلب المدينة: المسافة والمسار وما تتوقّعه في زحام المساء.",
      en: "From the airport to the city centre: distance, route and what to expect in evening traffic.",
    },
    sections: [
      {
        heading: {
          tr: "Güzergâh ve süre",
          ar: "المسار والمدة",
          en: "The route and the time",
        },
        body: {
          tr: "Taksim, İstanbul Havalimanı'na yaklaşık 40 kilometre uzaklıkta ve Avrupa yakasında olduğu için Boğaz'ı geçmeye gerek yoktur. Yolculuk genellikle Kuzey Marmara Otoyolu ve şehir içi bağlantılarla yapılır. Sabah ve akşam saatlerinde şehre giriş yavaşlar; öğle saatlerinde aynı yol belirgin biçimde hızlıdır.",
          ar: "تبعد تقسيم نحو 40 كيلومتراً عن مطار إسطنبول، وهي في الجانب الأوروبي فلا حاجة لعبور البوسفور. تتم الرحلة عادةً عبر أوتوستراد شمال مرمرة والوصلات الداخلية. الدخول إلى المدينة يبطؤ صباحاً ومساءً؛ أما في ساعات الظهيرة فالطريق نفسه أسرع بوضوح.",
          en: "Taksim is about 40 km from Istanbul Airport and on the European side, so no Bosphorus crossing is needed. The drive usually runs along the North Marmara motorway and city connections. Traffic into the city slows morning and evening; at midday the same road is noticeably quicker.",
        },
      },
      {
        heading: {
          tr: "Taksim'de araçla inmek",
          ar: "النزول بالسيارة في تقسيم",
          en: "Arriving by car in Taksim",
        },
        body: {
          tr: "Taksim ve çevresindeki sokakların bir kısmı dar ve tek yönlüdür; bazı oteller yaya bölgesinin içinde kalır. Otelin tam adresi rezervasyon sırasında alındığında şoför en yakın inilebilecek noktayı önceden bilir ve bagajla gereksiz yürüyüş olmaz. İstiklal Caddesi araç trafiğine kapalıdır.",
          ar: "بعض شوارع تقسيم ومحيطها ضيقة وباتجاه واحد، وبعض الفنادق تقع داخل المنطقة المخصّصة للمشاة. وعند أخذ عنوان الفندق الكامل أثناء الحجز يعرف السائق مسبقاً أقرب نقطة نزول، فلا يحدث مشي إضافي بالحقائب. وشارع الاستقلال مغلق أمام السيارات.",
          en: "Some streets in and around Taksim are narrow and one-way, and a few hotels sit inside the pedestrian zone. When the full hotel address is taken at booking, the driver knows the nearest drop-off point in advance and you avoid walking with luggage. Istiklal Street is closed to traffic.",
        },
      },
      {
        heading: {
          tr: "Bu bölgede kalıyorsanız",
          ar: "إذا كنت ستقيم في هذه المنطقة",
          en: "If you are staying in this area",
        },
        body: {
          tr: "Taksim, metroya ve İstiklal Caddesi'ne yakınlığıyla şehrin ulaşım kalbidir; Şişli tarafı alışveriş merkezlerine ve hastanelere yakın olduğu için Körfez'den gelen misafirlerin sık tercih ettiği bölgedir. Tarihî yarımadaya tramvay ve metro ile ulaşılır, ancak yürüme mesafesinde değildir.",
          ar: "تقسيم هي قلب المواصلات في المدينة بقربها من المترو وشارع الاستقلال؛ وجهة شيشلي يفضّلها كثير من ضيوف الخليج لقربها من المولات والمستشفيات. ويُوصل إلى شبه الجزيرة التاريخية بالترام والمترو، لكنها ليست على مسافة سير.",
          en: "Taksim is the city's transport heart, close to the metro and Istiklal Street; the Sisli side is a frequent choice for Gulf visitors thanks to its malls and hospitals. The historic peninsula is reachable by tram and metro, but not on foot.",
        },
      },
    ],
  },
  {
    slug: "istanbul-havalimani-sultanahmet-transfer",
    airport: "IST",
    image: "/images/places/sultanahmet.jpg",
    from: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
    to: { tr: "Sultanahmet", ar: "السلطان أحمد", en: "Sultanahmet" },
    distance: { tr: "yaklaşık 45 km", ar: "نحو 45 كم", en: "about 45 km" },
    duration: { tr: "50 dk – 1,5 saat", ar: "50 دقيقة – ساعة ونصف", en: "50 min – 1.5 hrs" },
    excerpt: {
      tr: "Tarihî yarımadaya transfer: dar sokaklar, yaya bölgeleri ve otelin kapısına inmek.",
      ar: "النقل إلى شبه الجزيرة التاريخية: أزقة ضيقة ومناطق مشاة والنزول عند باب الفندق.",
      en: "Transfer to the historic peninsula: narrow lanes, pedestrian zones and reaching your hotel door.",
    },
    sections: [
      {
        heading: {
          tr: "Güzergâh ve süre",
          ar: "المسار والمدة",
          en: "The route and the time",
        },
        body: {
          tr: "Sultanahmet, havalimanına yaklaşık 45 kilometre mesafede ve Taksim'den biraz daha uzaktır. Yolculuk Avrupa yakası içinde kalır, Boğaz geçişi yoktur. Tarihî yarımadaya giriş şehir içi trafiğe bağlıdır ve akşamüstü belirgin şekilde yavaşlar.",
          ar: "تبعد السلطان أحمد نحو 45 كيلومتراً عن المطار، أي أبعد قليلاً من تقسيم. تبقى الرحلة داخل الجانب الأوروبي دون عبور البوسفور. والدخول إلى شبه الجزيرة التاريخية مرتبط بحركة المرور داخل المدينة ويبطؤ بوضوح قبيل المساء.",
          en: "Sultanahmet is about 45 km from the airport, a little farther than Taksim. The drive stays on the European side with no Bosphorus crossing. Entering the historic peninsula depends on city traffic and slows noticeably in the late afternoon.",
        },
      },
      {
        heading: {
          tr: "Dar sokaklar ve otelin kapısı",
          ar: "الأزقة الضيقة وباب الفندق",
          en: "Narrow lanes and the hotel door",
        },
        body: {
          tr: "Sultanahmet'in sokakları tarihî dokusu gereği dar, eğimli ve bir kısmı taş döşelidir; bazı otellere büyük araçla girilemez. Bu bölgede otelin adını değil, tam adresini vermek önemlidir: şoför en yakın inilebilecek noktayı bilir ve gerekiyorsa bagaj taşımaya yardım eder.",
          ar: "أزقة السلطان أحمد ضيقة ومائلة وبعضها مرصوف بالحجر بحكم نسيجها التاريخي، وبعض الفنادق لا تصلها سيارة كبيرة. لذلك المهم في هذه المنطقة إعطاء العنوان الكامل لا اسم الفندق فقط: عندها يعرف السائق أقرب نقطة نزول ويساعد في حمل الحقائب عند اللزوم.",
          en: "Because of its historic fabric, Sultanahmet's lanes are narrow, sloping and partly cobbled; a large vehicle cannot reach some hotels. Here it matters to give the full address rather than just the hotel name: the driver then knows the closest drop-off point and helps with the luggage if needed.",
        },
      },
      {
        heading: {
          tr: "Varışta yürüme mesafesinde ne var",
          ar: "ما الذي يقع على مسافة سير عند الوصول",
          en: "What is within walking distance",
        },
        body: {
          tr: "Sultanahmet Camii, Ayasofya, Topkapı Sarayı ve Yerebatan Sarnıcı birbirine yürüme mesafesindedir; bu, bölgenin en büyük avantajıdır. Kapalıçarşı ve Mısır Çarşısı da yakındır. Bölge akşamları sakinleşir, gece hayatı arayanlar için uygun değildir.",
          ar: "جامع السلطان أحمد وآيا صوفيا وقصر توبكابي وصهريج البازيليك على مسافة سير من بعضها، وهذه أكبر ميزة للمنطقة. والبازار المسقوف وبازار التوابل قريبان أيضاً. تهدأ المنطقة مساءً، فهي لا تناسب من يبحث عن حياة ليلية.",
          en: "The Blue Mosque, Hagia Sophia, Topkapi Palace and the Basilica Cistern are all within walking distance of each other — the area's biggest advantage. The Grand Bazaar and Spice Bazaar are close too. It quietens in the evening and does not suit anyone after nightlife.",
        },
      },
    ],
  },
  {
    slug: "sabiha-gokcen-taksim-transfer",
    airport: "SAW",
    image: "/images/places/bogaz-kopru.jpg",
    from: { tr: "Sabiha Gökçen (SAW)", ar: "صبيحة كوكجن (SAW)", en: "Sabiha Gokcen (SAW)" },
    to: { tr: "Taksim", ar: "تقسيم", en: "Taksim" },
    distance: { tr: "yaklaşık 50 km", ar: "نحو 50 كم", en: "about 50 km" },
    duration: { tr: "1 – 1,5 saat", ar: "ساعة – ساعة ونصف", en: "1 – 1.5 hrs" },
    excerpt: {
      tr: "Anadolu yakasından Avrupa yakasına: Boğaz geçişi bu yolculuğun süresini belirleyen şey.",
      ar: "من الجانب الآسيوي إلى الأوروبي: عبور البوسفور هو ما يحدّد مدة هذه الرحلة.",
      en: "From the Asian side to the European: the Bosphorus crossing decides how long this takes.",
    },
    sections: [
      {
        heading: {
          tr: "Boğaz'ı geçmek gerekiyor",
          ar: "لا بدّ من عبور البوسفور",
          en: "You have to cross the Bosphorus",
        },
        body: {
          tr: "Sabiha Gökçen Anadolu yakasında, Taksim ise Avrupa yakasındadır; bu yolculuk mutlaka Boğaz geçişi içerir. Geçiş köprüden ya da Avrasya Tüneli'nden yapılır ve hangisinin seçileceği saate göre değişir. Köprü trafiği bu güzergâhta süreyi en çok değiştiren etkendir.",
          ar: "مطار صبيحة كوكجن في الجانب الآسيوي وتقسيم في الأوروبي؛ لذا تتضمّن هذه الرحلة عبور البوسفور حتماً. ويتم العبور من أحد الجسور أو عبر نفق أوراسيا، والاختيار بينهما يتغيّر حسب الساعة. وازدحام الجسور هو أكثر ما يغيّر المدة في هذا المسار.",
          en: "Sabiha Gokcen is on the Asian side and Taksim on the European, so this trip always includes a Bosphorus crossing — either over a bridge or through the Eurasia Tunnel, and which one depends on the hour. Bridge traffic is what changes the journey time most on this route.",
        },
      },
      {
        heading: {
          tr: "Gece inen uçuşlar",
          ar: "الرحلات التي تصل ليلاً",
          en: "Late-night arrivals",
        },
        body: {
          tr: "Sabiha Gökçen'e gelen tarifelerin önemli bir kısmı gece geç saatte iner ve bu, güzergâh açısından iyi haberdir: köprü trafiği o saatte yoktur, yolculuk günün en hızlı hâlindedir. Buna karşılık toplu taşıma seyrekleşir; önceden ayarlanmış karşılama gece yarısı en çok işe yarayan şeydir.",
          ar: "كثير من الرحلات إلى صبيحة كوكجن تهبط في ساعة متأخرة، وهذا خبر جيد لهذا المسار: لا ازدحام على الجسور في تلك الساعة، وتكون الرحلة في أسرع حالاتها. في المقابل تقلّ وسائل النقل العام؛ ويصبح الاستقبال المحجوز مسبقاً أنفع شيء منتصف الليل.",
          en: "A large share of flights into Sabiha Gokcen land late at night, which is good news for this route: there is no bridge traffic then and the drive is at its fastest. Public transport, on the other hand, thins out — a pre-arranged pickup is what helps most at midnight.",
        },
      },
      {
        heading: {
          tr: "Anadolu yakasında kalmak bir seçenek",
          ar: "الإقامة في الجانب الآسيوي خيار",
          en: "Staying on the Asian side is an option",
        },
        body: {
          tr: "Uçuşunuz Sabiha Gökçen'e iniyorsa ve programınız Anadolu yakasında yoğunlaşıyorsa, Kadıköy ya da Ataşehir'de kalmak her gün Boğaz geçmekten kurtarır. Tarihî noktalar Avrupa yakasında olduğu için bu tercih programınıza göre değişir; rezervasyondan önce konuşulması gereken bir konudur.",
          ar: "إذا كانت رحلتك تهبط في صبيحة كوكجن وبرنامجك يتركّز في الجانب الآسيوي، فالإقامة في كاديكوي أو آتاشهير تعفيك من عبور البوسفور يومياً. ولأن المعالم التاريخية في الجانب الأوروبي فالأمر يتوقّف على برنامجك؛ وهو موضوع يُناقش قبل الحجز.",
          en: "If your flight lands at Sabiha Gokcen and your plans centre on the Asian side, staying in Kadikoy or Atasehir saves a daily Bosphorus crossing. Since the historic sights are on the European side, the choice depends on your programme — worth discussing before booking.",
        },
      },
    ],
  },
  {
    slug: "sabiha-gokcen-kadikoy-transfer",
    airport: "SAW",
    image: "/images/places/kadikoy.jpg",
    from: { tr: "Sabiha Gökçen (SAW)", ar: "صبيحة كوكجن (SAW)", en: "Sabiha Gokcen (SAW)" },
    to: { tr: "Kadıköy", ar: "كاديكوي", en: "Kadikoy" },
    distance: { tr: "yaklaşık 35 km", ar: "نحو 35 كم", en: "about 35 km" },
    duration: { tr: "40 dk – 1 saat", ar: "40 دقيقة – ساعة", en: "40 min – 1 hr" },
    excerpt: {
      tr: "Aynı yakada kalan en kısa transferlerden biri: köprü yok, trafik daha az.",
      ar: "من أقصر عمليات النقل لبقائها في الجانب نفسه: بلا جسر وبازدحام أقل.",
      en: "One of the shortest transfers, staying on the same side: no bridge, less traffic.",
    },
    sections: [
      {
        heading: {
          tr: "Köprü olmayan güzergâh",
          ar: "مسار بلا جسر",
          en: "A route without a bridge",
        },
        body: {
          tr: "Kadıköy, Sabiha Gökçen ile aynı yakada olduğu için bu güzergâh Boğaz geçişi içermez ve İstanbul'un en öngörülebilir transferlerinden biridir. Yaklaşık 35 kilometrelik yol büyük ölçüde otoyoldan gider. Aynı sebeple trafik saatlerinde bile süre daha az sapar.",
          ar: "لأن كاديكوي في الجانب نفسه لمطار صبيحة كوكجن، لا يتضمّن هذا المسار عبور البوسفور، وهو من أكثر عمليات النقل قابلية للتوقّع في إسطنبول. والطريق البالغ نحو 35 كيلومتراً يسير في معظمه على الأوتوستراد. وللسبب نفسه تنحرف المدة أقل حتى في ساعات الذروة.",
          en: "Because Kadikoy is on the same side as Sabiha Gokcen, this route involves no Bosphorus crossing and is one of Istanbul's most predictable transfers. The roughly 35 km run is mostly motorway. For the same reason the time varies less, even at rush hour.",
        },
      },
      {
        heading: {
          tr: "Kadıköy ve Moda",
          ar: "كاديكوي ومودا",
          en: "Kadikoy and Moda",
        },
        body: {
          tr: "Kadıköy, çarşısı, sahil yürüyüş hattı ve Moda'daki kafeleriyle Anadolu yakasının merkezidir. Avrupa yakasına vapurla geçmek hem hızlıdır hem de Boğaz'ı görmenin en ucuz yoludur. Bölge, tarihî yarımadaya her gün gitmeyecek misafirler için rahat bir üstür.",
          ar: "كاديكوي هي مركز الجانب الآسيوي بسوقها وممشاها الساحلي ومقاهي مودا. والعبور إلى الجانب الأوروبي بالعبّارة سريع، وهو أرخص طريقة لرؤية البوسفور. والمنطقة قاعدة مريحة لمن لن يذهب يومياً إلى شبه الجزيرة التاريخية.",
          en: "With its market, seaside promenade and the cafés of Moda, Kadikoy is the heart of the Asian side. Crossing to the European side by ferry is quick and the cheapest way to see the Bosphorus. The area is a comfortable base for guests who will not go to the historic peninsula every day.",
        },
      },
      {
        heading: {
          tr: "Dönüş uçuşu için pay bırakın",
          ar: "اترك هامشاً لرحلة العودة",
          en: "Leave margin for the return flight",
        },
        body: {
          tr: "Gidiş yönünde kısa olan bu güzergâh, dönüşte sabah trafiğine denk gelirse uzayabilir. Uçuş saatinden geriye doğru hesaplarken bagaj teslimi ve güvenlik kuyruğu için de pay bırakmak gerekir; şoför kalkış saatini rezervasyonda birlikte belirler.",
          ar: "هذا المسار القصير في اتجاه الذهاب قد يطول في العودة إن صادف زحام الصباح. وعند الحساب رجوعاً من موعد الإقلاع يجب ترك هامش أيضاً لتسليم الحقائب وطابور الأمن؛ ويحدّد السائق ساعة الانطلاق معك أثناء الحجز.",
          en: "Short in the outbound direction, this route can stretch on the way back if it meets morning traffic. Counting back from your departure time, leave margin for bag drop and the security queue as well; the driver sets the pickup time with you at booking.",
        },
      },
    ],
  },
  {
    slug: "istanbul-havalimani-sisli-nisantasi-transfer",
    airport: "IST",
    image: "/images/tours/istanbul.jpg",
    from: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
    to: { tr: "Şişli ve Nişantaşı", ar: "شيشلي ونيشانتاشي", en: "Sisli and Nisantasi" },
    distance: { tr: "yaklaşık 38 km", ar: "نحو 38 كم", en: "about 38 km" },
    duration: { tr: "40 dk – 1,5 saat", ar: "40 دقيقة – ساعة ونصف", en: "40 min – 1.5 hrs" },
    excerpt: {
      tr: "Alışveriş ve sağlık turizmi için en çok tercih edilen bölge; havalimanına en yakın merkezlerden.",
      ar: "المنطقة الأكثر تفضيلاً للتسوّق والسياحة العلاجية، ومن أقرب المراكز إلى المطار.",
      en: "The favourite area for shopping and medical travel, and one of the closest central districts to the airport.",
    },
    sections: [
      {
        heading: {
          tr: "Merkeze en yakın varış noktalarından",
          ar: "من أقرب وجهات الوصول إلى المركز",
          en: "One of the closest central destinations",
        },
        body: {
          tr: "Şişli, İstanbul Havalimanı'na yaklaşık 38 kilometre mesafeyle Taksim ve Sultanahmet'ten biraz daha yakındır. Yolculuk Avrupa yakası içinde kalır. Sabah ve akşam trafiği burada da hissedilir ama merkeze giriş noktası daha erken olduğu için toplam süre genelde daha kısadır.",
          ar: "تبعد شيشلي نحو 38 كيلومتراً عن مطار إسطنبول، أي أقرب قليلاً من تقسيم والسلطان أحمد. وتبقى الرحلة داخل الجانب الأوروبي. ويُحسّ زحام الصباح والمساء هنا أيضاً، لكن نقطة الدخول إلى المركز أبكر فتكون المدة الإجمالية أقصر عادةً.",
          en: "At about 38 km from Istanbul Airport, Sisli is slightly closer than Taksim or Sultanahmet. The drive stays on the European side. Morning and evening traffic is felt here too, but the entry point into the centre comes earlier, so the total time is usually shorter.",
        },
      },
      {
        heading: {
          tr: "Alışveriş ve sağlık",
          ar: "التسوّق والصحة",
          en: "Shopping and healthcare",
        },
        body: {
          tr: "Nişantaşı marka alışverişinin merkezidir ve Şişli çevresinde büyük alışveriş merkezleri ile özel hastaneler bulunur. Körfez'den gelen misafirlerin bu bölgeyi sık tercih etmesinin sebebi budur: otel, alışveriş ve randevu aynı yürüme mesafesinde kalabilir.",
          ar: "نيشانتاشي مركز التسوّق للماركات، وحول شيشلي مولات كبيرة ومستشفيات خاصة. وهذا سبب تفضيل كثير من ضيوف الخليج لهذه المنطقة: الفندق والتسوّق والموعد الطبي قد تكون جميعها على مسافة سير واحدة.",
          en: "Nisantasi is the centre of brand shopping, and around Sisli there are large malls and private hospitals. That is why many Gulf visitors favour the area: hotel, shopping and an appointment can all sit within the same walk.",
        },
      },
      {
        heading: {
          tr: "Paketle dönüş ve araç",
          ar: "العودة بالأكياس والسيارة",
          en: "Coming back with bags",
        },
        body: {
          tr: "Alışveriş günlerinde elde taşınacak paket sayısı tahmin edilenden fazla olur. Aracın gün boyu emrinizde olması bu bölgede en çok işe yarayan hizmettir: paketleri araca bırakıp gezmeye devam edebilir, akşam tek seferde otele dönebilirsiniz.",
          ar: "في أيام التسوّق يكون عدد الأكياس أكثر مما يُتوقّع. ووجود السيارة تحت تصرّفك طوال اليوم هو أنفع خدمة في هذه المنطقة: تترك الأكياس فيها وتواصل التجوّل، ثم تعود إلى الفندق مرة واحدة مساءً.",
          en: "On shopping days there are more bags than expected. Having the car at your disposal all day is the most useful service in this area: leave the bags in it, carry on, and return to the hotel once in the evening.",
        },
      },
    ],
  },
  {
    slug: "istanbul-havalimani-besiktas-ortakoy-transfer",
    airport: "IST",
    image: "/images/hero-ortakoy.jpg",
    from: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
    to: { tr: "Beşiktaş ve Ortaköy", ar: "بشكتاش وأورتاكوي", en: "Besiktas and Ortakoy" },
    distance: { tr: "yaklaşık 42 km", ar: "نحو 42 كم", en: "about 42 km" },
    duration: { tr: "45 dk – 1,5 saat", ar: "45 دقيقة – ساعة ونصف", en: "45 min – 1.5 hrs" },
    excerpt: {
      tr: "Boğaz kıyısındaki oteller için: sahil yolu, dar yan sokaklar ve manzaralı odaya varmak.",
      ar: "لفنادق ضفة البوسفور: طريق الساحل والأزقة الجانبية الضيقة والوصول إلى الغرفة ذات الإطلالة.",
      en: "For the Bosphorus-shore hotels: the coast road, narrow side streets and reaching that view room.",
    },
    sections: [
      {
        heading: {
          tr: "Sahil yolundan iniş",
          ar: "النزول من طريق الساحل",
          en: "Coming in along the shore",
        },
        body: {
          tr: "Beşiktaş ve Ortaköy, havalimanına yaklaşık 42 kilometre mesafede ve Avrupa yakasında; Boğaz geçişi gerekmez. Yolun son bölümü sahil yolundan geçer ve Boğaz manzarası daha araçtayken başlar. Bu bölüm dar ve tek şeritli olduğu için akşamüstü belirgin şekilde yavaşlar.",
          ar: "تبعد بشكتاش وأورتاكوي نحو 42 كيلومتراً عن المطار وهما في الجانب الأوروبي؛ فلا حاجة لعبور البوسفور. والجزء الأخير من الطريق يمرّ على الساحل، فتبدأ إطلالة البوسفور وأنت ما زلت في السيارة. وهذا المقطع ضيق وبحارة واحدة، لذا يبطؤ بوضوح قبيل المساء.",
          en: "Besiktas and Ortakoy are about 42 km from the airport and on the European side, so no Bosphorus crossing is needed. The last stretch runs along the shore road and the Bosphorus view starts while you are still in the car. That section is narrow and single-lane, so it slows noticeably in the late afternoon.",
        },
      },
      {
        heading: {
          tr: "Yalı otellerine varmak",
          ar: "الوصول إلى فنادق الضفة",
          en: "Reaching the waterside hotels",
        },
        body: {
          tr: "Boğaz kıyısındaki otellerin bir kısmı sahil yolundan dar yan sokaklarla inilen konumlardadır ve kapının önünde bekleme alanı sınırlıdır. Otelin tam adresi rezervasyonda alındığında şoför giriş noktasını önceden bilir; bagajla sahil yolunda yürümek gerekmez. Ortaköy meydanı çevresi hafta sonları araç trafiğine yoğun şekilde kapanabilir.",
          ar: "بعض فنادق ضفة البوسفور تُبلغ عبر أزقة جانبية ضيقة تنزل من طريق الساحل، ومساحة الانتظار أمام الباب محدودة. وعند أخذ العنوان الكامل للفندق أثناء الحجز يعرف السائق نقطة الدخول مسبقاً، فلا يلزم المشي بالحقائب على طريق الساحل. وقد يُغلق محيط ميدان أورتاكوي أمام السيارات بكثافة في عطلة نهاية الأسبوع.",
          en: "Some of the shore hotels are reached down narrow side streets off the coast road, with limited waiting space at the door. When the full address is taken at booking, the driver knows the entry point in advance and you do not walk along the shore road with luggage. The area around Ortakoy square can close heavily to traffic at weekends.",
        },
      },
      {
        heading: {
          tr: "Manzara neye mal olur",
          ar: "ما ثمن الإطلالة",
          en: "What the view costs you",
        },
        body: {
          tr: "Boğaz manzarası İstanbul'da fiyatı en çok değiştiren unsurdur ve bu bölgede kalmanın asıl sebebi odur. Karşılığında tarihî yarımada yürüme mesafesinde değildir: Sultanahmet'e her gün gidilecekse ulaşım günün içine eklenmelidir. Aracın gün boyu emrinizde olması bu bölgede en çok işe yarayan çözümdür.",
          ar: "إطلالة البوسفور هي العامل الأكثر تأثيراً في السعر بإسطنبول، وهي السبب الأساسي للإقامة في هذه المنطقة. وفي المقابل شبه الجزيرة التاريخية ليست على مسافة سير: فإن كنت ستذهب يومياً إلى السلطان أحمد فيجب إضافة التنقّل إلى برنامج اليوم. ووجود السيارة تحت تصرّفك طوال اليوم هو أنفع حل في هذه المنطقة.",
          en: "A Bosphorus view is the biggest price lever in Istanbul and the main reason to stay here. In return, the historic peninsula is not walking distance: if you will go to Sultanahmet daily, add the travel into the day. Having the car at your disposal all day is the most useful answer in this area.",
        },
      },
    ],
  },
  {
    slug: "istanbul-havalimani-bursa-transfer",
    airport: "IST",
    image: "/images/tours/bursa.jpg",
    from: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
    to: { tr: "Bursa", ar: "بورصة", en: "Bursa" },
    distance: { tr: "yaklaşık 240 km", ar: "نحو 240 كم", en: "about 240 km" },
    duration: { tr: "3 – 3,5 saat", ar: "3 – 3.5 ساعات", en: "3 – 3.5 hrs" },
    excerpt: {
      tr: "Şehirlerarası transferin en çok sorulanı: feribot mu karayolu mu, ve gecikme payı.",
      ar: "أكثر ما يُسأل في النقل بين المدن: عبّارة أم برّاً، وهامش التأخير.",
      en: "The most-asked intercity transfer: ferry or road, and how much margin to leave.",
    },
    sections: [
      {
        heading: {
          tr: "İki güzergâh, iki farklı hesap",
          ar: "مساران، حسابان مختلفان",
          en: "Two routes, two different calculations",
        },
        body: {
          tr: "Bursa'ya İstanbul Havalimanı'ndan iki şekilde gidilir. Karayolu Osmangazi Köprüsü üzerinden gider ve saatten bağımsız çalışır; feribot Marmara'yı denizden geçer ve yolun bir bölümünü kısaltır ama sefer saatine bağlıdır. Uçuşu gecikmiş bir yolcu için karayolu daha güvenlidir: kaçırılacak bir sefer yoktur.",
          ar: "يُوصل إلى بورصة من مطار إسطنبول بطريقتين. الطريق البرّي يمرّ عبر جسر عثمان غازي ويعمل بمعزل عن الساعة؛ أما العبّارة فتعبر بحر مرمرة وتختصر جزءاً من الطريق لكنها مرتبطة بمواعيد الرحلات. ولمسافر تأخّرت رحلته يكون الطريق البرّي أأمن: لا توجد رحلة تفوته.",
          en: "There are two ways to Bursa from Istanbul Airport. The road route crosses the Osmangazi Bridge and works regardless of the hour; the ferry crosses the Marmara and shortens part of the trip but depends on sailing times. For a passenger whose flight is late, the road is safer: there is no sailing to miss.",
        },
      },
      {
        heading: {
          tr: "Üç saatlik yolculuk ne demek",
          ar: "ماذا تعني رحلة من ثلاث ساعات",
          en: "What a three-hour drive means",
        },
        body: {
          tr: "Bu, sitedeki en uzun transferdir ve şehir içi bir yolculuk gibi planlanamaz. Çocuklu ailelerde yol üzerinde en az bir mola gerekir; araçta su bulunur ve namaz vakti güzergâh üzerindeki tesislerde geçirilebilir. Uçuş sonrası doğrudan Bursa'ya geçmek yerine İstanbul'da bir gece kalmak, çoğu aile için daha rahat olur.",
          ar: "هذا أطول نقل على الموقع ولا يمكن تخطيطه كرحلة داخل المدينة. ومع الأطفال يلزم توقّف واحد على الأقل في الطريق؛ والماء متوفّر في السيارة ويمكن أداء الصلاة في الاستراحات على المسار. وبدل الانتقال مباشرةً إلى بورصة بعد الرحلة الجوية، تكون المبيت ليلة في إسطنبول أريح لمعظم العائلات.",
          en: "This is the longest transfer on the site and cannot be planned like a city trip. With children at least one stop along the way is needed; water is in the car and prayer time can be taken at the service areas on the route. Rather than going straight to Bursa after a flight, spending one night in Istanbul is more comfortable for most families.",
        },
      },
      {
        heading: {
          tr: "Aynı araç, aynı şoför",
          ar: "السيارة نفسها والسائق نفسه",
          en: "The same car, the same driver",
        },
        body: {
          tr: "Şehirlerarası yolculuklarda araç ve şoför gün boyu sizinle kalır; Bursa'da Uludağ, Ulu Cami ve Cumalıkızık arasında ayrıca ulaşım aramanız gerekmez. Dönüş aynı gün planlanacaksa uçuş saatinden geriye doğru hesap yaparken yolun üç saatine ek olarak trafik payı bırakmak gerekir.",
          ar: "في الرحلات بين المدن تبقى السيارة والسائق معكم طوال اليوم؛ فلا تحتاجون إلى البحث عن مواصلات بين أولوداغ والجامع الكبير وجوما لي كيزيك في بورصة. وإذا كانت العودة في اليوم نفسه فعند الحساب رجوعاً من موعد الإقلاع يجب ترك هامش للازدحام إضافةً إلى ساعات الطريق الثلاث.",
          en: "On intercity trips the vehicle and driver stay with you all day; in Bursa you will not need separate transport between Uludag, the Ulu Mosque and Cumalikizik. If the return is planned for the same day, counting back from the flight time, leave a traffic margin on top of the three hours on the road.",
        },
      },
    ],
  },
  /*
   * ─── Antalya (AYT) ───────────────────────────────────────────────
   *
   * Antalya tek bir varış noktası değil: havalimanından batıya Kemer,
   * doğuya Belek, Side ve Alanya uzanıyor ve aradaki fark 30 dakika ile
   * iki saat arasında değişiyor. "Antalya transferi" diye tek sayfa
   * yazmak, Alanya'ya gidecek misafire yanlış süre söylemek olurdu.
   */
  {
    slug: "antalya-havalimani-kemer-transfer",
    airport: "AYT",
    image: "/images/places/kemer.jpg",
    from: { tr: "Antalya Havalimanı (AYT)", ar: "مطار أنطاليا (AYT)", en: "Antalya Airport (AYT)" },
    to: { tr: "Kemer", ar: "كمر", en: "Kemer" },
    distance: { tr: "yaklaşık 57 km", ar: "نحو 57 كم", en: "about 57 km" },
    duration: { tr: "50 dk – 1,5 saat", ar: "50 دقيقة – ساعة ونصف", en: "50 min – 1.5 hrs" },
    excerpt: {
      tr: "Şehri geçip Toroslar'ın denize indiği sahil yoluna: mesafe, viraj ve otelin yarımadanın neresinde olduğu.",
      ar: "عبور المدينة إلى الطريق الساحلي حيث تنزل جبال طوروس إلى البحر: المسافة والمنعطفات وأين يقع فندقك بالضبط.",
      en: "Onto the coast road where the Taurus mountains drop into the sea: distance, bends and where your hotel really sits.",
    },
    sections: [
      {
        heading: { tr: "Güzergâh ve süre", ar: "المسار والمدة", en: "The route and the time" },
        body: {
          tr: "Kemer, Antalya Havalimanı'na yaklaşık 57 kilometre uzaklıkta ve havalimanı şehrin doğusunda kaldığı için yolculuk önce Antalya'yı batıya doğru geçmekle başlıyor. Şehir çıkışından sonra yol sahile iniyor ve Toroslar'ın denize dik indiği kıyı şeridini takip ediyor. Şehir içi bölümü sabah ve akşam saatlerinde yavaşlıyor; sahil yolu ise yaz aylarında tur otobüsleri yüzünden zaman zaman ağırlaşıyor.",
          ar: "تبعد كمر نحو 57 كيلومتراً عن مطار أنطاليا، وبما أن المطار يقع شرق المدينة فإن الرحلة تبدأ بعبور أنطاليا غرباً. بعد الخروج من المدينة ينزل الطريق إلى الساحل ويتبع الشريط الذي تهبط فيه جبال طوروس إلى البحر مباشرة. القسم داخل المدينة يبطؤ صباحاً ومساءً؛ أما الطريق الساحلي فيثقل أحياناً في الصيف بسبب حافلات الرحلات.",
          en: "Kemer is about 57 km from Antalya Airport, and because the airport sits east of the city the drive begins by crossing Antalya westwards. Past the city the road drops to the shore and follows the strip where the Taurus mountains fall straight into the sea. The urban section slows morning and evening; the coast road itself can get heavy in summer because of tour coaches.",
        },
      },
      {
        heading: {
          tr: "Kemer tek bir yer değil",
          ar: "كمر ليست مكاناً واحداً",
          en: "Kemer is not one place",
        },
        body: {
          tr: "Otel adresinde \"Kemer\" yazması, otelin Kemer merkezde olduğu anlamına gelmiyor. Otel şeridi Beldibi'nden başlayıp Göynük, Kemer merkez, Çamyuva ve Tekirova'ya kadar yaklaşık 25 kilometre boyunca uzanıyor. Beldibi'ndeki bir otele havalimanından 40 dakikada varılırken Tekirova'daki bir otel bir saati aşabiliyor. Rezervasyon sırasında otelin tam adını aldığımızda süreyi tahmin değil, doğru söyleyebiliyoruz.",
          ar: "كتابة \"كمر\" في عنوان الفندق لا تعني أن الفندق في مركز كمر. يمتد شريط الفنادق من بلديبي مروراً بغويْنوك ومركز كمر وتشامْيووا حتى تكيروفا، على مسافة نحو 25 كيلومتراً. الوصول إلى فندق في بلديبي يستغرق نحو 40 دقيقة من المطار، بينما قد يتجاوز فندق في تكيروفا الساعة. وحين نأخذ اسم الفندق الكامل عند الحجز نستطيع أن نقول المدة بدقة لا تخميناً.",
          en: "\"Kemer\" in a hotel address does not mean the hotel is in Kemer town. The hotel strip runs from Beldibi through Göynük, Kemer centre, Çamyuva and on to Tekirova — some 25 km end to end. A hotel in Beldibi is about 40 minutes from the airport; one in Tekirova can pass the hour. When we take the exact hotel name at booking we can tell you the real time rather than an estimate.",
        },
      },
      {
        heading: { tr: "Yolda bilinmesi gerekenler", ar: "ما ينبغي معرفته على الطريق", en: "What to know on the way" },
        body: {
          tr: "Sahil yolu virajlı ve yer yer denizin hemen üstünden geçiyor; manzarası güzel ama araç tutan çocuklar için ön tarafta oturmak ve sık aralıklarla hava almak işe yarıyor. Yol boyunca birkaç seyir noktası ve dinlenme yeri var, isteyen kısa bir mola verebiliyor. Gece varışlarında yol tenha ve aydınlatma sınırlı; bu bizim için sorun değil ama kendi aracını kiralamayı düşünen misafirin bilmesi gereken bir ayrıntı.",
          ar: "الطريق الساحلي متعرّج ويمرّ في بعض المواضع فوق البحر مباشرة؛ المنظر جميل، لكن للأطفال الذين يتعبون في السيارة يفيد الجلوس في المقدمة وأخذ الهواء على فترات. توجد على الطريق عدة نقاط إطلالة وأماكن استراحة لمن أراد وقفة قصيرة. وفي الوصول الليلي يكون الطريق خالياً والإضاءة محدودة؛ هذا لا يمثّل مشكلة بالنسبة لنا، لكنه تفصيل ينبغي أن يعرفه من يفكّر في استئجار سيارة يقودها بنفسه.",
          en: "The coast road winds and in places runs directly above the water. The views are worth it, but for children prone to car sickness a front seat and regular fresh air help. There are several viewpoints and rest stops along the way if you want a short break. On night arrivals the road is quiet and lighting is limited — no issue for us, but worth knowing if you are considering driving yourself.",
        },
      },
    ],
  },
  {
    slug: "antalya-havalimani-belek-transfer",
    airport: "AYT",
    image: "/images/tours/antalya.jpg",
    from: { tr: "Antalya Havalimanı (AYT)", ar: "مطار أنطاليا (AYT)", en: "Antalya Airport (AYT)" },
    to: { tr: "Belek", ar: "بيليك", en: "Belek" },
    distance: { tr: "yaklaşık 35 km", ar: "نحو 35 كم", en: "about 35 km" },
    duration: { tr: "30 – 45 dk", ar: "30 – 45 دقيقة", en: "30 – 45 min" },
    excerpt: {
      tr: "Antalya'nın havalimanına en yakın otel bölgesi: kısa yol, ama son on dakika çam ormanının içindeki özel yollarda geçiyor.",
      ar: "أقرب منطقة فنادق إلى مطار أنطاليا: طريق قصير، لكن العشر دقائق الأخيرة تمرّ في طرق خاصة داخل غابة الصنوبر.",
      en: "The hotel area closest to Antalya Airport: a short drive, but the last ten minutes run down private lanes through pine forest.",
    },
    sections: [
      {
        heading: { tr: "En kısa transfer", ar: "أقصر رحلة نقل", en: "The shortest transfer" },
        body: {
          tr: "Belek, Antalya'nın büyük otel bölgeleri arasında havalimanına en yakın olanı: yaklaşık 35 kilometre ve normal koşullarda 30-45 dakika. Havalimanı şehrin doğusunda olduğu için Belek'e giderken Antalya şehir merkezine hiç girilmiyor; yol doğrudan D400 üzerinden doğuya devam ediyor. Bu yüzden Belek transferi, şehir trafiğinden en az etkilenen güzergâh.",
          ar: "بيليك هي الأقرب إلى المطار بين مناطق الفنادق الكبرى في أنطاليا: نحو 35 كيلومتراً و30-45 دقيقة في الظروف العادية. وبما أن المطار يقع شرق المدينة فإن الطريق إلى بيليك لا يدخل مركز أنطاليا إطلاقاً، بل يمضي شرقاً مباشرة على طريق D400. لذلك فإن نقل بيليك هو المسار الأقل تأثراً بزحام المدينة.",
          en: "Belek is the closest of Antalya's major hotel areas to the airport: about 35 km and 30–45 minutes in normal conditions. Because the airport lies east of the city, the drive to Belek never enters central Antalya — it continues straight east on the D400. That makes this the route least affected by city traffic.",
        },
      },
      {
        heading: { tr: "Son kilometre", ar: "الكيلومتر الأخير", en: "The last kilometre" },
        body: {
          tr: "Belek'teki otellerin çoğu ana yoldan görünmüyor: çam ormanının içine, sahile kadar uzanan uzun özel yolların ucunda duruyorlar. Ana yoldan ayrıldıktan sonra otele varmak birkaç dakika daha sürüyor ve bazı oteller birbirine çok benzeyen tabelalarla aynı kavşaktan giriyor. Otelin tam adı ve mümkünse rezervasyon numarası elimizde olduğunda şoför doğru girişten dönüyor; bagajla yanlış kapıda inmek en can sıkıcı varış biçimi.",
          ar: "معظم فنادق بيليك لا تُرى من الطريق الرئيسي: فهي تقع في نهاية طرق خاصة طويلة تمتد داخل غابة الصنوبر حتى الشاطئ. وبعد مغادرة الطريق الرئيسي يستغرق الوصول إلى الفندق بضع دقائق إضافية، كما أن بعض الفنادق تدخل من التقاطع نفسه بلافتات متشابهة جداً. وحين يكون بحوزتنا اسم الفندق الكامل ورقم الحجز إن أمكن، ينعطف السائق من المدخل الصحيح؛ فالنزول بالحقائب عند بوابة خاطئة هو أسوأ صور الوصول.",
          en: "Most Belek hotels are invisible from the main road: they sit at the end of long private lanes running through pine forest down to the beach. After the turn-off it takes a few more minutes to reach the door, and several hotels share one junction behind near-identical signs. With the exact hotel name — and the booking reference if you have it — the driver takes the right entrance. Being dropped at the wrong gate with luggage is the worst kind of arrival.",
        },
      },
      {
        heading: { tr: "Belek kime uyar", ar: "لمن تناسب بيليك", en: "Who Belek suits" },
        body: {
          tr: "Belek büyük ölçüde her şey dahil otellerden ve golf sahalarından oluşuyor; gezilecek bir kasaba merkezi ya da çarşı beklentisiyle gelen misafir hayal kırıklığına uğrayabiliyor. Buna karşılık uzun kumsalı, geniş otel bahçeleri ve havalimanına yakınlığıyla küçük çocuklu aileler için Antalya'nın en rahat bölgesi. Alışveriş ve eski şehir görmek isteyenler için Antalya merkez ve Kaleiçi araçla yaklaşık 45 dakika; Side ise yarım saat doğuda.",
          ar: "تتكوّن بيليك في معظمها من فنادق \"كل شيء مشمول\" وملاعب غولف؛ وقد يُصاب بخيبة أمل من يأتي متوقعاً مركز بلدة أو سوقاً للتجوّل. في المقابل، فإن شاطئها الطويل وحدائق فنادقها الواسعة وقربها من المطار تجعلها أريح مناطق أنطاليا للعائلات ذات الأطفال الصغار. ولمن يريد التسوّق ورؤية المدينة القديمة، فمركز أنطاليا وكالي إيتشي على نحو 45 دقيقة بالسيارة، وسيدي على نصف ساعة شرقاً.",
          en: "Belek is largely all-inclusive hotels and golf courses; a guest arriving expecting a town centre or a bazaar to wander may be disappointed. In exchange, its long sandy beach, generous hotel grounds and closeness to the airport make it the easiest part of Antalya for families with small children. For shopping and the old town, central Antalya and Kaleiçi are about 45 minutes by car; Side is half an hour east.",
        },
      },
    ],
  },
  {
    slug: "antalya-havalimani-side-transfer",
    airport: "AYT",
    image: "/images/places/side.jpg",
    from: { tr: "Antalya Havalimanı (AYT)", ar: "مطار أنطاليا (AYT)", en: "Antalya Airport (AYT)" },
    to: { tr: "Side", ar: "سيدي", en: "Side" },
    distance: { tr: "yaklaşık 65 km", ar: "نحو 65 كم", en: "about 65 km" },
    duration: { tr: "55 dk – 1,5 saat", ar: "55 دقيقة – ساعة ونصف", en: "55 min – 1.5 hrs" },
    excerpt: {
      tr: "Antik kentin içindeki otele araçla girilemiyor: bu sayfa mesafeden çok o ayrıntıyı anlatıyor.",
      ar: "لا يمكن للسيارات الدخول إلى الفنادق داخل المدينة الأثرية: هذه الصفحة تشرح تلك التفصيلة أكثر من المسافة.",
      en: "Cars cannot reach hotels inside the ancient town — this page is about that detail more than the distance.",
    },
    sections: [
      {
        heading: { tr: "Güzergâh ve süre", ar: "المسار والمدة", en: "The route and the time" },
        body: {
          tr: "Side, Antalya Havalimanı'na yaklaşık 65 kilometre uzaklıkta ve yol tümüyle doğuya, D400 üzerinden gidiyor. Antalya şehir merkezine girilmediği için yolculuk büyük ölçüde açık yolda geçiyor ve normal koşullarda bir saat civarında sürüyor. Yaz aylarında Belek ve Kadriye çevresindeki otel girişleri yolu yavaşlatabiliyor.",
          ar: "تبعد سيدي نحو 65 كيلومتراً عن مطار أنطاليا، والطريق يتجه شرقاً بالكامل عبر D400. وبما أن الرحلة لا تدخل مركز أنطاليا فإنها تمضي في معظمها على طريق مفتوح وتستغرق نحو ساعة في الظروف العادية. وفي الصيف قد تبطئ مداخل الفنادق حول بيليك وكادرييه حركة السير.",
          en: "Side is about 65 km from Antalya Airport and the drive runs entirely east on the D400. Because it never enters central Antalya, most of the journey is on open road and takes around an hour in normal conditions. In summer the hotel entrances around Belek and Kadriye can slow things down.",
        },
      },
      {
        heading: {
          tr: "Antik kentin içine araç girmiyor",
          ar: "السيارات لا تدخل المدينة الأثرية",
          en: "Vehicles do not enter the ancient town",
        },
        body: {
          tr: "Side'nin eski yerleşimi bir yarımadanın üzerinde ve içindeki sokakların büyük bölümü araç trafiğine kapalı. Antik kentin içinde ya da hemen yanında kalıyorsanız araç sizi giriş noktasına kadar getirebiliyor, oradan otele kısa bir yürüyüş kalıyor. Bunu önceden bilmek önemli: bagajı ağır olan ya da yürümekte zorlanan misafir için otelin tam konumu, transferi planlarken hesaba katılması gereken bir şey. Rezervasyon sırasında otelin adını aldığımızda en yakın inilebilecek noktayı önceden söylüyoruz.",
          ar: "تقع سيدي القديمة على شبه جزيرة، ومعظم شوارعها الداخلية مغلقة أمام السيارات. فإن كنت تقيم داخل المدينة الأثرية أو بجوارها مباشرة، تستطيع السيارة أن توصلك حتى نقطة الدخول، ثم يبقى مشي قصير إلى الفندق. ومعرفة ذلك مسبقاً مهمة: فموقع الفندق بالضبط أمر ينبغي حسابه عند تخطيط النقل لمن يحمل حقائب ثقيلة أو يجد صعوبة في المشي. وحين نأخذ اسم الفندق عند الحجز نخبرك مسبقاً بأقرب نقطة نزول.",
          en: "Old Side sits on a peninsula and most of its inner streets are closed to traffic. If you are staying inside the ancient town or right beside it, the car can bring you as far as the entry point and a short walk remains. Knowing this in advance matters: for a guest with heavy luggage or difficulty walking, the hotel's exact position is something to factor into the transfer. When we take the hotel name at booking we tell you the nearest drop-off point beforehand.",
        },
      },
      {
        heading: {
          tr: "\"Side\" yazan her adres Side değil",
          ar: "ليس كل عنوان مكتوب فيه \"سيدي\" هو سيدي",
          en: "Not every address saying \"Side\" is Side",
        },
        body: {
          tr: "Side adı çevredeki geniş bir otel bölgesi için de kullanılıyor: Çolaklı, Kumköy, Titreyengöl, Sorgun ve Manavgat, adreslerinde çoğu zaman Side geçse de birbirlerinden kilometrelerce uzakta. Manavgat ayrı bir ilçe merkezi ve antik kente yaklaşık 8 kilometre. Bu yüzden \"Side\" demek transferi planlamak için yeterli olmuyor; otelin adı ya da mahallesi gerekiyor. Aradaki fark yolculuk süresine 15-20 dakika ekleyebiliyor.",
          ar: "يُستخدم اسم سيدي أيضاً لمنطقة فنادق واسعة حولها: تشولاكلي، وكومكوي، وتيتره ينغول، وسورغون، ومانافغات — وكلها يرد اسم سيدي في عناوينها غالباً رغم أنها تبعد كيلومترات بعضها عن بعض. ومانافغات مركز قضاء مستقل يبعد نحو 8 كيلومترات عن المدينة الأثرية. لذلك لا تكفي كلمة \"سيدي\" لتخطيط النقل؛ نحتاج اسم الفندق أو الحيّ. وقد يضيف هذا الفرق 15-20 دقيقة إلى مدة الرحلة.",
          en: "The name Side is also used for a wide hotel area around it: Çolaklı, Kumköy, Titreyengöl, Sorgun and Manavgat mostly carry Side in their addresses although they lie kilometres apart. Manavgat is a separate district centre about 8 km from the ancient town. So \"Side\" alone is not enough to plan a transfer; we need the hotel name or the neighbourhood. The difference can add 15–20 minutes to the drive.",
        },
      },
    ],
  },
  {
    slug: "antalya-havalimani-alanya-transfer",
    airport: "AYT",
    image: "/images/places/alanya.jpg",
    from: { tr: "Antalya Havalimanı (AYT)", ar: "مطار أنطاليا (AYT)", en: "Antalya Airport (AYT)" },
    to: { tr: "Alanya", ar: "ألانيا", en: "Alanya" },
    distance: { tr: "yaklaşık 125 km", ar: "نحو 125 كم", en: "about 125 km" },
    duration: { tr: "1 saat 45 dk – 2,5 saat", ar: "ساعة و45 دقيقة – ساعتان ونصف", en: "1 hr 45 min – 2.5 hrs" },
    excerpt: {
      tr: "Antalya'nın en uzun transferi. Mesafe gerçekten uzun ve bunu baştan söylemek, varışta söylemekten iyi.",
      ar: "أطول رحلة نقل في أنطاليا. المسافة طويلة فعلاً، وقولها من البداية أفضل من قولها عند الوصول.",
      en: "Antalya's longest transfer. The distance is genuinely long, and saying so upfront beats saying it on arrival.",
    },
    sections: [
      {
        heading: { tr: "Mesafe gerçekten uzun", ar: "المسافة طويلة فعلاً", en: "The distance is genuinely long" },
        body: {
          tr: "Alanya, Antalya Havalimanı'na yaklaşık 125 kilometre uzaklıkta ve yolculuk normal koşullarda iki saate yakın sürüyor. Yaz aylarında ve hafta sonları bu süre iki buçuk saati bulabiliyor. Bu, uçuş sonrası küçük çocuklu bir aile için ciddi bir yol; uçuş saatini seçerken hesaba katmakta fayda var. Araçta su ve mola imkânı var, uzun yolu bir çırpıda gitmek zorunda değilsiniz.",
          ar: "تبعد ألانيا نحو 125 كيلومتراً عن مطار أنطاليا، وتستغرق الرحلة نحو ساعتين في الظروف العادية. وفي الصيف وعطلات نهاية الأسبوع قد تصل إلى ساعتين ونصف. وهذا طريق طويل فعلاً لعائلة مع أطفال صغار بعد رحلة جوية؛ من المفيد أخذه في الحسبان عند اختيار موعد الرحلة. يتوفر الماء في السيارة وإمكانية التوقف، ولستم مضطرين لقطع الطريق دفعة واحدة.",
          en: "Alanya is about 125 km from Antalya Airport and the drive takes close to two hours in normal conditions — up to two and a half in summer and at weekends. That is a real journey for a family with small children straight off a flight, and worth weighing when you choose your flight time. There is water in the car and you can stop; you do not have to do the whole road in one go.",
        },
      },
      {
        heading: {
          tr: "Gazipaşa havalimanı çok daha yakın",
          ar: "مطار غازي باشا أقرب بكثير",
          en: "Gazipaşa airport is much closer",
        },
        body: {
          tr: "Alanya'ya en yakın havalimanı Antalya değil, Gazipaşa-Alanya (GZP): şehre yaklaşık 40 kilometre, yani yarım saatlik bir yol. Uçuş seçenekleri Antalya'ya göre çok daha sınırlı ve her ülkeden doğrudan sefer bulunmuyor; ama tatilinizin tamamını Alanya'da geçirecekseniz, bilet ararken Gazipaşa'ya da bakmaya değer. Dört saatlik bir gidiş-dönüş yolundan kurtarabilir. Biz iki havalimanından da karşılıyoruz; hangisine ineceğinizi bilmemiz yeterli.",
          ar: "أقرب مطار إلى ألانيا ليس أنطاليا بل غازي باشا-ألانيا (GZP): نحو 40 كيلومتراً عن المدينة، أي طريق نصف ساعة. خيارات الطيران إليه أقل بكثير من أنطاليا ولا تتوفر رحلات مباشرة من كل بلد؛ لكن إن كنت ستقضي إجازتك كاملة في ألانيا فيستحق الأمر النظر إلى غازي باشا عند البحث عن التذكرة. قد يوفّر عليك أربع ساعات ذهاباً وإياباً. ونحن نستقبل من المطارين معاً؛ يكفي أن نعرف أين ستهبط.",
          en: "The nearest airport to Alanya is not Antalya but Gazipaşa–Alanya (GZP): roughly 40 km from town, about half an hour. Flight options are far more limited than Antalya and there is no direct service from every country, but if you are spending your whole holiday in Alanya it is worth checking Gazipaşa when you look for tickets. It can save you four hours of driving over the round trip. We meet at both airports; we only need to know where you land.",
        },
      },
      {
        heading: { tr: "Yol ve mola", ar: "الطريق والاستراحة", en: "The road and stopping" },
        body: {
          tr: "Yol D400 üzerinden doğuya, Side ve Manavgat'ı geçerek devam ediyor; büyük bölümü bölünmüş ve rahat. Manavgat çevresinde ve Alanya girişinde trafik yoğunlaşabiliyor. Uzun yolculuğu bölmek isteyen misafirler genellikle Manavgat civarında kısa bir mola veriyor; isterseniz Manavgat Şelalesi bu güzergâh üzerinde kısa bir duraklama olarak eklenebiliyor. Böyle bir eklemeyi yolculuk öncesinde konuşmak gerekiyor, çünkü süreyi ve planı değiştiriyor.",
          ar: "يمضي الطريق شرقاً على D400 مروراً بسيدي ومانافغات؛ ومعظمه مزدوج ومريح. وقد تزدحم الحركة حول مانافغات وعند مدخل ألانيا. وعادةً ما يأخذ من يريد تقسيم الرحلة الطويلة استراحة قصيرة قرب مانافغات؛ ويمكن إضافة شلال مانافغات كتوقّف قصير على هذا المسار إن رغبت. ومثل هذه الإضافة ينبغي الاتفاق عليها قبل الرحلة لأنها تغيّر المدة والخطة.",
          en: "The road runs east on the D400 through Side and Manavgat; most of it is dual carriageway and comfortable. Traffic can build around Manavgat and at the entrance to Alanya. Guests who want to break the long drive usually stop briefly near Manavgat, and the Manavgat waterfall can be added as a short pause on this route if you like. Any such addition needs to be agreed before the journey, since it changes both the timing and the plan.",
        },
      },
    ],
  },
  /*
   * ─── Bodrum (BJV) ────────────────────────────────────────────────
   *
   * Havalimanının adı Milas-Bodrum ve gerçekten Milas'ta: yarımadanın
   * dışında. Bodrum'a gelen misafirin en sık şaşırdığı şey bu ve iki
   * güzergâh sayfası da bunun üzerine kurulu.
   */
  {
    slug: "bodrum-havalimani-bodrum-merkez-transfer",
    airport: "BJV",
    image: "/images/tours/bodrum.jpg",
    from: { tr: "Bodrum Havalimanı (BJV)", ar: "مطار بودروم (BJV)", en: "Bodrum Airport (BJV)" },
    to: { tr: "Bodrum merkez", ar: "مركز بودروم", en: "Bodrum centre" },
    distance: { tr: "yaklaşık 36 km", ar: "نحو 36 كم", en: "about 36 km" },
    duration: { tr: "40 dk – 1 saat", ar: "40 دقيقة – ساعة", en: "40 min – 1 hr" },
    excerpt: {
      tr: "Havalimanı Bodrum'da değil, Milas'ta. Yarımadaya girmek yolculuğun kendisi kadar önemli bir ayrıntı.",
      ar: "المطار ليس في بودروم بل في ميلاس. والدخول إلى شبه الجزيرة تفصيلة لا تقلّ أهمية عن الرحلة نفسها.",
      en: "The airport is not in Bodrum but in Milas. Getting onto the peninsula is as much of the story as the drive itself.",
    },
    sections: [
      {
        heading: {
          tr: "Havalimanı Milas'ta, Bodrum'da değil",
          ar: "المطار في ميلاس لا في بودروم",
          en: "The airport is in Milas, not Bodrum",
        },
        body: {
          tr: "Havalimanının tam adı Milas-Bodrum ve isim yanıltıcı değil: tesis Milas ilçesinde, Bodrum yarımadasının dışında duruyor. Bodrum merkeze yaklaşık 36 kilometre var ve yol normal koşullarda 40 dakika civarında sürüyor. Yolculuk önce ovadan geçiyor, sonra yarımadanın boynundaki tepeleri aşarak Bodrum'a iniyor. Bu iniş sırasında kale ve marina bir anda görünüyor; yarımadaya geldiğinizi anladığınız yer orası.",
          ar: "الاسم الكامل للمطار هو ميلاس-بودروم، والتسمية ليست مضلّلة: فالمنشأة تقع في قضاء ميلاس، خارج شبه جزيرة بودروم. وتبعد عن مركز بودروم نحو 36 كيلومتراً، ويستغرق الطريق نحو 40 دقيقة في الظروف العادية. تمرّ الرحلة أولاً في السهل، ثم تعبر تلال عنق شبه الجزيرة وتنزل إلى بودروم. وأثناء هذا النزول تظهر القلعة والمارينا فجأة؛ وهناك تدرك أنك وصلت شبه الجزيرة.",
          en: "The airport's full name is Milas–Bodrum, and the name is not misleading: it sits in the Milas district, outside the Bodrum peninsula. Bodrum centre is about 36 km away and the drive takes around 40 minutes in normal conditions. The road crosses the plain first, then climbs over the hills at the neck of the peninsula and descends into Bodrum. On that descent the castle and the marina appear all at once — that is the moment you know you have arrived.",
        },
      },
      {
        heading: {
          tr: "Merkezdeki sokaklar dar",
          ar: "شوارع المركز ضيّقة",
          en: "The streets in the centre are narrow",
        },
        body: {
          tr: "Bodrum merkezde, özellikle kale çevresinde ve çarşı içinde sokaklar dar ve bir kısmı yaya trafiğine ayrılmış. Sahil boyunca uzanan Cumhuriyet Caddesi akşam saatlerinde araca kapanıyor. Merkezdeki küçük butik otellerin bir bölümüne araçla kapıya kadar gidilemiyor; en yakın noktaya bırakıp kısa bir yürüyüş kalıyor. Otelin adını önceden aldığımızda şoför nereye kadar girebileceğini biliyor ve bagajla gereksiz tur atılmıyor.",
          ar: "في مركز بودروم، وخصوصاً حول القلعة وداخل السوق، الشوارع ضيّقة وبعضها مخصّص للمشاة. ويُغلق شارع الجمهورية الممتد على الساحل أمام السيارات في ساعات المساء. كما أن بعض الفنادق البوتيكية الصغيرة في المركز لا يمكن الوصول إليها بالسيارة حتى الباب؛ فيتم الإنزال في أقرب نقطة ويبقى مشي قصير. وحين نأخذ اسم الفندق مسبقاً يعرف السائق إلى أين يستطيع الدخول، فلا تحدث لفّات إضافية بالحقائب.",
          en: "In central Bodrum, especially around the castle and inside the bazaar, the streets are narrow and some are pedestrian only. Cumhuriyet Caddesi along the waterfront closes to traffic in the evening. A number of small boutique hotels in the centre cannot be reached by car all the way to the door; you are dropped at the nearest point and a short walk remains. With the hotel name in advance the driver knows how far in he can go, and there is no circling with luggage.",
        },
      },
      {
        heading: { tr: "Akşam varışları", ar: "الوصول المسائي", en: "Evening arrivals" },
        body: {
          tr: "Bodrum'a inen uçuşların çoğu akşam saatlerinde geliyor ve yaz aylarında havalimanı çıkışı ile yarımada yolu aynı anda yoğunlaşıyor. Bu, 40 dakikalık yolu bir saate çıkarabiliyor. Uçuş numarasını bize verdiğinizde uçuşu takip ediyoruz; rötar olursa bekleme için ek ücret çıkmıyor. Gece geç saatte varan misafirler için yolun tamamı aydınlatmalı ve rahat.",
          ar: "تصل معظم الرحلات إلى بودروم في ساعات المساء، وفي الصيف يزدحم مخرج المطار وطريق شبه الجزيرة في الوقت نفسه. وهذا قد يرفع طريق الأربعين دقيقة إلى ساعة. وحين تعطينا رقم الرحلة نتابعها؛ وإن حدث تأخير فلا رسوم إضافية على الانتظار. أما للقادمين في وقت متأخر من الليل فالطريق كامل مضاء ومريح.",
          en: "Most flights into Bodrum land in the evening, and in summer the airport exit and the peninsula road get busy at the same time. That can turn the 40-minute drive into an hour. Give us your flight number and we track the flight; if it is delayed there is no extra charge for waiting. For late-night arrivals the whole road is lit and comfortable.",
        },
      },
    ],
  },
  {
    slug: "bodrum-havalimani-turgutreis-transfer",
    airport: "BJV",
    image: "/images/places/turgutreis.jpg",
    from: { tr: "Bodrum Havalimanı (BJV)", ar: "مطار بودروم (BJV)", en: "Bodrum Airport (BJV)" },
    to: { tr: "Turgutreis", ar: "تورغوتريس", en: "Turgutreis" },
    distance: { tr: "yaklaşık 53 km", ar: "نحو 53 كم", en: "about 53 km" },
    duration: { tr: "50 dk – 1 saat 15 dk", ar: "50 دقيقة – ساعة و15 دقيقة", en: "50 min – 1 hr 15 min" },
    excerpt: {
      tr: "Yarımadayı boydan boya geçip batı ucuna: Bodrum merkezden sakin, Ege adalarına karşı ve gün batımıyla anılan taraf.",
      ar: "عبور شبه الجزيرة بالكامل إلى طرفها الغربي: أهدأ من مركز بودروم، مقابل جزر بحر إيجه، والجهة التي تُذكر بغروبها.",
      en: "Across the peninsula to its western tip: quieter than Bodrum town and known for its sunsets.",
    },
    sections: [
      {
        heading: { tr: "Yarımadayı geçmek", ar: "عبور شبه الجزيرة", en: "Crossing the peninsula" },
        body: {
          tr: "Turgutreis, havalimanına yaklaşık 53 kilometre uzaklıkta ve yarımadanın batı ucunda. Yol Bodrum merkeze kadar aynı güzergâhı izliyor, sonra merkeze girmeden batıya sapıyor ve tepeler arasından Turgutreis'e iniyor. Yarımada içindeki bu bölüm virajlı ve iniş çıkışlı; mesafe kısa görünse de süresi buna göre uzun. Normal koşullarda toplam bir saat civarında sürüyor.",
          ar: "تبعد تورغوتريس نحو 53 كيلومتراً عن المطار وتقع في الطرف الغربي لشبه الجزيرة. يتبع الطريق المسار نفسه حتى مركز بودروم، ثم ينعطف غرباً دون دخول المركز وينزل إلى تورغوتريس بين التلال. وهذا القسم داخل شبه الجزيرة متعرّج وكثير الصعود والهبوط؛ فرغم أن المسافة تبدو قصيرة إلا أن زمنها أطول بما يناسب ذلك. وتستغرق الرحلة إجمالاً نحو ساعة في الظروف العادية.",
          en: "Turgutreis is about 53 km from the airport, at the western end of the peninsula. The road follows the same route as far as Bodrum, then turns west without entering the town and drops down to Turgutreis through the hills. That stretch inside the peninsula is winding and hilly; the distance looks short but the time is longer than it suggests. In normal conditions the whole trip takes around an hour.",
        },
      },
      {
        heading: {
          tr: "Turgutreis mi, Bodrum merkez mi",
          ar: "تورغوتريس أم مركز بودروم",
          en: "Turgutreis or Bodrum centre",
        },
        body: {
          tr: "İkisi aynı yarımadada ama karakterleri farklı. Bodrum merkez gece hayatı, marina ve çarşısıyla hareketli; Turgutreis daha sakin, uzun sahili ve haftalık pazarıyla aile tatiline dönük. Batıya baktığı için gün batımı burada anılmaya değer ve akşamları sahil boyunca yürüyüş yapılıyor. Merkeze gitmek isterseniz araçla yaklaşık 20-25 dakika; yani sakinliği seçip hareketliliğe erişimi kaybetmiyorsunuz.",
          ar: "كلاهما على شبه الجزيرة نفسها لكن طابعهما مختلف. مركز بودروم حيويّ بحياته الليلية ومارينته وسوقه؛ أما تورغوتريس فأهدأ، وبشاطئها الطويل وسوقها الأسبوعي هي أقرب إلى عطلة العائلة. ولأنها تطلّ غرباً فإن غروبها يستحق الذكر، وفي المساء يتمشّى الناس على امتداد الساحل. وإن أردت الذهاب إلى المركز فهو على نحو 20-25 دقيقة بالسيارة؛ أي أنك تختار الهدوء دون أن تفقد الوصول إلى الحركة.",
          en: "Both are on the same peninsula but they feel different. Bodrum town is lively — nightlife, the marina, the bazaar. Turgutreis is quieter, with a long beach and a weekly market, and leans towards family holidays. Because it faces west the sunset is genuinely worth mentioning, and people walk the seafront in the evening. Bodrum centre is about 20–25 minutes away by car, so choosing the calm does not cost you access to the busy side.",
        },
      },
      {
        heading: { tr: "Pratik bilgiler", ar: "معلومات عملية", en: "Practical notes" },
        body: {
          tr: "Turgutreis'te bir marina ve İstanköy (Kos) adasına giden feribot iskelesi bulunuyor; adaya geçmeyi düşünüyorsanız pasaport ve vize koşullarını önceden kontrol etmek gerekiyor, bu bizim düzenlediğimiz bir hizmet değil. Yarımada içi yollar yaz akşamlarında yoğunlaşıyor ve bazı sapaklar dar; otelin ya da villanın tam konumunu önceden aldığımızda şoför doğru sapağı biliyor. Villa kiralayan misafirler için adres tarifi çoğu zaman otel adından daha önemli.",
          ar: "توجد في تورغوتريس مارينا ومرفأ عبّارات إلى جزيرة كوس؛ فإن كنت تفكّر في العبور إلى الجزيرة فينبغي التحقق مسبقاً من شروط جواز السفر والتأشيرة، وهذه ليست خدمة ننظّمها نحن. وتزدحم طرق شبه الجزيرة في أمسيات الصيف وبعض المنعطفات ضيّقة؛ وحين نأخذ الموقع الدقيق للفندق أو الفيلا مسبقاً يعرف السائق المنعطف الصحيح. وبالنسبة لمن يستأجر فيلا فإن وصف العنوان غالباً أهم من اسم الفندق.",
          en: "Turgutreis has a marina and a ferry terminal for Kos; if you are thinking of crossing to the island, check passport and visa requirements in advance — it is not a service we arrange. Roads on the peninsula get busy on summer evenings and some turnings are narrow, so with the exact position of the hotel or villa in advance the driver knows the right turn. For guests renting a villa, a description of the address usually matters more than a hotel name.",
        },
      },
    ],
  },
];

export function transferRouteBySlug(slug: string) {
  return transferRoutes.find((route) => route.slug === slug);
}

/**
 * Bir güzergâh sayfasının altında gösterilecek diğer güzergâhlar.
 *
 * Önceki hali "kendisi dışındaki hepsi" idi. Yedi güzergâh varken bu
 * yalnızca kalabalıktı; Antalya ve Bodrum eklenince yanlış oldu:
 * Antalya-Kemer sayfasının altında on iki kartın onu İstanbul'a aitti ve
 * o sayfaya gelen misafirin İstanbul-Taksim transferiyle hiçbir işi yok.
 *
 * Aynı havalimanından kalkan güzergâhlar öne alınıyor, sonrası kaydırmalı
 * olarak dolduruluyor — böylece hem ilgili olan üstte kalıyor hem de her
 * sayfa listeye farklı bir yerden başladığı için bazı güzergâhlar hiç
 * bağlantı almadan kalmıyor (rehberlerde aynı hata düzeltilmişti).
 */
export function relatedRoutes(slug: string, count = 4) {
  const current = transferRoutes.find((route) => route.slug === slug);
  if (!current) return transferRoutes.slice(0, count);

  const rest = transferRoutes.filter((route) => route.slug !== slug);
  const sameAirport = rest.filter((route) => route.airport === current.airport);
  const others = rest.filter((route) => route.airport !== current.airport);

  const offset = transferRoutes.indexOf(current);
  const rotate = <T,>(list: T[]) =>
    list.length
      ? list.slice(offset % list.length).concat(list.slice(0, offset % list.length))
      : list;

  return [...rotate(sameAirport), ...rotate(others)].slice(0, count);
}
