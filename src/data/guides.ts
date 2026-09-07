/**
 * Seyahat rehberleri.
 *
 * Sitenin arama motorundaki en büyük boşluğuydu: hizmet sayfaları "biz ne
 * yapıyoruz" diye yazılmış, oysa Körfez'den gelen misafir seyahatten haftalar
 * önce "مطار اسطنبول كيف اروح للفندق", "اين اسكن في اسطنبول", "سبانجا في
 * الشتاء" gibi SORULAR arıyor. Rakiplerin (seentravels) 17 rehber yazısıyla
 * tuttuğu yüzey bu.
 *
 * Metinler üç dilde burada duruyor, mesaj dosyalarında değil: bir rehber
 * eklemek üç ayrı JSON'a dokunmayı gerektirmesin diye (paketler ve
 * güzergâhlarla aynı yaklaşım).
 *
 * İçerik bilerek genel seyahat bilgisi: mesafeler, mevsimler, semtler.
 * Fiyat ve süre taahhüdü YOK — rehber metninde verilen bir rakam, hizmet
 * sayfasındaki sabit fiyat sözünün denetlenmediği bir yer olur.
 */

type Text = { tr: string; ar: string; en: string };

export interface GuideSection {
  heading: Text;
  body: Text;
  /** Bölümün altına giren görsel — her bölümde olmak zorunda değil. */
  image?: string;
  imageAlt?: Text;
}

/**
 * Yazının başındaki hızlı bilgi kutusu.
 *
 * Rehberi okumaya vakti olmayan kişi (çoğu ziyaretçi) mesafeyi, süreyi ve
 * mevsimi burada tek bakışta alıyor. Yalnız doğrulanabilir bilgiler:
 * fiyat ve taahhüt buraya girmiyor.
 */
export interface GuideFact {
  label: Text;
  value: Text;
}

/**
 * Yazının sonundaki soru-cevap.
 *
 * Rehberler sitenin en ince sayfalarıydı: üç bölüm, ~700 karakter Arapça
 * gövde. Oysa Körfez'den gelen misafirin aradığı şey tam olarak bu biçimde
 * yazılıyor — "كم تبعد مطار اسطنبول عن المركز". Buradaki üç soru yazının
 * kendi konusundan çıkar ve /sss listesindeki genel sorularla çakışmaz;
 * sayfaya FAQPage şeması da bu yüzden konabiliyor.
 */
export interface GuideFaq {
  question: Text;
  answer: Text;
}

export interface Guide {
  slug: string;
  image: string;
  /** Okuma süresi (dakika) — listede gösterilir. */
  minutes: number;
  title: Text;
  excerpt: Text;
  facts: GuideFact[];
  sections: GuideSection[];
  faq: GuideFaq[];
}

export const guides: Guide[] = [
  {
    slug: "istanbul-havalimanindan-sehre-ulasim",
    image: "/images/places/havalimani.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul Havalimanı'ndan şehre nasıl gidilir?",
      ar: "كيف تصل من مطار إسطنبول إلى المدينة؟",
      en: "How to get from Istanbul Airport into the city",
    },
    excerpt: {
      tr: "Mesafe, süre, seçenekler ve bagajlı bir aileyle hangisinin gerçekten işe yaradığı.",
      ar: "المسافة والوقت والخيارات المتاحة، وأيّها يناسب فعلاً عائلة مع حقائب.",
      en: "Distance, travel time, the options — and which one actually works with luggage and family.",
    },
    facts: [
      {
        label: { tr: "Mesafe", ar: "المسافة", en: "Distance" },
        value: { tr: "Merkeze 45–50 km", ar: "45–50 كم إلى المركز", en: "45–50 km to the centre" },
      },
      {
        label: { tr: "Yolculuk süresi", ar: "مدة الرحلة", en: "Travel time" },
        value: { tr: "Trafiğe göre 45 dk – 2 saat", ar: "45 دقيقة – ساعتان حسب الازدحام", en: "45 min – 2 hrs with traffic" },
      },
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "İstanbul Havalimanı (IST)", ar: "مطار إسطنبول (IST)", en: "Istanbul Airport (IST)" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul Havalimanı şehir merkezine kaç kilometre?", ar: "كم تبعد مطار إسطنبول عن مركز المدينة؟", en: "How far is Istanbul Airport from the city centre?" },
        answer: {
          tr: "Merkeze 45–50 kilometre. Yolculuk trafiğe göre 45 dakika ile 2 saat arasında değişir; sabah ve akşam saatlerinde üst sınıra yaklaşır. Havalimanı şehrin kuzeybatısında, Karadeniz kıyısına yakın konumda — haritada göründüğünden daha uzak bir yolculuk.",
          ar: "يبعد المطار نحو 45 إلى 50 كيلومتراً عن المركز. وتستغرق الرحلة بين 45 دقيقة وساعتين بحسب حركة المرور، وتقترب من الحد الأعلى في ساعات الصباح والمساء. يقع المطار شمال غرب المدينة قرب ساحل البحر الأسود، والرحلة أطول مما تبدو على الخريطة.",
          en: "It is 45–50 km from the centre. The journey takes between 45 minutes and 2 hours depending on traffic, reaching the upper end during morning and evening peaks. The airport sits northwest of the city near the Black Sea coast — a longer trip than the map suggests.",
        },
      },
      {
        question: { tr: "Havalimanından metro ile şehre gidilebilir mi?", ar: "هل يمكن الوصول إلى المدينة من المطار بالمترو؟", en: "Can you reach the city from the airport by metro?" },
        answer: {
          tr: "Evet, metro hattı havalimanını şehre bağlar, ancak kalmak istediğiniz semte varmak için genelde bir ya da iki aktarma gerekir. Tek başına hafif bagajla seyahat eden biri için işe yarar; iki büyük valiz ve çocukla aktarmalı yolculuk yorucu olur.",
          ar: "نعم، هناك خط مترو يربط المطار بالمدينة، لكن الوصول إلى الحي الذي تنوي الإقامة فيه يتطلب عادة تبديلاً أو تبديلين. الخيار مناسب لمن يسافر وحده بأمتعة خفيفة؛ أما مع حقيبتين كبيرتين وأطفال فالتنقل بين الخطوط متعب.",
          en: "Yes, a metro line connects the airport to the city, but reaching the district you are staying in usually means one or two changes. It works if you travel alone with light luggage; with two large suitcases and children, changing lines is exhausting.",
        },
      },
      {
        question: { tr: "Gece geç saatte inen uçakta havalimanından nasıl çıkılır?", ar: "كيف أغادر المطار إذا هبطت رحلتي في وقت متأخر من الليل؟", en: "How do you leave the airport on a late-night arrival?" },
        answer: {
          tr: "Gece saatlerinde toplu taşıma sefer aralıkları açılır ve son metro saatini kaçırma riski doğar. Bu yüzden gece inen uçuşlarda önceden ayarlanmış özel transfer en az sürprizli seçenek: şoför uçuş saatinize göre gelir, ne kuyruk ne pazarlık olur.",
          ar: "في ساعات الليل تتباعد مواعيد النقل العام ويزداد احتمال أن تفوتك آخر رحلة مترو. لذلك يبقى النقل الخاص المحجوز مسبقاً الخيار الأقل مفاجآت في الرحلات الليلية: يأتي السائق حسب موعد هبوطك، فلا طابور ولا مساومة.",
          en: "Late at night public transport runs less frequently and you risk missing the last metro. For night arrivals a pre-arranged private transfer is the option with the fewest surprises: the driver comes to match your landing time, with no queue and no haggling.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Havalimanı şehre uzak",
          ar: "المطار بعيد عن المدينة",
          en: "The airport is far from the city",
        },
        body: {
          tr: "İstanbul Havalimanı (IST) şehrin kuzeybatısında, Avrupa yakasının ucunda. Sultanahmet ve Taksim gibi merkezî bölgelere yaklaşık 45–50 kilometre mesafede. Trafiğe göre yolculuk bir saatin altında da kalabilir, iki saati de bulabilir; akşam saatlerinde şehre giriş belirgin şekilde yavaşlar.",
          ar: "يقع مطار إسطنبول (IST) في الشمال الغربي من المدينة، عند طرف الجانب الأوروبي. المسافة إلى المناطق المركزية مثل السلطان أحمد وتقسيم نحو 45–50 كيلومتراً. حسب الازدحام قد تستغرق الرحلة أقل من ساعة وقد تصل إلى ساعتين؛ الدخول إلى المدينة يبطؤ بوضوح في ساعات المساء.",
          en: "Istanbul Airport (IST) sits at the north-western edge of the European side. Central districts such as Sultanahmet and Taksim are roughly 45–50 km away. Depending on traffic the drive can take under an hour or stretch to two; entering the city slows noticeably in the evening.",
        },
      },
      {
        heading: {
          tr: "Seçenekler ve bagaj gerçeği",
          ar: "الخيارات وواقع الحقائب",
          en: "The options, and the luggage reality",
        },
        body: {
          tr: "Metro (M11) havalimanını şehir hattına bağlar ve ucuzdur, ancak merkeze varmak için aktarma gerekir. Havaş otobüsleri belirli duraklara iner, otelinizin kapısına değil. Ticari taksi mevcut olsa da bagaj sayısı ve kişi sayısı arttığında iki araç gerekebilir. Dört kişilik bir aile, dört valiz ve bir bebek arabasıyla geldiğinde pratikte tek gerçekçi seçenek özel araçtır.",
          ar: "يربط المترو (M11) المطار بشبكة المدينة وهو خيار رخيص، لكنه يتطلب تبديل خطوط للوصول إلى المركز. حافلات هافاش تتوقف عند محطات محددة، لا عند باب الفندق. سيارات الأجرة متاحة، لكن مع زيادة عدد الأفراد والحقائب قد تحتاج إلى سيارتين. عائلة من أربعة أفراد بأربع حقائب وعربة أطفال لن تجد عملياً سوى خيار السيارة الخاصة.",
          en: "The metro (M11) links the airport to the city network and is cheap, but reaching the centre needs a change. Havaş buses stop at fixed points, not at your hotel door. Taxis exist, but as passengers and suitcases add up you may need two cars. For a family of four with four suitcases and a pushchair, a private vehicle is in practice the only workable option.",
        },
        image: "/images/vito-black.jpg",
        imageAlt: {
          tr: "Havalimanı transferinde kullanılan Mercedes Vito",
          ar: "سيارة مرسيدس فيتو المستخدمة في النقل من المطار",
          en: "The Mercedes Vito used for airport transfers",
        },
      },
      {
        heading: {
          tr: "Uçuş gecikirse ne olur",
          ar: "ماذا لو تأخرت الرحلة",
          en: "What happens if your flight is late",
        },
        body: {
          tr: "Gecikme bu yolculuğun en sık yaşanan sorunudur ve önceden ayarlanan bir transferde çözümü basittir: uçuş numarası verildiğinde şoför iniş saatine göre gelir. Bagajınız gecikirse ya da pasaport kuyruğu uzarsa bekleme süresi için ek ücret çıkmaması, rezervasyondan önce netleştirmeniz gereken tek şeydir.",
          ar: "التأخير هو أكثر ما يحدث في هذه الرحلة، وحلّه بسيط عند حجز النقل مسبقاً: بإعطاء رقم الرحلة يأتي السائق حسب وقت الهبوط الفعلي. أما إذا تأخرت حقائبك أو طال طابور الجوازات، فالنقطة الوحيدة التي يجب توضيحها قبل الحجز هي ألّا تُحتسب رسوم إضافية على الانتظار.",
          en: "Delays are the most common problem on this leg, and with a pre-booked transfer the fix is simple: give your flight number and the driver arrives for the actual landing time. If your bags are slow or passport control is long, the one thing to confirm before booking is that waiting time carries no extra charge.",
        },
      },
    ],
  },
  {
    slug: "sabiha-gokcenden-istanbula-ulasim",
    image: "/images/chauffeur.jpg",
    minutes: 3,
    title: {
      tr: "Sabiha Gökçen'den İstanbul'a ulaşım",
      ar: "الوصول من مطار صبيحة كوكجن إلى إسطنبول",
      en: "Getting from Sabiha Gokcen to Istanbul",
    },
    excerpt: {
      tr: "Anadolu yakasındaki havalimanından Avrupa yakasına geçmek neden ayrı bir plan ister.",
      ar: "لماذا يحتاج الانتقال من المطار الآسيوي إلى الجانب الأوروبي خطة مختلفة.",
      en: "Why crossing from the Asian-side airport to the European side needs its own plan.",
    },
    facts: [
      {
        label: { tr: "Yaka", ar: "الجانب", en: "Side" },
        value: { tr: "Anadolu yakası, Pendik", ar: "الجانب الآسيوي، بنديك", en: "Asian side, Pendik" },
      },
      {
        label: { tr: "Avrupa yakasına", ar: "إلى الجانب الأوروبي", en: "To the European side" },
        value: { tr: "Boğaz geçişi gerekir", ar: "يلزم عبور البوسفور", en: "Requires a Bosphorus crossing" },
      },
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "Sabiha Gökçen (SAW)", ar: "صبيحة كوكجن (SAW)", en: "Sabiha Gokcen (SAW)" },
      },
    ],
    faq: [
      {
        question: { tr: "Sabiha Gökçen'den Avrupa yakasına yolculuk ne kadar sürer?", ar: "كم تستغرق الرحلة من صبيحة كوكجن إلى الجانب الأوروبي؟", en: "How long does it take from Sabiha Gökçen to the European side?" },
        answer: {
          tr: "Trafiğe göre 60–90 dakika. Havalimanı Anadolu yakasında, Pendik'te bulunur; Taksim ya da Sultanahmet'e gitmek için Boğaz'ı köprüden geçmek gerekir. Akşam saatlerinde köprü trafiği bu süreyi belirgin biçimde uzatabilir.",
          ar: "بين 60 و90 دقيقة بحسب حركة المرور. يقع المطار في الجانب الآسيوي بمنطقة بنديك، والوصول إلى تقسيم أو السلطان أحمد يستلزم عبور البوسفور من فوق الجسر. وفي ساعات المساء قد يطيل ازدحام الجسر هذه المدة بوضوح.",
          en: "60–90 minutes depending on traffic. The airport is on the Asian side at Pendik, and reaching Taksim or Sultanahmet means crossing the Bosphorus by bridge. Evening bridge traffic can stretch that noticeably.",
        },
      },
      {
        question: { tr: "Sabiha Gökçen mi İstanbul Havalimanı mı daha uygun?", ar: "أيهما أنسب: صبيحة كوكجن أم مطار إسطنبول؟", en: "Which is better, Sabiha Gökçen or Istanbul Airport?" },
        answer: {
          tr: "Nerede kalacağınıza bağlı. Kadıköy, Üsküdar ya da Anadolu yakasında konaklayacaksanız Sabiha Gökçen belirgin biçimde daha yakın. Sultanahmet, Taksim ve Şişli için İstanbul Havalimanı daha mantıklı — bilet fiyatı arasındaki fark, kazandığınız yol süresinden küçük kalabilir.",
          ar: "يعتمد ذلك على مكان إقامتك. إذا كنت ستقيم في كاديكوي أو أسكودار أو الجانب الآسيوي عموماً فصبيحة كوكجن أقرب بوضوح. أما للسلطان أحمد وتقسيم وشيشلي فمطار إسطنبول أنسب — وقد يكون فارق سعر التذكرة أقل من قيمة الوقت الذي توفره.",
          en: "It depends where you are staying. For Kadıköy, Üsküdar or anywhere on the Asian side, Sabiha Gökçen is clearly closer. For Sultanahmet, Taksim and Şişli, Istanbul Airport makes more sense — the fare difference can be smaller than the travel time you save.",
        },
      },
      {
        question: { tr: "Sabiha Gökçen'de karşılama nerede oluyor?", ar: "أين يتم الاستقبال في مطار صبيحة كوكجن؟", en: "Where does the meet-and-greet happen at Sabiha Gökçen?" },
        answer: {
          tr: "Geliş salonu İstanbul Havalimanı'na göre çok daha küçüktür ve tek çıkış noktası vardır; şoförle buluşmak burada karışmaz. Bagajınızı aldıktan sonra çıktığınız kapının hemen önünde isminizin yazılı olduğu tabelayla beklenir.",
          ar: "صالة الوصول أصغر بكثير من نظيرتها في مطار إسطنبول، ولها نقطة خروج واحدة، فلا يحدث التباس في لقاء السائق. ينتظرك أمام الباب الذي تخرج منه مباشرة بعد استلام أمتعتك حاملاً لافتة تحمل اسمك.",
          en: "The arrivals hall is far smaller than at Istanbul Airport and has a single exit, so meeting your driver is straightforward. You are met right outside the door you come through after baggage claim, with a board bearing your name.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İki havalimanı, iki farklı yolculuk",
          ar: "مطاران، رحلتان مختلفتان",
          en: "Two airports, two different journeys",
        },
        body: {
          tr: "Sabiha Gökçen (SAW) Anadolu yakasında, Pendik yakınlarındadır. Kadıköy ve Ataşehir gibi Anadolu yakası bölgelerine yakınlığı büyük avantajdır. Ancak oteliniz Sultanahmet, Taksim ya da Beşiktaş'taysa Boğaz'ı geçmeniz gerekir; bu, mesafeyi ve trafiğe bağlı süreyi belirgin biçimde artırır.",
          ar: "يقع مطار صبيحة كوكجن (SAW) في الجانب الآسيوي قرب بنديك، وقربه من مناطق مثل كاديكوي وآتاشهير ميزة كبيرة. لكن إذا كان فندقك في السلطان أحمد أو تقسيم أو بشكتاش فعليك عبور البوسفور، وهذا يزيد المسافة والوقت بوضوح حسب الازدحام.",
          en: "Sabiha Gokcen (SAW) is on the Asian side near Pendik, which is a real advantage for districts like Kadikoy and Atasehir. But if your hotel is in Sultanahmet, Taksim or Besiktas you have to cross the Bosphorus, and that lengthens both distance and traffic-dependent travel time.",
        },
      },
      {
        heading: {
          tr: "Gece inen uçuşlar",
          ar: "الرحلات التي تصل ليلاً",
          en: "Late-night arrivals",
        },
        body: {
          tr: "Sabiha Gökçen'e gelen tarifelerin önemli bir kısmı gece geç saatte iner. Toplu taşımanın seyrekleştiği bu saatlerde, özellikle çocuklu bir aileyle, önceden ayarlanmış bir karşılama yolculuğun en rahat kısmına dönüşür. Şoförün adının ve plakanın önceden elinize ulaşması, gece yarısı tanımadığınız bir şehirde beklerken en çok işe yarayan ayrıntıdır.",
          ar: "كثير من الرحلات إلى صبيحة كوكجن تهبط في ساعة متأخرة من الليل. في هذه الساعات تقلّ وسائل النقل العام، وعندها يصبح الاستقبال المحجوز مسبقاً أريح جزء في الرحلة، خصوصاً مع الأطفال. ووصول اسم السائق ورقم اللوحة إليك قبل السفر هو التفصيل الأنفع وأنت تنتظر منتصف الليل في مدينة لا تعرفها.",
          en: "A large share of flights into Sabiha Gokcen land late at night, when public transport thins out. With children in tow, a pre-arranged pickup becomes the easiest part of the trip. Getting the driver's name and plate number in advance is the detail that helps most while waiting at midnight in an unfamiliar city.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-nerede-kalinir",
    image: "/images/places/sultanahmet.jpg",
    minutes: 5,
    title: {
      tr: "İstanbul'da nerede kalınır? Semt semt rehber",
      ar: "أين تسكن في إسطنبول؟ دليل حسب المناطق",
      en: "Where to stay in Istanbul: a district guide",
    },
    excerpt: {
      tr: "Sultanahmet mi Taksim mi, Boğaz manzarası mı merkeze yakınlık mı — aileye göre karar.",
      ar: "السلطان أحمد أم تقسيم، إطلالة البوسفور أم القرب من المركز — القرار بحسب العائلة.",
      en: "Sultanahmet or Taksim, a Bosphorus view or a central base — deciding by what your family needs.",
    },
    facts: [
      {
        label: { tr: "Tarih için", ar: "للتاريخ", en: "For history" },
        value: { tr: "Sultanahmet", ar: "السلطان أحمد", en: "Sultanahmet" },
      },
      {
        label: { tr: "Merkez ve metro için", ar: "للمركز والمترو", en: "For centre and metro" },
        value: { tr: "Taksim, Şişli", ar: "تقسيم، شيشلي", en: "Taksim, Sisli" },
      },
      {
        label: { tr: "Manzara için", ar: "للإطلالة", en: "For the view" },
        value: { tr: "Ortaköy, Beşiktaş, Üsküdar", ar: "أورتاكوي، بشكتاش، أسكودار", en: "Ortakoy, Besiktas, Uskudar" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul'a ilk kez gelen biri hangi semtte kalmalı?", ar: "في أي حي يُفضّل أن يقيم زائر إسطنبول لأول مرة؟", en: "Which district should a first-time visitor stay in?" },
        answer: {
          tr: "İlk ziyarette çoğu misafir için Sultanahmet ya da Taksim doğru seçim. Sultanahmet'te ana tarihî yapılar yürüme mesafesinde; Taksim daha merkezi, metroya yakın ve akşamları hareketli. Üçüncü kez gelen biri Boğaz kıyısını tercih edebilir, ama ilk seferde ulaşım kolaylığı manzaradan önde gelir.",
          ar: "في الزيارة الأولى يناسب معظم الضيوف السلطان أحمد أو تقسيم. ففي السلطان أحمد تقع المعالم التاريخية الكبرى على مسافة مشي، وتقسيم أكثر مركزية وقرباً من المترو وأكثر حيوية في المساء. أما زائر المرة الثالثة فقد يفضّل ساحل البوسفور، لكن سهولة التنقل تتقدم على المنظر في الزيارة الأولى.",
          en: "For a first visit, Sultanahmet or Taksim suits most guests. In Sultanahmet the major historic sites are within walking distance; Taksim is more central, close to the metro and lively in the evening. A third-time visitor might prefer the Bosphorus shore, but on a first trip ease of movement beats the view.",
        },
      },
      {
        question: { tr: "Sultanahmet mi Taksim mi daha iyi?", ar: "أيهما أفضل: السلطان أحمد أم تقسيم؟", en: "Sultanahmet or Taksim — which is better?" },
        answer: {
          tr: "İkisi farklı şeyler sunar. Sultanahmet gündüz tarihin içindedir ama akşamüstü sakinleşir ve seçenekler azalır. Taksim gece geç saate kadar canlıdır, restoran ve mağaza çeşidi fazladır, ama tarihî yarımadaya her gün ulaşım gerekir. Sessizlik isteyen aileler Sultanahmet'te, hareket isteyenler Taksim'de daha memnun kalıyor.",
          ar: "كل منهما يقدّم شيئاً مختلفاً. السلطان أحمد يضعك داخل التاريخ نهاراً لكنه يهدأ بعد العصر وتقلّ الخيارات فيه. أما تقسيم فينبض بالحياة حتى وقت متأخر وتتنوع فيه المطاعم والمتاجر، لكنك ستحتاج إلى التنقل يومياً نحو شبه الجزيرة التاريخية. العائلات التي تبحث عن الهدوء ترتاح في السلطان أحمد، ومن يبحث عن الحركة يرتاح في تقسيم.",
          en: "They offer different things. Sultanahmet puts you inside the history by day but quietens down in the evening, with fewer options. Taksim stays lively until late with more restaurants and shops, but you will travel to the historic peninsula every day. Families wanting quiet prefer Sultanahmet; those wanting activity prefer Taksim.",
        },
      },
      {
        question: { tr: "Boğaz manzaralı otel gerçekten fark yaratır mı?", ar: "هل يستحق الفندق المطل على البوسفور فارق السعر؟", en: "Is a Bosphorus-view hotel really worth it?" },
        answer: {
          tr: "Ortaköy, Beşiktaş ve Üsküdar kıyısında manzara gerçekten etkileyicidir ve akşamları sahil boyunca yürüyüş yapılabilir. Karşılığında tarihî yarımadaya her gidiş geliş yol demektir. Kısa ziyaretlerde merkezde kalıp Boğaz'ı tekneden görmek, uzun ziyaretlerde kıyıda kalmak daha iyi sonuç veriyor.",
          ar: "على سواحل أورتاكوي وبشيكتاش وأسكودار يكون المنظر مذهلاً بالفعل، ويمكنك التنزه على الكورنيش مساءً. لكن ثمن ذلك أن كل ذهاب وإياب إلى شبه الجزيرة التاريخية يعني طريقاً إضافياً. في الزيارات القصيرة يكون البقاء في المركز ورؤية البوسفور من القارب أفضل، وفي الزيارات الطويلة يكون السكن على الساحل أنسب.",
          en: "Along the Ortaköy, Beşiktaş and Üsküdar shore the view is genuinely striking, and you can walk the waterfront in the evening. The trade-off is that every trip to the historic peninsula becomes a journey. On short visits, stay central and see the Bosphorus from a boat; on longer ones, the shore pays off.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Sultanahmet — tarihin içinde",
          ar: "السلطان أحمد — في قلب التاريخ",
          en: "Sultanahmet: inside the history",
        },
        body: {
          tr: "Sultanahmet Camii, Ayasofya, Topkapı Sarayı ve Yerebatan Sarnıcı yürüme mesafesindedir. Tarihî yarımadada kalmak, sabah kalabalık toplanmadan bu noktalara ulaşmanızı sağlar. Bölge akşamları sakinleşir; hareketli bir gece hayatı arayanlar için değil, erken kalkıp gezmek isteyen aileler için uygundur.",
          ar: "جامع السلطان أحمد وآيا صوفيا وقصر توبكابي وصهريج البازيليك جميعها على مسافة سير. السكن في شبه الجزيرة التاريخية يتيح لك الوصول إلى هذه المعالم صباحاً قبل تجمّع الزحام. المنطقة تهدأ مساءً؛ فهي ليست لمن يبحث عن حياة ليلية، بل للعائلات التي تفضّل الاستيقاظ مبكراً والتجوّل.",
          en: "The Blue Mosque, Hagia Sophia, Topkapi Palace and the Basilica Cistern are all within walking distance. Staying on the historic peninsula lets you reach them early, before the crowds gather. The area quietens in the evening: it suits families who rise early to sightsee rather than anyone after nightlife.",
        },
      },
      {
        heading: {
          tr: "Taksim ve Şişli — merkeze ve metroya yakın",
          ar: "تقسيم وشيشلي — قرب المركز والمترو",
          en: "Taksim and Sisli: central and on the metro",
        },
        body: {
          tr: "Taksim, İstiklal Caddesi'ne ve metro hatlarına yakınlığıyla şehrin ulaşım kalbidir. Şişli tarafı alışveriş merkezlerine ve hastanelere yakın olduğu için Körfez'den gelen misafirlerin sık tercih ettiği bölgedir. Restoran çeşitliliği ve geç saate kadar açık işletmeler bu iki bölgede tarihî yarımadaya göre çok daha fazladır.",
          ar: "تقسيم هي قلب المواصلات في المدينة بقربها من شارع الاستقلال وخطوط المترو. أما جهة شيشلي فيفضّلها كثير من ضيوف الخليج لقربها من المولات والمستشفيات. تنوّع المطاعم والمحلات المفتوحة حتى وقت متأخر أكبر بكثير في هاتين المنطقتين مقارنة بشبه الجزيرة التاريخية.",
          en: "Taksim is the city's transport heart, close to Istiklal Street and the metro lines. Sisli is a frequent choice for Gulf visitors thanks to its malls and hospitals. Both offer far more restaurants and late-opening businesses than the historic peninsula.",
        },
      },
      {
        heading: {
          tr: "Boğaz kıyısı — Ortaköy, Beşiktaş, Üsküdar",
          ar: "ضفاف البوسفور — أورتاكوي وبشكتاش وأسكودار",
          en: "The Bosphorus shore: Ortakoy, Besiktas, Uskudar",
        },
        body: {
          tr: "Boğaz manzarası, İstanbul'da fiyatı en çok değiştiren tek unsurdur. Ortaköy ve Beşiktaş Avrupa yakasında, Üsküdar karşı kıyıdadır ve Kız Kulesi manzarasını verir. Manzaralı oda ile manzarasız oda arasındaki farkın sadece pencereden ibaret olmadığını bilin: bu bölgeler merkeze yakın ama tarihî noktalara yürüme mesafesinde değildir.",
          ar: "إطلالة البوسفور هي العامل الأكثر تأثيراً في السعر داخل إسطنبول. أورتاكوي وبشكتاش على الجانب الأوروبي، وأسكودار على الضفة المقابلة وتمنحك إطلالة على برج الفتاة. تذكّر أن الفرق بين غرفة بإطلالة وأخرى بدونها ليس في النافذة فقط: هذه المناطق قريبة من المركز لكنها ليست على مسافة سير من المعالم التاريخية.",
          en: "A Bosphorus view is the single biggest price lever in Istanbul. Ortakoy and Besiktas sit on the European shore; Uskudar faces them and looks across at the Maiden's Tower. Note that the difference between a view room and an ordinary one is not only the window: these districts are central but not walking distance from the historic sights.",
        },
        image: "/images/places/bogaz-kopru.jpg",
        imageAlt: {
          tr: "Boğaz Köprüsü ve kıyı semtleri",
          ar: "جسر البوسفور والأحياء الساحلية",
          en: "The Bosphorus Bridge and the shore districts",
        },
      },
    ],
  },
  {
    slug: "sapanca-masukiye-rehberi",
    image: "/images/tours/sapanca.jpg",
    minutes: 4,
    title: {
      tr: "Sapanca ve Maşukiye rehberi",
      ar: "دليل سبانجا ومعشوقية",
      en: "A guide to Sapanca and Masukiye",
    },
    excerpt: {
      tr: "İstanbul'a en yakın yeşil kaçış: göl, şelaleler ve çocuklu aileler için sakin bir gün.",
      ar: "أقرب متنفّس أخضر إلى إسطنبول: بحيرة وشلالات ويوم هادئ يناسب العائلات مع الأطفال.",
      en: "The closest green escape to Istanbul: a lake, waterfalls and a calm day for families.",
    },
    facts: [
      {
        label: { tr: "Mesafe", ar: "المسافة", en: "Distance" },
        value: { tr: "İstanbul'a 130 km", ar: "130 كم من إسطنبول", en: "130 km from Istanbul" },
      },
      {
        label: { tr: "Program", ar: "البرنامج", en: "Programme" },
        value: { tr: "Günübirlik", ar: "زيارة يوم واحد", en: "A single day" },
      },
      {
        label: { tr: "En iyi mevsim", ar: "أفضل موسم", en: "Best season" },
        value: { tr: "İlkbahar ve sonbahar", ar: "الربيع والخريف", en: "Spring and autumn" },
      },
    ],
    faq: [
      {
        question: { tr: "Sapanca İstanbul'dan kaç kilometre, günübirlik gidilir mi?", ar: "كم تبعد سبانجا عن إسطنبول وهل تصلح لرحلة يوم واحد؟", en: "How far is Sapanca from Istanbul, and can you do it in a day?" },
        answer: {
          tr: "İstanbul'a yaklaşık 130 kilometre; günübirlik program için uygun bir mesafe. Sabah çıkıp akşam dönmek rahatça mümkün, yol tek yön iki saat civarında sürer. Göl kenarında birkaç saat, Maşukiye tarafında öğle yemeği ve şelale yürüyüşü tipik bir gün planıdır.",
          ar: "تبعد نحو 130 كيلومتراً عن إسطنبول، وهي مسافة مناسبة لبرنامج يوم واحد. يمكنك الخروج صباحاً والعودة مساءً بأريحية، والطريق يستغرق نحو ساعتين في الاتجاه الواحد. وتتألف خطة اليوم عادةً من ساعات على ضفة البحيرة، وغداء في جهة ماشوكية، ونزهة عند الشلال.",
          en: "About 130 km from Istanbul — a comfortable distance for a day trip. Leaving in the morning and returning in the evening works easily, with roughly two hours each way. A typical day is a few hours by the lake, lunch on the Maşukiye side and a walk to the waterfalls.",
        },
      },
      {
        question: { tr: "Sapanca'ya hangi mevsimde gitmeli?", ar: "ما أفضل موسم لزيارة سبانجا؟", en: "What is the best season for Sapanca?" },
        answer: {
          tr: "İlkbahar ve sonbahar en dengeli dönem: yeşil yerinde, hava serin ve kalabalık makul. Yaz aylarında İstanbul'un nemli sıcağından kaçmak için tercih edilir. Kışın göl ve orman sisli bir görüntü alır, ama şelale yürüyüşü için yollar ıslak ve kaygan olabilir.",
          ar: "الربيع والخريف هما الأكثر اعتدالاً: الخضرة في أبهى حالاتها والجو منعش والزحام معقول. وفي الصيف يقصدها الناس هرباً من رطوبة إسطنبول وحرّها. أما في الشتاء فتكتسي البحيرة والغابة بالضباب، لكن مسارات الشلال قد تكون مبللة وزلقة.",
          en: "Spring and autumn are the most balanced: the greenery is at its best, the air is cool and the crowds are manageable. In summer people come to escape Istanbul's humid heat. In winter the lake and forest turn misty, but the paths to the waterfalls can be wet and slippery.",
        },
      },
      {
        question: { tr: "Maşukiye ile Sapanca aynı yer mi?", ar: "هل ماشوكية وسبانجا المكان نفسه؟", en: "Are Maşukiye and Sapanca the same place?" },
        answer: {
          tr: "Hayır, ikisi ayrı yerler ama aynı gün içinde birlikte gezilir. Sapanca göl kıyısındaki ilçedir; Maşukiye ise Kartepe eteğinde, göle yakın bir köydür ve şelaleleri, alabalık lokantalarıyla bilinir. Çoğu program ikisini tek günde birleştirir.",
          ar: "لا، هما موضعان مختلفان لكن يُزاران معاً في اليوم نفسه. سبانجا بلدة على ضفة البحيرة، أما ماشوكية فقرية عند سفح كارتبه قريبة من البحيرة، تشتهر بشلالاتها ومطاعم سمك السلمون المرقط. ومعظم البرامج تجمع بينهما في يوم واحد.",
          en: "No, they are two different places, but they are visited together on the same day. Sapanca is the lakeside town; Maşukiye is a village at the foot of Kartepe near the lake, known for its waterfalls and trout restaurants. Most programmes combine both in one day.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Ne kadar uzak, ne zaman gidilir",
          ar: "كم تبعد ومتى تُزار",
          en: "How far, and when to go",
        },
        body: {
          tr: "Sapanca, İstanbul'un doğusunda, Sakarya sınırları içindedir ve şehirden yaklaşık 130 kilometre uzaklıktadır. Günübirlik gidilebilecek mesafede olması en büyük avantajıdır. İlkbahar ve sonbahar bölgenin en güzel halidir; yaz aylarında serinliği, kışın ise kar manzarası için tercih edilir.",
          ar: "تقع سبانجا شرق إسطنبول ضمن حدود سكاريا، وتبعد نحو 130 كيلومتراً عن المدينة. أكبر ميزاتها أنها على مسافة تسمح بزيارة اليوم الواحد. الربيع والخريف أجمل مواسمها؛ وتُقصد صيفاً لبرودتها وشتاءً لمناظر الثلج.",
          en: "Sapanca lies east of Istanbul inside Sakarya province, about 130 km from the city. Its great advantage is being close enough for a day trip. Spring and autumn show the area at its best; people come in summer for the cooler air and in winter for the snow.",
        },
      },
      {
        heading: {
          tr: "Göl, şelaleler ve alabalık",
          ar: "البحيرة والشلالات وسمك السلمون المرقّط",
          en: "The lake, the waterfalls and the trout",
        },
        body: {
          tr: "Sapanca Gölü kıyısında yürüyüş yolları ve çay bahçeleri vardır. Maşukiye, ormanın içindeki şelaleleri ve dere üstüne kurulmuş alabalık restoranlarıyla bilinir. Kartepe'ye çıkıldığında gölü yukarıdan gören manzara noktasına ulaşılır; hava açıksa günün en iyi fotoğrafı oradan çıkar.",
          ar: "على ضفاف بحيرة سبانجا مسارات للمشي وحدائق شاي. أما معشوقية فمعروفة بشلالاتها داخل الغابة ومطاعم السلمون المرقّط المقامة فوق مجرى النهر. وبالصعود إلى كارتبه تصل إلى نقطة إطلالة تطلّ على البحيرة من الأعلى؛ وإذا كان الجو صافياً فمن هناك تُلتقط أجمل صورة في اليوم.",
          en: "There are walking paths and tea gardens along the shore of Lake Sapanca. Masukiye is known for its forest waterfalls and trout restaurants built over the stream. Driving up to Kartepe brings you to a viewpoint above the lake; on a clear day it produces the best photograph of the trip.",
        },
        image: "/images/tours/sapanca.jpg",
        imageAlt: {
          tr: "Sapanca Gölü kıyısı",
          ar: "ضفة بحيرة سبانجا",
          en: "The shore of Lake Sapanca",
        },
      },
      {
        heading: {
          tr: "Çocuklu aileler için not",
          ar: "ملاحظة للعائلات مع أطفال",
          en: "A note for families with children",
        },
        body: {
          tr: "Sapanca programı, İstanbul turlarına göre çok daha az yürüyüş içerir ve tempo sakindir. Yol boyunca durulacak noktalar esnektir; çocuklar yorulduğunda program kısaltılabilir. Bölgede yürüyüş yollarının bir kısmı toprak ve eğimlidir, bebek arabası her yerde rahat gitmez.",
          ar: "برنامج سبانجا يتضمّن مشياً أقل بكثير من جولات إسطنبول وإيقاعه هادئ. نقاط التوقف على الطريق مرنة، ويمكن اختصار البرنامج عند تعب الأطفال. لكن بعض مسارات المشي ترابية ومائلة، وعربة الأطفال لا تسير بسهولة في كل مكان.",
          en: "A Sapanca day involves far less walking than an Istanbul tour and moves at a gentle pace. Stops along the way are flexible and the programme can be shortened when children tire. Some paths are unpaved and sloping, so a pushchair will not roll easily everywhere.",
        },
      },
    ],
  },
  {
    slug: "trabzon-uzungol-karadeniz",
    image: "/images/places/uzungol.jpg",
    minutes: 5,
    title: {
      tr: "Trabzon, Uzungöl ve Karadeniz yaylaları",
      ar: "طرابزون وأوزنجول وهضاب البحر الأسود",
      en: "Trabzon, Uzungol and the Black Sea plateaus",
    },
    excerpt: {
      tr: "Yeşilin ve sisin bölgesi: neyi kaç günde görürsünüz, hangi mevsim ne getirir.",
      ar: "منطقة الخضرة والضباب: كم يوماً تحتاج لرؤية ماذا، وما الذي يجلبه كل موسم.",
      en: "The land of green and mist: what you can see in how many days, and what each season brings.",
    },
    facts: [
      {
        label: { tr: "Ulaşım", ar: "الوصول", en: "Getting there" },
        value: { tr: "Uçakla", ar: "جواً", en: "By air" },
      },
      {
        label: { tr: "Ana duraklar", ar: "المحطات الرئيسية", en: "Main stops" },
        value: { tr: "Uzungöl, Sümela, Ayder", ar: "أوزنجول، سوميلا، آيدر", en: "Uzungol, Sumela, Ayder" },
      },
      {
        label: { tr: "Yayla sezonu", ar: "موسم الهضاب", en: "Plateau season" },
        value: { tr: "Haziran sonu – eylül", ar: "أواخر يونيو – سبتمبر", en: "Late June – September" },
      },
    ],
    faq: [
      {
        question: { tr: "Trabzon'a karayoluyla gidilir mi?", ar: "هل يمكن الذهاب إلى طرابزون براً؟", en: "Can you drive to Trabzon?" },
        answer: {
          tr: "Teknik olarak mümkün ama pratikte anlamlı değil: İstanbul–Trabzon arası bin kilometreyi aşar ve tek yön araçla bir günü alır. Karadeniz programı için uçak tek makul seçenek; şehre iniş yapıp yayla turlarını oradan araçla yapmak zaman kazandırır.",
          ar: "ممكن نظرياً لكنه غير عملي: المسافة بين إسطنبول وطرابزون تتجاوز ألف كيلومتر وتستغرق يوماً كاملاً بالسيارة في الاتجاه الواحد. الطائرة هي الخيار المعقول الوحيد لبرنامج البحر الأسود؛ فالهبوط في المدينة ثم التنقل منها بالسيارة إلى المرتفعات يوفّر وقتاً كبيراً.",
          en: "Technically possible but not practical: Istanbul to Trabzon is over a thousand kilometres and takes a full day each way by road. Flying is the only sensible option for a Black Sea programme — land in the city, then travel to the highlands by vehicle from there.",
        },
      },
      {
        question: { tr: "Uzungöl Trabzon merkezine ne kadar uzak?", ar: "كم تبعد أوزنجول عن مركز طرابزون؟", en: "How far is Uzungöl from central Trabzon?" },
        answer: {
          tr: "Yaklaşık yüz kilometre ve yolun büyük bölümü dağ yoludur; tek yön iki saat civarında sürer. Bu yüzden Uzungöl genelde tam günlük bir program olarak planlanır, sabah çıkılıp akşamüstü dönülür. Yolda çay bahçeleri ve vadi manzaraları için mola verilir.",
          ar: "نحو مئة كيلومتر، ومعظم الطريق جبلي، ويستغرق نحو ساعتين في الاتجاه الواحد. لذلك تُخطَّط زيارة أوزنجول عادةً كبرنامج ليوم كامل، بالخروج صباحاً والعودة عند العصر. وتتخلل الطريق استراحات في حدائق الشاي وأمام مناظر الوديان.",
          en: "Around a hundred kilometres, most of it mountain road, taking roughly two hours each way. Uzungöl is therefore usually planned as a full-day programme, leaving in the morning and returning late afternoon, with stops for tea gardens and valley views along the way.",
        },
      },
      {
        question: { tr: "Karadeniz için kaç gün ayırmalı?", ar: "كم يوماً ينبغي تخصيصه للبحر الأسود؟", en: "How many days should you allow for the Black Sea?" },
        answer: {
          tr: "Üç ila dört gün dengeli bir süre. Bir gün Uzungöl, bir gün Sümela ve çevresi, bir gün Ayder ya da şehir ve sahil için ayrılır. İki güne sıkıştırılan program yolda geçen saatler yüzünden yorucu olur; yayla yolları kısa ama yavaştır.",
          ar: "من ثلاثة إلى أربعة أيام مدة متوازنة: يوم لأوزنجول، ويوم لسوميلا وما حولها، ويوم لآيدر أو للمدينة والساحل. أما ضغط البرنامج في يومين فيصبح مرهقاً بسبب الساعات التي تُقضى على الطريق؛ فطرق المرتفعات قصيرة لكنها بطيئة.",
          en: "Three to four days is balanced: one day for Uzungöl, one for Sümela and its surroundings, one for Ayder or the city and coast. Squeezing it into two days becomes tiring because of the hours spent on the road — the highland roads are short but slow.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Trabzon tek başına bir program değil",
          ar: "طرابزون ليست برنامجاً بمفردها",
          en: "Trabzon is not a programme on its own",
        },
        body: {
          tr: "Trabzon'a uçakla gidilir ve şehir merkezi gezmenin yalnızca küçük bir parçasıdır. Asıl program şehirden çıkıldığında başlar: Uzungöl, Sümela Manastırı, Ayder Yaylası ve Zigana geçidi birbirine saatlerce uzaklıktadır. Bu yüzden Karadeniz'i bir günde bitirmeye çalışmak, çoğu zaman yolda geçen bir güne dönüşür.",
          ar: "يُوصل إلى طرابزون جواً، ومركز المدينة ليس سوى جزء صغير من الزيارة. البرنامج الحقيقي يبدأ عند الخروج منها: أوزنجول ودير سوميلا وهضبة آيدر وممر زيغانا تفصل بينها ساعات. لذلك فمحاولة إنهاء البحر الأسود في يوم واحد تتحوّل غالباً إلى يوم يُقضى على الطريق.",
          en: "You reach Trabzon by air, and the city centre is only a small part of the visit. The real programme starts once you leave it: Uzungol, the Sumela Monastery, the Ayder Plateau and the Zigana pass are hours apart. Trying to do the Black Sea in a single day usually turns into a day spent on the road.",
        },
      },
      {
        heading: {
          tr: "Uzungöl ve Sümela",
          ar: "أوزنجول وسوميلا",
          en: "Uzungol and Sumela",
        },
        body: {
          tr: "Uzungöl, dağlarla çevrili bir göl ve etrafındaki ahşap yapılarıyla bölgenin en bilinen noktasıdır; göl çevresinde yürüyüş bir saatten kısa sürer. Sümela Manastırı kayalığa oyulmuştur ve manastıra çıkış yokuşludur — bu tırmanış her yaş için uygun değildir, ziyaret öncesinde göz önünde bulundurun.",
          ar: "أوزنجول بحيرة تحيط بها الجبال والمباني الخشبية، وهي أشهر نقاط المنطقة؛ والتجوّل حولها يستغرق أقل من ساعة. أما دير سوميلا فمنحوت في الصخر والصعود إليه فيه انحدار — وهذا التسلّق لا يناسب كل الأعمار، فخذه في الحسبان قبل الزيارة.",
          en: "Uzungol, a lake ringed by mountains and wooden houses, is the region's best-known spot; walking round it takes under an hour. The Sumela Monastery is carved into a cliff and the approach is a climb — not suitable for every age, so plan for that before you go.",
        },
        image: "/images/places/uzungol.jpg",
        imageAlt: {
          tr: "Uzungöl ve çevresindeki dağlar",
          ar: "أوزنجول والجبال المحيطة به",
          en: "Uzungol and the surrounding mountains",
        },
      },
      {
        heading: {
          tr: "Hava ve mevsim",
          ar: "الطقس والموسم",
          en: "Weather and season",
        },
        body: {
          tr: "Karadeniz Türkiye'nin en çok yağış alan bölgesidir ve yaz aylarında bile yağmur ihtimali yüksektir. Sis, yaylalarda manzarayı tamamen kapatabilir; bu bölgeye giderken programı esnek tutmak gerekir. Yaylalar için en güvenli aralık haziran sonu ile eylül arasıdır, kışın bazı yayla yolları kapanır.",
          ar: "البحر الأسود أكثر مناطق تركيا هطولاً للأمطار، واحتمال المطر مرتفع حتى في الصيف. وقد يحجب الضباب المنظر تماماً في الهضاب؛ لذا يجب إبقاء البرنامج مرناً عند التوجّه إلى هناك. أفضل فترة للهضاب من أواخر يونيو حتى سبتمبر، وفي الشتاء تُغلق بعض طرق الهضاب.",
          en: "The Black Sea is Turkey's rainiest region and showers are likely even in summer. Mist can close the view on the plateaus entirely, so keep the programme flexible. Late June to September is the safest window for the plateaus; some plateau roads close in winter.",
        },
      },
    ],
  },
  {
    slug: "turkiyeye-ne-zaman-gitmeli",
    image: "/images/places/bogaz-kopru.jpg",
    minutes: 4,
    title: {
      tr: "Türkiye'ye ne zaman gitmeli? Mevsim rehberi",
      ar: "متى تزور تركيا؟ دليل المواسم",
      en: "When to visit Türkiye: a season guide",
    },
    excerpt: {
      tr: "Hangi ay neyi getirir: sıcaklık, kalabalık ve fiyatların birlikte değiştiği takvim.",
      ar: "ماذا يجلب كل شهر: تقويم تتغيّر فيه الحرارة والزحام والأسعار معاً.",
      en: "What each month brings: the calendar where heat, crowds and prices move together.",
    },
    facts: [
      {
        label: { tr: "En dengeli", ar: "الأكثر توازناً", en: "Best balance" },
        value: { tr: "Nisan – mayıs", ar: "أبريل – مايو", en: "April – May" },
      },
      {
        label: { tr: "En yoğun", ar: "الأكثر ازدحاماً", en: "Busiest" },
        value: { tr: "Haziran – ağustos", ar: "يونيو – أغسطس", en: "June – August" },
      },
      {
        label: { tr: "Serinlik için", ar: "للبرودة", en: "For cooler air" },
        value: { tr: "Sapanca, Bolu, yaylalar", ar: "سبانجا، بولو، الهضاب", en: "Sapanca, Bolu, the plateaus" },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'ye gitmek için en iyi aylar hangileri?", ar: "ما أفضل الأشهر لزيارة تركيا؟", en: "Which are the best months to visit Türkiye?" },
        answer: {
          tr: "Nisan–mayıs ile eylül–ekim en dengeli dönemler: hava ılık, yağış az, kalabalık yaz kadar yoğun değil. Bu aylarda hem şehir gezisi hem şehir dışı günübirlikler rahat yapılır. Ramazan ve bayram dönemlerinde şehir hareketlenir, otel doluluğu artar.",
          ar: "شهرا نيسان وأيار وشهرا أيلول وتشرين الأول هي الأكثر اعتدالاً: الجو دافئ والأمطار قليلة والزحام أخف من الصيف. وفي هذه الأشهر تسهل جولات المدينة والرحلات اليومية خارجها معاً. أما في رمضان والأعياد فتزداد حركة المدينة وترتفع نسبة إشغال الفنادق.",
          en: "April–May and September–October are the most balanced: mild weather, little rain and lighter crowds than summer. Both city sightseeing and day trips outside the city are comfortable in these months. During Ramadan and the Eid holidays the city gets busier and hotels fill up.",
        },
      },
      {
        question: { tr: "Yaz aylarında İstanbul çok mu sıcak?", ar: "هل إسطنبول شديدة الحرارة في الصيف؟", en: "Is Istanbul very hot in summer?" },
        answer: {
          tr: "Temmuz ve ağustosta sıcaklık genelde otuz derece civarındadır ama asıl mesele nem: termometrenin gösterdiğinden daha ağır hissettirir. Öğle saatleri açık alanda zorlayıcı olabilir, bu yüzden program sabah erkene ve ikindi sonrasına yayılır. Sapanca ve yaylalar serinlemek için kullanılır.",
          ar: "في تموز وآب تدور الحرارة حول الثلاثين درجة، لكن المشكلة الحقيقية هي الرطوبة التي تجعل الجو أثقل مما يشير إليه الميزان. وقد تكون ساعات الظهيرة مرهقة في الأماكن المكشوفة، لذلك يُوزَّع البرنامج على الصباح الباكر وما بعد العصر. وتُستخدم سبانجا والمرتفعات للتبريد.",
          en: "In July and August temperatures sit around thirty degrees, but the real issue is humidity, which makes it feel heavier than the thermometer suggests. Midday can be demanding outdoors, so programmes shift to early morning and late afternoon. Sapanca and the highlands are used to cool off.",
        },
      },
      {
        question: { tr: "Kışın Türkiye'ye gitmek mantıklı mı?", ar: "هل من المنطقي زيارة تركيا في الشتاء؟", en: "Does it make sense to visit Türkiye in winter?" },
        answer: {
          tr: "Kar görmek isteyen Körfez misafirleri için kış en çok tercih edilen dönem. Uludağ ve Kartepe'de kar aralıktan marta kadar bulunur, İstanbul'da müzeler boş ve sıralar kısadır. Karşılığında günler kısa ve yağmurludur; program iç mekân ağırlıklı kurulur.",
          ar: "الشتاء هو الموسم المفضّل لضيوف الخليج الراغبين في رؤية الثلج. فالثلج موجود في أولوداغ وكارتبه من كانون الأول حتى آذار، وفي إسطنبول تكون المتاحف خالية والطوابير قصيرة. في المقابل تكون الأيام قصيرة وممطرة، ويُبنى البرنامج على الأماكن المغلقة أكثر.",
          en: "Winter is the favourite season for Gulf guests who want to see snow. There is snow at Uludağ and Kartepe from December through March, and in Istanbul the museums are empty and queues short. In return the days are short and rainy, so programmes lean towards indoor stops.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İlkbahar: nisan–mayıs",
          ar: "الربيع: أبريل – مايو",
          en: "Spring: April to May",
        },
        body: {
          tr: "Çoğu ziyaretçi için en dengeli dönem burasıdır. İstanbul'da hava gezmeye elverişlidir, laleler nisanda açar ve yaz kalabalığı henüz başlamamıştır. Yağmur ihtimali vardır; yanınıza ince bir yağmurluk almak yeterlidir.",
          ar: "هذه أكثر الفترات توازناً لمعظم الزوار. الجو في إسطنبول مناسب للتجوّل، وتتفتّح زهور التوليب في أبريل، ولم يبدأ زحام الصيف بعد. احتمال المطر قائم، ويكفي أن تحمل معطفاً خفيفاً.",
          en: "For most visitors this is the best-balanced window. The weather in Istanbul suits walking, the tulips open in April and the summer crowds have not arrived. Rain is possible; a light waterproof is enough.",
        },
      },
      {
        heading: {
          tr: "Yaz: haziran–ağustos",
          ar: "الصيف: يونيو – أغسطس",
          en: "Summer: June to August",
        },
        body: {
          tr: "Körfez'den gelen misafirlerin en yoğun tercih ettiği dönemdir. İstanbul sıcak ve nemlidir; tarihî yarımadada öğle saatlerinde gezmek yorucu olur, programı sabah erken ve ikindi sonrasına yaymak daha rahattır. Sapanca, Bolu ve Karadeniz yaylaları bu aylarda serinlik aradığınız yerlerdir.",
          ar: "هذه أكثر الفترات التي يختارها ضيوف الخليج. إسطنبول حارّة ورطبة؛ والتجوّل في شبه الجزيرة التاريخية ظهراً مُتعب، والأفضل توزيع البرنامج على الصباح الباكر وما بعد العصر. أما سبانجا وبولو وهضاب البحر الأسود فهي وجهات البرودة في هذه الأشهر.",
          en: "This is the peak season for Gulf visitors. Istanbul is hot and humid; sightseeing on the historic peninsula at midday is tiring, so spread the programme across early morning and late afternoon. Sapanca, Bolu and the Black Sea plateaus are where you go for cooler air in these months.",
        },
        image: "/images/places/sultanahmet.jpg",
        imageAlt: {
          tr: "Sultanahmet Camii",
          ar: "جامع السلطان أحمد",
          en: "The Blue Mosque",
        },
      },
      {
        heading: {
          tr: "Sonbahar ve kış",
          ar: "الخريف والشتاء",
          en: "Autumn and winter",
        },
        body: {
          tr: "Eylül ve ekim, yazın sıcağı geçtikten sonra hâlâ açık havanın sürdüğü sakin bir dönemdir. Kasımdan itibaren yağış artar. Kış, kar manzarası ve Uludağ ile Kartepe için gidilir; İstanbul'da kar her yıl garanti değildir ve şehir kar yağdığında yavaşlar.",
          ar: "سبتمبر وأكتوبر فترة هادئة يزول فيها حرّ الصيف ويبقى الجو صحواً. ومن نوفمبر يزداد هطول الأمطار. أما الشتاء فيُقصد لمناظر الثلج ولأولوداغ وكارتبه؛ والثلج في إسطنبول ليس مضموناً كل عام، والمدينة تبطؤ حين يتساقط.",
          en: "September and October are a quiet stretch when the summer heat has passed but clear weather holds. Rain increases from November. Winter is for snow scenery and for Uludag and Kartepe; snow in Istanbul is not guaranteed every year, and the city slows when it falls.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-bir-hafta-aile-programi",
    image: "/images/places/galata.jpg",
    minutes: 6,
    title: {
      tr: "İstanbul'da bir hafta: aileler için gün gün program",
      ar: "أسبوع في إسطنبول: برنامج يومي للعائلات",
      en: "A week in Istanbul: a day-by-day family plan",
    },
    excerpt: {
      tr: "Yedi günü yormadan bölmenin yolu: hangi gün nerede, ne kadar yürüyüş, nerede mola.",
      ar: "كيف تقسّم سبعة أيام دون إرهاق: أين تذهب كل يوم، كم تمشي، وأين تستريح.",
      en: "How to split seven days without exhaustion: where each day, how much walking, where to rest.",
    },
    facts: [
      {
        label: { tr: "Süre", ar: "المدة", en: "Length" },
        value: { tr: "7 gün", ar: "7 أيام", en: "7 days" },
      },
      {
        label: { tr: "Tempo", ar: "الإيقاع", en: "Pace" },
        value: { tr: "Günde tek ana bölge", ar: "منطقة رئيسية واحدة يومياً", en: "One main district a day" },
      },
      {
        label: { tr: "Şehir dışı", ar: "خارج المدينة", en: "Out of town" },
        value: { tr: "İki günübirlik", ar: "رحلتان ليوم واحد", en: "Two day trips" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul için bir hafta yeterli mi?", ar: "هل يكفي أسبوع لزيارة إسطنبول؟", en: "Is one week enough for Istanbul?" },
        answer: {
          tr: "Bir hafta şehri acele etmeden görmeye yeter ve iki günübirlik gezi için de yer bırakır. Beş gün şehre, iki gün Sapanca ya da Bursa gibi yakın duraklara ayrıldığında program sıkışmaz. Daha kısa sürelerde şehir dışını çıkarmak gerekir.",
          ar: "يكفي الأسبوع لرؤية المدينة دون عجلة، ويترك مجالاً لرحلتين خارجها. فحين تُخصَّص خمسة أيام للمدينة ويومان لوجهات قريبة مثل سبانجا أو بورصة لا يصبح البرنامج مضغوطاً. أما المدد الأقصر فتستلزم حذف الخارج تماماً.",
          en: "A week is enough to see the city without rushing, and it leaves room for two day trips. With five days in the city and two for nearby stops like Sapanca or Bursa, the programme never feels squeezed. Shorter stays mean dropping the out-of-town days.",
        },
      },
      {
        question: { tr: "Çocuklu bir aile günde kaç durak gezebilir?", ar: "كم محطة تستطيع عائلة مع أطفال زيارتها في اليوم؟", en: "How many stops can a family with children manage in a day?" },
        answer: {
          tr: "Üç durak pratik sınırdır; dördüncüsü genelde yorgunluk yüzünden keyifsiz geçer. Aynı bölgede kalan üç durak, şehrin iki ucuna dağılmış ikiden daha rahat gezilir. Program kurarken gün başına tek ana bölge seçmek en çok işe yarayan kuraldır.",
          ar: "ثلاث محطات هي الحد العملي؛ أما الرابعة فتمرّ عادةً بلا متعة بسبب الإرهاق. وثلاث محطات في المنطقة نفسها أيسر من اثنتين متباعدتين على طرفي المدينة. وأنفع قاعدة عند وضع البرنامج هي اختيار منطقة رئيسية واحدة لكل يوم.",
          en: "Three stops is the practical limit; a fourth is usually spoiled by tiredness. Three stops in the same area are easier than two spread across opposite ends of the city. The most useful rule when planning is one main area per day.",
        },
      },
      {
        question: { tr: "Haftalık programda şehir dışına hangi günler çıkılmalı?", ar: "في أي أيام الأسبوع يُفضّل الخروج خارج المدينة؟", en: "Which days should the out-of-town trips fall on?" },
        answer: {
          tr: "Ortadaki günler en uygunu. İlk iki gün uçuş yorgunluğu geçer ve şehre alışılır, son günler alışveriş ve toparlanmaya ayrılır; arada kalan dört ve beşinci günler günübirlik geziler için en dinç zamandır. Hafta sonu Sapanca ve Bursa yolları daha kalabalık olur.",
          ar: "الأيام الوسطى هي الأنسب. ففي اليومين الأولين يزول تعب الطيران وتعتاد المدينة، وتُخصَّص الأيام الأخيرة للتسوق والاستعداد للعودة؛ ويبقى اليومان الرابع والخامس أكثر الأوقات نشاطاً للرحلات اليومية. كما تزدحم طرق سبانجا وبورصة في عطلة نهاية الأسبوع.",
          en: "The middle days work best. The first two days absorb the flight fatigue and settle you into the city, the last days go to shopping and packing, leaving days four and five as the freshest for day trips. Roads to Sapanca and Bursa are busier at weekends.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İlk iki gün: tarihî yarımada",
          ar: "اليومان الأولان: شبه الجزيرة التاريخية",
          en: "The first two days: the historic peninsula",
        },
        body: {
          tr: "Sultanahmet Camii, Ayasofya ve Topkapı Sarayı birbirine yürüme mesafesindedir ama üçünü bir güne sıkıştırmak çocuklu bir aile için yorucudur. İlk gün camiler ve Yerebatan Sarnıcı, ikinci gün Topkapı ve Kapalıçarşı iyi bir bölünmedir. Sabah erken başlamak kuyrukları belirgin şekilde kısaltır.",
          ar: "جامع السلطان أحمد وآيا صوفيا وقصر توبكابي على مسافة سير من بعضها، لكن حشرها في يوم واحد مُتعب لعائلة مع أطفال. اليوم الأول للمساجد وصهريج البازيليك، والثاني لتوبكابي والبازار المسقوف — تقسيم جيد. والبدء صباحاً باكراً يقصّر الطوابير بوضوح.",
          en: "The Blue Mosque, Hagia Sophia and Topkapi Palace are within walking distance of one another, but squeezing all three into one day is tiring with children. Mosques and the Basilica Cistern on day one, Topkapi and the Grand Bazaar on day two is a good split. Starting early noticeably shortens the queues.",
        },
        image: "/images/places/sultanahmet.jpg",
        imageAlt: {
          tr: "Sultanahmet Camii",
          ar: "جامع السلطان أحمد",
          en: "The Blue Mosque",
        },
      },
      {
        heading: {
          tr: "Üçüncü gün: Boğaz ve Beyoğlu",
          ar: "اليوم الثالث: البوسفور وبيوغلو",
          en: "Day three: the Bosphorus and Beyoglu",
        },
        body: {
          tr: "Boğaz turu şehri denizden görmenin en kolay yoludur ve çocuklar için günün en sevilen kısmı olur. Karaya çıktıktan sonra Galata Kulesi ve Karaköy tarafı yürüyerek gezilebilir. Bu gün çok yürüyüş içerdiği için ertesi güne sakin bir program koymak iyi olur.",
          ar: "جولة البوسفور أسهل طريقة لرؤية المدينة من البحر، وغالباً ما تكون أحبّ جزء لدى الأطفال. وبعد النزول يمكن التجوّل سيراً في برج غالاتا وجهة كاراكوي. هذا اليوم يتضمّن مشياً كثيراً، لذا من الأفضل وضع برنامج هادئ لليوم التالي.",
          en: "A Bosphorus cruise is the easiest way to see the city from the water and is usually the children's favourite part of the day. After landing, Galata Tower and the Karakoy side are walkable. This day involves a lot of walking, so plan something calmer for the next one.",
        },
      },
      {
        heading: {
          tr: "Dört ve beşinci gün: şehir dışı",
          ar: "اليومان الرابع والخامس: خارج المدينة",
          en: "Days four and five: out of town",
        },
        body: {
          tr: "Sapanca ve Bursa, İstanbul'dan günübirlik gidilebilecek iki farklı yön. Sapanca göl ve orman, Bursa tarih ve teleferik demektir. İkisi arasında seçim yaparken çocukların yaşını düşünün: Sapanca daha az yürüyüş, Bursa daha çok gezi noktası içerir.",
          ar: "سبانجا وبورصة وجهتان مختلفتان يمكن زيارتهما من إسطنبول في يوم واحد. سبانجا تعني البحيرة والغابة، وبورصة تعني التاريخ والتلفريك. وعند الاختيار بينهما انظر إلى أعمار الأطفال: سبانجا مشي أقل، وبورصة محطات زيارة أكثر.",
          en: "Sapanca and Bursa are two different directions for a day trip from Istanbul. Sapanca means lake and forest; Bursa means history and a cable car. Choosing between them, consider the children's ages: Sapanca involves less walking, Bursa more stops.",
        },
        image: "/images/tours/bursa.jpg",
        imageAlt: {
          tr: "Bursa'da Osmanlı dönemi yapıları",
          ar: "مبانٍ من العهد العثماني في بورصة",
          en: "Ottoman-era buildings in Bursa",
        },
      },
      {
        heading: {
          tr: "Son iki gün: alışveriş ve serbest zaman",
          ar: "اليومان الأخيران: التسوّق ووقت حر",
          en: "The last two days: shopping and free time",
        },
        body: {
          tr: "Programın sonuna serbest gün bırakmak, kaçırılan bir yeri telafi etmek ya da sadece dinlenmek için alan açar. Nişantaşı ve Bağdat Caddesi alışveriş için iki farklı yakada iki iyi seçenek. Dönüş uçuşundan önceki günü hafif tutmak, bavul toplama ve havalimanı yolculuğu için gereken payı bırakır.",
          ar: "ترك يوم حرّ في نهاية البرنامج يفتح مجالاً لتعويض مكان فاتك أو للراحة فقط. نيشانتاشي وشارع بغداد خياران جيدان للتسوّق في جانبين مختلفين. وإبقاء اليوم السابق لرحلة العودة خفيفاً يترك هامشاً لحزم الحقائب والطريق إلى المطار.",
          en: "Leaving a free day at the end creates room to make up for something you missed, or simply to rest. Nisantasi and Bagdat Street are two good shopping options on two different sides. Keeping the day before your return flight light leaves margin for packing and the trip to the airport.",
        },
      },
    ],
  },
  {
    slug: "arapca-konusan-sofor-ve-rehber",
    image: "/images/chauffeur.jpg",
    minutes: 3,
    title: {
      tr: "Türkiye'de Arapça konuşan şoför ve rehber neden fark yaratır?",
      ar: "لماذا يُحدث السائق والمرشد الناطق بالعربية فرقاً في تركيا؟",
      en: "Why an Arabic-speaking driver and guide changes the trip",
    },
    excerpt: {
      tr: "Dil, seyahatin konforunu fiyattan sonra en çok belirleyen etken. Nerede işe yarar, nerede yaramaz.",
      ar: "اللغة هي العامل الأهم بعد السعر في راحة الرحلة. أين تنفع وأين لا تكفي.",
      en: "After price, language shapes the trip more than anything. Where it helps, and where it does not.",
    },
    facts: [
      {
        label: { tr: "Konuşulan diller", ar: "اللغات", en: "Languages" },
        value: { tr: "Arapça, Türkçe, İngilizce", ar: "العربية والتركية والإنجليزية", en: "Arabic, Turkish, English" },
      },
      {
        label: { tr: "En çok işe yaradığı yer", ar: "الأكثر فائدة", en: "Most useful" },
        value: { tr: "Karşılama ve alışveriş", ar: "الاستقبال والتسوّق", en: "Meet-and-greet and shopping" },
      },
      {
        label: { tr: "Rehberlik", ar: "الإرشاد", en: "Guiding" },
        value: { tr: "Tur programlarında", ar: "في البرامج السياحية", en: "On tour programmes" },
      },
    ],
    faq: [
      {
        question: { tr: "Şoförün Arapça bilmesi neden önemli?", ar: "لماذا يهمّ أن يتحدث السائق العربية؟", en: "Why does it matter that the driver speaks Arabic?" },
        answer: {
          tr: "En çok işe yaradığı an ilk saat: uçaktan indiğiniz, yorgun ve şehri hiç bilmediğiniz saat. Otel adresi, bagaj, çocuk koltuğu gibi ayrıntılar el işaretiyle değil konuşarak halledilir. Aynı şey alışverişte ve lokantada da geçerli; tercüman aramak zorunda kalmazsınız.",
          ar: "أكثر ما يظهر أثره في الساعة الأولى: ساعة نزولك من الطائرة، وأنت متعب ولا تعرف المدينة. فتفاصيل مثل عنوان الفندق والأمتعة ومقعد الطفل تُحلّ بالكلام لا بالإشارة. والأمر نفسه في التسوق والمطاعم؛ فلن تضطر إلى البحث عن مترجم.",
          en: "It matters most in the first hour: the hour you step off the plane, tired and new to the city. Details like the hotel address, luggage and a child seat get settled by talking, not by gesturing. The same holds when shopping and eating out — you never have to look for an interpreter.",
        },
      },
      {
        question: { tr: "Rehber ile şoför arasındaki fark nedir?", ar: "ما الفرق بين المرشد والسائق؟", en: "What is the difference between a guide and a driver?" },
        answer: {
          tr: "Şoför sizi güvenle ve zamanında taşır, yol ve park sorununu çözer. Rehber ise gezdiğiniz yerin tarihini anlatır ve ziyaret sırasında yanınızda yürür. Şehir turlarında ikisi birden bulunur; sadece ulaşım gereken transferlerde şoför yeterlidir.",
          ar: "السائق ينقلك بأمان وفي الوقت المحدد ويتولى أمر الطريق والمواقف. أما المرشد فيشرح تاريخ المكان الذي تزوره ويسير معك أثناء الزيارة. وفي جولات المدينة يوجد الاثنان معاً؛ أما في عمليات النقل التي تحتاج تنقلاً فقط فيكفي السائق.",
          en: "A driver gets you there safely and on time and deals with the roads and parking. A guide explains the history of what you are seeing and walks with you during the visit. City tours have both; a transfer that is only about getting somewhere needs only the driver.",
        },
      },
      {
        question: { tr: "Namaz vakitleri programa nasıl yerleştiriliyor?", ar: "كيف تُراعى أوقات الصلاة في البرنامج؟", en: "How are prayer times fitted into the programme?" },
        answer: {
          tr: "Program kurulurken vakitler baştan hesaba katılır ve güzergâh üzerindeki camiler mola noktası olarak seçilir. İstanbul'da hemen her turistik durağın yakınında cami bulunur, bu yüzden ayrı bir sapma gerekmez. Öğle yemeği molası da çoğu zaman öğle vaktine denk getirilir.",
          ar: "تُراعى الأوقات منذ وضع البرنامج، وتُختار المساجد الواقعة على الطريق كنقاط استراحة. وفي إسطنبول يوجد مسجد قرب كل محطة سياحية تقريباً، فلا حاجة إلى انحراف خاص عن المسار. كما تُوافَق استراحة الغداء غالباً مع وقت الظهر.",
          en: "Prayer times are factored in from the start, and mosques along the route are chosen as stopping points. In Istanbul there is a mosque near almost every tourist stop, so no detour is needed. The lunch break is usually timed to coincide with the midday prayer.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İlk saat en kritik saat",
          ar: "الساعة الأولى هي الأهم",
          en: "The first hour matters most",
        },
        body: {
          tr: "Havalimanına indiğiniz ilk saatte yorgunsunuz, bavullar elinizde ve şehri tanımıyorsunuz. Şoförün dilinizi konuşması bu saatte bir konfor değil, doğrudan işleyen bir çözümdür: otelin adını tarif etmek, bir eczaneye uğramak ya da çocuk için mola istemek tercüme gerektirmeden hallolur.",
          ar: "في الساعة الأولى بعد الهبوط تكون متعباً، والحقائب بيدك، والمدينة غير مألوفة. حديث السائق بلغتك في هذه الساعة ليس رفاهية بل حلّ عملي مباشر: وصف اسم الفندق، أو المرور بصيدلية، أو طلب استراحة للطفل — كلها تُقضى دون ترجمة.",
          en: "In the first hour after landing you are tired, holding luggage and unfamiliar with the city. A driver who speaks your language is not a luxury at that hour but a working solution: naming your hotel, stopping at a pharmacy or asking for a break for a child all happen without translation.",
        },
      },
      {
        heading: {
          tr: "Rehberlik ile şoförlük aynı şey değil",
          ar: "الإرشاد ليس هو القيادة",
          en: "Guiding and driving are not the same",
        },
        body: {
          tr: "Arapça konuşan bir şoför yol boyunca iletişimi çözer; gezdiğiniz yerin tarihini anlatmak ise rehberin işidir. Turlarda bu ikisi ayrılır: rehber programın içeriğinden, şoför ulaşımdan sorumludur. Transferlerde rehbere gerek yoktur, tur programlarında ise fark burada ortaya çıkar.",
          ar: "السائق الناطق بالعربية يحلّ التواصل طوال الطريق؛ أما سرد تاريخ المكان فهو عمل المرشد. في الجولات ينفصل الدوران: المرشد مسؤول عن محتوى البرنامج والسائق عن التنقّل. في خدمات النقل لا حاجة لمرشد، أما في البرامج السياحية فهنا يظهر الفرق.",
          en: "An Arabic-speaking driver solves communication on the road; explaining the history of a place is the guide's job. On tours the two roles separate: the guide handles the content, the driver the transport. Transfers need no guide; on tour programmes this is where the difference shows.",
        },
      },
      {
        heading: {
          tr: "Namaz, yemek ve tempo",
          ar: "الصلاة والطعام والإيقاع",
          en: "Prayer, food and pace",
        },
        body: {
          tr: "Dil, programın içeriğini de değiştirir. Namaz vakitlerinde güzergâh üzerindeki camilerde mola vermek, helal seçenek sunan restoranlara yönlendirmek ve çocukların temposuna göre programı esnetmek, bunları söylemeye gerek kalmadan anlayan bir ekiple çok daha kolaydır.",
          ar: "اللغة تغيّر محتوى البرنامج أيضاً. التوقّف عند مساجد على الطريق في أوقات الصلاة، والتوجيه إلى مطاعم توفّر خيارات حلال، وتعديل البرنامج حسب إيقاع الأطفال — كل ذلك أسهل بكثير مع فريق يفهمها دون أن تُقال.",
          en: "Language also changes what goes into the programme. Stopping at mosques along the route at prayer times, pointing you to restaurants with halal options and flexing the plan around the children's pace are all far easier with a team that understands without being told.",
        },
      },
    ],
  },
  {
    slug: "bursa-uludag-gunubirlik",
    image: "/images/tours/bursa.jpg",
    minutes: 4,
    title: {
      tr: "Bursa ve Uludağ: İstanbul'dan günübirlik rehber",
      ar: "بورصة وأولوداغ: دليل رحلة يوم واحد من إسطنبول",
      en: "Bursa and Uludag: a day-trip guide from Istanbul",
    },
    excerpt: {
      tr: "Osmanlı'nın ilk başkenti, teleferik ve UNESCO köyü — bir güne ne sığar, ne sığmaz.",
      ar: "أول عاصمة عثمانية، والتلفريك، وقرية اليونسكو — ما الذي يتّسع له اليوم وما لا يتّسع.",
      en: "The first Ottoman capital, a cable car and a UNESCO village — what fits into a day and what does not.",
    },
    facts: [
      {
        label: { tr: "Mesafe", ar: "المسافة", en: "Distance" },
        value: { tr: "Feribotla ~2,5 saat", ar: "نحو ساعتين ونصف بالعبّارة", en: "About 2.5 hrs by ferry" },
      },
      {
        label: { tr: "Ana duraklar", ar: "المحطات الرئيسية", en: "Main stops" },
        value: { tr: "Uludağ, Ulu Cami, Cumalıkızık", ar: "أولوداغ، الجامع الكبير، جوما لي كيزيك", en: "Uludag, Ulu Mosque, Cumalikizik" },
      },
      {
        label: { tr: "Kar mevsimi", ar: "موسم الثلج", en: "Snow season" },
        value: { tr: "Aralık – mart", ar: "ديسمبر – مارس", en: "December – March" },
      },
    ],
    faq: [
      {
        question: { tr: "Bursa'ya feribotla mı karayoluyla mı gitmeli?", ar: "هل الأفضل الذهاب إلى بورصة بالعبّارة أم براً؟", en: "Should you reach Bursa by ferry or by road?" },
        answer: {
          tr: "Feribot hem daha kısa hem de yolculuğun kendisi bir manzara: araç gemiye biner, Marmara geçilir ve karşıda yola devam edilir; toplam yaklaşık iki buçuk saat. Karayolu köprü üzerinden gider ve trafiğe daha açıktır. Günübirlik programlarda çoğunlukla feribot tercih edilir.",
          ar: "العبّارة أقصر، والرحلة نفسها مشهد بحد ذاته: تصعد السيارة إلى السفينة، فيُعبَر بحر مرمرة، ثم يُستأنف الطريق على الضفة المقابلة، بمجموع ساعتين ونصف تقريباً. أما الطريق البري فيمرّ من فوق الجسر وهو أكثر عرضة للازدحام. ولذلك تُفضَّل العبّارة عادةً في برامج اليوم الواحد.",
          en: "The ferry is both quicker and a sight in itself: the vehicle boards the ship, crosses the Marmara and continues on the far side — about two and a half hours in total. The road route goes over the bridge and is more exposed to traffic. Day trips usually take the ferry.",
        },
      },
      {
        question: { tr: "Uludağ'da kar ne zaman bulunur?", ar: "متى يوجد الثلج في أولوداغ؟", en: "When is there snow on Uludağ?" },
        answer: {
          tr: "Kar mevsimi genelde aralıktan mart sonuna kadar sürer, ocak ve şubatta en kalın haline ulaşır. Zirveye teleferikle çıkılır ve yolculuk kendi başına manzaralıdır. Yaz aylarında zirve yeşil ve serindir; kar görmek isteyen misafirler için kış ayları planlanır.",
          ar: "يمتد موسم الثلج عادةً من كانون الأول حتى نهاية آذار، ويبلغ ذروته في كانون الثاني وشباط. ويُصعد إلى القمة بالتلفريك، والرحلة بحد ذاتها تطلّ على مناظر جميلة. أما في الصيف فتكون القمة خضراء ومنعشة؛ ولمن يريد رؤية الثلج تُخطَّط أشهر الشتاء.",
          en: "The snow season generally runs from December to the end of March, at its deepest in January and February. You reach the summit by cable car, and the ride itself is scenic. In summer the summit is green and cool; guests who want snow are booked for the winter months.",
        },
      },
      {
        question: { tr: "Bursa tek günde gezilir mi?", ar: "هل يمكن زيارة بورصة في يوم واحد؟", en: "Can Bursa be seen in a single day?" },
        answer: {
          tr: "Evet, ama seçim yapmak gerekir. Uludağ ve teleferik tek başına yarım günü alır; şehir merkezinde Ulu Cami, Koza Han ve Cumalıkızık köyü de kendi zamanını ister. Günübirlik programlarda genelde Uludağ ile şehir merkezinden biri öne çıkarılır, ikisi de yüzeysel gezilmez.",
          ar: "نعم، لكن عليك الاختيار. فأولوداغ والتلفريك يستغرقان نصف يوم وحدهما؛ ومركز المدينة بجامعه الكبير وخان الحرير وقرية جومالي كيزيك يطلب وقته الخاص. ولذلك تُقدَّم في برامج اليوم الواحد إحدى الوجهتين على الأخرى بدل المرور السريع عليهما معاً.",
          en: "Yes, but you have to choose. Uludağ and the cable car take half a day on their own; the city centre with the Grand Mosque, Koza Han and Cumalıkızık village needs its own time. Day programmes usually favour one over the other rather than skimming both.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Yol: feribot mu karayolu mu",
          ar: "الطريق: عبّارة أم برّاً",
          en: "The route: ferry or road",
        },
        body: {
          tr: "Bursa'ya İstanbul'dan iki şekilde gidilir: Marmara'yı feribotla geçerek ya da Osmangazi Köprüsü üzerinden karayoluyla. Feribot yolculuğun bir kısmını denizde geçirir ve çocuklar için daha keyiflidir; karayolu ise saat konusunda daha esnektir. Her iki durumda da sabah erken çıkmak günün içine bir durak daha sığdırır.",
          ar: "يُوصل إلى بورصة من إسطنبول بطريقتين: عبور بحر مرمرة بالعبّارة، أو برّاً عبر جسر عثمان غازي. العبّارة تجعل جزءاً من الرحلة في البحر وهي أمتع للأطفال؛ أما الطريق البرّي فأكثر مرونة في التوقيت. وفي الحالتين، الانطلاق صباحاً باكراً يضيف محطة إضافية إلى اليوم.",
          en: "There are two ways to Bursa from Istanbul: crossing the Marmara by ferry, or driving over the Osmangazi Bridge. The ferry puts part of the journey on the water and is more fun for children; the road is more flexible on timing. Either way, an early start fits one more stop into the day.",
        },
      },
      {
        heading: {
          tr: "Uludağ ve teleferik",
          ar: "أولوداغ والتلفريك",
          en: "Uludag and the cable car",
        },
        body: {
          tr: "Uludağ'a teleferikle çıkmak turun en çok beğenilen kısmıdır ve yolculuk yaklaşık yarım saat sürer. Zirvede hava şehirden belirgin şekilde soğuktur; yaz aylarında bile ince bir mont işe yarar. Kış aylarında kar manzarası için gidilir ama teleferik hava koşullarına göre kapanabilir, bu yüzden programı esnek tutmak gerekir.",
          ar: "الصعود إلى أولوداغ بالتلفريك هو أكثر أجزاء الجولة إعجاباً، والرحلة تستغرق نحو نصف ساعة. الجو في القمة أبرد بوضوح من المدينة؛ وحتى في الصيف يفيد معطف خفيف. وفي الشتاء يُقصد لمناظر الثلج، لكن التلفريك قد يُغلق حسب الأحوال الجوية، لذا يجب إبقاء البرنامج مرناً.",
          en: "Riding the cable car up Uludag is the most popular part of the trip and takes about half an hour. It is noticeably colder at the top than in the city; even in summer a light jacket helps. In winter people come for the snow, but the cable car can close in bad weather, so keep the plan flexible.",
        },
      },
      {
        heading: {
          tr: "Şehirde: Ulu Cami, Koza Han ve Cumalıkızık",
          ar: "في المدينة: الجامع الكبير وخان الحرير وجوما لي كيزيك",
          en: "In town: the Ulu Mosque, Koza Han and Cumalikizik",
        },
        body: {
          tr: "Ulu Cami ve yanındaki Koza Han, Bursa'nın ipek ticareti geçmişini bir arada gösterir. Yeşil Türbe kısa bir sürüşle ulaşılabilir. Gün, UNESCO listesindeki Cumalıkızık köyünde kahvaltı ya da çay molasıyla kapanır; taş sokakları dar ve eğimlidir, rahat ayakkabı gerekir.",
          ar: "الجامع الكبير وخان الحرير المجاور له يظهران معاً ماضي بورصة في تجارة الحرير. والتربة الخضراء تُبلغ بقيادة قصيرة. ويُختتم اليوم باستراحة فطور أو شاي في قرية جوما لي كيزيك المدرجة في اليونسكو؛ وأزقتها الحجرية ضيقة ومائلة، فيلزم حذاء مريح.",
          en: "The Ulu Mosque and the adjoining Koza Han show Bursa's silk-trading past together. The Green Tomb is a short drive away. The day closes with breakfast or tea in Cumalikizik, a UNESCO-listed village; its stone lanes are narrow and sloping, so comfortable shoes matter.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-alisveris-rehberi",
    image: "/images/tours/istanbul.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul'da alışveriş: çarşılar, caddeler ve merkezler",
      ar: "التسوّق في إسطنبول: البازارات والشوارع والمولات",
      en: "Shopping in Istanbul: bazaars, streets and malls",
    },
    excerpt: {
      tr: "Kapalıçarşı mı, Nişantaşı mı, AVM mi — ne nerede alınır ve pazarlık nerede geçerli.",
      ar: "البازار المسقوف أم نيشانتاشي أم المولات — ماذا يُشترى من أين، وأين تنفع المساومة.",
      en: "Grand Bazaar, Nisantasi or a mall — what to buy where, and where haggling still applies.",
    },
    facts: [
      {
        label: { tr: "Tarihî çarşılar", ar: "البازارات التاريخية", en: "Historic bazaars" },
        value: { tr: "Kapalıçarşı, Mısır Çarşısı", ar: "البازار المسقوف، بازار التوابل", en: "Grand Bazaar, Spice Bazaar" },
      },
      {
        label: { tr: "Marka caddeleri", ar: "شوارع الماركات", en: "Brand streets" },
        value: { tr: "Nişantaşı, Bağdat Caddesi", ar: "نيشانتاشي، شارع بغداد", en: "Nisantasi, Bagdat Street" },
      },
      {
        label: { tr: "Pazarlık", ar: "المساومة", en: "Haggling" },
        value: { tr: "Çarşılarda geçerli", ar: "تنفع في البازارات", en: "Applies in the bazaars" },
      },
    ],
    faq: [
      {
        question: { tr: "Kapalıçarşı'da pazarlık yapılır mı?", ar: "هل تجري المساومة في البازار الكبير؟", en: "Do you haggle in the Grand Bazaar?" },
        answer: {
          tr: "Evet, tarihî çarşılarda pazarlık alışılmış bir uygulama ve satıcı da bunu bekler. Alışveriş merkezlerinde ve marka mağazalarında ise fiyatlar sabittir, pazarlık geçmez. Çarşıda birkaç dükkânda aynı ürünün fiyatını sormak, gerçek aralığı görmenin en pratik yolu.",
          ar: "نعم، المساومة أمر معتاد في الأسواق التاريخية والبائع يتوقعها. أما في المولات والمتاجر الماركة فالأسعار ثابتة ولا مجال للمساومة. وأبسط طريقة لمعرفة النطاق السعري الحقيقي هي سؤال عدة محال في السوق عن سعر المنتج نفسه.",
          en: "Yes, haggling is standard practice in the historic bazaars and the seller expects it. In shopping malls and brand stores prices are fixed and haggling does not apply. Asking a few different shops the price of the same item is the most practical way to see the real range.",
        },
      },
      {
        question: { tr: "Alışveriş için hangi bölgeye gidilmeli?", ar: "إلى أي منطقة يُذهب للتسوق؟", en: "Which area should you go to for shopping?" },
        answer: {
          tr: "Aradığınıza bağlı. Halı, baharat, seramik ve hediyelik için Kapalıçarşı ve Mısır Çarşısı; markalar için Nişantaşı ve Bağdat Caddesi; tek çatı altında geniş seçim için büyük alışveriş merkezleri. Üçünü aynı güne sıkıştırmak yerine ayrı yarım günlere bölmek daha rahat.",
          ar: "يعتمد على ما تبحث عنه. فللسجاد والبهارات والخزف والهدايا: البازار الكبير والسوق المصري؛ وللماركات: نيشانتاشي وشارع بغداد؛ وللاختيار الواسع تحت سقف واحد: المولات الكبرى. ومن الأريح توزيعها على أنصاف أيام منفصلة بدل حشرها في يوم واحد.",
          en: "It depends what you are after. Carpets, spices, ceramics and gifts: the Grand Bazaar and Spice Bazaar. Brands: Nişantaşı and Bağdat Avenue. Wide choice under one roof: the large malls. Splitting these across separate half-days is easier than squeezing all three into one.",
        },
      },
      {
        question: { tr: "Aldıklarımı taşımak sorun olur mu?", ar: "هل يشكّل حمل المشتريات مشكلة؟", en: "Is carrying purchases a problem?" },
        answer: {
          tr: "Çarşılarda yürüme mesafeleri uzun ve sokaklar dardır; poşetler birikince gezinin keyfi kaçar. Aracın gün boyu yanınızda olması burada işe yarar: alınanlar araca bırakılır, gezmeye elleriniz boş devam edilir. Dönüş bagajı için valiz ağırlığını da baştan hesaba katmakta fayda var.",
          ar: "مسافات المشي في الأسواق طويلة والأزقة ضيقة؛ وحين تتراكم الأكياس تفقد الجولة متعتها. وهنا تظهر فائدة بقاء السيارة معك طوال اليوم: تُترك المشتريات في السيارة وتتابع التجوّل ويداك فارغتان. ومن المفيد أيضاً حساب وزن الحقائب للعودة منذ البداية.",
          en: "Walking distances in the bazaars are long and the lanes narrow; once the bags pile up the fun goes out of the trip. This is where having the vehicle with you all day helps: purchases go in the car and you carry on empty-handed. It is also worth planning your luggage allowance for the flight home in advance.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Kapalıçarşı ve Mısır Çarşısı",
          ar: "البازار المسقوف وبازار التوابل",
          en: "The Grand Bazaar and the Spice Bazaar",
        },
        body: {
          tr: "Kapalıçarşı halı, takı, seramik ve deri için; Mısır Çarşısı baharat, lokum ve kuruyemiş için gidilen yerdir. İkisi de tarihî yarımadada ve birbirine yürüme mesafesinde. Çarşılarda etiket fiyatı çoğu zaman başlangıç noktasıdır; kibarca pazarlık beklenen bir davranıştır.",
          ar: "البازار المسقوف للسجاد والمجوهرات والسيراميك والجلد؛ وبازار التوابل للبهارات والملبن والمكسّرات. كلاهما في شبه الجزيرة التاريخية وعلى مسافة سير من بعضهما. وفي البازارات يكون السعر المعلن نقطة بداية غالباً؛ والمساومة بلطف سلوك متوقّع.",
          en: "The Grand Bazaar is for carpets, jewellery, ceramics and leather; the Spice Bazaar for spices, Turkish delight and nuts. Both are on the historic peninsula, within walking distance of each other. In the bazaars the marked price is usually a starting point; polite haggling is expected.",
        },
      },
      {
        heading: {
          tr: "Caddeler ve alışveriş merkezleri",
          ar: "الشوارع والمولات",
          en: "Streets and malls",
        },
        body: {
          tr: "Nişantaşı Avrupa yakasında, Bağdat Caddesi Anadolu yakasında marka alışverişinin merkezidir. Alışveriş merkezlerinde fiyat sabittir, pazarlık yoktur ve kapalı alan olduğu için hava koşullarından etkilenmezsiniz. Çocuklu ailelerin yaz sıcağında ya da yağmurlu bir günde tercih ettiği yer genelde burasıdır.",
          ar: "نيشانتاشي في الجانب الأوروبي وشارع بغداد في الجانب الآسيوي هما مركزا التسوّق للماركات. وفي المولات السعر ثابت ولا مساومة، وكونها مغلقة يعني ألّا تتأثر بالطقس. وغالباً ما تفضّلها العائلات مع الأطفال في حرّ الصيف أو في يوم ممطر.",
          en: "Nisantasi on the European side and Bagdat Street on the Asian side are the centres of brand shopping. In malls prices are fixed, there is no haggling, and being indoors keeps you clear of the weather. Families with children usually pick these in summer heat or on a rainy day.",
        },
      },
      {
        heading: {
          tr: "Taşıma ve bagaj",
          ar: "الحمل والحقائب",
          en: "Carrying it home",
        },
        body: {
          tr: "Alışveriş günü sonunda elde taşınacak paket sayısı çoğu zaman tahmin edilenden fazla olur. Aracın gün boyu emrinizde olması bu noktada işe yarar: paketleri araca bırakıp gezmeye devam edebilirsiniz. Halı gibi büyük alımlarda satıcılar kargo düzenler; ülkeye giriş kurallarını önceden öğrenmek gerekir.",
          ar: "في نهاية يوم التسوّق يكون عدد الأكياس أكثر مما يُتوقّع عادةً. وهنا تفيد السيارة الموضوعة تحت تصرّفك طوال اليوم: تترك الأكياس فيها وتواصل التجوّل. وفي المشتريات الكبيرة كالسجاد ينظّم البائعون الشحن؛ ومن اللازم معرفة قواعد الإدخال إلى بلدك مسبقاً.",
          en: "By the end of a shopping day there are usually more bags than expected. This is where having the car at your disposal helps: leave the bags in it and carry on. For large purchases such as carpets, sellers arrange shipping; check your own country's import rules in advance.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-helal-yemek-rehberi",
    image: "/images/places/kadikoy.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul'da helal yemek: nerede ne yenir",
      ar: "الطعام الحلال في إسطنبول: أين تأكل وماذا",
      en: "Halal food in Istanbul: where and what to eat",
    },
    excerpt: {
      tr: "Türk mutfağında neyin helal olduğu, hangi semtte ne bulunur ve dikkat edilecek tek şey.",
      ar: "ما هو الحلال في المطبخ التركي، وماذا تجد في كل منطقة، والنقطة الوحيدة التي تحتاج انتباهاً.",
      en: "What is halal in Turkish cuisine, what each district offers, and the one thing to watch for.",
    },
    facts: [
      {
        label: { tr: "Genel durum", ar: "الوضع العام", en: "In general" },
        value: { tr: "Et ürünleri yaygın olarak helal", ar: "منتجات اللحوم حلال على نطاق واسع", en: "Meat is widely halal" },
      },
      {
        label: { tr: "Dikkat", ar: "انتبه", en: "Watch for" },
        value: { tr: "Alkol servisi yapan yerler", ar: "الأماكن التي تقدّم الكحول", en: "Places serving alcohol" },
      },
      {
        label: { tr: "Kahvaltı", ar: "الفطور", en: "Breakfast" },
        value: { tr: "Türk kahvaltısı etsiz ve bol", ar: "الفطور التركي بلا لحم ووفير", en: "Turkish breakfast is meat-free and generous" },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'de et ürünleri helal mi?", ar: "هل اللحوم في تركيا حلال؟", en: "Is meat in Türkiye halal?" },
        answer: {
          tr: "Türkiye'de kasaplık ve et üretimi yaygın olarak helal usulle yapılır, bu yüzden lokantaların büyük çoğunluğunda et konusunda ayrı bir sorun çıkmaz. Dikkat edilmesi gereken nokta alkol servisi yapan işletmeler ve bazı uluslararası zincirlerin tedarikidir; emin olmak isteyen misafir doğrudan sorabilir.",
          ar: "الذبح وإنتاج اللحوم في تركيا يجريان على النحو الحلال في الغالب، ولذلك لا تثير اللحوم مشكلة خاصة في معظم المطاعم. أما ما ينبغي الانتباه إليه فهو المطاعم التي تقدّم الكحول وموردو بعض السلاسل العالمية؛ ومن أراد التأكد فبإمكانه السؤال مباشرة.",
          en: "Butchery and meat production in Türkiye are widely halal, so meat is not a separate concern in the great majority of restaurants. What to watch for is venues serving alcohol and the sourcing of some international chains; guests who want certainty can simply ask.",
        },
      },
      {
        question: { tr: "Türk kahvaltısı nasıl bir şey?", ar: "كيف هو الفطور التركي؟", en: "What is a Turkish breakfast like?" },
        answer: {
          tr: "Peynir çeşitleri, zeytin, domates, salatalık, bal, kaymak, reçel ve sıcak ekmekten oluşan geniş bir sofradır; et içermediği için helal konusunda hiçbir tereddüt bırakmaz. Yumurta çeşitleri ve börek de eklenir. Kahvaltı sofraları özellikle Boğaz kıyısı semtlerinde uzun ve keyifli kurulur.",
          ar: "هو مائدة واسعة من أصناف الجبن والزيتون والطماطم والخيار والعسل والقشطة والمربى والخبز الساخن؛ ولأنه خالٍ من اللحم فلا يترك أي تردد بشأن الحلال. ويُضاف إليه البيض بأنواعه والبوريك. وتُمدّ موائد الفطور طويلةً وممتعة خاصةً في أحياء ساحل البوسفور.",
          en: "A wide spread of cheeses, olives, tomatoes, cucumber, honey, clotted cream, jam and hot bread; since it contains no meat it raises no halal question at all. Eggs and börek are added too. Breakfast is served long and leisurely, especially in the Bosphorus-shore districts.",
        },
      },
      {
        question: { tr: "Arap mutfağı sunan lokantalar nerede bulunur?", ar: "أين توجد مطاعم المطبخ العربي؟", en: "Where can you find Arabic cuisine?" },
        answer: {
          tr: "Fatih, Aksaray ve Beyoğlu çevresinde Arap mutfağı sunan lokanta sayısı fazladır ve menüler Arapça yazılıdır. Bununla birlikte Türk mutfağını denemeden dönmemek gerekir; kebap, pide, mercimek çorbası ve ızgara balık çoğu Körfez damak tadına yakın durur.",
          ar: "يكثر عدد المطاعم التي تقدّم المطبخ العربي في محيط الفاتح وأقسراي وبي أوغلو، وقوائم الطعام فيها مكتوبة بالعربية. ومع ذلك لا ينبغي العودة دون تجربة المطبخ التركي؛ فالكباب والبيده وشوربة العدس والسمك المشوي قريبة من ذوق الخليج.",
          en: "Around Fatih, Aksaray and Beyoğlu there are many restaurants serving Arabic cuisine with menus in Arabic. Even so, it would be a shame to leave without trying Turkish food — kebab, pide, lentil soup and grilled fish sit close to Gulf tastes.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Türk mutfağında et meselesi",
          ar: "مسألة اللحم في المطبخ التركي",
          en: "The meat question in Turkish cuisine",
        },
        body: {
          tr: "Türkiye'de kasaplık ve et işleme yaygın olarak İslami usule göre yapılır; kebapçılar, dönerciler ve ev yemekleri sunan lokantalar bu açıdan sorun çıkarmaz. Domuz ürünü Türk mutfağının parçası değildir ve normal restoranlarda bulunmaz. Emin olmak isteyen misafirlerimiz için tek pratik soru şudur: mekân alkol servisi yapıyor mu.",
          ar: "الذبح وتصنيع اللحوم في تركيا يجريان على نطاق واسع وفق الطريقة الإسلامية؛ ومطاعم الكباب والدونر والمطاعم البيتية لا تثير إشكالاً في هذا الجانب. ولحم الخنزير ليس جزءاً من المطبخ التركي ولا يُوجد في المطاعم العادية. والسؤال العملي الوحيد لمن يريد الاطمئنان: هل يقدّم المكان الكحول.",
          en: "Butchery and meat processing in Türkiye are widely done according to Islamic practice; kebab houses, döner shops and home-style restaurants raise no issue here. Pork is not part of Turkish cuisine and is not found in ordinary restaurants. For guests who want certainty, the one practical question is whether the venue serves alcohol.",
        },
      },
      {
        heading: {
          tr: "Semt semt ne bulunur",
          ar: "ماذا تجد في كل منطقة",
          en: "What each district offers",
        },
        body: {
          tr: "Sultanahmet ve Fatih çevresinde aile lokantaları ve alkolsüz mekânlar çoğunluktadır; Arapça menü bulmak da en kolay buradadır. Taksim ve Beyoğlu'nda çeşit çok ama alkol servisi yapan yerler de fazladır. Nişantaşı ve alışveriş merkezlerinde uluslararası zincirlerin yanında Türk mutfağı sunan aile restoranları bulunur.",
          ar: "حول السلطان أحمد والفاتح تكثر المطاعم العائلية والأماكن الخالية من الكحول؛ وهنا أسهل ما تجد قائمة طعام بالعربية. أما في تقسيم وبيوغلو فالتنوّع كبير لكن الأماكن التي تقدّم الكحول أكثر أيضاً. وفي نيشانتاشي والمولات تجد إلى جانب السلاسل العالمية مطاعم عائلية تقدّم المطبخ التركي.",
          en: "Around Sultanahmet and Fatih, family restaurants and alcohol-free venues dominate, and Arabic menus are easiest to find here. Taksim and Beyoglu offer more variety but also more places serving alcohol. In Nisantasi and the malls you will find family restaurants serving Turkish food alongside international chains.",
        },
      },
      {
        heading: {
          tr: "Kahvaltı ve tatlı",
          ar: "الفطور والحلويات",
          en: "Breakfast and sweets",
        },
        body: {
          tr: "Türk kahvaltısı peynir, zeytin, yumurta, bal ve ekmekten oluşur; etsiz olduğu için hiçbir soru işareti bırakmaz ve çocuklu aileler için günün en rahat öğünüdür. Baklava, künefe ve dondurma da aynı şekilde sorunsuzdur. Şoförümüz güzergâh üzerinde durabileceğiniz yerleri bilir; bir yerden emin olmak isterseniz sormanız yeterli.",
          ar: "الفطور التركي جبن وزيتون وبيض وعسل وخبز؛ وكونه بلا لحم لا يترك أي علامة استفهام، وهو أريح وجبة في اليوم للعائلات مع الأطفال. والبقلاوة والكنافة والمثلجات كذلك بلا إشكال. وسائقنا يعرف الأماكن التي يمكن التوقّف عندها على الطريق؛ وإذا أردت الاطمئنان لمكان يكفي أن تسأل.",
          en: "Turkish breakfast is cheese, olives, eggs, honey and bread; being meat-free it raises no questions and is the easiest meal of the day with children. Baklava, künefe and ice cream are equally straightforward. Our driver knows where you can stop along the route; if you want to be sure about a place, just ask.",
        },
      },
    ],
  },
  {
    slug: "bogaz-turu-rehberi",
    image: "/images/places/bogaz-kopru.jpg",
    minutes: 4,
    title: {
      tr: "Boğaz turu rehberi: hangi tekne, ne kadar sürer",
      ar: "دليل جولة البوسفور: أي قارب وكم تستغرق",
      en: "A Bosphorus cruise guide: which boat, how long",
    },
    excerpt: {
      tr: "Kısa tur mu tam gün mü, nereden binilir, ne görülür — ve hangi saatte gitmeli.",
      ar: "جولة قصيرة أم يوم كامل، من أين تركب، وماذا ترى — وفي أي ساعة تذهب.",
      en: "Short cruise or full day, where to board, what you see — and the best hour to go.",
    },
    facts: [
      {
        label: { tr: "Kısa tur", ar: "جولة قصيرة", en: "Short cruise" },
        value: { tr: "1,5 – 2 saat", ar: "ساعة ونصف – ساعتان", en: "1.5 – 2 hrs" },
      },
      {
        label: { tr: "Kalkış", ar: "الانطلاق", en: "Departure" },
        value: { tr: "Eminönü, Kabataş, Beşiktaş", ar: "أمينونو، كاباطاش، بشكتاش", en: "Eminonu, Kabatas, Besiktas" },
      },
      {
        label: { tr: "En iyi saat", ar: "أفضل وقت", en: "Best time" },
        value: { tr: "İkindi ve gün batımı", ar: "العصر وغروب الشمس", en: "Late afternoon and sunset" },
      },
    ],
    faq: [
      {
        question: { tr: "Boğaz turu ne kadar sürer?", ar: "كم تستغرق جولة البوسفور؟", en: "How long does a Bosphorus cruise take?" },
        answer: {
          tr: "Kısa turlar bir buçuk ile iki saat arasındadır ve iki köprü arasındaki klasik hattı kapsar. Tam gün turlar Karadeniz ağzına, Anadolu Kavağı'na kadar gider ve öğle molası içerir. İlk ziyarette kısa tur çoğu misafir için yeterli oluyor.",
          ar: "تتراوح الجولات القصيرة بين ساعة ونصف وساعتين وتغطي المسار الكلاسيكي بين الجسرين. أما جولات اليوم الكامل فتمتد حتى مدخل البحر الأسود عند أناضولو كواغي وتتضمن استراحة غداء. وفي الزيارة الأولى تكفي الجولة القصيرة معظم الضيوف.",
          en: "Short cruises run one and a half to two hours and cover the classic route between the two bridges. Full-day cruises go as far as the mouth of the Black Sea at Anadolu Kavağı and include a lunch break. On a first visit the short cruise suits most guests.",
        },
      },
      {
        question: { tr: "Boğaz turu için en iyi saat hangisi?", ar: "ما أفضل وقت لجولة البوسفور؟", en: "What is the best time of day for a Bosphorus cruise?" },
        answer: {
          tr: "İkindi ve gün batımı saatleri. Işık yalıların ve camilerin üzerine yandan düşer, fotoğraflar en iyi bu saatte çıkar ve sıcak yaz öğlelerinden kaçınılmış olur. Sabah turları daha sakindir; gece turlarında ise şehir ışıklı görünür ama ayrıntılar kaybolur.",
          ar: "ساعات العصر والغروب. فالضوء يسقط جانبياً على القصور الخشبية والمساجد، وتخرج الصور في أجمل حالاتها، وتتجنّب حرّ الظهيرة الصيفية. أما جولات الصباح فأهدأ؛ وفي الجولات الليلية تبدو المدينة مضاءة لكن التفاصيل تضيع.",
          en: "Late afternoon and sunset. The light falls sideways across the waterfront mansions and mosques, photographs come out best, and you avoid the hot summer midday. Morning cruises are calmer; on night cruises the city looks lit up but the detail is lost.",
        },
      },
      {
        question: { tr: "Tekne turu nereden kalkıyor?", ar: "من أين تنطلق جولة القارب؟", en: "Where do the boats depart from?" },
        answer: {
          tr: "Eminönü, Kabataş ve Beşiktaş en yaygın kalkış noktaları. Sultanahmet'te kalanlar için Eminönü yürüme mesafesinde; Taksim'de kalanlar için Kabataş daha yakın. Özel tekne kiralamada kalkış noktası konakladığınız yere göre seçilebilir.",
          ar: "إمينونو وكاباتاش وبشيكتاش هي أكثر نقاط الانطلاق شيوعاً. فمن يقيم في السلطان أحمد تكون إمينونو على مسافة مشي منه، ومن يقيم في تقسيم تكون كاباتاش أقرب إليه. وعند استئجار قارب خاص يمكن اختيار نقطة الانطلاق بحسب مكان إقامتك.",
          en: "Eminönü, Kabataş and Beşiktaş are the most common departure points. If you are staying in Sultanahmet, Eminönü is within walking distance; from Taksim, Kabataş is closer. With a private boat charter the departure point can be chosen to suit where you are staying.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Kısa tur mu, tam gün mü",
          ar: "جولة قصيرة أم يوم كامل",
          en: "Short cruise or full day",
        },
        body: {
          tr: "Kısa Boğaz turları genellikle bir buçuk-iki saat sürer ve iki köprü arasını gösterir; şehir turu programının içine rahatça sığar. Tam gün turlar Karadeniz'in ağzına kadar gider, Anadolu Kavağı'nda mola verir ve günün tamamını alır. Çocuklu ailelerin çoğu için kısa tur yeterlidir; uzun tur dönüşte yorgunluk yaratabilir.",
          ar: "جولات البوسفور القصيرة تستغرق عادةً ساعة ونصف إلى ساعتين وتُظهر ما بين الجسرين؛ وتندرج بسهولة داخل برنامج جولة المدينة. أما جولات اليوم الكامل فتصل إلى مدخل البحر الأسود وتتوقّف في أنادولو كاواغي وتستغرق اليوم كله. ولمعظم العائلات مع الأطفال تكفي الجولة القصيرة؛ فالطويلة قد تُتعب في العودة.",
          en: "Short Bosphorus cruises usually run an hour and a half to two hours and cover the stretch between the two bridges; they fit comfortably inside a city-tour day. Full-day cruises go up to the mouth of the Black Sea, stop at Anadolu Kavagi and take the whole day. For most families with children the short cruise is enough; the long one can leave everyone tired on the way back.",
        },
      },
      {
        heading: {
          tr: "Ne görülür",
          ar: "ماذا ترى",
          en: "What you see",
        },
        body: {
          tr: "Tekne Dolmabahçe Sarayı, Ortaköy Camii, Rumeli Hisarı, Kız Kulesi ve iki yakadaki ahşap yalıları geçer. Şehri denizden görmek, karada saatlerce yürüyerek elde edemeyeceğiniz bir perspektif verir ve fotoğraf için günün en verimli kısmıdır. Üst güverte manzara için iyidir ama rüzgârlıdır; ince bir üst almak işe yarar.",
          ar: "يمرّ القارب بقصر دولمة بهجة وجامع أورتاكوي وقلعة روملي حصار وبرج الفتاة والقصور الخشبية على الضفتين. ورؤية المدينة من البحر تمنحك زاوية لا تحصل عليها بساعات من المشي، وهي أنتج وقت للتصوير في اليوم. والطابق العلوي أفضل للإطلالة لكنه معرّض للرياح؛ ومن المفيد أخذ سترة خفيفة.",
          en: "The boat passes Dolmabahce Palace, Ortakoy Mosque, Rumeli Fortress, the Maiden's Tower and the wooden waterside mansions on both shores. Seeing the city from the water gives a perspective hours of walking cannot, and it is the most productive part of the day for photographs. The upper deck is best for the view but windy; a light jacket helps.",
        },
      },
      {
        heading: {
          tr: "Saat seçimi",
          ar: "اختيار الساعة",
          en: "Choosing the hour",
        },
        body: {
          tr: "Öğle saatlerinde güneş tepededir ve fotoğraflar sert çıkar. İkindi ve gün batımı saatleri hem ışık hem sıcaklık açısından en iyisidir; yaz aylarında serinlik de o saatte başlar. Programı kurarken tekne saatini önceden belirlemek, gün içindeki diğer durakların sırasını da netleştirir.",
          ar: "في الظهيرة تكون الشمس في كبد السماء وتخرج الصور قاسية. أما العصر والغروب فالأفضل من حيث الضوء والحرارة معاً؛ وفي الصيف تبدأ البرودة في تلك الساعة. وتحديد موعد القارب مسبقاً عند وضع البرنامج يوضّح أيضاً ترتيب بقية محطات اليوم.",
          en: "At midday the sun is overhead and photographs come out harsh. Late afternoon and sunset are best for both light and temperature; in summer that is also when it starts to cool. Fixing the boat time in advance also settles the order of the day's other stops.",
        },
      },
    ],
  },
  {
    slug: "cocuklu-ailelerle-istanbul",
    image: "/images/chauffeur.jpg",
    minutes: 4,
    title: {
      tr: "Çocuklu ailelerle İstanbul: pratik notlar",
      ar: "إسطنبول مع الأطفال: ملاحظات عملية",
      en: "Istanbul with children: practical notes",
    },
    excerpt: {
      tr: "Bebek arabası, yürüme mesafeleri, mola noktaları ve programı kısaltmanın doğru yolu.",
      ar: "عربة الأطفال ومسافات المشي ونقاط الاستراحة والطريقة الصحيحة لاختصار البرنامج.",
      en: "Pushchairs, walking distances, rest stops and the right way to shorten the plan.",
    },
    facts: [
      {
        label: { tr: "Bebek arabası", ar: "عربة الأطفال", en: "Pushchair" },
        value: { tr: "Tarihî yarımadada zor", ar: "صعبة في شبه الجزيرة التاريخية", en: "Hard on the historic peninsula" },
      },
      {
        label: { tr: "Günlük durak", ar: "محطات اليوم", en: "Stops per day" },
        value: { tr: "Üçten fazlası yorucu", ar: "أكثر من ثلاث مُتعب", en: "More than three tires everyone" },
      },
      {
        label: { tr: "Çocuk koltuğu", ar: "مقعد الأطفال", en: "Child seat" },
        value: { tr: "Talebe göre, ek ücretsiz", ar: "عند الطلب وبدون رسوم", en: "On request, no extra charge" },
      },
    ],
    faq: [
      {
        question: { tr: "Tarihî yarımadada bebek arabası kullanılır mı?", ar: "هل يمكن استخدام عربة الأطفال في شبه الجزيرة التاريخية؟", en: "Can you use a pushchair in the historic peninsula?" },
        answer: {
          tr: "Zor. Sultanahmet ve çevresinde sokaklar arnavut kaldırımı, kaldırımlar dar ve zemin sık sık eğimli. Küçük çocuklar için kanguru ya da sırt taşıyıcı çoğu ailenin daha rahat bulduğu çözüm. Alışveriş merkezlerinde ve Boğaz sahilinde ise bebek arabası sorunsuz kullanılır.",
          ar: "صعب. ففي السلطان أحمد وما حوله تكون الشوارع مرصوفة بالحجارة والأرصفة ضيقة والأرض مائلة في كثير من المواضع. ولذلك تجد معظم العائلات أن الحمّالة الأمامية أو حقيبة الظهر أريح للأطفال الصغار. أما في المولات وعلى ساحل البوسفور فتُستخدم عربة الأطفال دون مشكلة.",
          en: "It is difficult. In and around Sultanahmet the streets are cobbled, the pavements narrow and the ground often sloped. For small children most families find a carrier or backpack easier. In the malls and along the Bosphorus shore a pushchair is no problem at all.",
        },
      },
      {
        question: { tr: "Çocuk koltuğu sağlanıyor mu?", ar: "هل يتوفر مقعد للأطفال؟", en: "Are child seats provided?" },
        answer: {
          tr: "Evet ve ek ücret alınmaz, ancak talebin önceden bildirilmesi gerekir; koltuk araçta hazır durmaz, çocuğun yaşına göre takılır. Rezervasyon sırasında çocukların yaşını yazmanız yeterli. Uzun yolculuklarda bu ayrıntı hem güvenlik hem konfor açısından fark yaratıyor.",
          ar: "نعم ودون رسوم إضافية، لكن يجب ذكر الطلب مسبقاً؛ فالمقعد لا يكون جاهزاً داخل السيارة بل يُركَّب بحسب عمر الطفل. ويكفي أن تذكر أعمار الأطفال عند الحجز. وفي الرحلات الطويلة يُحدث هذا التفصيل فرقاً في السلامة والراحة معاً.",
          en: "Yes, at no extra charge, but the request must be made in advance; the seat is not kept in the vehicle and is fitted according to the child's age. Just give the children's ages at booking. On long journeys this detail makes a difference to both safety and comfort.",
        },
      },
      {
        question: { tr: "Çocuklar için hangi duraklar daha iyi geçiyor?", ar: "ما المحطات الأنسب للأطفال؟", en: "Which stops work best for children?" },
        answer: {
          tr: "Açık alanlı ve hareketli duraklar: Boğaz'da tekne turu, Emirgan ve Gülhane gibi parklar, Miniatürk ve akvaryum gibi mekânlar. Uzun süre ayakta beklemek gerektiren müzeler küçük yaşlarda zorlayıcı olur; bunları günün ilk durağına koymak, çocuk henüz dinçken gezmeyi sağlar.",
          ar: "المحطات المفتوحة والمليئة بالحركة: جولة القارب في البوسفور، وحدائق مثل أميرغان وغولهانه، وأماكن مثل مينياتورك والأكواريوم. أما المتاحف التي تستلزم وقوفاً طويلاً فتكون مرهقة في الأعمار الصغيرة؛ ووضعها كمحطة أولى في اليوم يتيح زيارتها والطفل ما زال نشيطاً.",
          en: "Open-air, active stops: a Bosphorus boat trip, parks like Emirgan and Gülhane, places like Miniatürk and the aquarium. Museums that involve long spells of standing are hard on younger children; putting them first in the day means visiting while the child is still fresh.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Yürüme mesafeleri gerçekte ne kadar",
          ar: "كم هي مسافات المشي فعلاً",
          en: "How far the walking really is",
        },
        body: {
          tr: "Tarihî yarımadadaki noktalar haritada yakın görünür ama arada taş döşeli, eğimli sokaklar vardır ve bebek arabası her yerde rahat gitmez. Topkapı Sarayı'nın kendisi geniş bir alandır; içeride bir-iki saat yürünür. Bir güne iki büyük müze koymak, çocuklu bir aile için genellikle fazladır.",
          ar: "تبدو معالم شبه الجزيرة التاريخية متقاربة على الخريطة، لكن بينها أزقة حجرية مائلة ولا تسير عربة الأطفال بسهولة في كل مكان. وقصر توبكابي نفسه مساحة واسعة؛ يُمشى داخله ساعة أو ساعتان. ووضع متحفين كبيرين في يوم واحد كثير عادةً على عائلة مع أطفال.",
          en: "The sights on the historic peninsula look close on a map, but between them are cobbled, sloping lanes where a pushchair will not roll easily. Topkapi Palace itself is a large site; you walk inside it for an hour or two. Putting two major museums in one day is usually too much for a family with children.",
        },
      },
      {
        heading: {
          tr: "Aracın gün boyu yanınızda olması",
          ar: "بقاء السيارة معكم طوال اليوم",
          en: "Having the car with you all day",
        },
        body: {
          tr: "Çocuklu bir programda en çok işe yarayan şey, aracın gün boyu emrinizde olmasıdır: ceket, su ve alışveriş paketleri araçta kalır, çocuk yorulduğunda ara verilir ve program kısaltılabilir. Araç her durakta sizi beklerse gün içinde ulaşım aramak diye bir mesele kalmaz.",
          ar: "أنفع شيء في برنامج مع أطفال هو بقاء السيارة تحت تصرّفكم طوال اليوم: تبقى الجاكيتات والماء وأكياس التسوّق فيها، وعند تعب الطفل تؤخذ استراحة ويُختصر البرنامج. وإذا انتظرتكم السيارة عند كل محطة فلن تبقى مسألة اسمها البحث عن مواصلات أثناء اليوم.",
          en: "On a programme with children, the most useful thing is having the car at your disposal all day: jackets, water and shopping bags stay in it, you pause when a child tires and the plan can be shortened. If the car waits at every stop, finding transport during the day stops being a problem at all.",
        },
      },
      {
        heading: {
          tr: "Hangi duraklar çocuklara iyi gelir",
          ar: "أي المحطات تناسب الأطفال",
          en: "Which stops work for children",
        },
        body: {
          tr: "Boğaz tekne turu, teleferikle Uludağ'a çıkmak ve Sapanca'da göl kenarında yürümek çocukların en çok sevdiği bölümlerdir; hepsi az yürüyüş çok manzara içerir. Uzun müze gezileri ve kalabalık çarşılar ise en çabuk yorulunan yerlerdir. İyi bir gün bu ikisini dengeler: sabah bir tarihî nokta, öğleden sonra açık hava.",
          ar: "جولة القارب في البوسفور، والصعود بالتلفريك إلى أولوداغ، والمشي على ضفة بحيرة سبانجا هي أحبّ الأجزاء إلى الأطفال؛ وكلها مشي قليل ومناظر كثيرة. أما جولات المتاحف الطويلة والبازارات المزدحمة فأسرع ما يُتعب. واليوم الجيد يوازن بينهما: معلم تاريخي صباحاً وهواء طلق بعد الظهر.",
          en: "A Bosphorus boat trip, the cable car up Uludag and walking by the lake at Sapanca are the parts children like most; all involve little walking and plenty of view. Long museum visits and crowded bazaars tire everyone fastest. A good day balances the two: one historic site in the morning, open air in the afternoon.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-uc-gun-programi",
    image: "/images/places/sultanahmet.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul'da üç gün: kısa ziyaret programı",
      ar: "ثلاثة أيام في إسطنبول: برنامج زيارة قصيرة",
      en: "Three days in Istanbul: a short-visit plan",
    },
    excerpt: {
      tr: "Az vakti olan için sıkıştırılmış ama yormayan bir sıra — neyi bırakmak gerektiği dahil.",
      ar: "ترتيب مكثّف لكنه غير مُرهق لمن وقته قصير — بما في ذلك ما يجب تركه.",
      en: "A condensed but not exhausting order for a short stay — including what to leave out.",
    },
    facts: [
      {
        label: { tr: "Süre", ar: "المدة", en: "Length" },
        value: { tr: "3 gün", ar: "3 أيام", en: "3 days" },
      },
      {
        label: { tr: "Konaklama", ar: "الإقامة", en: "Where to stay" },
        value: { tr: "Sultanahmet ya da Taksim", ar: "السلطان أحمد أو تقسيم", en: "Sultanahmet or Taksim" },
      },
      {
        label: { tr: "Şehir dışı", ar: "خارج المدينة", en: "Out of town" },
        value: { tr: "Bu programda yok", ar: "غير مدرج في هذا البرنامج", en: "Not in this plan" },
      },
    ],
    faq: [
      {
        question: { tr: "Üç günde İstanbul'un ne kadarı görülür?", ar: "كم يمكن رؤيته من إسطنبول في ثلاثة أيام؟", en: "How much of Istanbul can you see in three days?" },
        answer: {
          tr: "Ana hatlarıyla şehir görülür: tarihî yarımada, Boğaz ve Beyoğlu üç güne rahat sığar. Sığmayan şey şehir dışı gezileridir — Sapanca ya da Bursa eklemek programı bozar. Üç günlük ziyaretlerde şehir dışını bir sonraki sefere bırakmak en iyi sonucu veriyor.",
          ar: "تُرى المدينة في خطوطها العريضة: شبه الجزيرة التاريخية والبوسفور وبي أوغلو تتّسع لها ثلاثة أيام بأريحية. أما ما لا يتّسع فهو الرحلات خارج المدينة — فإضافة سبانجا أو بورصة تُخلّ بالبرنامج. وأفضل نتيجة في الزيارات الثلاثية أن يُترك الخارج لزيارة قادمة.",
          en: "You see the city in outline: the historic peninsula, the Bosphorus and Beyoğlu fit comfortably into three days. What does not fit is out-of-town trips — adding Sapanca or Bursa breaks the programme. On a three-day visit, leaving the day trips for next time works best.",
        },
      },
      {
        question: { tr: "Kısa ziyarette nerede kalmak daha mantıklı?", ar: "أين يُفضّل الإقامة في الزيارة القصيرة؟", en: "Where is it best to stay on a short visit?" },
        answer: {
          tr: "Sultanahmet ya da Taksim. Üç günlük programda yolda geçen her saat pahalıdır; merkezde kalmak günde bir saate kadar kazandırabilir. Boğaz kıyısı ve uzak semtler daha uzun ziyaretlerde anlamlı, kısa ziyarette ulaşım süresi keyfi götürür.",
          ar: "السلطان أحمد أو تقسيم. ففي برنامج من ثلاثة أيام تكون كل ساعة تُقضى على الطريق مكلفة؛ والإقامة في المركز قد توفّر ما يصل إلى ساعة يومياً. أما ساحل البوسفور والأحياء البعيدة فتناسب الزيارات الأطول، إذ يلتهم وقت التنقل متعة الزيارة القصيرة.",
          en: "Sultanahmet or Taksim. On a three-day programme every hour on the road is expensive; staying central can save up to an hour a day. The Bosphorus shore and outlying districts make sense on longer visits — on a short one, travel time eats the enjoyment.",
        },
      },
      {
        question: { tr: "Üç günlük programda neyi çıkarmak gerekir?", ar: "ما الذي ينبغي حذفه من برنامج الأيام الثلاثة؟", en: "What has to be cut from a three-day programme?" },
        answer: {
          tr: "Şehir dışı geziler, uzak müzeler ve uzun alışveriş turları. Bunun yerine tarihî yarımadaya bir tam gün, Boğaz ve Beyoğlu'na bir gün, üçüncü güne ise ilk iki günde yetişemediğiniz tek bir bölge ayrılır. Her günü tek bölgeye bağlamak, üç günü altı gün gibi kullandırır.",
          ar: "الرحلات خارج المدينة، والمتاحف البعيدة، وجولات التسوق الطويلة. وبدلاً منها يُخصَّص يوم كامل لشبه الجزيرة التاريخية، ويوم للبوسفور وبي أوغلو، واليوم الثالث لمنطقة واحدة لم تلحق بها في اليومين الأولين. وربط كل يوم بمنطقة واحدة يجعلك تستفيد من الأيام الثلاثة وكأنها ستة.",
          en: "Out-of-town trips, distant museums and long shopping tours. Instead, give a full day to the historic peninsula, a day to the Bosphorus and Beyoğlu, and the third day to the one area you did not reach. Tying each day to a single area makes three days work like six.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Birinci gün: tarihî yarımada",
          ar: "اليوم الأول: شبه الجزيرة التاريخية",
          en: "Day one: the historic peninsula",
        },
        body: {
          tr: "Sabah erken Sultanahmet Camii ve Ayasofya ile başlayın; ikisi de yürüme mesafesinde ve erken saat kuyruğu belirgin şekilde kısaltır. Öğleden sonra Topkapı Sarayı ya da Yerebatan Sarnıcı — üçünü birden aynı güne koymak yorar. Gün Kapalıçarşı'da kapanabilir.",
          ar: "ابدأ صباحاً باكراً بجامع السلطان أحمد وآيا صوفيا؛ كلاهما على مسافة سير والساعة المبكرة تقصّر الطابور بوضوح. وبعد الظهر قصر توبكابي أو صهريج البازيليك — ووضع الثلاثة في يوم واحد مُتعب. ويمكن أن يُختتم اليوم في البازار المسقوف.",
          en: "Start early with the Blue Mosque and Hagia Sophia; both are within walking distance and an early hour noticeably shortens the queue. In the afternoon, Topkapi Palace or the Basilica Cistern — putting all three in one day is tiring. The day can end at the Grand Bazaar.",
        },
      },
      {
        heading: {
          tr: "İkinci gün: Boğaz ve Beyoğlu",
          ar: "اليوم الثاني: البوسفور وبيوغلو",
          en: "Day two: the Bosphorus and Beyoglu",
        },
        body: {
          tr: "Öğleden önce Dolmabahçe Sarayı, ikindi vakti Boğaz turu. Tekneden indikten sonra Galata Kulesi ve Karaköy tarafı yürüyerek gezilebilir. Bu gün şehri hem karadan hem denizden gösterdiği için üç günlük programın en verimli günüdür.",
          ar: "قبل الظهر قصر دولمة بهجة، وعند العصر جولة البوسفور. وبعد النزول من القارب يمكن التجوّل سيراً في برج غالاتا وجهة كاراكوي. وهذا اليوم أنتج أيام البرنامج الثلاثة لأنه يُظهر المدينة من البرّ والبحر معاً.",
          en: "Dolmabahce Palace before noon, the Bosphorus cruise in the late afternoon. After landing, Galata Tower and the Karakoy side are walkable. This is the most productive day of the three because it shows the city from both land and water.",
        },
      },
      {
        heading: {
          tr: "Üçüncü gün ve neyi bırakmalı",
          ar: "اليوم الثالث وما الذي تتركه",
          en: "Day three, and what to leave out",
        },
        body: {
          tr: "Üçüncü günü alışverişe ve serbest zamana ayırın: Nişantaşı ya da bir alışveriş merkezi, öğleden sonra da dinlenme. Üç günlük bir ziyarette şehir dışına çıkmayı (Bursa, Sapanca) bilerek programa koymuyoruz — yol iki tarafı da yorar ve İstanbul'un kendisinden çalar. Şehir dışı, beş gün ve üstü programlara aittir.",
          ar: "خصّص اليوم الثالث للتسوّق والوقت الحر: نيشانتاشي أو أحد المولات، وبعد الظهر راحة. وفي زيارة من ثلاثة أيام لا ندرج الخروج خارج المدينة (بورصة، سبانجا) عن قصد — فالطريق يُتعب في الاتجاهين ويسرق من إسطنبول نفسها. الخروج خارج المدينة يناسب برامج خمسة أيام فأكثر.",
          en: "Give the third day to shopping and free time: Nisantasi or a mall, with an afternoon to rest. On a three-day visit we deliberately leave out trips beyond the city (Bursa, Sapanca) — the road tires you both ways and takes from Istanbul itself. Out-of-town days belong to programmes of five days or more.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-toplu-tasima-rehberi",
    image: "/images/places/kadikoy.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul'da toplu taşıma: metro, tramvay, vapur",
      ar: "المواصلات في إسطنبول: المترو والترام والعبّارات",
      en: "Getting around Istanbul: metro, tram and ferry",
    },
    excerpt: {
      tr: "İstanbulkart nedir, hangi hat nereye gider ve ne zaman özel araç daha mantıklı olur.",
      ar: "ما هي بطاقة إسطنبول، وأي خط يذهب إلى أين، ومتى تكون السيارة الخاصة أنسب.",
      en: "What the Istanbulkart is, which line goes where, and when a private car makes more sense.",
    },
    facts: [
      {
        label: { tr: "Ödeme", ar: "الدفع", en: "Payment" },
        value: { tr: "İstanbulkart, tüm hatlarda geçerli", ar: "بطاقة إسطنبول، صالحة على كل الخطوط", en: "Istanbulkart, valid on all lines" },
      },
      {
        label: { tr: "Tarihî yarımada", ar: "شبه الجزيرة التاريخية", en: "Historic peninsula" },
        value: { tr: "T1 tramvay hattı", ar: "خط الترام T1", en: "The T1 tram line" },
      },
      {
        label: { tr: "Boğaz geçişi", ar: "عبور البوسفور", en: "Crossing the Bosphorus" },
        value: { tr: "Vapur, en keyiflisi", ar: "العبّارة، الأمتع", en: "Ferry, the nicest way" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbulkart nedir, nasıl alınır?", ar: "ما هي بطاقة إسطنبول كارت وكيف تُشترى؟", en: "What is the İstanbulkart and how do you get one?" },
        answer: {
          tr: "Şehrin ortak ulaşım kartıdır ve metro, tramvay, otobüs, vapur, füniküler dâhil bütün hatlarda geçer. İstasyonlardaki otomatlardan alınır ve yine aynı otomatlardan yüklenir. Aynı kart birden fazla kişi için kullanılabilir; her binişte ayrı okutmak yeterli.",
          ar: "هي بطاقة النقل الموحّدة في المدينة، وتصلح لجميع الخطوط بما فيها المترو والترام والحافلات والعبّارات والقطار المائل. تُشترى من الأجهزة الموجودة في المحطات، وتُشحن من الأجهزة نفسها. ويمكن استخدام البطاقة الواحدة لأكثر من شخص؛ إذ يكفي تمريرها عند كل صعود.",
          en: "It is the city's shared transport card and works on every line — metro, tram, bus, ferry and funicular. You buy it from machines at the stations and top it up at the same machines. One card can be used for several people; just tap it once per passenger.",
        },
      },
      {
        question: { tr: "Turistik yerlere hangi hat gider?", ar: "أي خط يوصل إلى الأماكن السياحية؟", en: "Which line goes to the tourist sites?" },
        answer: {
          tr: "Tarihî yarımadanın omurgası T1 tramvay hattıdır: Sultanahmet, Eminönü ve Kapalıçarşı bu hat üzerindedir. Taksim ve Şişli metroyla bağlanır. Boğaz'ın iki yakası arasında geçiş için vapur hem en hızlı hem en keyifli seçenek.",
          ar: "العمود الفقري لشبه الجزيرة التاريخية هو خط الترام T1: فالسلطان أحمد وإمينونو والبازار الكبير تقع عليه. أما تقسيم وشيشلي فيرتبطان بالمترو. وللانتقال بين ضفتي البوسفور تبقى العبّارة الأسرع والأمتع معاً.",
          en: "The backbone of the historic peninsula is the T1 tram line: Sultanahmet, Eminönü and the Grand Bazaar all sit on it. Taksim and Şişli are connected by metro. To cross between the two sides of the Bosphorus, the ferry is both the fastest and the most enjoyable option.",
        },
      },
      {
        question: { tr: "Ne zaman toplu taşıma yerine özel araç kullanmalı?", ar: "متى يُفضّل استخدام السيارة الخاصة بدل النقل العام؟", en: "When should you use a private vehicle instead of public transport?" },
        answer: {
          tr: "Bagajlı yolculuklarda, kalabalık aileyle gezerken, gün içinde şehrin iki ucuna gidilecekse ve gece geç saatlerde. Tek başına ve hafif bagajla gezen biri için metro çoğu zaman daha hızlıdır. İkisini karıştırmak da mümkün: gündüz tramvay, akşam araç.",
          ar: "في الرحلات مع الأمتعة، وعند التنقل مع عائلة كبيرة، وإذا كان اليوم يشمل طرفي المدينة، وفي ساعات الليل المتأخرة. أما من يتجوّل وحده بأمتعة خفيفة فالمترو أسرع له غالباً. ويمكن الجمع بين الاثنين: الترام نهاراً والسيارة مساءً.",
          en: "With luggage, when travelling as a large family, when the day spans opposite ends of the city, and late at night. For someone alone with light luggage the metro is usually faster. Mixing the two also works: tram by day, vehicle in the evening.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İstanbulkart ile başlayın",
          ar: "ابدأ ببطاقة إسطنبول",
          en: "Start with the Istanbulkart",
        },
        body: {
          tr: "İstanbulkart metro, tramvay, otobüs, vapur ve füniküler hatlarının hepsinde geçer; havalimanı dahil çoğu istasyonda otomatlardan alınır ve yüklenir. Tek kartla ailenin tamamı geçebilir, yani her kişiye ayrı kart almak zorunlu değildir. Aktarmalarda indirimli tarife uygulanır.",
          ar: "بطاقة إسطنبول صالحة على المترو والترام والحافلات والعبّارات والقطار المائل جميعاً؛ وتُشترى وتُشحن من الأجهزة في معظم المحطات بما فيها المطار. ويمكن للعائلة كلها العبور ببطاقة واحدة، فلا يلزم شراء بطاقة لكل شخص. وتُطبَّق تعرفة مخفّضة عند التبديل بين الخطوط.",
          en: "The Istanbulkart works on the metro, tram, buses, ferries and funiculars; you buy and top it up from machines at most stations, including the airport. One card can pass a whole family, so you do not need one each. Transfers between lines are discounted.",
        },
      },
      {
        heading: {
          tr: "Hangi hat nereye gider",
          ar: "أي خط يذهب إلى أين",
          en: "Which line goes where",
        },
        body: {
          tr: "T1 tramvay hattı tarihî yarımadanın omurgasıdır: Sultanahmet, Kapalıçarşı, Eminönü ve Karaköy bu hat üzerindedir. M2 metro Taksim ve Şişli'yi bağlar. Vapurlar Eminönü, Karaköy, Kabataş ve Üsküdar arasında işler ve Boğaz'ı geçmenin en ucuz, en keyifli yoludur.",
          ar: "خط الترام T1 هو العمود الفقري لشبه الجزيرة التاريخية: السلطان أحمد والبازار المسقوف وأمينونو وكاراكوي جميعها على هذا الخط. ومترو M2 يربط تقسيم بشيشلي. أما العبّارات فتعمل بين أمينونو وكاراكوي وكاباطاش وأسكودار، وهي أرخص وأمتع طريقة لعبور البوسفور.",
          en: "The T1 tram is the spine of the historic peninsula: Sultanahmet, the Grand Bazaar, Eminonu and Karakoy are all on it. The M2 metro links Taksim and Sisli. Ferries run between Eminonu, Karakoy, Kabatas and Uskudar, and are the cheapest and most enjoyable way to cross the Bosphorus.",
        },
      },
      {
        heading: {
          tr: "Ne zaman özel araç daha mantıklı",
          ar: "متى تكون السيارة الخاصة أنسب",
          en: "When a private car makes more sense",
        },
        body: {
          tr: "Toplu taşıma tek başına ya da çift gezenler için ucuz ve hızlıdır. Bagajlı bir varış, dört-beş kişilik bir aile, bebek arabası, gece geç saat ya da şehir dışı bir gün söz konusuysa hesap değişir: aktarmalar ve merdivenler zaman ve enerji alır. Pratik yaklaşım ikisini karıştırmaktır — havalimanı ve şehir dışı için araç, tarihî yarımada içinde tramvay.",
          ar: "المواصلات العامة رخيصة وسريعة لمن يسافر وحده أو لشخصين. أما مع الوصول بالحقائب، أو عائلة من أربعة أو خمسة، أو عربة أطفال، أو ساعة متأخرة ليلاً، أو يوم خارج المدينة، فيتغيّر الحساب: التبديلات والسلالم تأخذ وقتاً وطاقة. والنهج العملي هو المزج بينهما — سيارة للمطار وخارج المدينة، وترام داخل شبه الجزيرة التاريخية.",
          en: "Public transport is cheap and quick for one or two travellers. With a luggage-laden arrival, a family of four or five, a pushchair, a late-night hour or a day out of town, the calculation changes: transfers and stairs cost time and energy. The practical approach is to mix them — a car for the airport and out-of-town days, the tram inside the historic peninsula.",
        },
      },
    ],
  },
  {
    slug: "istanbulda-hava-durumu-ve-giyim",
    image: "/images/places/bogaz-kopru.jpg",
    minutes: 4,
    title: {
      tr: "İstanbul'da hava ve ne giyilir: ay ay rehber",
      ar: "الطقس في إسطنبول وماذا ترتدي: دليل شهرياً",
      en: "Istanbul weather and what to wear, month by month",
    },
    excerpt: {
      tr: "Nem, rüzgâr ve yağmur — sıcaklık rakamının söylemediği üç şey ve valize ne koymalı.",
      ar: "الرطوبة والرياح والمطر — ثلاثة أشياء لا يقولها رقم الحرارة، وماذا تضع في الحقيبة.",
      en: "Humidity, wind and rain — three things the temperature number does not tell you, and what to pack.",
    },
    facts: [
      {
        label: { tr: "En sıcak", ar: "الأحرّ", en: "Hottest" },
        value: { tr: "Temmuz–ağustos, nemli", ar: "يوليو–أغسطس، رطب", en: "July–August, humid" },
      },
      {
        label: { tr: "En yağışlı", ar: "الأكثر مطراً", en: "Wettest" },
        value: { tr: "Aralık–mart", ar: "ديسمبر–مارس", en: "December–March" },
      },
      {
        label: { tr: "Her mevsim", ar: "في كل موسم", en: "Year-round" },
        value: { tr: "Rüzgâr ve rahat ayakkabı", ar: "الرياح وحذاء مريح", en: "Wind and comfortable shoes" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul'da yazın ne giyilmeli?", ar: "ماذا يُلبس في إسطنبول صيفاً؟", en: "What should you wear in Istanbul in summer?" },
        answer: {
          tr: "İnce ve pamuklu kumaşlar, açık renkler ve mutlaka rahat ayakkabı. Nem yüzünden hava termometrenin gösterdiğinden ağır hissettirir. Akşamları Boğaz kıyısında rüzgâr çıkar, ince bir üst işe yarar. Camileri ziyaret edecekseniz omuz ve diz kapatan kıyafet yanınızda bulunsun.",
          ar: "أقمشة خفيفة قطنية وألوان فاتحة وحذاء مريح بالضرورة. فالرطوبة تجعل الجو أثقل مما يشير إليه الميزان. وفي المساء تهبّ الريح على ساحل البوسفور، فيفيد وجود طبقة خفيفة. وإن كنت ستزور المساجد فليكن معك لباس يغطي الكتفين والركبتين.",
          en: "Light cotton fabrics, pale colours and, above all, comfortable shoes. Humidity makes the air feel heavier than the thermometer says. Wind picks up along the Bosphorus in the evening, so a light layer helps. If you plan to visit mosques, bring clothing that covers shoulders and knees.",
        },
      },
      {
        question: { tr: "Kışın İstanbul çok mu soğuk?", ar: "هل إسطنبول شديدة البرودة في الشتاء؟", en: "Is Istanbul very cold in winter?" },
        answer: {
          tr: "Sıcaklık genelde sıfırın çok altına inmez ama rüzgâr ve nem soğuğu olduğundan keskin hissettirir. Aralık–mart arası en yağışlı dönemdir; su geçirmez bir mont ve kaymayan ayakkabı işe yarar. Kar her yıl yağar ama uzun sürmez, birkaç gün içinde erir.",
          ar: "لا تنخفض الحرارة عادةً كثيراً تحت الصفر، لكن الريح والرطوبة تجعلان البرد أقسى مما هو عليه. والفترة بين كانون الأول وآذار هي الأكثر مطراً؛ ويفيد فيها معطف مقاوم للماء وحذاء غير زلق. ويتساقط الثلج كل عام لكنه لا يدوم، إذ يذوب خلال أيام قليلة.",
          en: "Temperatures rarely drop far below freezing, but wind and damp make the cold feel sharper than it is. December to March is the wettest period; a waterproof coat and non-slip shoes help. Snow falls every year but does not last, melting within a few days.",
        },
      },
      {
        question: { tr: "Camileri ziyaret ederken nelere dikkat edilir?", ar: "ما الذي يُراعى عند زيارة المساجد؟", en: "What should you keep in mind when visiting mosques?" },
        answer: {
          tr: "Ayakkabılar girişte çıkarılır, bu yüzden kolay çıkarılıp giyilebilen ayakkabı pratik olur. Kadın ziyaretçiler için başörtüsü gerekir; büyük camilerin girişinde ödünç örtü bulunur ama kendi örtünüz daha rahattır. Namaz vakitlerinde ziyaret kısa süreliğine durur.",
          ar: "تُخلع الأحذية عند المدخل، لذلك يكون الحذاء سهل الخلع واللبس عملياً. ويلزم غطاء الرأس للزائرات؛ وتتوفر أغطية للاستعارة عند مداخل المساجد الكبرى، لكن غطاءك الخاص أريح. وتتوقف الزيارة لفترة قصيرة في أوقات الصلاة.",
          en: "Shoes come off at the entrance, so footwear that slips on and off easily is practical. Women visitors need a head covering; the larger mosques lend scarves at the door, but your own is more comfortable. Visits pause briefly during prayer times.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Sıcaklık rakamı yanıltır",
          ar: "رقم الحرارة يخدع",
          en: "The temperature number misleads",
        },
        body: {
          tr: "İstanbul denizle çevrilidir ve nem, hissedilen sıcaklığı yazın yukarı, kışın aşağı çeker: 30 derece Körfez'dekinden farklı hissedilir, 8 derece de öyle. Boğaz'dan gelen rüzgâr yıl boyu vardır ve akşamları belirgin şekilde serinletir; tekne turunda bunu en çok hissedersiniz.",
          ar: "إسطنبول محاطة بالبحر، والرطوبة ترفع الإحساس بالحرارة صيفاً وتخفضه شتاءً: فثلاثون درجة هنا تُحسّ غير ما تُحسّ في الخليج، وكذلك ثماني درجات. ورياح البوسفور موجودة طوال العام وتبرّد المساء بوضوح؛ وتشعر بها أكثر ما تشعر في جولة القارب.",
          en: "Istanbul is surrounded by water, and humidity pushes the felt temperature up in summer and down in winter: 30 degrees feels different from 30 in the Gulf, and so does 8. Wind off the Bosphorus is there year-round and cools the evenings noticeably; you feel it most on a boat trip.",
        },
      },
      {
        heading: {
          tr: "Mevsim mevsim ne koymalı",
          ar: "ماذا تضع في كل موسم",
          en: "What to pack by season",
        },
        body: {
          tr: "İlkbahar ve sonbaharda kat kat giyinmek en doğrusu: sabah serin, öğle ılık, akşam yine serin olur; ince bir yağmurluk yer kaplamaz. Yazın hafif ve nefes alan kumaşlar, şapka ve akşamlar için ince bir üst. Kışın su geçirmez ayakkabı, yağmurun kendisinden çok ıslak kaldırımlar yüzünden gerekir.",
          ar: "في الربيع والخريف الأصحّ هو اللبس طبقات: الصباح بارد والظهر دافئ والمساء بارد مجدداً؛ ومعطف مطر خفيف لا يأخذ مساحة. وفي الصيف أقمشة خفيفة تتنفّس وقبعة وسترة رقيقة للمساء. وفي الشتاء يلزم حذاء مقاوم للماء، بسبب الأرصفة المبتلّة أكثر من المطر نفسه.",
          en: "In spring and autumn layers are the answer: mornings are cool, midday mild, evenings cool again; a light waterproof takes no space. In summer, light breathable fabrics, a hat and a thin layer for evenings. In winter, waterproof shoes matter more because of wet pavements than because of the rain itself.",
        },
      },
      {
        heading: {
          tr: "Camiler ve ayakkabı",
          ar: "المساجد والأحذية",
          en: "Mosques and shoes",
        },
        body: {
          tr: "Cami ziyaretlerinde omuz ve diz kapalı olmalı, kadınlar için başörtüsü gerekir; girişte ücretsiz örtü verilir ama kendi şalınızı getirmek daha rahattır. Ayakkabılar çıkarılıp poşete konur, o yüzden kolay çıkan ayakkabı ve temiz çorap günü kolaylaştırır. Tarihî yarımadada zemin çoğu yerde taş döşelidir; topuklu ayakkabı bu turda işe yaramaz.",
          ar: "في زيارة المساجد يجب ستر الكتفين والركبتين، وللنساء غطاء رأس؛ ويُعطى غطاء مجاني عند المدخل لكن إحضار شالك أريح. وتُخلع الأحذية وتوضع في كيس، لذا فالحذاء سهل الخلع والجوارب النظيفة يسهّلان اليوم. وأرض شبه الجزيرة التاريخية مرصوفة بالحجر في معظمها؛ والكعب العالي لا ينفع في هذه الجولة.",
          en: "For mosque visits shoulders and knees must be covered and women need a headscarf; a free cover is given at the entrance, though bringing your own shawl is more comfortable. Shoes come off and go into a bag, so easy-off shoes and clean socks make the day easier. Much of the historic peninsula is cobbled; heels do not work on this tour.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-sehirler-arasi-mesafeler",
    image: "/images/tours/trabzon.jpg",
    minutes: 4,
    title: {
      tr: "Türkiye'de şehirler arası mesafeler ve süreler",
      ar: "المسافات والمدد بين المدن التركية",
      en: "Distances and travel times between Turkish cities",
    },
    excerpt: {
      tr: "Hangi şehir günübirlik gidilir, hangisi uçak ister — programı kurmadan önce bilinmesi gereken.",
      ar: "أي مدينة تُزار في يوم واحد وأيها تحتاج طائرة — ما يجب معرفته قبل وضع البرنامج.",
      en: "Which cities work as a day trip and which need a flight — what to know before planning.",
    },
    facts: [
      {
        label: { tr: "Günübirlik", ar: "زيارة يوم", en: "Day trip" },
        value: { tr: "Sapanca, Bursa, Yalova, Şile", ar: "سبانجا، بورصة، يالوفا، شيله", en: "Sapanca, Bursa, Yalova, Sile" },
      },
      {
        label: { tr: "Uçakla", ar: "بالطائرة", en: "By air" },
        value: { tr: "Trabzon, Bodrum, Antalya", ar: "طرابزون، بودروم، أنطاليا", en: "Trabzon, Bodrum, Antalya" },
      },
      {
        label: { tr: "Kural", ar: "القاعدة", en: "Rule of thumb" },
        value: { tr: "Tek yön 3 saati aşarsa konaklama", ar: "إن تجاوز الاتجاه الواحد 3 ساعات فبِت هناك", en: "Over 3 hrs one way: stay the night" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul'dan günübirlik nerelere gidilir?", ar: "إلى أين يمكن الذهاب من إسطنبول في رحلة يوم واحد؟", en: "Where can you go on a day trip from Istanbul?" },
        answer: {
          tr: "Sapanca ve Maşukiye, Bursa ve Uludağ, Yalova ile Şile en çok tercih edilen günübirlik duraklar. Hepsi tek yön iki–iki buçuk saat mesafede. Bu sınırın ötesindeki şehirler günübirlik programa sığmaz; yolda geçen süre gezilecek süreyi aşmaya başlar.",
          ar: "سبانجا وماشوكية، وبورصة وأولوداغ، ويالوفا وشيله هي أكثر الوجهات المطلوبة لرحلات اليوم الواحد. وجميعها على بعد ساعتين إلى ساعتين ونصف في الاتجاه الواحد. أما المدن الأبعد من هذا الحد فلا تتّسع لها رحلة اليوم الواحد؛ إذ يبدأ وقت الطريق يتجاوز وقت الزيارة.",
          en: "Sapanca and Maşukiye, Bursa and Uludağ, Yalova and Şile are the most popular day-trip destinations — all within two to two and a half hours each way. Cities beyond that limit do not fit a day trip; the time on the road starts to exceed the time spent there.",
        },
      },
      {
        question: { tr: "Hangi şehirlere uçakla gitmek gerekir?", ar: "ما المدن التي يلزم الوصول إليها بالطائرة؟", en: "Which cities do you need to fly to?" },
        answer: {
          tr: "Trabzon, Bodrum, Antalya, İzmir ve Kapadokya karayoluyla gidilecek mesafede değil. Bu şehirlere uçakla gidilir, iç hat uçuşları kısa sürer ve şehirde ulaşım yerinden ayarlanır. Karayolu bu mesafelerde tatilin bir gününü tek yönde harcar.",
          ar: "طرابزون وبودروم وأنطاليا وإزمير وكابادوكيا ليست على مسافة تُقطع براً. فيُذهب إليها بالطائرة، والرحلات الداخلية قصيرة، ويُرتَّب التنقل داخل المدينة من هناك. أما الطريق البري فيستهلك في هذه المسافات يوماً كاملاً من الإجازة في اتجاه واحد.",
          en: "Trabzon, Bodrum, Antalya, İzmir and Cappadocia are not within driving distance. You fly to these, domestic flights are short, and local transport is arranged on arrival. By road, these distances cost a full day of the holiday in one direction.",
        },
      },
      {
        question: { tr: "Program kurarken hangi kural işe yarar?", ar: "ما القاعدة المفيدة عند وضع البرنامج؟", en: "What rule helps when planning an itinerary?" },
        answer: {
          tr: "Basit bir ölçü: tek yön yolculuk üç saati aşıyorsa o durak günübirlik değil, konaklamalı planlanmalı. Bu kural hem yorgunluğu hem de \"gittik ama göremedik\" hissini önler. Üç saatin altındaki duraklar sabah çıkıp akşam dönerek rahatça gezilir.",
          ar: "معيار بسيط: إذا تجاوزت الرحلة في اتجاه واحد ثلاث ساعات فتلك المحطة تُخطَّط بمبيت لا كرحلة يوم واحد. وتمنع هذه القاعدة الإرهاق وشعور «ذهبنا ولم نرَ شيئاً» معاً. أما المحطات دون الثلاث ساعات فتُزار بأريحية بالخروج صباحاً والعودة مساءً.",
          en: "A simple measure: if the one-way journey exceeds three hours, plan that stop with an overnight rather than as a day trip. The rule prevents both exhaustion and the feeling of having gone somewhere without really seeing it. Stops under three hours work comfortably as morning-out, evening-back.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "İstanbul'dan günübirlik gidilenler",
          ar: "ما يُزار من إسطنبول في يوم واحد",
          en: "Day trips from Istanbul",
        },
        body: {
          tr: "Sapanca yaklaşık 130 km, Yalova 130 km, Bursa 240 km, Şile ve Ağva 70–100 km uzaklıktadır. Bunların hepsi sabah çıkıp akşam dönülecek mesafededir. Bursa en uzunudur ve gün içinde iki-üç durak sığar; daha fazlasını sıkıştırmak günü yolda geçirmek olur.",
          ar: "تبعد سبانجا نحو 130 كم، ويالوفا 130 كم، وبورصة 240 كم، وشيله وآغوا 70–100 كم. وكلها على مسافة تسمح بالخروج صباحاً والعودة مساءً. وبورصة أطولها، ويتّسع اليوم لمحطتين أو ثلاث؛ وحشر أكثر من ذلك يعني قضاء اليوم على الطريق.",
          en: "Sapanca is about 130 km away, Yalova 130 km, Bursa 240 km, and Sile and Agva 70–100 km. All are close enough to leave in the morning and return in the evening. Bursa is the longest, and two or three stops fit into the day; squeezing in more means spending the day on the road.",
        },
      },
      {
        heading: {
          tr: "Uçak isteyen şehirler",
          ar: "المدن التي تحتاج طائرة",
          en: "Cities that need a flight",
        },
        body: {
          tr: "Trabzon İstanbul'a yaklaşık 1.000 km, Bodrum 700 km, Antalya 700 km uzaklıktadır; karayoluyla gitmek bir günü tamamen alır. Bu şehirlere uçakla gidilir ve orada ayrıca araç gerekir, çünkü asıl gezilecek yerler şehir merkezlerinin dışındadır: Uzungöl, Sümela, Ayder ya da Ege koyları.",
          ar: "تبعد طرابزون عن إسطنبول نحو 1000 كم، وبودروم 700 كم، وأنطاليا 700 كم؛ والذهاب برّاً يستهلك يوماً كاملاً. تُقصد هذه المدن جواً، وتحتاج فيها إلى سيارة أيضاً، لأن الأماكن الأساسية خارج مراكز المدن: أوزنجول وسوميلا وآيدر أو خلجان إيجة.",
          en: "Trabzon is about 1,000 km from Istanbul, Bodrum 700 km and Antalya 700 km; driving takes a full day. These are reached by air, and you still need a vehicle there, because the places worth seeing lie outside the city centres: Uzungol, Sumela, Ayder or the Aegean bays.",
        },
      },
      {
        heading: {
          tr: "Programı kurarken kullanılabilecek kural",
          ar: "قاعدة تنفع عند وضع البرنامج",
          en: "A rule for building the plan",
        },
        body: {
          tr: "Basit bir ölçü: tek yön üç saati aşıyorsa o şehri günübirlik yapmayın, geceleyin. Üç saatin altındaki her yer gidiş-dönüş bir güne sığar ama iki tarafta da trafik payı bırakmak gerekir. Uçuş günü şehir dışına çıkmamak da genel bir kolaylıktır: valizle yol, ilk günü olduğundan uzun gösterir.",
          ar: "مقياس بسيط: إن تجاوز الاتجاه الواحد ثلاث ساعات فلا تجعل تلك المدينة زيارة يوم واحد، بل بِت فيها. وكل ما دون الثلاث ساعات يتّسع ذهاباً وإياباً في يوم، لكن يجب ترك هامش للازدحام في الاتجاهين. ومن التسهيلات العامة ألّا تخرج خارج المدينة في يوم الطيران: فالطريق بالحقائب يجعل اليوم الأول أطول مما هو.",
          en: "A simple measure: if one direction is over three hours, do not make that city a day trip — stay the night. Anything under three hours fits there and back in a day, but leave a traffic margin both ways. Not leaving the city on a flight day is another general ease: travelling with suitcases makes the first day feel longer than it is.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-balayi-rehberi",
    image: "/images/tours/bodrum.jpg",
    minutes: 4,
    title: {
      tr: "Türkiye'de balayı: nereye, ne zaman, kaç gün",
      ar: "شهر العسل في تركيا: أين ومتى وكم يوماً",
      en: "A honeymoon in Türkiye: where, when and how long",
    },
    excerpt: {
      tr: "İstanbul mu Ege mi Karadeniz mi — mevsime ve tempoya göre üç farklı rota.",
      ar: "إسطنبول أم بحر إيجة أم البحر الأسود — ثلاثة مسارات بحسب الموسم والإيقاع.",
      en: "Istanbul, the Aegean or the Black Sea — three routes by season and pace.",
    },
    facts: [
      {
        label: { tr: "Klasik rota", ar: "المسار الكلاسيكي", en: "Classic route" },
        value: { tr: "İstanbul + Boğaz + Sapanca", ar: "إسطنبول + البوسفور + سبانجا", en: "Istanbul + Bosphorus + Sapanca" },
      },
      {
        label: { tr: "Yaz rotası", ar: "مسار الصيف", en: "Summer route" },
        value: { tr: "Bodrum ve Ege koyları", ar: "بودروم وخلجان إيجة", en: "Bodrum and the Aegean bays" },
      },
      {
        label: { tr: "Süre", ar: "المدة", en: "Length" },
        value: { tr: "5–7 gün dengeli", ar: "5–7 أيام متوازنة", en: "5–7 days is balanced" },
      },
    ],
    faq: [
      {
        question: { tr: "Balayı için Türkiye'de nereye gidilir?", ar: "إلى أين يُذهب في تركيا لشهر العسل؟", en: "Where do honeymooners go in Türkiye?" },
        answer: {
          tr: "Klasik rota İstanbul, Boğaz ve Sapanca üçlüsüdür; şehir, deniz ve doğayı kısa mesafelerde birleştirir. Yaz aylarında Bodrum ve Ege koyları öne çıkar. Kışın kar isteyen çiftler için Uludağ ve Kartepe rotaya eklenir.",
          ar: "المسار الكلاسيكي هو ثلاثي إسطنبول والبوسفور وسبانجا؛ إذ يجمع المدينة والبحر والطبيعة ضمن مسافات قصيرة. وفي أشهر الصيف تتقدّم بودروم وخلجان بحر إيجه. أما في الشتاء فتُضاف أولوداغ وكارتبه لمن يرغب من الأزواج في رؤية الثلج.",
          en: "The classic route is Istanbul, the Bosphorus and Sapanca — city, sea and nature within short distances. In summer Bodrum and the Aegean bays come to the fore. In winter, couples who want snow add Uludağ and Kartepe to the route.",
        },
      },
      {
        question: { tr: "Balayı için kaç gün ayırmalı?", ar: "كم يوماً يُخصَّص لشهر العسل؟", en: "How many days should a honeymoon be?" },
        answer: {
          tr: "Beş ila yedi gün dengeli bir süre. Üç gün şehir, iki gün doğa ya da deniz, kalan günler serbest kalırsa program yormaz. Balayında her günü doldurmak iyi bir fikir değil; boş bırakılan yarım günler çoğu çiftin en çok hatırladığı zaman oluyor.",
          ar: "من خمسة إلى سبعة أيام مدة متوازنة. فإذا خُصِّصت ثلاثة أيام للمدينة ويومان للطبيعة أو البحر وتُرك الباقي حراً، لا يصبح البرنامج مرهقاً. وليس من الحكمة ملء كل يوم في شهر العسل؛ فأنصاف الأيام المتروكة فارغة هي غالباً ما يتذكره الأزواج أكثر.",
          en: "Five to seven days is balanced. Three days in the city, two for nature or the sea, and the rest left free keeps the trip from becoming tiring. Filling every day is not a good idea on a honeymoon; the half-days left empty are often what couples remember most.",
        },
      },
      {
        question: { tr: "Mahremiyet açısından nelere dikkat edilmeli?", ar: "ما الذي يُراعى من ناحية الخصوصية؟", en: "What should you consider about privacy?" },
        answer: {
          tr: "Özel araç ve özel program burada belirleyici: kalabalık bir grup turunda gün başkalarının temposuna göre akar. Camları kararmış araç, otelden alış-bırakış ve programın tümüyle size ait olması balayında en çok istenen ayrıntılar. Otel seçerken de sessiz semtler öne çıkıyor.",
          ar: "السيارة الخاصة والبرنامج الخاص هما الفيصل هنا: ففي الجولة الجماعية يسير اليوم على إيقاع الآخرين. أما النوافذ المعتمة والاستقبال من الفندق والعودة إليه وكون البرنامج ملكاً لكما وحدكما فهي أكثر التفاصيل طلباً في شهر العسل. وعند اختيار الفندق تتقدّم الأحياء الهادئة.",
          en: "A private vehicle and a private programme are decisive here: on a group tour the day runs to other people's pace. Tinted windows, hotel pick-up and drop-off, and a programme that belongs entirely to you are the details most requested for honeymoons. Quieter districts also come to the fore when choosing a hotel.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Mahremiyet ilk şart",
          ar: "الخصوصية شرط أول",
          en: "Privacy comes first",
        },
        body: {
          tr: "Balayı programında en çok fark yaratan şey, kalabalıkla paylaşılmayan bir düzendir: özel araç, grup turuna katılmama ve saatleri kendi belirleme. Bu, gezilecek yerlerin sayısını azaltır ama günü rahatlatır — balayında az yer iyi görmek, çok yeri koşarak görmekten daha iyi sonuç verir.",
          ar: "أكثر ما يُحدث فرقاً في برنامج شهر العسل هو ترتيب لا يُشارَك فيه الزحام: سيارة خاصة، وعدم الانضمام إلى جولة جماعية، وتحديد الأوقات بأنفسكم. وهذا يقلّل عدد الأماكن لكنه يريح اليوم — وفي شهر العسل رؤية أماكن أقل بشكل جيد أفضل من رؤية كثيرة على عجل.",
          en: "What makes the most difference on a honeymoon is an arrangement not shared with a crowd: a private vehicle, no group tour and setting your own hours. That reduces the number of places but eases the day — on a honeymoon, seeing fewer places well beats rushing through many.",
        },
      },
      {
        heading: {
          tr: "Mevsime göre üç rota",
          ar: "ثلاثة مسارات بحسب الموسم",
          en: "Three routes by season",
        },
        body: {
          tr: "İlkbahar ve sonbaharda İstanbul artı Sapanca ya da Bursa iyi çalışır: hava gezmeye uygun, kalabalık az. Yazın Ege tarafı öne çıkar; Bodrum'da tekne ile koy turu ve akşam marina. Kışın Uludağ ve Kartepe kar için tercih edilir, İstanbul'da ise Boğaz manzaralı bir otel programın merkezi olur.",
          ar: "في الربيع والخريف تعمل إسطنبول مع سبانجا أو بورصة جيداً: الجو مناسب للتجوّل والزحام أقل. وفي الصيف تتقدّم جهة بحر إيجة؛ في بودروم جولة خلجان بالقارب ومساء في المارينا. وفي الشتاء تُقصد أولوداغ وكارتبه للثلج، وفي إسطنبول يصبح فندق بإطلالة على البوسفور مركز البرنامج.",
          en: "In spring and autumn, Istanbul plus Sapanca or Bursa works well: the weather suits walking and there are fewer crowds. In summer the Aegean side comes forward; in Bodrum a boat trip round the bays and an evening at the marina. In winter people go to Uludag and Kartepe for snow, while in Istanbul a Bosphorus-view hotel becomes the centre of the plan.",
        },
      },
      {
        heading: {
          tr: "Kaç gün ve nasıl bölünür",
          ar: "كم يوماً وكيف تُقسَّم",
          en: "How many days and how to split them",
        },
        body: {
          tr: "Beş-yedi gün dengeli bir süredir: üç gün İstanbul, bir gün şehir dışı, kalanı serbest. Her güne bir ana durak koymak ve öğleden sonraları boş bırakmak, programın yorucu olmasını engeller. İki şehir arası uçuş varsa o günü gezi günü saymamak gerekir; havalimanı ve bekleme günün yarısını alır.",
          ar: "خمسة إلى سبعة أيام مدة متوازنة: ثلاثة أيام في إسطنبول، ويوم خارج المدينة، والباقي حر. ووضع محطة رئيسية واحدة لكل يوم وترك فترات ما بعد الظهر فارغة يمنع أن يصبح البرنامج مُتعباً. وإن كان بين مدينتين رحلة طيران فلا يُحسب ذلك اليوم يوم زيارة؛ فالمطار والانتظار يأخذان نصف اليوم.",
          en: "Five to seven days is a balanced length: three days in Istanbul, one out of town, the rest free. Putting one main stop in each day and leaving afternoons open keeps the programme from becoming tiring. If there is a flight between two cities, do not count that day as a sightseeing day; the airport and waiting take half of it.",
        },
      },
    ],
  },
];

export function guideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
