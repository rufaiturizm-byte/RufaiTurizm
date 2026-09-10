/**
 * Şehir merkezi sayfaları.
 *
 * NEDEN VAR. Rakip analizinden çıktı: Arapça arama yapan misafir
 * "جولات سياحية أنطاليا" ya da "فنادق أنطاليا" diye ŞEHİR + HİZMET
 * biçiminde arıyor. Bizde her hizmet tek bir sayfada toplanmıştı
 * (bir turlar sayfası, bir oteller sayfası) ve şehir adına inen bir
 * sayfa yoktu.
 *
 * NEDEN 18 DEĞİL 6. Rakipler her şehir için ayrı "turlar", "oteller",
 * "programlar" sayfası açıyor — altı şehir × üç hizmet on sekiz sayfa
 * eder. Anlatacak ayrı şeyi olmayan on sekiz ince sayfa yerine altı
 * DERİN sayfa yapıldı: her şehrin turu, paketi, transfer güzergâhları,
 * otel bölgeleri ve rehberleri tek yerde toplanıyor. Aynı arama
 * karşılanıyor ama sayfa gerçekten okunacak bir şey söylüyor.
 *
 * İçerik burada duruyor, mesaj dosyalarında değil: bir şehir eklemek
 * üç ayrı JSON'a dokunmayı gerektirmesin diye (paketler, rehberler ve
 * güzergâhlarla aynı yaklaşım).
 */

type Text = { tr: string; ar: string; en: string };

export interface DestinationSection {
  heading: Text;
  body: Text;
  /** Bölümün altındaki görsel — her bölümde olmak zorunda değil. */
  image?: string;
  imageAlt?: Text;
}

export interface DestinationFact {
  label: Text;
  value: Text;
}

export interface DestinationFaq {
  question: Text;
  answer: Text;
}

export interface Destination {
  slug: string;
  /** Kapak fotoğrafı. */
  image: string;
  name: Text;
  /** Kapağın altındaki tek satır. */
  tagline: Text;
  /** Arama sonucundaki başlık ve açıklama. */
  seo?: { title?: Partial<Text>; description?: Partial<Text> };
  /** Giriş paragrafı — sayfanın ilk cümleleri. */
  intro: Text;
  /**
   * Şehirler listesindeki karşılaştırma tablosunun satırı.
   *
   * `facts` her şehirde AYRI eksenler taşıyor (Antalya'da "sahil uzunluğu",
   * Bursa'da "kar mevsimi") — o yüzden karşılaştırmaya elverişli değil.
   * Ziyaretçinin bu sayfadaki asıl sorusu ise karşılaştırmalı: "Antalya mı
   * Bodrum mu". Buradaki beş eksen altı şehirde de aynı ve kısa tutuluyor;
   * hücre uzunsa tablo okunmuyor.
   */
  compare: {
    /** Nasıl gidilir — uçuş ya da karayolu süresi. */
    reach: Text;
    /** Önerilen kalış. */
    stay: Text;
    /** Deniz durumu; yüzme vaadi vermeden. */
    sea: Text;
    /** En iyi aylar. */
    months: Text;
    /** Kime uyar. */
    suits: Text;
  };
  sections: DestinationSection[];
  facts: DestinationFact[];
  faq: DestinationFaq[];

  /* ── Bağlar. Sayfa kendi başına durmaz; şehirde SUNDUĞUMUZ her şeyi
     buradan toplar ve o sayfalara bağlanır. ── */
  tourSlug?: string;
  packageSlug?: string;
  guideSlugs: string[];
  routeSlugs: string[];
  /*
   * Oteller sayfasında bu şehrin bölgesi var mı.
   *
   * Sayfa değerin kendisini yazmıyor, yalnızca "otel bölgeleri" bağını
   * gösterip göstermeyeceğine bakıyor — bu yüzden liste: İstanbul'un
   * hotels.ts'te dört bölgesi var, Bursa'nın ve Sapanca'nın hiç yok ve
   * olmayan bir bölgeye bağ vermek misafiri boş sayfaya götürürdü.
   */
  hotelAreaKeys?: string[];
}

export function destinationBySlug(slug: string) {
  return destinations.find((item) => item.slug === slug);
}

/**
 * Bir rehberin hangi şehir merkezine ait olduğu.
 *
 * Bağ zaten burada duruyor (guideSlugs), guides.ts'e ikinci bir alan
 * eklemek aynı ilişkiyi iki yerde tutmak olurdu ve biri güncellenip
 * diğeri unutulduğunda sessizce yanlış sayfaya bağlanırdı. Şehre bağlı
 * olmayan rehberler ("Türkiye'ye ne zaman gitmeli" gibi) undefined
 * döndürüyor ve bağ hiç basılmıyor.
 */
export function destinationForGuide(guideSlug: string) {
  return destinations.find((item) => item.guideSlugs.includes(guideSlug))?.slug;
}

export const destinations: Destination[] = [
  {
    slug: "istanbul",
    image: "/images/places/suleymaniye.jpg",
    name: { tr: "İstanbul", ar: "إسطنبول", en: "Istanbul" },
    tagline: {
      tr: "İki kıta, iki havalimanı ve otelin hangi yakada olduğuna göre tamamen değişen bir tatil.",
      ar: "قارتان ومطاران، وإجازة تتغيّر كلياً بحسب الجهة التي يقع فيها فندقك.",
      en: "Two continents, two airports, and a holiday that changes completely with the side your hotel is on.",
    },
    seo: {
      title: {
        tr: "İstanbul Turu, Transferi ve Nerede Kalınır",
        ar: "جولات إسطنبول والنقل من المطار وأين تقيم",
        en: "Istanbul Tours, Transfers and Where to Stay",
      },
      description: {
        tr: "İstanbul'da hangi semtte kalınır, IST mi Sabiha Gökçen mi, kaç gün yeter. Özel araç, Arapça rehber, sabit fiyat.",
        ar: "في أي حيّ تقيم في إسطنبول، ومطار إسطنبول أم صبيحة كوكتشن، وكم يوماً يكفي. سيارة خاصة ومرشد يتحدث العربية وسعر ثابت.",
        en: "Which district to stay in, IST or Sabiha Gökçen, how many days are enough. Private vehicle, Arabic-speaking guide, fixed price.",
      },
    },
    intro: {
      tr: "İstanbul'da tatilin nasıl geçeceğini belirleyen ilk karar hangi camiyi göreceğiniz değil, hangi semtte kalacağınız. Şehir iki kıtaya yayılmış, on beş milyon kişi yaşıyor ve trafiği aynı yolu günün saatine göre yirmi dakikada da bir buçuk saatte de aldırıyor. Sultanahmet'te kalan misafir sabah otelden çıkıp yürüyerek Ayasofya'ya gidiyor; Şişli'de kalan aynı yeri görmek için her gün yola çıkıyor. Bu sayfa o kararı ve arkasından gelen soruları — hangi havalimanı, kaç gün, ne zaman — tek yerde topluyor.",
      ar: "أول قرار يحدّد كيف ستمضي إجازتك في إسطنبول ليس أي مسجد ستزور، بل في أي حيّ ستقيم. المدينة ممتدة على قارتين، يسكنها خمسة عشر مليوناً، وزحامها يجعل الطريق نفسه يستغرق عشرين دقيقة أو ساعة ونصف بحسب ساعة اليوم. من يقيم في السلطان أحمد يخرج من فندقه صباحاً فيصل آيا صوفيا سيراً على الأقدام؛ ومن يقيم في شيشلي يبدأ كل يوم برحلة ليرى المكان نفسه. هذه الصفحة تجمع ذلك القرار وما يليه من أسئلة — أي مطار، وكم يوماً، ومتى — في مكان واحد.",
      en: "The first decision that shapes a holiday in Istanbul is not which mosque you will see but which district you sleep in. The city spreads over two continents, fifteen million people live in it, and the same drive takes twenty minutes or an hour and a half depending on the hour. A guest staying in Sultanahmet walks out of the hotel and reaches Hagia Sophia on foot; a guest in Şişli sets out every day to see the same thing. This page gathers that decision and the questions behind it — which airport, how many days, when to come — in one place.",
    },
    compare: {
      reach: { tr: "Varış şehri — iki havalimanı", ar: "مدينة الوصول — مطاران", en: "The arrival city — two airports" },
      stay: { tr: "En az üç tam gün", ar: "ثلاثة أيام كاملة على الأقل", en: "At least three full days" },
      sea: { tr: "Boğaz ve Marmara; yüzme odaklı değil", ar: "البوسفور ومرمرة؛ ليست وجهة سباحة", en: "Bosphorus and Marmara; not for swimming" },
      months: { tr: "Nisan–mayıs, eylül–ekim", ar: "أبريل–مايو، سبتمبر–أكتوبر", en: "April–May, September–October" },
      suits: { tr: "İlk ziyaret, tarih, alışveriş", ar: "الزيارة الأولى والتاريخ والتسوّق", en: "A first visit, history, shopping" },
    },
    sections: [
      {
        heading: { tr: "Hangi semtte kalmalı", ar: "في أي حيّ تقيم", en: "Which district to stay in" },
        body: {
          tr: "Sultanahmet tarihi yarımadanın kalbi: Ayasofya, Sultanahmet Camii, Topkapı ve Yerebatan yürüme mesafesinde, akşamları sakin ve aile için en kolay bölge — ama gece hayatı yok, oteller çoğunlukla küçük butik yapılar. Taksim ve Beyoğlu hareketi sevene göre; İstiklal Caddesi, restoranlar ve metro kapıda, karşılığı gürültü. Şişli ve Nişantaşı alışveriş için gelenlerin bölgesi: markalar yürüme mesafesinde, tarihi yarımadaya metroyla kırk dakika. Boğaz hattı — Beşiktaş, Ortaköy, Bebek — manzarası en güzel taraf, gezmekten çok oturup bakmak isteyene göre. Kadıköy ve Üsküdar Anadolu yakasında: aynı bütçeye daha geniş oda ve daha az turist, ama her sabah köprü ya da vapur.",
          ar: "السلطان أحمد قلب شبه الجزيرة التاريخية: آيا صوفيا والمسجد الأزرق وتوب كابي وصهريج البازيليك على مسافة مشي، والمساءات هادئة، وهي أسهل منطقة للعائلة — لكن لا حياة ليلية فيها والفنادق غالباً صغيرة من طراز البوتيك. وتقسيم وبي أوغلو لمن يحب الحركة؛ شارع الاستقلال والمطاعم والمترو عند الباب، وثمن ذلك الضجيج. وشيشلي ونيشان تاشي حيّ القادمين للتسوّق: الماركات على مسافة مشي، وشبه الجزيرة التاريخية على أربعين دقيقة بالمترو. وخط البوسفور — بشيكتاش وأورتاكوي وبيبك — أجمل جهة منظراً، وتناسب من يريد الجلوس والنظر أكثر من التجوّل. وكاديكوي وأسكودار في الجهة الآسيوية: غرفة أوسع بالميزانية نفسها وسيّاح أقل، لكن جسر أو عبّارة كل صباح.",
          en: "Sultanahmet is the heart of the historic peninsula: Hagia Sophia, the Blue Mosque, Topkapı and the Basilica Cistern are all walkable, the evenings are quiet and it is the easiest area for a family — but there is no nightlife and the hotels are mostly small boutique buildings. Taksim and Beyoğlu suit those who want movement; İstiklal Street, the restaurants and the metro are at the door, and the price is noise. Şişli and Nişantaşı are for guests who come to shop: the labels are walkable and the historic peninsula is forty minutes by metro. The Bosphorus line — Beşiktaş, Ortaköy, Bebek — has the best views and suits people who would rather sit and look than walk. Kadıköy and Üsküdar are on the Asian side: a larger room for the same money and fewer tourists, but a bridge or a ferry every morning.",
        },
      },
      {
        heading: { tr: "İki havalimanı, iki ayrı hesap", ar: "مطاران وحسابان مختلفان", en: "Two airports, two different sums" },
        body: {
          tr: "İstanbul Havalimanı (IST) Avrupa yakasının kuzeybatısında: Taksim'e yaklaşık kırk kilometre, trafiksiz kırk beş dakika, akşamüstü bir buçuk saat. Sabiha Gökçen (SAW) Anadolu yakasında: Kadıköy'e kırk kilometre ama Taksim'e köprü geçişiyle elli beş kilometre ve yoğun saatte iki saati bulabiliyor. Karar biletin fiyatına göre değil otelin yakasına göre verilmeli — Avrupa yakasında kalacaksanız IST, Anadolu yakasında kalacaksanız SAW yolu yarıya indiriyor. İki havalimanında da karşılama geliş kapısında isimli tabelayla yapılıyor, uçuş numarasından takip ediliyor ve rötar için ek ücret çıkmıyor.",
          ar: "مطار إسطنبول (IST) في شمال غرب الجهة الأوروبية: نحو أربعين كيلومتراً عن تقسيم، خمس وأربعون دقيقة بلا زحام وساعة ونصف قبيل المساء. ومطار صبيحة كوكتشن (SAW) في الجهة الآسيوية: أربعون كيلومتراً عن كاديكوي، لكنه خمسة وخمسون كيلومتراً إلى تقسيم مع عبور الجسر وقد يبلغ ساعتين في ساعة الذروة. والقرار لا يُتخذ بحسب سعر التذكرة بل بحسب جهة الفندق — إن كنت ستقيم في الجهة الأوروبية فـ IST، وإن كنت في الآسيوية فـ SAW يختصر الطريق إلى النصف. والاستقبال في المطارين عند بوابة الوصول بلافتة تحمل اسمك، ومتابعة الرحلة برقمها، ولا رسوم إضافية على التأخير.",
          en: "Istanbul Airport (IST) sits in the north-west of the European side: about forty kilometres from Taksim, forty-five minutes clear and an hour and a half in the late afternoon. Sabiha Gökçen (SAW) is on the Asian side: forty kilometres from Kadıköy, but fifty-five to Taksim across a bridge and up to two hours at peak. The choice should follow the side your hotel is on rather than the ticket price — on the European side, IST; on the Asian side, SAW halves the drive. At both airports you are met at the arrivals gate with a name board, the flight is tracked by its number, and a delay costs nothing extra.",
        },
      },
      {
        heading: { tr: "Boğaz'ı görmenin üç yolu", ar: "ثلاث طرق لرؤية البوسفور", en: "Three ways to see the Bosphorus" },
        body: {
          tr: "En ucuzu şehir hattı vapuru: Eminönü'nden kalkıyor, bileti birkaç lira ve iki yakayı da yakından geçiyor — kalabalık ve saat çizelgesine bağlı. İkincisi tur teknesi; Eminönü ve Kabataş iskelelerinden kalkan iki saatlik turlar Rumeli Hisarı'na kadar çıkıp dönüyor, güverte açık ve fotoğraf için en rahatı. Üçüncüsü karadan: Ortaköy'den Bebek'e sahil yolu yürünüyor, yalıları ve köprüyü aynı hizadan görüyorsunuz. Şehir turumuzda tekne gezisi programın içinde; ayrıca gitmek isterseniz otelden alıp iskeleye bırakıyoruz.",
          ar: "أرخصها عبّارة الخطوط البلدية: تنطلق من إمينونو، وتذكرتها بضع ليرات، وتمرّ قريباً من الضفتين — لكنها مزدحمة ومقيّدة بجدول المواعيد. والثانية قارب الجولات؛ جولات من ساعتين تنطلق من مرفأي إمينونو وكاباتاش وتصعد حتى قلعة روملي ثم تعود، وسطحها مكشوف وهي الأريح للتصوير. والثالثة من البرّ: تُمشى طريق الساحل من أورتاكوي إلى بيبك، فترى القصور الخشبية والجسر من المستوى نفسه. وفي جولة المدينة عندنا تكون رحلة القارب ضمن البرنامج؛ وإن أردت الذهاب على حدة نأخذك من الفندق ونوصلك إلى المرفأ.",
          en: "The cheapest is the municipal ferry: it leaves from Eminönü, the fare is a few lira and it passes close to both shores — crowded and tied to a timetable. The second is a tour boat; two-hour trips from the Eminönü and Kabataş piers run up to Rumeli Fortress and back, the deck is open and it is the easiest for photographs. The third is from land: walk the shore road from Ortaköy to Bebek and you see the waterfront mansions and the bridge at eye level. Our city tour includes the boat trip; if you would rather go separately we collect you from the hotel and drop you at the pier.",
        },
        image: "/images/places/bogaz-yali.jpg",
        imageAlt: {
          tr: "Boğaz kıyısındaki yalılar, denizden görünüm",
          ar: "القصور الخشبية على ضفة البوسفور، من البحر",
          en: "Waterfront mansions on the Bosphorus, seen from the water",
        },
      },
      {
        heading: { tr: "Çarşılar ve alışveriş", ar: "الأسواق والتسوّق", en: "Bazaars and shopping" },
        body: {
          tr: "Kapalıçarşı dört bine yakın dükkânıyla dünyanın en eski kapalı çarşılarından biri; halı, altın, deri ve hediyelik burada toplanıyor ve pazarlık beklenen bir şey. Mısır Çarşısı Eminönü'nde: baharat, lokum ve kuruyemiş için. Modern alışveriş İstinye Park ve Zorlu tarafında, Nişantaşı ise caddede yürüyerek gezilen marka bölgesi. Arapça konuşan misafirin en çok sorduğu iki şey fiyatların sabit olup olmadığı ve nereden alınırsa doğru olacağı. Şoförümüz sizi bırakıp bekliyor, pazarlığa karışmıyor — ve komisyon aldığımız bir dükkân yok, sizi belirli bir mağazaya götürmeye çalışmayız.",
          ar: "السوق المسقوف بنحو أربعة آلاف دكان من أقدم الأسواق المسقوفة في العالم؛ فيه السجاد والذهب والجلد والهدايا، والمساومة فيه أمر متوقّع. وسوق المصريين في إمينونو: للبهارات والملبن والمكسّرات. أما التسوّق الحديث فناحية إستينيه بارك وزورلو، ونيشان تاشي حيّ ماركات يُتجوّل فيه مشياً في الشارع. وأكثر ما يسأل عنه الضيف العربي أمران: هل الأسعار ثابتة، ومن أين يكون الشراء صحيحاً. سائقنا يوصلك وينتظر ولا يتدخّل في المساومة — وليس لدينا دكان نأخذ منه عمولة، ولا نحاول أن نأخذك إلى متجر بعينه.",
          en: "The Grand Bazaar, with nearly four thousand shops, is one of the oldest covered markets in the world; carpets, gold, leather and souvenirs are gathered here and haggling is expected. The Spice Bazaar is in Eminönü: spices, Turkish delight and nuts. Modern shopping is around İstinye Park and Zorlu, while Nişantaşı is a label district you walk along the street. The two things Arabic-speaking guests ask most are whether prices are fixed and where it is safe to buy. Our driver drops you and waits without joining the bargaining — and we take commission from no shop, so we will not steer you into a particular store.",
        },
        image: "/images/places/kapalicarsi.jpg",
        imageAlt: {
          tr: "Kapalıçarşı'nın boyalı tonozlu koridoru ve dükkânlar",
          ar: "ممرّ السوق المسقوف بأقواسه المزخرفة ودكاكينه",
          en: "The painted vaulted corridor of the Grand Bazaar and its shops",
        },
      },
      {
        heading: { tr: "İstanbul'da neler yapıyoruz", ar: "ماذا نقدّم في إسطنبول", en: "What we do in Istanbul" },
        body: {
          tr: "İki havalimanından karşılama ve otele transfer, gün boyu emrinizde araç ve şoför, sekiz saatlik özel şehir turu, dört günlük İstanbul programı ve Bursa ile Sapanca'ya günübirlik çıkışlar. Turlar özel: gruba katılmıyorsunuz, otelden alıp otele bırakıyoruz ve şoför Arapça konuşuyor. Otel rezervasyonunu sizin adınıza yapıyoruz; anlaşmalı otel listemiz yok, oteli siz seçiyorsunuz ve fiyatın üstüne bir şey koymuyoruz. Yapmadıklarımızı da yazalım: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz.",
          ar: "الاستقبال من المطارين والتوصيل إلى الفندق، وسيارة مع سائق تحت تصرّفك طوال اليوم، وجولة مدينة خاصة من ثماني ساعات، وبرنامج إسطنبول من أربعة أيام، ورحلات يومية إلى بورصة وسبانجا. الجولات خاصة: لا تنضم إلى مجموعة، نأخذك من الفندق ونعيدك إليه، والسائق يتحدث العربية. ونحجز الفندق باسمك؛ ليست لدينا قائمة فنادق متعاقدة، أنت من يختار الفندق ولا نضيف شيئاً على السعر. ولنكتب أيضاً ما لا نقدّمه: لا نوفّر تأجير اليخوت ولا الشقق الفندقية ولا سيارات الأعراس.",
          en: "Meet-and-greet at both airports and transfer to the hotel, a car and driver at your disposal by the day, an eight-hour private city tour, a four-day Istanbul programme and day trips to Bursa and Sapanca. Tours are private: you do not join a group, we collect you from your hotel and return you there, and the driver speaks Arabic. We book the hotel in your name; we have no list of partner hotels, you choose the hotel and we add nothing to the price. And let us write down what we do not do: no yacht charter, no serviced apartments, no wedding cars.",
        },
      },
    ],
    facts: [
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "İstanbul (IST) ve Sabiha Gökçen (SAW)", ar: "إسطنبول (IST) وصبيحة كوكتشن (SAW)", en: "Istanbul (IST) and Sabiha Gökçen (SAW)" },
      },
      {
        label: { tr: "Şehir turu", ar: "جولة المدينة", en: "City tour" },
        value: { tr: "8 saat, özel araç ve Arapça rehber", ar: "ثماني ساعات، سيارة خاصة ومرشد عربي", en: "8 hours, private car and Arabic guide" },
      },
      {
        label: { tr: "En dengeli aylar", ar: "أفضل الشهور توازناً", en: "Most balanced months" },
        value: { tr: "Nisan–mayıs, eylül–ekim", ar: "نيسان–أيار وأيلول–تشرين الأول", en: "April–May, September–October" },
      },
      {
        label: { tr: "Yeterli süre", ar: "المدة الكافية", en: "Enough time" },
        value: { tr: "En az üç tam gün", ar: "ثلاثة أيام كاملة على الأقل", en: "Three full days minimum" },
      },
    ],
    faq: [
      {
        question: { tr: "İstanbul'da hangi semtte kalmalıyım?", ar: "في أي حيّ أقيم في إسطنبول؟", en: "Which district of Istanbul should I stay in?" },
        answer: {
          tr: "İlk kez geliyorsanız ve tarihi yerleri görmek istiyorsanız Sultanahmet — büyük anıtların hepsi yürüme mesafesinde. Alışveriş ağırlıklı bir seyahatse Şişli ya da Nişantaşı. Manzara ve sakinlik önceliğinizse Boğaz hattı. Bütçeyi genişletmek istiyorsanız Kadıköy tarafında aynı paraya daha büyük oda bulunuyor, karşılığında her gün karşıya geçiş var.",
          ar: "إن كانت زيارتك الأولى وتريد رؤية المعالم التاريخية فالسلطان أحمد — فالمعالم الكبرى كلها على مسافة مشي. وإن كانت الرحلة للتسوّق أساساً فشيشلي أو نيشان تاشي. وإن كان المنظر والهدوء أولويتك فخط البوسفور. وإن أردت توسيع الميزانية ففي جهة كاديكوي غرفة أكبر بالسعر نفسه، مقابل عبور إلى الجهة الأخرى كل يوم.",
          en: "If it is your first visit and you want the historic sights, Sultanahmet — the great monuments are all within walking distance. If the trip is mainly shopping, Şişli or Nişantaşı. If views and quiet come first, the Bosphorus line. If you want your budget to stretch, the Kadıköy side gives a larger room for the same money, in exchange for crossing over every day.",
        },
      },
      {
        question: { tr: "İstanbul Havalimanı'na mı Sabiha Gökçen'e mi inmeliyim?", ar: "هل أهبط في مطار إسطنبول أم صبيحة كوكتشن؟", en: "Should I fly into Istanbul Airport or Sabiha Gökçen?" },
        answer: {
          tr: "Otelinizin yakasına göre. Avrupa yakasında (Sultanahmet, Taksim, Şişli, Beşiktaş) kalacaksanız İstanbul Havalimanı; Anadolu yakasında (Kadıköy, Üsküdar, Ataşehir) kalacaksanız Sabiha Gökçen. Yanlış havalimanı yolu bir saat uzatabiliyor ve bu fark çoğu zaman bilet farkından daha pahalıya geliyor. İki havalimanına da transfer veriyoruz, fiyat mesafeye göre belli ve sabit.",
          ar: "بحسب جهة فندقك. إن كنت ستقيم في الجهة الأوروبية (السلطان أحمد، تقسيم، شيشلي، بشيكتاش) فمطار إسطنبول؛ وإن كنت في الجهة الآسيوية (كاديكوي، أسكودار، آتاشهير) فصبيحة كوكتشن. والمطار الخطأ قد يطيل الطريق ساعة، وهذا الفارق غالباً أغلى من فرق سعر التذكرة. ونحن نقدّم النقل من المطارين، والسعر محدّد وثابت بحسب المسافة.",
          en: "It depends on the side your hotel is on. Staying on the European side (Sultanahmet, Taksim, Şişli, Beşiktaş), Istanbul Airport; on the Asian side (Kadıköy, Üsküdar, Ataşehir), Sabiha Gökçen. The wrong airport can add an hour to the drive, and that difference usually costs more than the fare difference. We transfer from both, at a fixed price set by distance.",
        },
      },
      {
        question: { tr: "İstanbul kaç günde gezilir?", ar: "كم يوماً تكفي لزيارة إسطنبول؟", en: "How many days does Istanbul need?" },
        answer: {
          tr: "Üç tam gün ana başlıkları görmeye yeter: bir gün tarihi yarımada, bir gün Boğaz ve Beyoğlu, bir gün çarşılar ve alışveriş. Dört-beş gün olursa Adalar, Emirgan ya da Anadolu yakası da giriyor ve gün içinde acele etmiyorsunuz. Üç günün altına inince şehir gezisi değil koşuşturma oluyor; o durumda kapsamı daraltıp iki yeri iyi görmek daha iyi sonuç veriyor.",
          ar: "ثلاثة أيام كاملة تكفي للعناوين الرئيسية: يوم لشبه الجزيرة التاريخية، ويوم للبوسفور وبي أوغلو، ويوم للأسواق والتسوّق. وبأربعة أو خمسة أيام تدخل جزر الأمراء وأمير جان والجهة الآسيوية، ولا تضطر للاستعجال خلال اليوم. أما دون ثلاثة أيام فتتحوّل الزيارة إلى سباق؛ والأفضل حينها تضييق البرنامج ورؤية مكانين جيداً.",
          en: "Three full days cover the headlines: one for the historic peninsula, one for the Bosphorus and Beyoğlu, one for the bazaars and shopping. With four or five you can add the Princes' Islands, Emirgan or the Asian side without rushing through the day. Under three days it stops being sightseeing and becomes a scramble; better then to narrow the plan and see two places properly.",
        },
      },
    ],
    tourSlug: "istanbul-turu",
    packageSlug: "istanbul-4-gun",
    guideSlugs: [
      "istanbulda-gezilecek-yerler",
      "istanbulda-anadolu-yakasi",
      "istanbulda-nerede-kalinir",
      "istanbul-havalimanindan-sehre-ulasim",
      "bogaz-turu-rehberi",
      "istanbul-adalar-rehberi",
    ],
    routeSlugs: [
      "istanbul-havalimani-taksim-transfer",
      "istanbul-havalimani-sultanahmet-transfer",
      "sabiha-gokcen-taksim-transfer",
      "sabiha-gokcen-kadikoy-transfer",
      "istanbul-havalimani-sisli-nisantasi-transfer",
      "istanbul-havalimani-besiktas-ortakoy-transfer",
    ],
    hotelAreaKeys: ["sultanahmet", "taksim", "bosphorus", "asian"],
  },
  {
    slug: "antalya",
    image: "/images/places/duden.jpg",
    name: { tr: "Antalya", ar: "أنطاليا", en: "Antalya" },
    tagline: {
      tr: "Kemer'den Alanya'ya iki yüz kilometrelik Akdeniz kıyısı — ve o kıyının neresinde kalacağınız kararı.",
      ar: "ساحل متوسطي يمتد مئتي كيلومتر من كمر إلى ألانيا — والقرار هو أين تقيم على هذا الساحل.",
      en: "Two hundred kilometres of Mediterranean coast from Kemer to Alanya — and the decision of where on it you stay.",
    },
    seo: {
      title: {
        tr: "Antalya Turu, Transferi ve Otel Rehberi",
        ar: "جولات أنطاليا والنقل من المطار ودليل الفنادق",
        en: "Antalya Tours, Transfers and Where to Stay",
      },
      description: {
        tr: "Antalya'da hangi bölgede kalınır, havalimanından ne kadar sürer, hangi mevsim uygun. Özel araç, Arapça rehber, sabit fiyat.",
        ar: "أين تقيم في أنطاليا، وكم تستغرق الطريق من المطار، وأي موسم يناسبك. سيارة خاصة ومرشد يتحدث العربية وسعر ثابت.",
        en: "Where to stay in Antalya, how long from the airport, which season suits you. Private vehicle, Arabic-speaking guide, fixed price.",
      },
    },
    intro: {
      tr: "Antalya haritada tek bir isim ama turistik bölgesi Kemer'den Alanya'ya iki yüz kilometre uzanıyor. \"Antalya'ya gidiyoruz\" cümlesi bu yüzden tek başına bir şey anlatmıyor: Kemer'de kalan misafirle Side'de kalan aynı tatili yaşamıyor, havalimanına mesafeleri arasında iki saat fark var ve denizleri bile farklı — batıda çakıl, doğuda kum. Bu sayfa o kararı vermenize yarıyor ve Antalya'da yaptığımız her şeyi tek yerde topluyor.",
      ar: "أنطاليا اسم واحد على الخريطة، لكن منطقتها السياحية تمتد مئتي كيلومتر من كمر إلى ألانيا. لذلك لا تقول جملة \"سنذهب إلى أنطاليا\" شيئاً بمفردها: فمن يقيم في كمر لا يعيش الإجازة نفسها التي يعيشها من يقيم في سيدي، والفارق بينهما ساعتان في المسافة إلى المطار، وحتى البحر مختلف — حصى في الغرب ورمل في الشرق. هذه الصفحة تساعدك على اتخاذ ذلك القرار، وتجمع في مكان واحد كل ما نقدّمه في أنطاليا.",
      en: "Antalya is one name on the map, but its holiday coast runs two hundred kilometres from Kemer to Alanya. That is why \"we're going to Antalya\" says nothing on its own: a guest staying in Kemer is not having the same holiday as one in Side, there is a two-hour difference in their distance from the airport, and even the sea differs — pebble in the west, sand in the east. This page helps you make that decision and gathers everything we do in Antalya in one place.",
    },
    compare: {
      reach: { tr: "İstanbul'dan uçakla ~1 sa 10 dk", ar: "بالطائرة من إسطنبول نحو ساعة و10 دقائق", en: "About 1 hr 10 min by air from Istanbul" },
      stay: { tr: "Beş–yedi gece", ar: "خمس إلى سبع ليالٍ", en: "Five to seven nights" },
      sea: { tr: "Kum ve çakıl sahiller", ar: "شواطئ رملية وحصوية", en: "Sandy and pebble beaches" },
      months: { tr: "Mayıs–haziran, eylül", ar: "مايو–يونيو، سبتمبر", en: "May–June, September" },
      suits: { tr: "Sahil tatili, aileler, antik kentler", ar: "إجازة الشاطئ والعائلات والمدن الأثرية", en: "A beach holiday, families, ancient cities" },
    },
    sections: [
      {
        heading: {
          tr: "Hangi bölge kime uyar",
          ar: "أي منطقة تناسب من",
          en: "Which stretch suits whom",
        },
        body: {
          tr: "Lara ve Konyaaltı şehrin kendi sahilleri: Kaleiçi, çarşı ve restoranlar araçla on beş dakikada, otel dışına çıkmak isteyen için en pratik seçenek. Belek geniş bahçeli her şey dahil oteller ve golf sahalarından oluşuyor, küçük çocuklu aileler için en rahatı ama gezilecek bir kasaba merkezi yok. Kemer'de Toroslar denize iniyor; manzarası en güçlü taraf, koyları çakıl. Side'de antik kent ile tatil bölgesi iç içe, tarihi merak eden aile için en dengeli seçim. Alanya kendi başına bir şehir, çarşısı ve gece hayatı canlı — ama havalimanına iki saat.",
          ar: "لارا وكونيا آلتي هما شاطئا المدينة نفسها: كالي إيتشي والسوق والمطاعم على بُعد خمس عشرة دقيقة بالسيارة، وهو أنسب خيار لمن يريد الخروج من الفندق. أما بيليك فتتكوّن من فنادق \"كل شيء مشمول\" بحدائق واسعة وملاعب غولف، وهي أريح ما يكون للعائلات ذات الأطفال الصغار، لكن لا يوجد فيها مركز بلدة للتجوّل. وفي كمر تنزل جبال طوروس إلى البحر؛ فهي الجهة الأقوى منظراً، وخلجانها حصوية. وفي سيدي تتداخل المدينة الأثرية مع منطقة الاصطياف، وهي الخيار الأكثر توازناً للعائلة المهتمة بالتاريخ. وألانيا مدينة قائمة بذاتها بسوقها وحياتها الليلية النابضة — لكنها على ساعتين من المطار.",
          en: "Lara and Konyaaltı are the city's own beaches: Kaleiçi, the bazaar and the restaurants are fifteen minutes away by car, the most practical choice if you want to leave the hotel. Belek is all-inclusive hotels with generous grounds and golf courses, the easiest option for families with small children, but there is no town centre to wander. In Kemer the Taurus mountains come down to the sea; it is the strongest scenery, and the coves are pebble. In Side the ancient town and the resort area are interwoven, the most balanced choice for a family interested in history. Alanya is a city in its own right with a lively bazaar and nightlife — but it is two hours from the airport.",
        },
        image: "/images/places/side.jpg",
        imageAlt: {
          tr: "Side'de Apollon Tapınağı'nın sütunları",
          ar: "أعمدة معبد أبولو في سيدي",
          en: "The columns of the Temple of Apollo at Side",
        },
      },
      {
        heading: {
          tr: "Havalimanından otele",
          ar: "من المطار إلى الفندق",
          en: "From the airport to the hotel",
        },
        body: {
          tr: "Antalya Havalimanı (AYT) şehrin doğusunda. Belek'e yaklaşık 35 kilometre ve yarım saat, Side'ye 65 kilometre ve bir saat, Kemer'e 57 kilometre — ama Kemer batıda olduğu için önce Antalya'yı geçmek gerekiyor ve yol bir saati bulabiliyor. Alanya 125 kilometre, yani iki saatlik gerçek bir yolculuk. Aynı havalimanından çıkıp yarım saatte de varabilirsiniz iki buçuk saatte de; otelin tam adını rezervasyon sırasında aldığımızda süreyi tahmin değil doğru söyleyebiliyoruz. Karşılama geliş kapısında isimli tabelayla, uçuş takibi dahil ve rötarda bekleme için ek ücret çıkmıyor.",
          ar: "يقع مطار أنطاليا (AYT) شرق المدينة. تبعد بيليك نحو 35 كيلومتراً ونصف ساعة، وسيدي 65 كيلومتراً وساعة، وكمر 57 كيلومتراً — لكن لأن كمر تقع غرباً فلا بد من عبور أنطاليا أولاً وقد يبلغ الطريق ساعة. وألانيا على 125 كيلومتراً، أي رحلة حقيقية من ساعتين. من المطار نفسه قد تصل في نصف ساعة وقد تصل في ساعتين ونصف؛ وحين نأخذ اسم الفندق الكامل عند الحجز نستطيع أن نقول المدة بدقة لا تخميناً. والاستقبال يكون عند بوابة الوصول بلافتة تحمل اسمك، مع متابعة الرحلة، ولا رسوم إضافية على الانتظار عند التأخير.",
          en: "Antalya Airport (AYT) sits east of the city. Belek is about 35 km and half an hour, Side 65 km and an hour, Kemer 57 km — but because Kemer lies west you must cross Antalya first and the drive can reach an hour. Alanya is 125 km, a genuine two-hour journey. From the same airport you might arrive in thirty minutes or in two and a half hours; when we take the exact hotel name at booking we can tell you the real time rather than an estimate. You are met at the arrivals gate with a name board, your flight is tracked, and there is no extra charge for waiting if it is delayed.",
        },
      },
      {
        heading: {
          tr: "Ne zaman gitmeli",
          ar: "متى تذهب",
          en: "When to come",
        },
        body: {
          tr: "Deniz mevsimi mayıstan ekim sonuna kadar açık ve Antalya'nın denizi Ege'den daha uzun süre sıcak kalıyor. Temmuz ve ağustosta sıcaklık kırk dereceyi geçiyor; öğle saatleri gezmeye uygun olmuyor ve küçük çocuklu aileler için zor. Mayıs, haziran ve eylül hem deniz hem gezi için en dengeli aylar — su ılık, hava gezilebilir, oteller ağustos kadar dolu değil. Kasım–nisan arası deniz mevsimi değil ama Antalya kışın da kapanmıyor: şehir merkezi, Kaleiçi, müzeler ve Düden Şelalesi yıl boyu açık, üstelik çok daha sakin.",
          ar: "موسم البحر مفتوح من أيار حتى نهاية تشرين الأول، وبحر أنطاليا يبقى دافئاً مدة أطول من بحر إيجه. وفي تموز وآب تتجاوز الحرارة الأربعين درجة؛ فلا تصلح ساعات الظهيرة للتجوّل، والأمر شاقّ على العائلات ذات الأطفال الصغار. أما أيار وحزيران وأيلول فهي أكثر الشهور توازناً للبحر والتجوّل معاً — الماء دافئ والجو يسمح بالتنقل والفنادق ليست ممتلئة كما في آب. وبين تشرين الثاني ونيسان لا يكون موسم بحر، لكن أنطاليا لا تُغلق شتاءً: مركز المدينة وكالي إيتشي والمتاحف وشلال دودان مفتوحة طوال السنة، وأهدأ بكثير.",
          en: "The swimming season runs from May to the end of October, and the sea at Antalya stays warm longer than the Aegean. In July and August temperatures pass forty degrees; the middle of the day is not for sightseeing and it is hard going for families with small children. May, June and September are the most balanced months for both sea and sightseeing — the water is warm, the air lets you move, and the hotels are not as full as in August. From November to April it is not a beach season, but Antalya does not close: the city centre, Kaleiçi, the museums and the Düden waterfall are open all year, and much quieter.",
        },
      },
      {
        heading: {
          tr: "Antalya'da neler yapıyoruz",
          ar: "ماذا نقدّم في أنطاليا",
          en: "What we do in Antalya",
        },
        body: {
          tr: "Havalimanı karşılaması ve otele transfer, bölge içi günlük araç, Kaleiçi–Düden–Konyaaltı hattını kapsayan on saatlik şehir turu ve beş günlük Akdeniz programı. Turlar özel: gruba katılmıyorsunuz, otelden alıp otele bırakıyoruz ve şoför Arapça konuşuyor. Otel rezervasyonunu da sizin adınıza yapıyoruz — anlaşmalı otel listemiz yok, oteli siz seçiyorsunuz. Yapmadığımız şeyleri de yazalım: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz.",
          ar: "الاستقبال من المطار والتوصيل إلى الفندق، وسيارة يومية داخل المنطقة، وجولة مدينة من عشر ساعات تشمل خط كالي إيتشي ودودان وكونيا آلتي، وبرنامج متوسطي من خمسة أيام. الجولات خاصة: لا تنضم إلى مجموعة، نأخذك من الفندق ونعيدك إليه، والسائق يتحدث العربية. ونتولّى حجز الفندق باسمك أيضاً — ليست لدينا قائمة فنادق متعاقدة، أنت من يختار الفندق. ولنكتب أيضاً ما لا نقدّمه: لا نوفّر تأجير اليخوت ولا الشقق الفندقية ولا سيارات الأعراس.",
          en: "Airport meet-and-greet and hotel transfer, a car by the day within the region, a ten-hour city tour covering Kaleiçi, the Düden waterfall and Konyaaltı, and a five-day Mediterranean programme. Tours are private: you do not join a group, we collect you from your hotel and return you there, and the driver speaks Arabic. We also book hotels in your name — we have no list of partner hotels, you choose the hotel. And let us write down what we do not do: no yacht charter, no serviced apartments, no wedding cars.",
        },
        image: "/images/places/alanya.jpg",
        imageAlt: {
          tr: "Alanya limanı, Kızıl Kule ve kale",
          ar: "ميناء ألانيا والبرج الأحمر والقلعة",
          en: "Alanya harbour, the Red Tower and the castle",
        },
      },
    ],
    facts: [
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "Antalya (AYT) — şehrin doğusunda", ar: "أنطاليا (AYT) — شرق المدينة", en: "Antalya (AYT) — east of the city" },
      },
      {
        label: { tr: "Sahil uzunluğu", ar: "امتداد الساحل", en: "Length of coast" },
        value: { tr: "Kemer'den Alanya'ya ~200 km", ar: "نحو 200 كم من كمر إلى ألانيا", en: "About 200 km, Kemer to Alanya" },
      },
      {
        label: { tr: "Deniz mevsimi", ar: "موسم البحر", en: "Swimming season" },
        value: { tr: "Mayıs – ekim sonu", ar: "أيار – نهاية تشرين الأول", en: "May – end of October" },
      },
      {
        label: { tr: "En dengeli aylar", ar: "أفضل الشهور توازناً", en: "Most balanced months" },
        value: { tr: "Mayıs, haziran, eylül", ar: "أيار وحزيران وأيلول", en: "May, June, September" },
      },
    ],
    faq: [
      {
        question: {
          tr: "Antalya'da hangi bölgede kalmalıyım?",
          ar: "في أي منطقة أقيم في أنطاليا؟",
          en: "Which area of Antalya should I stay in?",
        },
        answer: {
          tr: "Otel dışına çıkıp gezmek istiyorsanız Lara veya Konyaaltı, çünkü şehir merkezi on beş dakikada. Küçük çocuklu aileyseniz Belek en rahatı. Manzara sizin için önemliyse Kemer. Tarihi merak ediyorsanız Side. Alanya'yı ancak bir haftadan uzun kalacaksanız öneririz; havalimanına iki saat, gidiş-dönüş dört saat yolda geçer.",
          ar: "إن كنت تريد الخروج من الفندق والتجوّل فاختر لارا أو كونيا آلتي، فمركز المدينة على بُعد خمس عشرة دقيقة. وإن كنت عائلة بأطفال صغار فبيليك أريح. وإن كان المنظر يهمّك فكمر. وإن كنت مهتماً بالتاريخ فسيدي. أما ألانيا فلا ننصح بها إلا إذا كانت إقامتك أكثر من أسبوع؛ فهي على ساعتين من المطار، أي أربع ساعات ذهاباً وإياباً.",
          en: "If you want to leave the hotel and explore, Lara or Konyaaltı — the city centre is fifteen minutes away. With small children, Belek is the easiest. If scenery matters most, Kemer. If you are interested in history, Side. We only recommend Alanya for stays longer than a week; it is two hours from the airport, four hours there and back.",
        },
      },
      {
        question: {
          tr: "Antalya Havalimanı'ndan otelime ne kadar sürer?",
          ar: "كم تستغرق الطريق من مطار أنطاليا إلى فندقي؟",
          en: "How long is the drive from Antalya Airport to my hotel?",
        },
        answer: {
          tr: "Bölgeye göre yarım saat ile iki buçuk saat arasında değişiyor: Belek 30-45 dakika, Side yaklaşık bir saat, Kemer 50 dakika – 1,5 saat, Alanya 1,5 – 2,5 saat. Otelin tam adını rezervasyon sırasında aldığımızda tahmini değil gerçek süreyi söylüyoruz, çünkü aynı bölge adı içinde bile oteller arasında yirmi dakika fark olabiliyor.",
          ar: "يتراوح ذلك بين نصف ساعة وساعتين ونصف بحسب المنطقة: بيليك 30-45 دقيقة، وسيدي نحو ساعة، وكمر 50 دقيقة – ساعة ونصف، وألانيا ساعة ونصف – ساعتان ونصف. وحين نأخذ اسم الفندق الكامل عند الحجز نقول المدة الحقيقية لا التقديرية، لأن الفارق بين فندقين داخل المنطقة الواحدة قد يبلغ عشرين دقيقة.",
          en: "Between half an hour and two and a half hours depending on the area: Belek 30–45 minutes, Side about an hour, Kemer 50 minutes to 1.5 hours, Alanya 1.5–2.5 hours. With the exact hotel name at booking we give you the real time rather than an estimate, because even within one area name two hotels can be twenty minutes apart.",
        },
      },
      {
        question: {
          tr: "Kışın Antalya'ya gitmek mantıklı mı?",
          ar: "هل الذهاب إلى أنطاليا شتاءً فكرة جيدة؟",
          en: "Does it make sense to visit Antalya in winter?",
        },
        answer: {
          tr: "Deniz için değil — kasım–nisan arası su girilecek sıcaklıkta değil ve sahil otellerinin bir kısmı kapanıyor. Ama şehir kapanmıyor: Kaleiçi, müzeler, Düden Şelalesi ve çarşı yıl boyu açık, hava on beş derece civarında ve kalabalık yok. Kışın gezmeye geliyorsanız Antalya merkez mantıklı; sahil beldelerine gitmeyin.",
          ar: "ليس من أجل البحر — فبين تشرين الثاني ونيسان لا يكون الماء بدرجة تسمح بالسباحة ويُغلق جزء من فنادق الساحل. لكن المدينة لا تُغلق: كالي إيتشي والمتاحف وشلال دودان والسوق مفتوحة طوال السنة، والحرارة حول خمس عشرة درجة ولا زحام. فإن كنت قادماً شتاءً للتجوّل فمركز أنطاليا منطقي؛ ولا تذهب إلى بلدات الساحل.",
          en: "Not for the sea — from November to April the water is not warm enough and some coastal hotels close. But the city does not close: Kaleiçi, the museums, the Düden waterfall and the bazaar are open all year, it is around fifteen degrees and there are no crowds. If you are coming in winter to sightsee, central Antalya makes sense; skip the coastal resorts.",
        },
      },
    ],
    tourSlug: "antalya-turu",
    packageSlug: "antalya-akdeniz-5-gun",
    guideSlugs: ["antalya-bolge-rehberi"],
    routeSlugs: [
      "antalya-havalimani-kemer-transfer",
      "antalya-havalimani-belek-transfer",
      "antalya-havalimani-side-transfer",
      "antalya-havalimani-alanya-transfer",
    ],
    hotelAreaKeys: ["antalya"],
  },
  {
    slug: "bodrum",
    image: "/images/places/bodrum-kale.jpg",
    name: { tr: "Bodrum", ar: "بودروم", en: "Bodrum" },
    tagline: {
      tr: "Bir şehir değil bir yarımada: yirmi beş kilometrede birbirine hiç benzemeyen on kadar koy.",
      ar: "ليست مدينة بل شبه جزيرة: نحو عشرة خلجان لا يشبه أحدها الآخر على خمسة وعشرين كيلومتراً.",
      en: "Not a town but a peninsula: a dozen bays, none like the next, in twenty-five kilometres.",
    },
    seo: {
      title: {
        tr: "Bodrum Turu, Transferi ve Hangi Koyda Kalınır",
        ar: "جولات بودروم والنقل من المطار وأين تقيم",
        en: "Bodrum Tours, Transfers and Where to Stay",
      },
      description: {
        tr: "Bodrum'da hangi koyda kalınır, havalimanından ne kadar sürer, deniz ne zaman ılık. Özel araç, Arapça şoför, sabit fiyat.",
        ar: "في أي خليج تقيم في بودروم، وكم تستغرق الطريق من المطار، ومتى يكون البحر دافئاً. سيارة خاصة وسائق يتحدث العربية وسعر ثابت.",
        en: "Which bay to stay in, how long from the airport, when the sea is warm. Private vehicle, Arabic-speaking driver, fixed price.",
      },
    },
    intro: {
      tr: "Bodrum haritada tek bir nokta gibi duruyor ama aslında bir yarımada: merkezden Yalıkavak'a yirmi beş kilometre var ve arada birbirine hiç benzemeyen koylar sıralanıyor. Gümbet'te kalan misafirle Türkbükü'nde kalan aynı tatili yaşamıyor — birinde sahil hareketli ve genç, diğerinde akşamlar sessiz. Denizin rengi de kumu da yarımadanın hangi yüzünde olduğunuza göre değişiyor. Bu sayfa o kararı vermenize yarıyor ve Bodrum'da yaptığımız her şeyi tek yerde topluyor.",
      ar: "تبدو بودروم نقطة واحدة على الخريطة، لكنها في الحقيقة شبه جزيرة: من المركز إلى ياليكافاك خمسة وعشرون كيلومتراً، وبينهما خلجان لا يشبه أحدها الآخر. من يقيم في غومبت لا يعيش الإجازة نفسها التي يعيشها من يقيم في تركبوكو — ففي الأول ساحل نشط وشابّ، وفي الثاني مساءات صامتة. ولون البحر ورمله يتغيّران أيضاً بحسب الوجه الذي تقيم فيه من شبه الجزيرة. هذه الصفحة تعينك على ذلك القرار، وتجمع في مكان واحد كل ما نقدّمه في بودروم.",
      en: "Bodrum looks like a single dot on the map, but it is really a peninsula: twenty-five kilometres from the centre to Yalıkavak, with bays along the way that resemble one another not at all. A guest in Gümbet is not having the same holiday as one in Türkbükü — the shore is young and busy in one, the evenings silent in the other. Even the colour of the sea and the texture of the sand change with which face of the peninsula you are on. This page helps you make that choice and gathers everything we do in Bodrum in one place.",
    },
    compare: {
      reach: { tr: "İstanbul'dan uçakla ~1 saat", ar: "بالطائرة من إسطنبول نحو ساعة", en: "About an hour by air from Istanbul" },
      stay: { tr: "Dört–beş gece", ar: "أربع إلى خمس ليالٍ", en: "Four to five nights" },
      sea: { tr: "Çakıl koylar; çoğunlukla platformdan giriş", ar: "خلجان حصوية؛ النزول من منصّات غالباً", en: "Pebble bays; mostly entry from platforms" },
      months: { tr: "Haziran, eylül", ar: "يونيو، سبتمبر", en: "June, September" },
      suits: { tr: "Koylar, tekne gezisi, sakinlik", ar: "الخلجان وجولة القارب والهدوء", en: "Bays, a boat trip, quiet" },
    },
    sections: [
      {
        heading: { tr: "Yarımadanın hangi tarafı", ar: "أي جهة من شبه الجزيرة", en: "Which side of the peninsula" },
        body: {
          tr: "Bodrum merkez kaleyi, çarşıyı ve marinayı bir arada isteyene göre: akşam yürüyerek yemeğe çıkılıyor, araca gerek kalmıyor. Gümbet ve Bitez merkeze en yakın iki koy; Gümbet hareketli, Bitez daha sakin ve ağaçlıklı. Yalıkavak yarımadanın kuzeybatı ucunda, marinası ve restoranlarıyla en yüksek bütçeli taraf. Türkbükü ve Göltürkbükü sakinliği ve iskele-restoran düzeniyle biliniyor. Turgutreis batıda, gün batımı orada izleniyor ve aileler için sahili daha geniş. Merkeze uzaklaştıkça manzara ve sessizlik artıyor, çarşıya inmek için araç gerekiyor.",
          ar: "مركز بودروم يناسب من يريد القلعة والسوق والمارينا معاً: تخرج مساءً إلى العشاء مشياً ولا تحتاج سيارة. وغومبت وبيتز أقرب خليجين إلى المركز؛ غومبت نشط وبيتز أهدأ وأكثر أشجاراً. وياليكافاك في الطرف الشمالي الغربي من شبه الجزيرة، وهي بمارينتها ومطاعمها الجهة الأعلى ميزانية. وتركبوكو وغول‑تركبوكو معروفتان بالهدوء وبنظام المطاعم على الأرصفة الخشبية. وتورغوتريس في الغرب، وفيها يُشاهد غروب الشمس وساحلها أوسع للعائلات. وكلما ابتعدت عن المركز زاد المنظر والسكون، واحتجت سيارة للنزول إلى السوق.",
          en: "Central Bodrum suits anyone who wants the castle, the bazaar and the marina together: you walk out to dinner in the evening and need no car. Gümbet and Bitez are the two bays closest to the centre; Gümbet is lively, Bitez quieter and shaded. Yalıkavak sits at the north-west tip of the peninsula and is, with its marina and restaurants, the highest-budget side. Türkbükü and Göltürkbükü are known for their quiet and their jetty restaurants. Turgutreis is in the west, where the sunset is watched and the beach is wider for families. The further from the centre, the more view and silence — and the more you need a car to reach the bazaar.",
        },
        image: "/images/places/yalikavak.jpg",
        imageAlt: {
          tr: "Yalıkavak sahili yukarıdan: iskele, şezlonglar ve turkuaz su",
          ar: "ساحل ياليكافاك من الأعلى: رصيف وكراسي استلقاء ومياه فيروزية",
          en: "The Yalıkavak shore from above: a jetty, sun loungers and turquoise water",
        },
      },
      {
        heading: { tr: "Havalimanından otele", ar: "من المطار إلى الفندق", en: "From the airport to the hotel" },
        body: {
          tr: "Bodrum–Milas Havalimanı (BJV) yarımadanın kuzeydoğusunda, merkeze yaklaşık otuz altı kilometre ve kırk beş dakika. Yalıkavak'a elli kilometre ve bir saat civarı, Turgutreis'e kırk beş kilometre. Yolun tamamı iyi asfalt ama yarımada içinde virajlı; gece varışlarda sürücünün yolu bilmesi fark yaratıyor. Havalimanı küçük olduğu için karşılama noktası şaşırtmıyor: geliş kapısında isimli tabelayla bekliyoruz, uçuş numarasından takip ediyoruz ve rötar için ek ücret çıkmıyor. Yaz aylarında uçuş yoğunluğu yüksek, bagaj bekleme süresi uzayabiliyor — bekleme ücrete yansımıyor.",
          ar: "مطار بودروم–ميلاس (BJV) في شمال شرق شبه الجزيرة، على نحو ستة وثلاثين كيلومتراً من المركز وخمس وأربعين دقيقة. وياليكافاك على خمسين كيلومتراً وساعة تقريباً، وتورغوتريس على خمسة وأربعين كيلومتراً. والطريق كله معبّد جيداً لكنه ملتوٍ داخل شبه الجزيرة؛ وفي الوصول ليلاً تُحدث معرفة السائق بالطريق فرقاً. والمطار صغير فلا يحيّرك مكان الاستقبال: ننتظر عند بوابة الوصول بلافتة تحمل اسمك، ونتابع الرحلة برقمها، ولا رسوم إضافية على التأخير. وفي أشهر الصيف تكثر الرحلات وقد يطول انتظار الحقائب — والانتظار لا ينعكس على السعر.",
          en: "Bodrum–Milas Airport (BJV) lies north-east of the peninsula, about thirty-six kilometres and forty-five minutes from the centre. Yalıkavak is fifty kilometres and around an hour, Turgutreis forty-five. The road is good asphalt throughout but winding once inside the peninsula; on a night arrival it matters that the driver knows the way. The airport is small, so the meeting point does not confuse anyone: we wait at the arrivals gate with a name board, track the flight by its number, and charge nothing extra for a delay. In summer the airport is busy and baggage can take a while — waiting is not billed.",
        },
      },
      {
        heading: { tr: "Koylar ve tekne turu", ar: "الخلجان وجولة القارب", en: "The bays and the boat trip" },
        body: {
          tr: "Bodrum'un koylarının çoğuna karadan da gidiliyor ama tekneyle gidildiğinde gün tamamen değişiyor: sabah limandan çıkılıyor, birkaç koyda yüzme molası veriliyor ve öğle yemeği teknede yeniyor. Bizim tur programımızda bu gezi var — kiralık yat değil, tarifeli koy turu; aileler için en rahat ve en öngörülebilir olanı bu. Kale ve Sualtı Arkeoloji Müzesi sabah, tekne öğleden sonra oluyor. Denizde yüzme molası verildiği için mayo ve havlu yanınızda olmalı; Ege'de öğle güneşi sert, şapka işe yarıyor.",
          ar: "يمكن الوصول إلى معظم خلجان بودروم برّاً أيضاً، لكن الذهاب بالقارب يغيّر اليوم تماماً: تنطلق صباحاً من الميناء، وتتوقف للسباحة في عدة خلجان، ويكون الغداء على متن القارب. وهذه الرحلة ضمن برنامج جولتنا — ليست يختاً مستأجراً بل جولة خلجان بجدول ثابت؛ وهي الأريح والأكثر قابلية للتوقّع بالنسبة للعائلات. تكون القلعة ومتحف الآثار تحت الماء صباحاً، والقارب بعد الظهر. ولأن هناك توقّفاً للسباحة فليكن معك المايوه والمنشفة؛ وشمس الظهيرة في إيجه قوية، والقبعة تنفع.",
          en: "Most of Bodrum's bays can be reached by road too, but going by boat changes the day entirely: you leave the harbour in the morning, stop to swim in several bays and eat lunch on board. This trip is part of our tour programme — not a chartered yacht but a scheduled bay tour, which is the easiest and most predictable option for families. The castle and the Museum of Underwater Archaeology come in the morning, the boat in the afternoon. Because there are swimming stops, bring a swimsuit and a towel; the midday sun on the Aegean is hard and a hat helps.",
        },
        image: "/images/places/bodrum-koyu.jpg",
        imageAlt: {
          tr: "Bodrum'da bir koy: demirli tekneler ve yamaçtaki beyaz evler",
          ar: "خليج في بودروم: قوارب راسية وبيوت بيضاء على المنحدر",
          en: "A bay in Bodrum: moored boats and white houses on the slope",
        },
      },
      {
        heading: { tr: "Ne zaman gitmeli", ar: "متى تذهب", en: "When to come" },
        body: {
          tr: "Deniz mevsimi mayıstan ekime kadar; su temmuz–eylül arasında en ılık halinde. Temmuz ve ağustos hem en sıcak hem en kalabalık aylar, otel fiyatları da o aralıkta tavan yapıyor. Haziran ve eylül dengeli: deniz uygun, sıcak katlanılır, koylar nefes alıyor. Nisan ve kasım denize girmek için serin ama gezmek, çarşıyı dolaşmak ve kaleyi görmek için iyi — üstelik ada gibi sakin. Kış aylarında yarımadanın bazı otelleri ve sahil restoranları kapanıyor, o dönemde Bodrum'u tavsiye etmiyoruz.",
          ar: "موسم البحر من أيار حتى تشرين الأول؛ والماء في أدفأ حالاته بين تموز وأيلول. وتموز وآب أشدّ الشهور حرّاً وازدحاماً، وفيهما تبلغ أسعار الفنادق ذروتها. أما حزيران وأيلول فمتوازنان: البحر مناسب والحرّ محتمل والخلجان تتنفّس. ونيسان وتشرين الثاني باردان للسباحة لكنهما جيدان للتجوّل والسوق ورؤية القلعة — والمكان فيهما هادئ كجزيرة. وفي أشهر الشتاء تُغلق بعض فنادق شبه الجزيرة ومطاعم الساحل، ولا ننصح ببودروم في تلك الفترة.",
          en: "The swimming season runs May to October; the water is at its warmest from July to September. July and August are the hottest and the most crowded, and hotel prices peak in that window. June and September are balanced: the sea is fine, the heat bearable, the bays breathing. April and November are cool for swimming but good for walking, the bazaar and the castle — and as quiet as an island. In winter some hotels and shore restaurants on the peninsula close, and we do not recommend Bodrum then.",
        },
      },
      {
        heading: { tr: "Bodrum'da neler yapıyoruz", ar: "ماذا نقدّم في بودروم", en: "What we do in Bodrum" },
        body: {
          tr: "Havalimanı karşılaması ve otele transfer, yarımada içinde günlük araç ve şoför, on saatlik Bodrum turu ve beş günlük Ege programı. Turlar özel: gruba katılmıyorsunuz, otelden alıp otele bırakıyoruz ve şoför Arapça konuşuyor. Otel rezervasyonunu sizin adınıza yapıyoruz; anlaşmalı otel listemiz yok, koyu ve oteli siz seçiyorsunuz. Yapmadıklarımız: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz — tekne gezisi tur programının içindeki tarifeli koy turudur.",
          ar: "الاستقبال من المطار والتوصيل إلى الفندق، وسيارة يومية مع سائق داخل شبه الجزيرة، وجولة بودروم من عشر ساعات، وبرنامج إيجه من خمسة أيام. الجولات خاصة: لا تنضم إلى مجموعة، نأخذك من الفندق ونعيدك إليه، والسائق يتحدث العربية. ونحجز الفندق باسمك؛ ليست لدينا قائمة فنادق متعاقدة، وأنت من يختار الخليج والفندق. وما لا نقدّمه: لا تأجير يخوت ولا شقق فندقية ولا سيارات أعراس — ورحلة القارب هي جولة الخلجان المجدولة ضمن برنامج الجولة.",
          en: "Airport meet-and-greet and hotel transfer, a car and driver by the day within the peninsula, a ten-hour Bodrum tour and a five-day Aegean programme. Tours are private: you do not join a group, we collect you from your hotel and return you there, and the driver speaks Arabic. We book the hotel in your name; we have no list of partner hotels, and you choose the bay and the hotel. What we do not do: no yacht charter, no serviced apartments, no wedding cars — the boat trip is the scheduled bay tour inside the tour programme.",
        },
      },
    ],
    facts: [
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "Bodrum–Milas (BJV) — merkeze ~36 km", ar: "بودروم–ميلاس (BJV) — نحو 36 كم عن المركز", en: "Bodrum–Milas (BJV) — about 36 km to the centre" },
      },
      {
        label: { tr: "Yarımada uzunluğu", ar: "امتداد شبه الجزيرة", en: "Length of the peninsula" },
        value: { tr: "Merkezden Yalıkavak'a ~25 km", ar: "نحو 25 كم من المركز إلى ياليكافاك", en: "About 25 km, centre to Yalıkavak" },
      },
      {
        label: { tr: "Deniz mevsimi", ar: "موسم البحر", en: "Swimming season" },
        value: { tr: "Mayıs – ekim; en ılık temmuz–eylül", ar: "أيار – تشرين الأول؛ وأدفأ ما يكون تموز–أيلول", en: "May – October; warmest July–September" },
      },
      {
        label: { tr: "Tur süresi", ar: "مدة الجولة", en: "Tour length" },
        value: { tr: "10 saat, tekne gezisi dahil", ar: "عشر ساعات، تشمل رحلة القارب", en: "10 hours, boat trip included" },
      },
    ],
    faq: [
      {
        question: { tr: "Bodrum'da hangi koyda kalmalıyım?", ar: "في أي خليج أقيم في بودروم؟", en: "Which bay in Bodrum should I stay in?" },
        answer: {
          tr: "Akşam yürüyerek yemeğe çıkmak ve çarşıyı yakınınızda istiyorsanız Bodrum merkez. Küçük çocuklu aileyseniz Bitez ya da Turgutreis; sahilleri daha sığ ve geniş. Sessizlik önceliğinizse Türkbükü. Marina, restoran ve yüksek bütçeli bir tatil arıyorsanız Yalıkavak. Merkezden uzaklaştıkça araca ihtiyaç artıyor; günlük araç ve şoför bu yüzden en çok sorulan hizmetimiz.",
          ar: "إن أردت الخروج مساءً إلى العشاء مشياً والسوق قريباً منك فمركز بودروم. وإن كنت عائلة بأطفال صغار فبيتز أو تورغوتريس؛ فشواطئهما أوسع وأقلّ عمقاً. وإن كان الهدوء أولويتك فتركبوكو. وإن كنت تبحث عن مارينا ومطاعم وإجازة بميزانية عالية فياليكافاك. وكلما ابتعدت عن المركز زادت الحاجة إلى سيارة؛ ولهذا فإن السيارة اليومية مع سائق أكثر خدماتنا طلباً.",
          en: "If you want to walk out to dinner in the evening with the bazaar nearby, central Bodrum. With small children, Bitez or Turgutreis; their beaches are shallower and wider. If quiet comes first, Türkbükü. If you are after a marina, restaurants and a higher-budget stay, Yalıkavak. The further from the centre, the more you need a car — which is why a car and driver by the day is our most requested service here.",
        },
      },
      {
        question: { tr: "Bodrum Havalimanı'ndan otele ne kadar sürer?", ar: "كم تستغرق الطريق من مطار بودروم إلى الفندق؟", en: "How long is the drive from Bodrum Airport to the hotel?" },
        answer: {
          tr: "Merkeze yaklaşık kırk beş dakika, Turgutreis'e bir saate yakın, Yalıkavak'a bir saat civarı. Yarımada içindeki yol virajlı olduğu için mesafeye bakıp süre tahmin etmek yanıltıyor. Rezervasyonda otelin tam adını aldığımızda süreyi tahmin değil doğru söylüyoruz — aynı koy adı içinde bile oteller arasında on beş dakika fark olabiliyor.",
          ar: "نحو خمس وأربعين دقيقة إلى المركز، وقرابة ساعة إلى تورغوتريس، وساعة تقريباً إلى ياليكافاك. والطريق داخل شبه الجزيرة ملتوٍ، فتقدير المدة بالنظر إلى المسافة وحدها مضلّل. وحين نأخذ اسم الفندق الكامل عند الحجز نقول المدة بدقة لا تخميناً — فالفارق بين فندقين داخل الخليج الواحد قد يبلغ خمس عشرة دقيقة.",
          en: "About forty-five minutes to the centre, close to an hour to Turgutreis, around an hour to Yalıkavak. The roads inside the peninsula wind, so judging time from distance alone misleads. With the exact hotel name at booking we give the real figure rather than an estimate — even within one bay, two hotels can be fifteen minutes apart.",
        },
      },
      {
        question: { tr: "Yat kiralıyor musunuz?", ar: "هل تؤجّرون اليخوت؟", en: "Do you charter yachts?" },
        answer: {
          tr: "Hayır. Bodrum turumuzun içinde tarifeli koy turu var — sabah limandan kalkan, birkaç koyda yüzme molası veren ve öğle yemeği verilen tekne gezisi. Özel yat kiralama hizmeti vermiyoruz ve bu konuda aracılık da yapmıyoruz; yapmadığımız bir işi yapıyormuş gibi göstermemeyi tercih ediyoruz.",
          ar: "لا. ضمن جولتنا في بودروم توجد جولة خلجان مجدولة — رحلة قارب تنطلق صباحاً من الميناء وتتوقف للسباحة في عدة خلجان ويُقدَّم فيها الغداء. ولا نقدّم خدمة تأجير اليخوت الخاصة ولا نتوسّط فيها؛ ونفضّل ألا نُظهر أننا نعمل عملاً لا نعمله.",
          en: "No. Our Bodrum tour includes a scheduled bay trip — a boat that leaves the harbour in the morning, stops to swim in several bays and serves lunch. We do not offer private yacht charter and we do not broker it either; we would rather not present ourselves as doing work we do not do.",
        },
      },
    ],
    tourSlug: "bodrum-turu",
    packageSlug: "bodrum-ege-5-gun",
    guideSlugs: ["bodrum-ege-rehberi"],
    routeSlugs: [
      "bodrum-havalimani-bodrum-merkez-transfer",
      "bodrum-havalimani-yalikavak-transfer",
      "bodrum-havalimani-turgutreis-transfer",
    ],
    hotelAreaKeys: ["bodrum"],
  },
  {
    slug: "trabzon",
    image: "/images/places/sumela.jpg",
    name: { tr: "Trabzon", ar: "طرابزون", en: "Trabzon" },
    tagline: {
      tr: "Körfez'in yaz sıcağından kaçanların rotası: yeşil vadiler, sis ve on beş derecelik ağustos sabahları.",
      ar: "وجهة الهاربين من حرّ الخليج صيفاً: أودية خضراء وضباب وصباحات آب بخمس عشرة درجة.",
      en: "Where Gulf guests go to escape the summer: green valleys, mist and August mornings at fifteen degrees.",
    },
    seo: {
      title: {
        tr: "Trabzon Turu, Uzungöl ve Karadeniz Rehberi",
        ar: "جولات طرابزون وأوزنجول ودليل البحر الأسود",
        en: "Trabzon Tours, Uzungöl and the Black Sea",
      },
      description: {
        tr: "Uzungöl, Sümela ve yaylalar: mesafeler, yayla sezonu ve kaç gün gerektiği. Özel araç, Arapça rehber, sabit fiyat.",
        ar: "أوزنجول وسوميلا والمرتفعات: المسافات وموسم المرتفعات وكم يوماً يلزم. سيارة خاصة ومرشد يتحدث العربية وسعر ثابت.",
        en: "Uzungöl, Sümela and the highlands: distances, the highland season and how many days you need. Private vehicle, Arabic guide, fixed price.",
      },
    },
    intro: {
      tr: "Karadeniz, Türkiye'nin geri kalanına hiç benzemiyor. Ağustosta Antalya kırk dereceyken Trabzon'un yaylalarında sabah on beş derece oluyor ve akşam üstünüze bir şey almadan oturamıyorsunuz. Körfez'den gelen misafirin yazın buraya yönelmesinin tek sebebi bu: sıcaktan kaçmak. Ama bölgenin bir de zor tarafı var — her şey birbirinden uzak ve yol dağ yolu. Bu sayfa mesafeleri, yayla sezonunu ve programın kaç gün olması gerektiğini olduğu gibi yazıyor.",
      ar: "لا يشبه البحر الأسود بقيّة تركيا في شيء. ففي آب، بينما تبلغ أنطاليا أربعين درجة، تكون مرتفعات طرابزون صباحاً عند خمس عشرة درجة، ولا تستطيع الجلوس مساءً دون أن تلبس شيئاً فوقك. وهذا وحده سبب توجّه ضيوف الخليج إلى هنا صيفاً: الهرب من الحرّ. لكن للمنطقة وجهاً صعباً أيضاً — كل شيء بعيد عن الآخر والطريق طريق جبل. هذه الصفحة تكتب المسافات وموسم المرتفعات وعدد الأيام اللازم كما هي.",
      en: "The Black Sea coast resembles no other part of Türkiye. In August, while Antalya sits at forty degrees, a morning on the Trabzon highlands is fifteen and you cannot sit outside in the evening without a layer. That single fact is why Gulf guests turn this way in summer: to escape the heat. But the region has a hard side too — everything is far from everything else and the roads are mountain roads. This page sets out the distances, the highland season and how many days the trip really needs.",
    },
    compare: {
      reach: { tr: "İstanbul'dan uçakla ~1,5 saat", ar: "بالطائرة من إسطنبول نحو ساعة ونصف", en: "About 1.5 hours by air from Istanbul" },
      stay: { tr: "Dört–beş gece", ar: "أربع إلى خمس ليالٍ", en: "Four to five nights" },
      sea: { tr: "Karadeniz; yüzme odaklı değil", ar: "البحر الأسود؛ ليست وجهة سباحة", en: "The Black Sea; not for swimming" },
      months: { tr: "Haziran sonu – eylül", ar: "أواخر يونيو – سبتمبر", en: "Late June – September" },
      suits: { tr: "Yayla, yeşil, serin hava", ar: "الهضاب والخضرة والجوّ البارد", en: "Highlands, greenery, cool air" },
    },
    sections: [
      {
        heading: { tr: "Sümela, Uzungöl ve arada kalan yol", ar: "سوميلا وأوزنجول والطريق بينهما", en: "Sümela, Uzungöl and the road between" },
        body: {
          tr: "Sümela Manastırı Altındere vadisinde, şehir merkezine yaklaşık kırk beş kilometre ve bir saat; kayalığa oyulmuş bir yapı ve girişten manastıra kadar yokuşlu bir yürüyüş var — her yaş için uygun değil, dizi ağrıyan misafirin bunu önceden bilmesi iyi olur. Uzungöl ters yönde, yüz kilometre ve büyük bölümü dağ yolu; tek yön iki saat, yani gidiş-dönüş dört saat araçta geçiyor. İkisini aynı güne sıkıştırmak teknik olarak mümkün ama günün çoğu yolda geçiyor ve iki yerin hiçbiri doğru dürüst görülmüyor. Biz ayrı günlere koyuyoruz; arada Zigana geçidi, çay bahçeleri ve Hamsiköy molası kendiliğinden çıkıyor.",
          ar: "دير سوميلا في وادي ألتينديره، على نحو خمسة وأربعين كيلومتراً من مركز المدينة وساعة؛ وهو بناء منحوت في الصخر، ومن المدخل إلى الدير مشي صاعد — لا يناسب كل الأعمار، ومن يشكو من ركبتيه يُستحسن أن يعرف ذلك مسبقاً. وأوزنجول في الاتجاه المعاكس، على مئة كيلومتر معظمها طريق جبلي؛ ساعتان في الاتجاه الواحد، أي أربع ساعات ذهاباً وإياباً داخل السيارة. وضغط الاثنين في يوم واحد ممكن تقنياً، لكن معظم اليوم يمضي على الطريق ولا يُرى أيّ منهما كما ينبغي. ونحن نضعهما في يومين منفصلين؛ وبينهما يظهر تلقائياً ممر زيغانا وبساتين الشاي واستراحة هامسي كوي.",
          en: "The Sümela Monastery stands in the Altındere valley, about forty-five kilometres and an hour from the city centre; it is carved into the cliff and there is an uphill walk from the entrance to the building — not right for every age, and a guest with bad knees should know beforehand. Uzungöl is in the opposite direction, a hundred kilometres of largely mountain road; two hours each way, which means four hours in the car there and back. Squeezing both into one day is technically possible, but most of it is spent on the road and neither place is properly seen. We put them on separate days; the Zigana pass, the tea gardens and the Hamsiköy stop then follow naturally.",
        },
        image: "/images/places/karadeniz-vadi.jpg",
        imageAlt: {
          tr: "Karadeniz'de dere kenarı: ahşap teras ve yeşil vadi (Ayder, Rize)",
          ar: "ضفة نهر في البحر الأسود: شرفة خشبية ووادٍ أخضر (آيدر، ريزه)",
          en: "A Black Sea riverside: a wooden terrace and a green valley (Ayder, Rize)",
        },
      },
      {
        heading: { tr: "Yaylalar ne zaman açılıyor", ar: "متى تُفتح المرتفعات", en: "When the highlands open" },
        body: {
          tr: "Yayla sezonu haziran sonunda başlıyor ve eylülde kapanıyor. Bu aralığın dışında Ayder ve yüksek yaylalar sisli, soğuk ve zaman zaman yolu kapalı oluyor — mayısta gelip \"yaylaları göremedik\" diyen misafir her yıl oluyor, o yüzden tarihi konuşurken bunu baştan söylüyoruz. Uzungöl ve Sümela ise yıl boyunca gezilebiliyor; kışın yalnız yol daha yavaş ilerliyor. Ayder ve yukarısı Rize sınırlarında, Trabzon'da değil; beş günlük programımızda o gün Rize'ye geçiliyor ve sezon kapalıysa gün sahile ya da şehir çevresine çevriliyor.",
          ar: "يبدأ موسم المرتفعات في أواخر حزيران وينتهي في أيلول. وخارج هذا المدى تكون آيدر والمرتفعات العالية ضبابية وباردة وقد يُغلق طريقها أحياناً — وفي كل عام يأتي ضيف في أيار ثم يقول \"لم نرَ المرتفعات\"، ولذلك نقول ذلك من البداية حين نتحدث عن التواريخ. أما أوزنجول وسوميلا فيمكن زيارتهما طوال السنة؛ غير أن الطريق شتاءً أبطأ. وآيدر وما فوقها ضمن حدود ريزه لا طرابزون؛ وفي برنامجنا من خمسة أيام يُنتقل ذلك اليوم إلى ريزه، وإن كان الموسم مغلقاً يُحوَّل اليوم إلى الساحل أو محيط المدينة.",
          en: "The highland season opens at the end of June and closes in September. Outside that window Ayder and the high plateaux are misty, cold and sometimes cut off by road — every year a guest arrives in May and says \"we couldn't see the highlands\", so we say it plainly when dates are discussed. Uzungöl and Sümela, by contrast, can be visited all year; only the driving is slower in winter. Ayder and above are inside Rize province, not Trabzon; in our five-day programme that day crosses into Rize, and if the season is closed the day turns to the coast or the country around the city.",
        },
        image: "/images/places/ayder.jpg",
        imageAlt: {
          tr: "Ayder Yaylası: kırmızı çatılı evler, arkada karlı zirveler (Rize)",
          ar: "مرتفعات آيدر: بيوت بأسقف حمراء وخلفها قمم مكسوّة بالثلج (ريزه)",
          en: "Ayder plateau: red-roofed houses with snow-capped peaks behind (Rize)",
        },
      },
      {
        heading: { tr: "Yağmur bölgesi: ne giyilir", ar: "منطقة مطر: ماذا تلبس", en: "Rain country: what to bring" },
        body: {
          tr: "Karadeniz Türkiye'nin en çok yağış alan bölgesi ve bu yazın da geçerli. Ağustosta bile bir gün yağmur yiyebilirsiniz, sis manzarayı tamamen kapatabilir ve Uzungöl'e iki saat yol gidip gölü görememek mümkün. Bunu engelleyemiyoruz ama programı buna göre kuruyoruz: sabah erken çıkıyoruz, sis genelde öğleye doğru kalkıyor. Yanınızda ince bir yağmurluk ve kaymayan ayakkabı olsun; yaylada akşam sıcaklığı on dereceye inebiliyor, ince bir hırka her mevsim işe yarıyor. Bavulunuza yazlık kıyafetin yanına bir üst koymanız yeterli.",
          ar: "البحر الأسود أكثر مناطق تركيا هطولاً للمطر، وهذا يسري على الصيف أيضاً. ففي آب قد يصيبك المطر يوماً، وقد يحجب الضباب المنظر تماماً، ومن الممكن أن تقطع ساعتين إلى أوزنجول فلا ترى البحيرة. لا نستطيع منع ذلك، لكننا نبني البرنامج على أساسه: نخرج باكراً، والضباب ينقشع عادةً قرب الظهر. ليكن معك معطف مطر خفيف وحذاء لا ينزلق؛ فحرارة المساء في المرتفعات قد تنزل إلى عشر درجات، والسترة الخفيفة تنفع في كل موسم. ويكفي أن تضع في حقيبتك قطعة فوقية إلى جانب الملابس الصيفية.",
          en: "The Black Sea region gets more rain than anywhere else in Türkiye, and that holds in summer too. Even in August you may catch a wet day, mist can close the view completely, and it is entirely possible to drive two hours to Uzungöl and not see the lake. We cannot prevent that, but we build the day around it: we leave early, and the mist usually lifts towards noon. Bring a light raincoat and shoes with grip; evening temperatures on the plateau can drop to ten degrees, so a thin layer earns its place in every season. Alongside your summer clothes, one warm top is enough.",
        },
      },
      {
        heading: { tr: "Trabzon'da neler yapıyoruz", ar: "ماذا نقدّم في طرابزون", en: "What we do in Trabzon" },
        body: {
          tr: "Trabzon havalimanında karşılama ve otele transfer, bölge içinde günlük araç ve şoför, on iki saatlik Karadeniz turu ve beş günlük program. Turlar özel: gruba katılmıyorsunuz ve şoför Arapça konuşuyor. Trabzon'a ulaşım uçakla — İstanbul'dan karayolu bin kilometreyi aşıyor ve tek yön bir gün alıyor. Uçak bileti programa dahil değil ama isterseniz sizin adınıza biz alıyoruz. Otel rezervasyonunu da yapıyoruz; anlaşmalı otel listemiz yok. Yapmadıklarımız: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz.",
          ar: "الاستقبال في مطار طرابزون والتوصيل إلى الفندق، وسيارة يومية مع سائق داخل المنطقة، وجولة البحر الأسود من اثنتي عشرة ساعة، وبرنامج من خمسة أيام. الجولات خاصة: لا تنضم إلى مجموعة، والسائق يتحدث العربية. والوصول إلى طرابزون يكون بالطائرة — فالطريق البرّي من إسطنبول يتجاوز ألف كيلومتر ويستغرق يوماً في الاتجاه الواحد. وتذكرة الطيران غير مشمولة بالبرنامج، لكننا نشتريها باسمك إن أردت. ونتولّى حجز الفندق أيضاً؛ وليست لدينا قائمة فنادق متعاقدة. وما لا نقدّمه: لا تأجير يخوت ولا شقق فندقية ولا سيارات أعراس.",
          en: "Meet-and-greet at Trabzon airport and transfer to the hotel, a car and driver by the day within the region, a twelve-hour Black Sea tour and a five-day programme. Tours are private: you do not join a group and the driver speaks Arabic. You reach Trabzon by air — the road from Istanbul is over a thousand kilometres and takes a full day one way. The flight is not included in the programme, but we will buy it in your name if you want. We book hotels too; we have no list of partner hotels. What we do not do: no yacht charter, no serviced apartments, no wedding cars.",
        },
      },
    ],
    facts: [
      {
        label: { tr: "Havalimanı", ar: "المطار", en: "Airport" },
        value: { tr: "Trabzon (TZX) — şehrin içinde", ar: "طرابزون (TZX) — داخل المدينة", en: "Trabzon (TZX) — inside the city" },
      },
      {
        label: { tr: "Uzungöl mesafesi", ar: "المسافة إلى أوزنجول", en: "Distance to Uzungöl" },
        value: { tr: "~100 km, tek yön iki saat", ar: "نحو 100 كم، ساعتان في الاتجاه الواحد", en: "About 100 km, two hours each way" },
      },
      {
        label: { tr: "Yayla sezonu", ar: "موسم المرتفعات", en: "Highland season" },
        value: { tr: "Haziran sonu – eylül", ar: "أواخر حزيران – أيلول", en: "Late June – September" },
      },
      {
        label: { tr: "Yeterli süre", ar: "المدة الكافية", en: "Enough time" },
        value: { tr: "Beş gün; mesafeler uzun", ar: "خمسة أيام؛ فالمسافات طويلة", en: "Five days; the distances are long" },
      },
    ],
    faq: [
      {
        question: { tr: "Uzungöl ve Sümela aynı gün gezilebilir mi?", ar: "هل يمكن زيارة أوزنجول وسوميلا في اليوم نفسه؟", en: "Can Uzungöl and Sümela be seen on the same day?" },
        answer: {
          tr: "Teknik olarak mümkün ama tavsiye etmiyoruz. İkisi şehrin ters yönlerinde; Uzungöl tek yön iki saat, Sümela bir saat. Aynı güne koyduğunuzda sekiz saatin beşi araçta geçiyor, iki yerde de yarım saat kalıyorsunuz ve akşam otele yorgun dönüyorsunuz. Beş günlük programımızda ikisi ayrı günlerde; bir günlük bir çıkış yapacaksanız hangisini istediğinizi seçmek daha doğru sonuç veriyor.",
          ar: "ممكن تقنياً لكننا لا ننصح به. فهما في اتجاهين متعاكسين من المدينة؛ أوزنجول ساعتان في الاتجاه الواحد وسوميلا ساعة. وحين تضعهما في يوم واحد تمضي خمس ساعات من الثماني داخل السيارة، ولا تبقى في كل مكان سوى نصف ساعة، وتعود إلى الفندق مساءً منهكاً. وفي برنامجنا من خمسة أيام يقعان في يومين منفصلين؛ وإن كنت ستخرج ليوم واحد فالأصحّ أن تختار أيّهما تريد.",
          en: "Technically yes, but we advise against it. They lie in opposite directions from the city; Uzungöl is two hours each way, Sümela one. Put them in the same day and five of your eight hours are spent in the car, you get half an hour at each and you come back to the hotel worn out. In our five-day programme they fall on separate days; if you are making a single day trip, choosing one gives a far better result.",
        },
      },
      {
        question: { tr: "Yaz ortasında Karadeniz sıcak olur mu?", ar: "هل يكون البحر الأسود حارّاً في وسط الصيف؟", en: "Is the Black Sea hot in midsummer?" },
        answer: {
          tr: "Sahilde temmuz–ağustos yirmi beş–otuz derece ve nemli; yaylada aynı günlerde sabah on beş derece civarında ve akşam serinliyor. Körfez'den gelen misafirin aradığı fark tam olarak bu. Ama deniz için gelinmiyor: Karadeniz'in suyu Akdeniz kadar ılık değil ve sahil daha çok geçilen bir yer. Denize girmek istiyorsanız Antalya ya da Bodrum daha doğru; buraya yeşil ve serinlik için geliniyor.",
          ar: "على الساحل تكون الحرارة في تموز وآب بين خمس وعشرين وثلاثين درجة مع رطوبة؛ وفي المرتفعات في الأيام نفسها تكون صباحاً حول خمس عشرة درجة وتبرد مساءً. وهذا بالضبط الفارق الذي يبحث عنه الضيف الخليجي. لكن لا يُؤتى إلى هنا من أجل البحر: فماء البحر الأسود ليس دافئاً كالمتوسط والساحل مكان عبور أكثر منه مقصداً. فإن أردت السباحة فأنطاليا أو بودروم أصحّ؛ وإلى هنا يُؤتى للخضرة والبرودة.",
          en: "On the coast July and August run twenty-five to thirty degrees and humid; on the plateau the same mornings are around fifteen and the evenings cool. That contrast is exactly what Gulf guests come for. But you do not come here for the sea: the Black Sea is not as warm as the Mediterranean and the shore is more a place you pass through. If swimming is the point, Antalya or Bodrum is the right answer; people come here for green and for cool air.",
        },
      },
      {
        question: { tr: "Trabzon'a nasıl gidiliyor, uçak dahil mi?", ar: "كيف يُذهب إلى طرابزون، وهل التذكرة مشمولة؟", en: "How do you get to Trabzon, is the flight included?" },
        answer: {
          tr: "Uçakla. İstanbul'dan karayolu bin kilometreyi aşıyor ve tek yön bir gün alıyor, o yüzden kimse karadan gitmiyor. Uçak bileti programa dahil değil ama isterseniz sizin adınıza biz alırız — tarih esnekliğinizi sorup en uygun saati birlikte seçeriz. Karşılama Trabzon havalimanında, geliş kapısında isimli tabelayla yapılıyor.",
          ar: "بالطائرة. فالطريق البرّي من إسطنبول يتجاوز ألف كيلومتر ويستغرق يوماً في الاتجاه الواحد، ولذلك لا يذهب أحد برّاً. وتذكرة الطيران غير مشمولة بالبرنامج، لكننا نشتريها باسمك إن أردت — نسألك عن مرونة التواريخ ونختار معاً أنسب موعد. والاستقبال في مطار طرابزون عند بوابة الوصول بلافتة تحمل اسمك.",
          en: "By air. The road from Istanbul is over a thousand kilometres and takes a day one way, so nobody drives it. The ticket is not included in the programme, but we will buy it in your name if you like — we ask how flexible your dates are and pick the best time together. You are met at Trabzon airport, at the arrivals gate, with a name board.",
        },
      },
    ],
    tourSlug: "trabzon-turu",
    packageSlug: "trabzon-karadeniz-5-gun",
    guideSlugs: ["trabzon-uzungol-karadeniz"],
    routeSlugs: [],
  },
  {
    slug: "bursa",
    image: "/images/places/uludag-teleferik.jpg",
    name: { tr: "Bursa", ar: "بورصة", en: "Bursa" },
    tagline: {
      tr: "Osmanlı'nın ilk başkenti ve İstanbul'dan günübirlik çıkılabilecek en yeşil şehir.",
      ar: "أول عاصمة عثمانية، وأكثر المدن خضرةً مما يمكن زيارته من إسطنبول في يوم واحد.",
      en: "The first Ottoman capital, and the greenest city you can reach from Istanbul in a day.",
    },
    seo: {
      title: {
        tr: "Bursa Turu, Uludağ ve Cumalıkızık Rehberi",
        ar: "جولة بورصة ودليل أولوداغ وجومالي كيزيك",
        en: "Bursa Tours, Uludağ and Cumalıkızık",
      },
      description: {
        tr: "İstanbul'dan Bursa'ya nasıl gidilir, teleferik ne zaman açık, günübirlik yeter mi. Özel araç, Arapça şoför, sabit fiyat.",
        ar: "كيف تصل من إسطنبول إلى بورصة، ومتى يعمل التلفريك، وهل يكفي يوم واحد. سيارة خاصة وسائق يتحدث العربية وسعر ثابت.",
        en: "How to get from Istanbul to Bursa, when the cable car runs, whether a day trip is enough. Private vehicle, Arabic driver, fixed price.",
      },
    },
    intro: {
      tr: "Bursa, İstanbul'a en yakın \"başka şehir\": aynı gün gidip dönülüyor ama gidince İstanbul'a hiç benzemeyen bir yere varıyorsunuz. Osmanlı'nın ilk başkenti olduğu için şehrin merkezi camiler, türbeler ve hanlarla dolu; arka tarafında ise Uludağ duruyor ve teleferikle yirmi dakikada ormanın üstüne çıkılıyor. Yazın İstanbul boğucuyken zirvede sıcaklık sekiz on derece düşük, kışın aynı yer kar altında. Bu sayfa gidiş yolunu, teleferiği ve günübirliğin yetip yetmediğini anlatıyor.",
      ar: "بورصة أقرب \"مدينة أخرى\" إلى إسطنبول: تذهب وتعود في اليوم نفسه، لكنك حين تذهب تصل إلى مكان لا يشبه إسطنبول في شيء. ولأنها أول عاصمة عثمانية فمركزها مليء بالمساجد والأضرحة والخانات؛ وخلفها يقف جبل أولوداغ، ويُصعد بالتلفريك في عشرين دقيقة إلى ما فوق الغابة. وفي الصيف، حين تكون إسطنبول خانقة، تقلّ الحرارة في القمة بثماني إلى عشر درجات، وفي الشتاء يكون المكان نفسه تحت الثلج. هذه الصفحة تشرح طريق الوصول والتلفريك وما إذا كان يوم واحد يكفي.",
      en: "Bursa is the nearest \"somewhere else\" to Istanbul: you go and come back the same day, yet you arrive somewhere that resembles Istanbul not at all. As the first Ottoman capital its centre is full of mosques, tombs and covered inns; behind it stands Uludağ, and a cable car lifts you above the forest in twenty minutes. In summer, when Istanbul is stifling, the summit is eight to ten degrees cooler; in winter the same place is under snow. This page explains how to get there, how the cable car works and whether one day is enough.",
    },
    compare: {
      reach: { tr: "İstanbul'dan feribotla ~2 saat", ar: "بالعبّارة من إسطنبول نحو ساعتين", en: "About two hours by ferry from Istanbul" },
      stay: { tr: "Günübirlik ya da bir gece", ar: "رحلة يوم واحد أو مبيت ليلة", en: "A day trip or one night" },
      sea: { tr: "Yok — dağ ve şehir", ar: "لا بحر — جبل ومدينة", en: "None — mountain and city" },
      months: { tr: "Yıl boyu; kar için aralık–mart", ar: "طوال السنة؛ وللثلج ديسمبر–مارس", en: "Year-round; December–March for snow" },
      suits: { tr: "Tarih, teleferik, kar", ar: "التاريخ والتلفريك والثلج", en: "History, the cable car, snow" },
    },
    sections: [
      {
        heading: { tr: "İstanbul'dan Bursa'ya nasıl gidilir", ar: "كيف تصل من إسطنبول إلى بورصة", en: "Getting there from Istanbul" },
        body: {
          tr: "İki yol var. Feribotla: Yenikapı'dan ya da Pendik'ten hızlı feribot Bursa'nın Mudanya iskelesine geçiyor, deniz yolculuğu bir buçuk saat sürüyor ve iskeleden şehir merkezine yarım saat kalıyor. Karayoluyla: Osmangazi Köprüsü üzerinden Körfez geçilerek yaklaşık iki buçuk saat. Aracı yanınıza alıp feribota bindirdiğimizde iki yolun avantajı birleşiyor — deniz yolculuğu boyunca oturuyorsunuz, karşıda araç sizinle birlikte iniyor ve gün Mudanya'da beklemeden başlıyor. Yoğun hafta sonlarında feribot dolabiliyor; saati önceden ayarlıyoruz.",
          ar: "هناك طريقان. بالعبّارة: تعبر عبّارة سريعة من ينيكابي أو بنديك إلى مرفأ مودانيا في بورصة، ورحلة البحر ساعة ونصف، ومن المرفأ إلى مركز المدينة نصف ساعة. وبرّاً: عبور الخليج من فوق جسر عثمان غازي في نحو ساعتين ونصف. وحين نأخذ السيارة معنا على متن العبّارة تجتمع ميزتا الطريقين — تجلس طوال رحلة البحر، وتنزل السيارة معك في الجهة الأخرى، ويبدأ اليوم في مودانيا بلا انتظار. وفي عطل نهاية الأسبوع المزدحمة قد تمتلئ العبّارة؛ ولذلك نحجز الموعد مسبقاً.",
          en: "There are two ways. By ferry: a fast ferry crosses from Yenikapı or Pendik to Bursa's Mudanya pier, an hour and a half at sea, with another half hour from the pier to the city centre. By road: across the Gulf over the Osmangazi Bridge, about two and a half hours. Taking the car with us onto the ferry combines the advantages of both — you sit through the crossing, the car comes off with you on the other side, and the day starts at Mudanya without waiting. On busy weekends the ferry fills up; we book the sailing in advance.",
        },
      },
      {
        heading: { tr: "Cumalıkızık ve Osmanlı Bursa'sı", ar: "جومالي كيزيك وبورصة العثمانية", en: "Cumalıkızık and Ottoman Bursa" },
        body: {
          tr: "Şehir merkezinde Ulu Cami, Yeşil Türbe ve Koza Han yürüme mesafesinde; Koza Han hâlâ ipek satılan avlulu bir han ve ortasındaki çay bahçesi molanın doğal yeri. Cumalıkızık merkeze yaklaşık on kilometre: yedi yüz yıllık taş evlerin ayakta olduğu, UNESCO listesindeki bir köy. Sokakları arnavut kaldırımı, dar ve eğimli — bebek arabası zorlanıyor, rahat ayakkabı şart. Köyde kahvaltı sunulan avlular var ve gün genelde orada çay ya da kahvaltı molasıyla tamamlanıyor. İnkaya Çınarı yolun üzerinde, altı yüz yaşında bir ağaç ve kısa bir duraklama.",
          ar: "في مركز المدينة يقع الجامع الكبير والضريح الأخضر وخان كوزا على مسافة مشي؛ وخان كوزا ما زال خاناً بفناء يُباع فيه الحرير، ومقهى الشاي في وسطه هو المكان الطبيعي للاستراحة. وجومالي كيزيك على نحو عشرة كيلومترات من المركز: قرية على قائمة اليونسكو ما زالت بيوتها الحجرية قائمة منذ سبعمئة عام. وأزقّتها من الحصى الصغير، ضيّقة ومائلة — تتعثّر فيها عربة الطفل، والحذاء المريح ضروري. وفي القرية أفنية تُقدَّم فيها الفطور، وينتهي اليوم عادةً باستراحة شاي أو فطور هناك. وشجرة إنكايا الدلب على الطريق، عمرها ستمئة عام، وتستحق وقفة قصيرة.",
          en: "In the city centre the Grand Mosque, the Green Tomb and Koza Han are within walking distance; Koza Han is still a courtyard inn where silk is sold, and the tea garden at its centre is the natural place to pause. Cumalıkızık is about ten kilometres out: a UNESCO-listed village where seven-hundred-year-old stone houses still stand. Its lanes are cobbled, narrow and steep — a pushchair struggles, and comfortable shoes are essential. Several courtyards in the village serve breakfast, and the day usually closes there over tea or a meal. The Inkaya plane tree, six hundred years old, sits on the way and is worth a short stop.",
        },
        image: "/images/places/cumalikizik.jpg",
        imageAlt: {
          tr: "Cumalıkızık'ta kaldırım taşlı sokak ve mavi Osmanlı konağı",
          ar: "زقاق مرصوف بالحصى وبيت عثماني أزرق في جومالي كيزيك",
          en: "A cobbled lane and a blue Ottoman house in Cumalıkızık",
        },
      },
      {
        heading: { tr: "Uludağ: yazın yeşil, kışın kar", ar: "أولوداغ: خضرة صيفاً وثلج شتاءً", en: "Uludağ: green in summer, snow in winter" },
        body: {
          tr: "Teleferik şehir merkezinden kalkıyor ve ormanın üstünden zirveye çıkarıyor; yolculuk yaklaşık yirmi dakika ve manzara turun en çok fotoğraflanan kısmı. Zirvede hava şehirden sekiz on derece soğuk oluyor, yani ağustos ortasında bile ince bir üst gerekiyor — yanında bir şey getirmeyen misafir yukarıda üşüyor. Aralık–mart arası kar var ve Körfez'den gelen birçok misafir Bursa'yı zaten karı görmek için istiyor. Teleferik hava koşullarına göre kapanabiliyor: rüzgâr, sis ya da yoğun kar seferi durdurabiliyor, o gün program şehir içine çevriliyor. Kapanma kararı sabah verildiği için önceden söz veremiyoruz.",
          ar: "ينطلق التلفريك من مركز المدينة ويصعد فوق الغابة إلى القمة؛ والرحلة نحو عشرين دقيقة، والمنظر أكثر أجزاء الجولة تصويراً. وفي القمة تقلّ الحرارة عن المدينة بثماني إلى عشر درجات، أي أن قطعة فوقية خفيفة لازمة حتى في منتصف آب — ومن لا يحمل شيئاً معه يشعر بالبرد في الأعلى. وبين كانون الأول وآذار يكون هناك ثلج، وكثير من ضيوف الخليج يطلبون بورصة أصلاً لرؤية الثلج. وقد يتوقّف التلفريك بحسب حال الطقس: فالريح أو الضباب أو الثلج الكثيف قد يوقف الرحلات، ويُحوَّل البرنامج حينها إلى داخل المدينة. ولأن قرار الإيقاف يُتخذ صباحاً فلا نستطيع الوعد به مسبقاً.",
          en: "The cable car leaves from the city centre and climbs over the forest to the summit; the ride takes about twenty minutes and the view is the most photographed part of the tour. At the top it is eight to ten degrees colder than in town, so even in mid-August you want a light layer — guests who bring nothing get cold up there. From December to March there is snow, and many Gulf guests ask for Bursa precisely to see it. The cable car can close with the weather: wind, fog or heavy snow will stop it, and the day then turns to the city instead. Because the decision is taken in the morning, we cannot promise it in advance.",
        },
        image: "/images/places/bursa-kis.jpg",
        imageAlt: {
          tr: "Bursa kışın: karla kaplı çatılar, arkada dağ",
          ar: "بورصة شتاءً: أسطح مغطاة بالثلج والجبل في الخلف",
          en: "Bursa in winter: snow-covered roofs with the mountain behind",
        },
      },
      {
        heading: { tr: "Bursa'da neler yapıyoruz", ar: "ماذا نقدّم في بورصة", en: "What we do in Bursa" },
        body: {
          tr: "İstanbul'dan on saatlik günübirlik Bursa turu — feribot geçişi, teleferik, Ulu Cami, Koza Han ve Cumalıkızık aynı günde. Altı günlük İstanbul–Bursa programında Bursa'ya bir gece kalınıyor ve gün sıkışmıyor. İstanbul Havalimanı'ndan doğrudan Bursa'ya transfer de veriyoruz; Bursa'ya inip İstanbul'a geçmeyecek misafir için en pratiği bu. Şoför Arapça konuşuyor, tur özel ve fiyat baştan belli. Yapmadıklarımız: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz.",
          ar: "جولة بورصة من إسطنبول ليوم واحد، عشر ساعات — عبور بالعبّارة وتلفريك والجامع الكبير وخان كوزا وجومالي كيزيك في اليوم نفسه. وفي برنامج إسطنبول–بورصة من ستة أيام تُقضى ليلة في بورصة فلا يضيق اليوم. ونوفّر أيضاً نقلاً مباشراً من مطار إسطنبول إلى بورصة؛ وهو الأنسب لمن يقصد بورصة ولن ينتقل إلى إسطنبول. والسائق يتحدث العربية، والجولة خاصة، والسعر معروف من البداية. وما لا نقدّمه: لا تأجير يخوت ولا شقق فندقية ولا سيارات أعراس.",
          en: "A ten-hour day trip to Bursa from Istanbul — the ferry crossing, the cable car, the Grand Mosque, Koza Han and Cumalıkızık in one day. In the six-day Istanbul–Bursa programme you stay a night in Bursa and the day is not compressed. We also run transfers straight from Istanbul Airport to Bursa; that is the practical option for guests headed for Bursa who will not go into Istanbul at all. The driver speaks Arabic, the tour is private and the price is set in advance. What we do not do: no yacht charter, no serviced apartments, no wedding cars.",
        },
      },
    ],
    facts: [
      {
        label: { tr: "İstanbul'dan", ar: "من إسطنبول", en: "From Istanbul" },
        value: { tr: "Feribotla ~2 saat, karayoluyla ~2,5 saat", ar: "نحو ساعتين بالعبّارة، وساعتين ونصف برّاً", en: "About 2 hours by ferry, 2.5 by road" },
      },
      {
        label: { tr: "Tur süresi", ar: "مدة الجولة", en: "Tour length" },
        value: { tr: "10 saat, günübirlik", ar: "عشر ساعات، ليوم واحد", en: "10 hours, a day trip" },
      },
      {
        label: { tr: "Kar mevsimi", ar: "موسم الثلج", en: "Snow season" },
        value: { tr: "Aralık – mart (Uludağ)", ar: "كانون الأول – آذار (أولوداغ)", en: "December – March (Uludağ)" },
      },
      {
        label: { tr: "Zirvede sıcaklık", ar: "الحرارة في القمة", en: "At the summit" },
        value: { tr: "Şehirden 8–10 derece düşük", ar: "أقل من المدينة بثماني إلى عشر درجات", en: "8–10 degrees below the city" },
      },
    ],
    faq: [
      {
        question: { tr: "Bursa'yı günübirlik gezmek yeterli mi?", ar: "هل يكفي يوم واحد لزيارة بورصة؟", en: "Is a day trip to Bursa enough?" },
        answer: {
          tr: "Ana başlıklar için yeterli: teleferik, Ulu Cami ve Koza Han, Cumalıkızık. On saatlik program bunları rahat alıyor. Ama gün yoğun ve iki buçuk saati yolda geçiyor; küçük çocuklu ailelerde tempo zorlayabiliyor. Bursa'da bir gece kalırsanız aynı yerler acele etmeden geziliyor ve ikinci gün Uludağ'a ya da kaplıcalara vakit kalıyor. İstanbul–Bursa altı günlük programımız bu ikinci düzene göre kurulu.",
          ar: "يكفي للعناوين الرئيسية: التلفريك والجامع الكبير وخان كوزا وجومالي كيزيك. وبرنامج العشر ساعات يستوعبها بأريحية. لكن اليوم مزدحم وساعتان ونصف منه تمضي على الطريق؛ وقد يشقّ الإيقاع على العائلات ذات الأطفال الصغار. وإن بتّ ليلة في بورصة تُزار الأماكن نفسها دون استعجال، ويبقى في اليوم الثاني وقت لأولوداغ أو للحمّامات المعدنية. وبرنامجنا إسطنبول–بورصة من ستة أيام مبنيّ على هذا الترتيب الثاني.",
          en: "Enough for the headlines: the cable car, the Grand Mosque and Koza Han, Cumalıkızık. A ten-hour programme takes those comfortably. But the day is full and two and a half hours of it are spent travelling; with small children the pace can be demanding. Stay a night in Bursa and the same places can be seen without hurrying, leaving the second day for Uludağ or the thermal baths. Our six-day Istanbul–Bursa programme is built on that second pattern.",
        },
      },
      {
        question: { tr: "Uludağ teleferiği her zaman çalışıyor mu?", ar: "هل يعمل تلفريك أولوداغ دائماً؟", en: "Does the Uludağ cable car always run?" },
        answer: {
          tr: "Hayır — hava koşullarına bağlı. Kuvvetli rüzgâr, yoğun sis ya da ağır kar seferleri durdurabiliyor ve karar genelde sabah veriliyor, yani önceden garanti edemiyoruz. Teleferik kapalıysa o günün programını şehir merkezine ve Cumalıkızık'a çeviriyoruz; tur ücreti değişmiyor ve iptal ettiğimiz bir şey için para almıyoruz. Kar için geliyorsanız aralık–mart arası şansınız en yüksek.",
          ar: "لا — الأمر مرتبط بحال الطقس. فالريح القوية أو الضباب الكثيف أو الثلج الغزير قد يوقف الرحلات، والقرار يُتخذ عادةً صباحاً، أي أننا لا نستطيع ضمانه مسبقاً. وإن كان التلفريك متوقّفاً حوّلنا برنامج ذلك اليوم إلى مركز المدينة وجومالي كيزيك؛ ولا يتغيّر سعر الجولة ولا نأخذ مالاً مقابل شيء ألغيناه. وإن كنت قادماً من أجل الثلج فحظّك أوفر بين كانون الأول وآذار.",
          en: "No — it depends on the weather. Strong wind, thick fog or heavy snow can stop it, and the call is usually made in the morning, so we cannot guarantee it beforehand. If it is closed we turn that day towards the city centre and Cumalıkızık; the tour price does not change and we do not charge for something we cancelled. If snow is what you came for, December to March gives you the best chance.",
        },
      },
      {
        question: { tr: "Bursa'ya feribotla mı karayoluyla mı gitmek daha iyi?", ar: "أيهما أفضل إلى بورصة: العبّارة أم الطريق البري؟", en: "Is the ferry or the road better for Bursa?" },
        answer: {
          tr: "Feribot hem daha kısa hem daha rahat: deniz yolculuğu boyunca oturuyorsunuz ve trafiğe takılmıyorsunuz. Aracı da feribota alıyoruz, böylece Mudanya'da inip beklemeden yola devam ediyoruz. Karayolu yalnız feribot saatleri uymadığında ya da hafta sonu seferleri dolduğunda kullanılıyor; o zaman Osmangazi Köprüsü'nden yaklaşık iki buçuk saat sürüyor. Hangisi olacağına biletleri alırken karar veriyoruz ve fiyat değişmiyor.",
          ar: "العبّارة أقصر وأريح: تجلس طوال رحلة البحر ولا تعلق في الزحام. ونأخذ السيارة معنا على متنها، فننزل في مودانيا ونكمل الطريق بلا انتظار. ولا نستخدم الطريق البرّي إلا حين لا تناسب مواعيد العبّارة أو تمتلئ رحلات نهاية الأسبوع؛ وحينها يستغرق الطريق من فوق جسر عثمان غازي نحو ساعتين ونصف. ونقرّر أيّهما عند شراء التذاكر، والسعر لا يتغيّر.",
          en: "The ferry is both shorter and easier: you sit through the crossing and miss the traffic. We take the car aboard, so we drive off at Mudanya and carry on without waiting. The road is used only when the sailing times do not fit or the weekend crossings are full; then it is about two and a half hours over the Osmangazi Bridge. We decide which when the tickets are bought, and the price does not change.",
        },
      },
    ],
    tourSlug: "bursa-turu",
    packageSlug: "istanbul-bursa-6-gun",
    guideSlugs: ["bursa-uludag-gunubirlik"],
    routeSlugs: ["istanbul-havalimani-bursa-transfer"],
  },
  {
    slug: "sapanca",
    image: "/images/places/sapanca-golu.jpg",
    name: { tr: "Sapanca", ar: "سبانجا", en: "Sapanca" },
    tagline: {
      tr: "İstanbul'a en yakın yeşil: göl, orman ve dere üstü restoranlar — sitedeki en sakin program.",
      ar: "أقرب خضرة إلى إسطنبول: بحيرة وغابة ومطاعم فوق النهر — أهدأ برنامج لدينا.",
      en: "The nearest green to Istanbul: a lake, forest and riverside restaurants — our calmest programme.",
    },
    seo: {
      title: {
        tr: "Sapanca ve Maşukiye Turu, Göl ve Doğa Rehberi",
        ar: "جولة سبانجا وماشوكية ودليل البحيرة والطبيعة",
        en: "Sapanca and Maşukiye Tour Guide",
      },
      description: {
        tr: "İstanbul'dan Sapanca'ya kaç saat, gölün etrafında ne var, hangi mevsim uygun. Özel araç, Arapça şoför, sabit fiyat.",
        ar: "كم ساعة من إسطنبول إلى سبانجا، وماذا حول البحيرة، وأي موسم يناسب. سيارة خاصة وسائق يتحدث العربية وسعر ثابت.",
        en: "How long from Istanbul, what is around the lake, which season suits. Private vehicle, Arabic driver, fixed price.",
      },
    },
    intro: {
      tr: "Sapanca, İstanbul'dan çıkıp bir buçuk–iki saatte varılan bir göl kasabası; arkasında Maşukiye'nin ormanı ve dere üstü alabalık restoranları, yukarısında Kartepe var. Şehirden kaçmak isteyip uzun yola çıkmak istemeyen misafirin gittiği yer burası. Program yorucu değil: yürüyüş isteğe bağlı, gün göl kıyısında ve ormanda geçiyor, çocuklu ve yaşlı misafirler için sitedeki en rahat tur. Bu sayfa yolu, gölün etrafında ne olduğunu ve hangi mevsimin uygun olduğunu anlatıyor.",
      ar: "سبانجا بلدة على بحيرة يُوصل إليها من إسطنبول في ساعة ونصف إلى ساعتين؛ خلفها غابة ماشوكية ومطاعم سمك السلمون المرقّط فوق النهر، وفوقها كارتيبه. وهي وجهة من يريد الهرب من المدينة دون أن يقطع طريقاً طويلاً. والبرنامج غير متعب: المشي اختياري، ويمضي اليوم على ضفة البحيرة وفي الغابة، وهي أريح جولاتنا للأطفال وكبار السنّ. هذه الصفحة تشرح الطريق وما حول البحيرة وأي موسم يناسب.",
      en: "Sapanca is a lake town an hour and a half to two hours out of Istanbul; behind it lie the forest of Maşukiye and its riverside trout restaurants, and above that Kartepe. It is where guests go who want to leave the city without committing to a long drive. The programme is not tiring: walking is optional, the day passes by the lake and in the forest, and it is the easiest tour we run for children and older travellers. This page covers the drive, what is around the lake and which season suits.",
    },
    compare: {
      reach: { tr: "İstanbul'dan karayoluyla 1,5–2 saat", ar: "برّاً من إسطنبول ساعة ونصف – ساعتان", en: "1.5–2 hours by road from Istanbul" },
      stay: { tr: "Günübirlik ya da bir gece", ar: "رحلة يوم واحد أو مبيت ليلة", en: "A day trip or one night" },
      sea: { tr: "Göl ve orman; deniz yok", ar: "بحيرة وغابة؛ لا بحر", en: "A lake and forest; no sea" },
      months: { tr: "Nisan – ekim", ar: "أبريل – أكتوبر", en: "April – October" },
      suits: { tr: "En sakin program, kısa kaçamak", ar: "أهدأ برنامج، وهروب قصير", en: "The calmest programme, a short break" },
    },
    sections: [
      {
        heading: { tr: "İstanbul'dan bir buçuk saat", ar: "ساعة ونصف من إسطنبول", en: "Ninety minutes from Istanbul" },
        body: {
          tr: "Sapanca İstanbul'un doğusunda, yaklaşık yüz kırk kilometre; otoyoldan bir buçuk saat, trafikli saatte iki saat. Anadolu yakasından çıkılıyor, yani Kadıköy ya da Ataşehir'de kalıyorsanız yol daha da kısalıyor; Avrupa yakasından çıkarken köprü trafiğine bakmak gerekiyor ve sabah erken çıkmak yarım saat kazandırıyor. Gidiş-dönüş toplam üç saat araçta geçiyor ve bu, günübirlik çıkışlar içinde en kısa olanı — Bursa'da beş, Uzungöl'de dört saat yol var. Sabiha Gökçen'e inen misafir doğrudan Sapanca'ya da geçebiliyor; havalimanı yolun üzerinde kalıyor.",
          ar: "تقع سبانجا شرق إسطنبول على نحو مئة وأربعين كيلومتراً؛ ساعة ونصف على الطريق السريع، وساعتان في ساعة الزحام. ويكون الخروج من الجهة الآسيوية، أي أن الطريق يقصر أكثر إن كنت مقيماً في كاديكوي أو آتاشهير؛ أما الخروج من الجهة الأوروبية فيقتضي حساب زحام الجسر، والخروج باكراً يوفّر نصف ساعة. ومجموع الذهاب والإياب ثلاث ساعات داخل السيارة، وهو الأقصر بين رحلات اليوم الواحد — ففي بورصة خمس ساعات طريق وفي أوزنجول أربع. ومن يهبط في صبيحة كوكتشن يستطيع التوجّه مباشرة إلى سبانجا؛ فالمطار يقع على الطريق.",
          en: "Sapanca lies east of Istanbul, about a hundred and forty kilometres; ninety minutes on the motorway, two hours in traffic. You leave from the Asian side, so the drive is shorter still if you are staying in Kadıköy or Ataşehir; leaving from the European side means reckoning with bridge traffic, and an early start saves half an hour. Three hours in the car there and back makes this the shortest of our day trips — Bursa involves five hours of driving, Uzungöl four. Guests landing at Sabiha Gökçen can go straight to Sapanca; the airport is on the way.",
        },
      },
      {
        heading: { tr: "Gölün etrafında bir gün", ar: "يوم حول البحيرة", en: "A day around the lake" },
        body: {
          tr: "Göl kıyısında yürüyüş yolları, iskeleler ve çay bahçeleri var; kalabalık olmayan bir sabah burada saatlerce geçiyor ve kimse acele ettirmiyor. Kıyı boyunca yerel ürün tezgâhları kuruluyor — bal, reçel, kestane ve mevsiminde ıhlamur. Suya girilmiyor, göl yüzmek için değil oturmak ve yürümek için. Fotoğraf isteyen misafirin en sevdiği saat akşamüstü: karşı yamaçlar puslanıyor ve göl duruluyor. Bebek arabasıyla kıyı yolunda sorun yok; asıl zorlanılan yer ilerideki orman patikaları.",
          ar: "على ضفة البحيرة مسارات مشي وأرصفة خشبية ومقاهي شاي؛ ويمضي الصباح غير المزدحم هنا ساعات دون أن يستعجلك أحد. وعلى امتداد الضفة تُنصب بسطات المنتجات المحلية — عسل ومربّى وكستناء وزهر الزيزفون في موسمه. ولا يُسبح في البحيرة، فهي للجلوس والمشي لا للسباحة. وأحبّ ساعة إلى من يريد التصوير هي ما قبل المغيب: تتضبّب المنحدرات المقابلة ويهدأ سطح الماء. ولا مشكلة في طريق الضفة مع عربة الطفل؛ والصعوبة في مسارات الغابة الأبعد.",
          en: "Along the shore there are walking paths, jetties and tea gardens; an uncrowded morning here stretches for hours and nobody hurries you. Local stalls line the road — honey, jam, chestnuts and linden in season. You do not swim in the lake; it is for sitting and walking rather than bathing. Guests who want photographs prefer the late afternoon: the far slopes haze over and the water goes still. A pushchair manages the shore road without trouble; it is the forest paths further on that are hard going.",
        },
        image: "/images/places/sapanca-iskele.jpg",
        imageAlt: {
          tr: "Sapanca Gölü'nde gün batımında ahşap iskele ve sazlık",
          ar: "رصيف خشبي وقصب على بحيرة سبانجا عند الغروب",
          en: "A wooden jetty and reeds on Lake Sapanca at sunset",
        },
      },
      {
        heading: { tr: "Maşukiye, Kartepe ve mevsimler", ar: "ماشوكية وكارتيبه والمواسم", en: "Maşukiye, Kartepe and the seasons" },
        body: {
          tr: "Maşukiye gölün güneyinde, ormanın içinde; şelaleler, dere üstüne kurulmuş alabalık restoranları ve serin bir vadi. Yaz ortasında bile burada hava İstanbul'dan birkaç derece düşük ve suyun sesi öğle molasını uzatıyor. Kartepe yukarıda: yoldan çıkıldığında Sapanca Gölü'nü yukarıdan gören manzara noktası var, kışın da kar için tercih ediliyor ama o dönemde yol koşulları değişken. Nisan–ekim arası en rahat aralık; nisan ve mayısta orman en yeşil hali, eylül–ekimde kalabalık azalıyor. Şelale çevresindeki yollar toprak ve ıslak olabiliyor, kaymayan ayakkabı işe yarıyor.",
          ar: "تقع ماشوكية جنوب البحيرة داخل الغابة؛ فيها شلالات ومطاعم سمك مقامة فوق مجرى النهر ووادٍ بارد. وحتى في وسط الصيف تقلّ الحرارة هنا عن إسطنبول بدرجات، وصوت الماء يطيل استراحة الغداء. وكارتيبه في الأعلى: إذا انحرفت عن الطريق وجدت نقطة إطلالة ترى بحيرة سبانجا من فوق، وتُقصد شتاءً أيضاً للثلج، لكن حال الطريق في تلك الفترة متقلّبة. وأنسب مدى هو نيسان–تشرين الأول؛ ففي نيسان وأيار تكون الغابة في أشدّ خضرتها، وفي أيلول وتشرين الأول يقلّ الزحام. وقد تكون الدروب حول الشلالات ترابية ومبتلّة، والحذاء غير الزلق ينفع.",
          en: "Maşukiye lies south of the lake, inside the forest; waterfalls, trout restaurants built out over the stream and a cool valley. Even at the height of summer it is several degrees below Istanbul here, and the sound of the water stretches lunch out. Kartepe is above: turn off the road and there is a viewpoint looking down on Lake Sapanca, and it draws people in winter for the snow, though road conditions then are changeable. April to October is the easiest window; April and May give the forest at its greenest, September and October bring smaller crowds. The paths around the waterfalls can be earth and wet, so shoes with grip help.",
        },
        image: "/images/places/sapanca-aksam.jpg",
        imageAlt: {
          tr: "Sapanca Gölü akşamüstü: göl kıyısındaki ahşap teras ve karşı yamaçlar",
          ar: "بحيرة سبانجا قبيل المغيب: شرفة خشبية على الضفة والمنحدرات المقابلة",
          en: "Lake Sapanca in the late afternoon: a wooden terrace on the shore and the slopes beyond",
        },
      },
      {
        heading: { tr: "Sapanca'da neler yapıyoruz", ar: "ماذا نقدّم في سبانجا", en: "What we do in Sapanca" },
        body: {
          tr: "İstanbul'dan dokuz saatlik günübirlik Sapanca–Maşukiye turu ve sekiz günlük İstanbul–Sapanca–Bursa programı. Tur özel: gruba katılmıyorsunuz, otelden alıp otele bırakıyoruz ve şoför Arapça konuşuyor. Sabiha Gökçen'den doğrudan Sapanca'ya transfer de veriyoruz. Bu, sitedeki en sakin program — yürüyüş az ve isteğe bağlı, çocuklu ve yaşlı misafirler için en uygunu. Yapmadıklarımız: yat kiralama, aparthotel ve gelin arabası hizmeti vermiyoruz; göl kenarındaki bungalov ve villa kiralama işine de girmiyoruz.",
          ar: "جولة سبانجا–ماشوكية من إسطنبول ليوم واحد، تسع ساعات، وبرنامج إسطنبول–سبانجا–بورصة من ثمانية أيام. والجولة خاصة: لا تنضم إلى مجموعة، نأخذك من الفندق ونعيدك إليه، والسائق يتحدث العربية. ونوفّر أيضاً نقلاً مباشراً من صبيحة كوكتشن إلى سبانجا. وهذا أهدأ برنامج لدينا — المشي قليل واختياري، وهو الأنسب للأطفال وكبار السنّ. وما لا نقدّمه: لا تأجير يخوت ولا شقق فندقية ولا سيارات أعراس؛ ولا ندخل كذلك في تأجير البنغلات والفلل على ضفة البحيرة.",
          en: "A nine-hour day trip from Istanbul to Sapanca and Maşukiye, and an eight-day Istanbul–Sapanca–Bursa programme. The tour is private: you do not join a group, we collect you from your hotel and return you there, and the driver speaks Arabic. We also transfer straight from Sabiha Gökçen to Sapanca. This is the calmest programme we run — little walking, all of it optional, and the best fit for children and older guests. What we do not do: no yacht charter, no serviced apartments, no wedding cars; nor do we rent out the lakeside bungalows and villas.",
        },
      },
    ],
    facts: [
      {
        label: { tr: "İstanbul'dan", ar: "من إسطنبول", en: "From Istanbul" },
        value: { tr: "~140 km, 1,5 – 2 saat", ar: "نحو 140 كم، ساعة ونصف – ساعتان", en: "About 140 km, 1.5 – 2 hours" },
      },
      {
        label: { tr: "Tur süresi", ar: "مدة الجولة", en: "Tour length" },
        value: { tr: "9 saat, günübirlik", ar: "تسع ساعات، ليوم واحد", en: "9 hours, a day trip" },
      },
      {
        label: { tr: "En rahat aylar", ar: "أنسب الشهور", en: "Easiest months" },
        value: { tr: "Nisan – ekim", ar: "نيسان – تشرين الأول", en: "April – October" },
      },
      {
        label: { tr: "Tempo", ar: "الإيقاع", en: "Pace" },
        value: { tr: "En sakin program; yürüyüş isteğe bağlı", ar: "أهدأ برنامج؛ والمشي اختياري", en: "Our calmest programme; walking optional" },
      },
    ],
    faq: [
      {
        question: { tr: "Sapanca İstanbul'dan günübirlik gidilir mi?", ar: "هل يمكن زيارة سبانجا من إسطنبول في يوم واحد؟", en: "Can Sapanca be done as a day trip from Istanbul?" },
        answer: {
          tr: "Evet, günübirlik çıkışlarımız içinde en rahat olanı bu. Tek yön bir buçuk–iki saat, yani gün içinde toplam üç saat yolda geçiyor ve geriye göl kıyısı, Maşukiye ve öğle yemeği için bol vakit kalıyor. Sabah dokuzda çıkıp akşam altı civarı otelde oluyorsunuz. Bursa ya da Uzungöl gibi yolun günü yediği bir çıkış değil.",
          ar: "نعم، وهي أريح رحلاتنا ليوم واحد. فالاتجاه الواحد ساعة ونصف إلى ساعتين، أي ثلاث ساعات على الطريق في مجمل اليوم، ويبقى وقت وافر لضفة البحيرة وماشوكية والغداء. تخرج في التاسعة صباحاً وتكون في الفندق نحو السادسة مساءً. وليست رحلة يأكل الطريقُ يومَها كما في بورصة أو أوزنجول.",
          en: "Yes, and it is the easiest of our day trips. An hour and a half to two hours each way means three hours of driving across the day, leaving plenty of time for the lakeshore, Maşukiye and lunch. Leave at nine and you are back at the hotel around six. It is not a trip where the road eats the day, as Bursa or Uzungöl can.",
        },
      },
      {
        question: { tr: "Sapanca Gölü'nde yüzülüyor mu?", ar: "هل يُسبح في بحيرة سبانجا؟", en: "Can you swim in Lake Sapanca?" },
        answer: {
          tr: "Hayır, göl yüzmek için kullanılmıyor. Kıyı yürümek, oturmak ve yemek için; suya girilen bir yer değil. Denize girmek isteyen misafire Sapanca'yı önermiyoruz — o durumda Antalya ya da Bodrum doğru adres. Sapanca'ya yeşil, serinlik ve sakinlik için geliniyor; çocuklu ailelerin en çok sevdiği taraf da kıyının düz ve güvenli olması.",
          ar: "لا، البحيرة لا تُستخدم للسباحة. فالضفة للمشي والجلوس والطعام، وليست مكاناً يُنزل فيه إلى الماء. ولا ننصح بسبانجا لمن يريد السباحة — ففي تلك الحال أنطاليا أو بودروم هي العنوان الصحيح. ويُؤتى إلى سبانجا للخضرة والبرودة والهدوء؛ وأكثر ما تحبّه العائلات ذات الأطفال فيها أن الضفة مستوية وآمنة.",
          en: "No, the lake is not used for swimming. The shore is for walking, sitting and eating; you do not go into the water. We do not recommend Sapanca to guests who want to swim — Antalya or Bodrum is the right answer there. People come to Sapanca for green, cool air and quiet; what families with children like most is that the shore is flat and safe.",
        },
      },
      {
        question: { tr: "Kışın Sapanca'ya gitmek mantıklı mı?", ar: "هل الذهاب إلى سبانجا شتاءً فكرة جيدة؟", en: "Does a winter visit to Sapanca make sense?" },
        answer: {
          tr: "Kar görmek istiyorsanız evet: Kartepe kışın kar için tercih ediliyor ve İstanbul'dan en yakın kar burada. Ama yol koşulları değişken, sisli günlerde manzara kapanıyor ve orman patikaları çamurlu oluyor. Kar hedefiniz değilse nisan–ekim arası çok daha keyifli — göl kıyısı açık, restoranlar dolu ve yürüyüş yolları kuru. Kışın çıkacaksak sabah hava durumuna bakıp size o gün haber veriyoruz.",
          ar: "إن كنت تريد رؤية الثلج فنعم: تُقصد كارتيبه شتاءً من أجل الثلج، وهي أقرب ثلج إلى إسطنبول. لكن حال الطريق متقلّبة، وفي الأيام الضبابية يُحجب المنظر، وتصير دروب الغابة موحلة. وإن لم يكن الثلج هدفك فالمدى بين نيسان وتشرين الأول أمتع بكثير — الضفة مفتوحة والمطاعم عاملة ومسارات المشي جافة. وإن خرجنا شتاءً ننظر في حال الطقس صباحاً ونخبرك في ذلك اليوم.",
          en: "If you want to see snow, yes: Kartepe draws visitors for it in winter and it is the nearest snow to Istanbul. But road conditions vary, foggy days close the view and the forest paths turn to mud. If snow is not the point, April to October is far more pleasant — the shore is open, the restaurants working and the paths dry. If we are going in winter we check the forecast in the morning and tell you the same day.",
        },
      },
    ],
    tourSlug: "sapanca-turu",
    packageSlug: "istanbul-sapanca-bursa-8-gun",
    guideSlugs: ["sapanca-masukiye-rehberi"],
    routeSlugs: [],
  },
];
