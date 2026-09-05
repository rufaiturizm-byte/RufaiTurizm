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
}

export interface Guide {
  slug: string;
  image: string;
  /** Okuma süresi (dakika) — listede gösterilir. */
  minutes: number;
  title: Text;
  excerpt: Text;
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "istanbul-havalimanindan-sehre-ulasim",
    image: "/images/vito-black.jpg",
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
    image: "/images/tours/istanbul.jpg",
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
    image: "/images/tours/trabzon.jpg",
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
    image: "/images/hero-ortakoy.jpg",
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
];

export function guideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
