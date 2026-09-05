/**
 * Güzergâh sayfaları.
 *
 * Müşteri "havalimanı transferi" diye değil, "مطار اسطنبول الى تقسيم" ya da
 * "İstanbul havalimanından Sultanahmet'e" diye arıyor. Transfer sayfası bu
 * aramaların hepsini tek başına karşılayamaz.
 *
 * NEDEN 43 DEĞİL 5: `routes.ts` içinde 43 semt var ve bunların hepsi için
 * şablondan sayfa üretmek teknik olarak kolay. Üretmedik — aralarındaki tek
 * fark semt adı olan 43 sayfa ince içeriktir (thin content) ve arama
 * motorunda faydadan çok zarar getirir. Buradaki beş güzergâhın her biri
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
  /** Kalkış havalimanı kodu — kartlarda rozet olarak görünür. */
  airport: "IST" | "SAW";
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
];

export function transferRouteBySlug(slug: string) {
  return transferRoutes.find((route) => route.slug === slug);
}
