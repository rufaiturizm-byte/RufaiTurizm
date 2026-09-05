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

export interface Guide {
  slug: string;
  image: string;
  /** Okuma süresi (dakika) — listede gösterilir. */
  minutes: number;
  title: Text;
  excerpt: Text;
  facts: GuideFact[];
  sections: GuideSection[];
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
];

export function guideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
