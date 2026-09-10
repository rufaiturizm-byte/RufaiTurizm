/**
 * Çok günlük paket programları.
 *
 * Rakip analizinin en net bulgusu: Körfez'den gelen aile günübirlik tur
 * aramıyor, 4–10 günlük PROGRAM arıyor. Arapça aramalarda ilk sırayı tutan
 * siteler ("برنامج سياحي في اسطنبول") ürünlerini böyle paketliyor; bizim
 * sitede transfer, tur ve otel ayrı ayrı duruyordu ve ziyaretçi bunları
 * kendi zihninde birleştirmek zorunda kalıyordu.
 *
 * Buradaki programlar UYDURMA DEĞİL: hepsi `tours.ts` içinde zaten var olan
 * turların gün gün sıralanmış hali. Yeni bir hizmet icat edilmedi, olan
 * hizmetler bir araya getirildi.
 *
 * FİYAT BİLEREK BOŞ. Paket fiyatı kişi sayısına, otel sınıfına ve sezona
 * göre değişiyor; sabit bir rakam yazmak sitenin her yerinde verdiğimiz
 * "fiyat rezervasyonda netleşir" sözünü bozar. Fiyatı olmayan kart
 * "Fiyat talep üzerine" gösterir ve WhatsApp'a yönlendirir.
 *
 * Metinler mesaj dosyalarında değil burada: bir paket eklemek üç ayrı
 * JSON'a dokunmayı gerektirmesin diye (rehberler ve güzergâhlarla aynı
 * yaklaşım).
 */

type Text = { tr: string; ar: string; en: string };

/**
 * Pakete özel soru-cevap.
 *
 * Paket sayfaları sitenin en ince grubuydu. Sorular /sss'teki genel
 * listeyle de, hizmet ve rehber sayfalarındakilerle de çakışmıyor;
 * hepsi bu programa özgü ("Sapanca ve Bursa aynı güne sığar mı",
 * "Uludağ'da kar ne zaman"). Sayfa başına tek FAQPage şeması kuralı
 * korunuyor.
 */
export interface PackageFaq {
  question: Text;
  answer: Text;
}

/** Programın bir günü. */
export interface PackageDay {
  title: Text;
  body: Text;
}

/**
 * Programın uzun bölümleri.
 *
 * Gün gün program "ne yapacağız" diyor; alıcının sorduğu iki şey bunun
 * dışında kalıyordu: fiyatı ne belirliyor ve bu program bana uyar mı.
 * Paket kartlarında fiyat "istek üzerine" yazdığı için birincisi
 * özellikle boşluktaydı.
 *
 * Tur ve hizmet sayfalarındaki `sections` ile aynı yapı; orada mesaj
 * dosyalarında duruyor çünkü metinleri oradan geliyor, burada ise
 * paketin kendi verisiyle birlikte.
 */
export interface PackageSection {
  heading: Text;
  body: Text;
}

export interface Package {
  slug: string;
  /*
   * Bağlı olduğu şehir merkezi sayfası (data/destinations.ts).
   *
   * Birden çok şehri gezen programlarda AĞIRLIK MERKEZİ yazılıyor, ilk
   * durak değil: "İstanbul + Bursa 6 gün" programının okuru İstanbul'u
   * zaten menüden buluyor, merak ettiği Bursa. Sekiz günlük programda da
   * aynı sebeple Sapanca yazılı.
   */
  destinationSlug: string;
  name: Text;
  /**
   * Arama sonucu başlığı.
   *
   * `name` sayfada H1 olarak kalıyor ("برنامج إسطنبول 4 أيام") ve orada
   * doğru. Ama aranan biçim başka: Arapça sorgu "برنامج سياحي في تركيا
   * لمدة 4 ايام" diye geçiyor — "سياحي" kelimesi sorguda var, başlıkta
   * yoktu. Verilmezse `name` kullanılır.
   */
  metaTitle?: Text;
  /**
   * Arama sonucu açıklaması.
   *
   * `excerpt` kartın altındaki tek satır ve orada doğru — kart dar,
   * uzun cümle kartı bozar. Ama arama sonucunda 155 karaktere kadar yer
   * var ve altı paketin açıklaması 71–100 karakterde kalıyordu, yani
   * alanın yarısı boştu. Başlıkta yapılan ayrımın (bkz. `metaTitle`)
   * açıklama tarafındaki karşılığı. Verilmezse `excerpt` kullanılır.
   */
  metaDescription?: Text;
  city: Text;
  days: number;
  /** Kartta ve listede görünen tek satırlık tanıtım. */
  excerpt: Text;
  /*
   * Kapak fotoğrafı — paketin kendi karesi, turunki DEĞİL.
   *
   * Altı paket altı turla aynı altı dosyayı kullanıyordu; bölge
   * sayfasında tur kartıyla paket kartı yan yana düştüğü için tek kart
   * iki kez basılmış gibi duruyordu, ana sayfada da aynı dosya altı kez
   * geçiyordu. Görsel, paketin GERÇEKTEN uğradığı bir yerden seçilir:
   * Antalya programı Kaleiçi'ne gidiyor, Bursa programı Koza Han'a.
   * Gitmediğimiz bir yeri kapak yapmak sayfanın kendi metniyle çelişir.
   */
  image: string;
  /** Gün gün program. */
  itinerary: PackageDay[];
  /** Gün gün programın altındaki uzun bölümler. */
  sections?: PackageSection[];
  /** Fiyata dahil olanlar — anahtar `included.*` mesajlarından gelir. */
  includes: string[];
  faq: PackageFaq[];
  /**
   * Başlangıç fiyatı (USD). Yazılmazsa kart "Fiyat talep üzerine" gösterir.
   * Sezon ve kişi sayısı fiyatı değiştirdiği için şimdilik hiçbirinde yok.
   */
  priceUsdFrom?: number;
  /** Yalnız GERÇEK indirim varken doldurun. */
  discountPercent?: number;
}

export const packages: Package[] = [
  {
    slug: "istanbul-4-gun",
    destinationSlug: "istanbul",
    days: 4,
    image: "/images/places/galata-halic.jpg",
    metaTitle: {
      tr: "Türkiye Tur Programı: İstanbul 4 Gün",
      ar: "برنامج سياحي في إسطنبول لمدة 4 أيام",
      en: "Türkiye Tour Programme: Istanbul in 4 Days",
    },
    name: {
      tr: "İstanbul 4 Günlük Program",
      ar: "برنامج إسطنبول 4 أيام",
      en: "Istanbul in 4 Days",
    },
    city: { tr: "İstanbul", ar: "إسطنبول", en: "Istanbul" },
    excerpt: {
      tr: "Tarihî yarımada, Boğaz ve Beyoğlu; şehir dışına çıkmadan İstanbul'un ana hatları.",
      ar: "شبه الجزيرة التاريخية والبوسفور وبي أوغلو؛ الخطوط العريضة لإسطنبول دون الخروج من المدينة.",
      en: "The historic peninsula, the Bosphorus and Beyoğlu — Istanbul in outline, without leaving the city.",
    },
    metaDescription: {
      tr: "Dört günde İstanbul: tarihî yarımada, Boğaz ve Beyoğlu, havalimanı karşılamasıyla birlikte. Özel araç ve Arapça konuşan şoför; fiyat araç başına, kişi başı değil.",
      ar: "أربعة أيام في إسطنبول: شبه الجزيرة التاريخية والبوسفور وبي أوغلو، مع الاستقبال من المطار. سيارة خاصة وسائق ناطق بالعربية، والسعر للسيارة لا للشخص.",
      en: "Four days in Istanbul: the historic peninsula, the Bosphorus and Beyoğlu, with the airport pickup included. Private vehicle, Arabic-speaking driver, priced per car.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Dört gün İstanbul'un ana başlıklarını görmeye yeten en kısa süre. Tarihî yarımada, Boğaz ve çarşılar rahat bir tempoyla sığıyor.\n\nİyi geldiği kişiler: İstanbul'a ilk kez gelenler, kısa izin kullananlar, ve şehir dışına çıkmadan tek bir yere odaklanmak isteyenler. İlk gün bilerek boş bırakılıyor — uçuş yorgunluğu, otele yerleşme ve ilk akşam için.\n\nYetmeyebileceği kişiler: Bursa ya da Sapanca'yı da görmek isteyenler. Dört güne günübirlik sıkıştırmak şehirdeki günlerden birini yiyor; o durumda altı ya da sekiz günlük programlar daha iyi oturuyor.\n\nÇocuklu ailelerde tempo düşürülebiliyor: günde iki ana durak bırakıp öğleden sonraları serbest tutmak dört günü de rahat geçiriyor.\n\nProgram hazır olarak alınmak zorunda değil. Gün sayısını, durakları ve günün temposunu birlikte ayarlıyoruz.",
          ar: "أربعة أيام أقصر مدة تكفي لرؤية عناوين إسطنبول الرئيسية. فشبه الجزيرة التاريخية والبوسفور والأسواق تتّسع بإيقاع مريح.\n\nيناسب: من يزور إسطنبول لأول مرة، ومن إجازته قصيرة، ومن يريد التركيز على مكان واحد دون الخروج من المدينة. واليوم الأول يُترك فارغاً عمداً — لتعب الرحلة والاستقرار في الفندق والمساء الأول.\n\nوقد لا يكفي: من يريد رؤية بورصة أو سبانجا أيضاً. فحشر رحلة يوم واحد داخل أربعة أيام يأكل يوماً من أيام المدينة؛ وفي هذه الحال يستقيم برنامج الستة أو الثمانية أيام أكثر.\n\nوعند العائلات ذات الأطفال يمكن خفض الإيقاع: الاكتفاء بمحطتين رئيسيتين في اليوم وترك ما بعد الظهر حرّاً يجعل الأيام الأربعة تمرّ بأريحية.\n\nولست مضطراً إلى أخذ البرنامج جاهزاً. فنحن نضبط معك عدد الأيام والمحطات وإيقاع اليوم.",
          en: "Four days is the shortest span that covers Istanbul's headline sights. The historic peninsula, the Bosphorus and the bazaars fit at a comfortable pace.\n\nIt suits: first-time visitors to Istanbul, those on short leave, and anyone who wants to focus on one place without leaving the city. The first day is deliberately left open — for the flight, settling into the hotel and the first evening.\n\nIt may not be enough for: anyone who also wants to see Bursa or Sapanca. Squeezing a day trip into four days eats one of the city days; the six- or eight-day programmes sit better then.\n\nWith children the pace can be dropped: two main stops a day with the afternoons left free carries all four days comfortably.\n\nThe programme does not have to be taken as it stands. We set the number of days, the stops and the pace of the day together.",
        },
      },
    ],
    itinerary: [
      {
        title: { tr: "Varış ve karşılama", ar: "الوصول والاستقبال", en: "Arrival and welcome" },
        body: {
          tr: "Havalimanında isimli tabelayla karşılama ve otele transfer. Uçuş saatine göre kalan zamanda otel çevresinde kısa bir yürüyüş; ilk gün bilerek boş bırakılır, yolculuk yorgunluğu üstünüzdeyken program başlamaz.",
          ar: "الاستقبال في المطار بلافتة تحمل اسمك والتوصيل إلى الفندق. وبحسب موعد الرحلة، نزهة قصيرة حول الفندق فيما تبقّى من الوقت؛ ويُترك اليوم الأول فارغاً عن قصد، فلا يبدأ البرنامج وأنت ما زلت متعباً من السفر.",
          en: "Met at the airport with a name board and taken to your hotel. Depending on your landing time, a short walk near the hotel; the first day is deliberately left open — the programme does not start while the journey is still on you.",
        },
      },
      {
        title: { tr: "Tarihî yarımada", ar: "شبه الجزيرة التاريخية", en: "The historic peninsula" },
        body: {
          tr: "Sultanahmet Camii, Ayasofya ve Topkapı Sarayı yürüme mesafesinde. Öğleden sonra Kapalıçarşı ve Mısır Çarşısı. Namaz vakitlerinde güzergâh üzerindeki camilerde mola verilir, öğle yemeği helal seçenek sunan bir yerde.",
          ar: "جامع السلطان أحمد وآيا صوفيا وقصر توب كابي على مسافة سير. وبعد الظهر البازار الكبير والسوق المصري. ونتوقف في أوقات الصلاة عند المساجد الواقعة على الطريق، والغداء في مكان يقدّم خيارات حلال.",
          en: "The Blue Mosque, Hagia Sophia and Topkapı Palace within walking distance. In the afternoon the Grand Bazaar and the Spice Bazaar. We stop for prayers at mosques along the route, and lunch is somewhere with halal options.",
        },
      },
      {
        title: { tr: "Boğaz ve Beyoğlu", ar: "البوسفور وبي أوغلو", en: "The Bosphorus and Beyoğlu" },
        body: {
          tr: "İkindi ışığında Boğaz'da tekne turu — yalılar ve camiler bu saatte en iyi görünür. Öncesinde Galata Kulesi ve Karaköy, sonrasında Ortaköy sahilinde serbest zaman.",
          ar: "جولة بالقارب في البوسفور تحت ضوء العصر — إذ تبدو القصور الخشبية والمساجد في أجمل حالاتها في هذا الوقت. قبلها برج غلطة وكاراكوي، وبعدها وقت حر على كورنيش أورتاكوي.",
          en: "A Bosphorus cruise in the late-afternoon light — the waterfront mansions and mosques look their best then. Before it, Galata Tower and Karaköy; after it, free time along the Ortaköy shore.",
        },
      },
      {
        title: { tr: "Alışveriş ve dönüş", ar: "التسوق والعودة", en: "Shopping and departure" },
        body: {
          tr: "Uçuş saatinize göre alışveriş için yarım gün: Nişantaşı, Bağdat Caddesi ya da büyük alışveriş merkezlerinden biri. Araç gün boyu yanınızda kalır, aldıklarınız araca bırakılır. Sonra havalimanına transfer.",
          ar: "نصف يوم للتسوق بحسب موعد رحلتك: نيشانتاشي أو شارع بغداد أو أحد المولات الكبرى. وتبقى السيارة معك طوال اليوم فتترك مشترياتك فيها. ثم التوصيل إلى المطار.",
          en: "Half a day for shopping, depending on your flight: Nişantaşı, Bağdat Avenue or one of the large malls. The vehicle stays with you all day so purchases go in the car. Then the transfer to the airport.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer"],
    faq: [
      {
        question: { tr: "Dört gün İstanbul için yeterli mi?", ar: "هل تكفي أربعة أيام لإسطنبول؟", en: "Are four days enough for Istanbul?" },
        answer: {
          tr: "Şehri ana hatlarıyla görmeye yeter: tarihî yarımada, Boğaz ve Beyoğlu dört güne rahat sığar. Sığmayan şey şehir dışı gezileridir — Sapanca ya da Bursa eklemek bu programı bozar. Dört günlük ziyaretlerde şehir dışını bir sonraki sefere bırakmak en iyi sonucu veriyor.",
          ar: "تكفي لرؤية المدينة في خطوطها العريضة: شبه الجزيرة التاريخية والبوسفور وبي أوغلو تتّسع لها أربعة أيام بأريحية. أما ما لا يتّسع فهو الرحلات خارج المدينة — فإضافة سبانجا أو بورصة تُخلّ بهذا البرنامج. وأفضل نتيجة في الزيارات القصيرة أن يُترك الخارج لزيارة قادمة.",
          en: "Enough to see the city in outline: the historic peninsula, the Bosphorus and Beyoğlu fit comfortably into four days. What does not fit is out-of-town trips — adding Sapanca or Bursa breaks this programme. On a four-day visit, leaving the day trips for next time works best.",
        },
      },
      {
        question: { tr: "Otel bu programa dahil mi?", ar: "هل الفندق مشمول في هذا البرنامج؟", en: "Is the hotel included in this programme?" },
        answer: {
          tr: "İsterseniz oteli de biz ayarlarız, isterseniz kendi otelinizde kalırsınız — program iki şekilde de yürür. Otel önerirken semtin nasıl bir yer olduğunu ve metroya kaç dakika olduğunu önceden söyleriz. Konaklama eklendiğinde toplam fiyat tek rakam olarak gelir.",
          ar: "إن شئت تولّينا حجز الفندق أيضاً، وإن شئت بقيت في فندقك الخاص — والبرنامج يسير في الحالتين. وعند ترشيح فندق نوضّح لك مسبقاً طبيعة الحي وكم دقيقة يبعد عن المترو. وحين تُضاف الإقامة يصلك السعر الإجمالي كرقم واحد.",
          en: "We can arrange the hotel too, or you can stay at your own — the programme runs either way. When we suggest a hotel we tell you in advance what the neighbourhood is like and how many minutes it is to the metro. With accommodation added, the total comes as a single figure.",
        },
      },
      {
        question: { tr: "İlk gün neden programsız?", ar: "لماذا اليوم الأول بلا برنامج؟", en: "Why is the first day left open?" },
        answer: {
          tr: "Uçuş yorgunluğu üstünüzdeyken başlayan program keyif vermiyor; özellikle çocuklu ailelerde ilk günü zorlamak sonraki üç günü de yoruyor. Uçağınız sabah erken inerse ve dinç hissederseniz o günü de kullanabiliriz — programı öne çekmek tek mesaj meselesi.",
          ar: "البرنامج الذي يبدأ وأنت ما زلت متعباً من الطيران لا يمنح متعة؛ وخاصةً مع العائلات التي معها أطفال، فإرهاق اليوم الأول يُتعب الأيام الثلاثة التالية. وإن هبطت طائرتك صباحاً باكراً وشعرت بالنشاط فيمكننا استخدام ذلك اليوم أيضاً — وتقديم البرنامج لا يحتاج أكثر من رسالة.",
          en: "A programme that starts while the flight is still on you is no pleasure; with children especially, pushing the first day tires the next three. If you land early and feel fresh we can use that day too — moving the programme forward takes one message.",
        },
      },
    ],
  },
  {
    slug: "istanbul-bursa-6-gun",
    destinationSlug: "bursa",
    days: 6,
    image: "/images/places/koza-han.jpg",
    metaTitle: {
      tr: "Türkiye Turu: İstanbul ve Bursa 6 Gün",
      ar: "برنامج سياحي في إسطنبول وبورصة لمدة 6 أيام",
      en: "Türkiye Tour: Istanbul and Bursa in 6 Days",
    },
    name: {
      tr: "İstanbul ve Bursa 6 Günlük Program",
      ar: "برنامج إسطنبول وبورصة 6 أيام",
      en: "Istanbul and Bursa in 6 Days",
    },
    city: { tr: "İstanbul · Bursa", ar: "إسطنبول · بورصة", en: "Istanbul · Bursa" },
    excerpt: {
      tr: "Şehir programına Uludağ ve Cumalıkızık ekleniyor; kar mevsiminde en çok istenen rota.",
      ar: "يضاف إلى برنامج المدينة جبل أولوداغ وقرية جومالي كيزيك؛ وهو المسار الأكثر طلباً في موسم الثلج.",
      en: "Uludağ and Cumalıkızık are added to the city programme — the most requested route in the snow season.",
    },
    metaDescription: {
      tr: "Altı gün: İstanbul programının tamamı, ardından Bursa, Uludağ ve Cumalıkızık köyü. Kar mevsiminde en çok istenen rota. Özel araç, sabit fiyat, gruba katılmadan.",
      ar: "ستة أيام: برنامج إسطنبول كاملاً، ثم بورصة وأولوداغ وقرية جومالي كيزيك. الأكثر طلباً في موسم الثلج. سيارة خاصة وسعر ثابت، دون الانضمام إلى مجموعة.",
      en: "Six days: the full Istanbul programme, then Bursa, Uludağ and the village of Cumalıkızık. The most requested route in the snow season. Private vehicle, fixed price.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Altı gün, İstanbul'u rahat görüp bir şehir daha eklemeye yeten süre. Dört gün İstanbul, ardından Bursa'da bir gece.\n\nBu düzenin sebebi şu: Bursa'yı günübirlik yapmak günün iki buçuk saatini yola veriyor ve tempo sıkışıyor. Bir gece kalmak günü ikiye bölüyor — teleferikte daha uzun kalmak, kaplıcalara gitmek ya da Cumalıkızık'ta kahvaltıyı acele etmeden yapmak mümkün oluyor.\n\nİyi geldiği kişiler: İstanbul'u ilk kez görüp yanına bir şey eklemek isteyenler, Osmanlı tarihiyle ilgilenenler, ve kar mevsiminde (aralık–mart) Uludağ'ı görmek isteyenler.\n\nKüçük çocuklu ailelerde fark daha büyük: günübirlikte çocuk yolda yoruluyor ve ikinci yarıda program işlemiyor. Bir gecelik konaklama iki günü de rahat geçiriyor.\n\nBursa'da konaklama İstanbul'a göre belirgin biçimde uygun; termal otelleri aynı bütçede daha iyi karşılık veriyor.",
          ar: "ستة أيام مدة تكفي لرؤية إسطنبول بأريحية وإضافة مدينة أخرى. أربعة أيام في إسطنبول ثم ليلة في بورصة.\n\nوسبب هذا الترتيب: أن جعل بورصة رحلة يوم واحد يعطي ساعتين ونصف من اليوم للطريق فيضيق الإيقاع. والمبيت ليلة يقسم اليوم قسمين — فيمكن البقاء أطول في التلفريك، أو الذهاب إلى الحمّامات المعدنية، أو تناول الفطور في جومالي كيزيك دون عجلة.\n\nيناسب: من يرى إسطنبول لأول مرة ويريد أن يضيف إليها شيئاً، ومن يهتمّ بالتاريخ العثماني، ومن يريد رؤية أولوداغ في موسم الثلج (ديسمبر–مارس).\n\nوالفرق أكبر عند العائلات ذات الأطفال الصغار: ففي رحلة اليوم الواحد يتعب الطفل على الطريق ولا يعمل البرنامج في نصفه الثاني. والمبيت ليلة يجعل اليومين يمرّان بأريحية.\n\nوالإقامة في بورصة أنسب بوضوح منها في إسطنبول؛ وفنادقها الحرارية تعطي مقابلاً أفضل بالميزانية نفسها.",
          en: "Six days is enough to see Istanbul comfortably and add one more city. Four days in Istanbul, then a night in Bursa.\n\nThe reason for that shape: making Bursa a day trip gives two and a half hours of the day to the road and tightens the pace. Staying a night splits the day in two — you can stay longer at the cable car, go to the thermal baths, or have breakfast at Cumalıkızık without hurrying.\n\nIt suits: those seeing Istanbul for the first time who want to add something, anyone interested in Ottoman history, and those who want Uludağ in the snow season (December–March).\n\nThe difference is larger for families with small children: on a day trip the child tires on the road and the second half of the programme stops working. A night makes both days pass comfortably.\n\nAccommodation in Bursa is noticeably kinder than in Istanbul, and its thermal hotels give better value at the same budget.",
        },
      },
    ],
    itinerary: [
      {
        title: { tr: "Varış ve karşılama", ar: "الوصول والاستقبال", en: "Arrival and welcome" },
        body: {
          tr: "Havalimanında karşılama ve otele transfer. Program ertesi sabah başlar.",
          ar: "الاستقبال في المطار والتوصيل إلى الفندق. ويبدأ البرنامج صباح اليوم التالي.",
          en: "Met at the airport and taken to your hotel. The programme begins the next morning.",
        },
      },
      {
        title: { tr: "Tarihî yarımada", ar: "شبه الجزيرة التاريخية", en: "The historic peninsula" },
        body: {
          tr: "Sultanahmet, Ayasofya, Topkapı ve çarşılar. Gün içinde toplam üç–dört kilometre yürüyüş; çocuklu ailelerde tempo buna göre ayarlanır.",
          ar: "السلطان أحمد وآيا صوفيا وتوب كابي والأسواق. ويبلغ المشي خلال اليوم ثلاثة إلى أربعة كيلومترات؛ ويُضبط الإيقاع على ذلك مع العائلات التي معها أطفال.",
          en: "Sultanahmet, Hagia Sophia, Topkapı and the bazaars. Three to four kilometres of walking across the day; with children the pace is set accordingly.",
        },
      },
      {
        title: { tr: "Boğaz ve Beyoğlu", ar: "البوسفور وبي أوغلو", en: "The Bosphorus and Beyoğlu" },
        body: {
          tr: "Boğaz'da tekne turu, Galata ve Beyoğlu. Akşam Ortaköy ya da Bebek sahilinde serbest zaman.",
          ar: "جولة بالقارب في البوسفور، ثم غلطة وبي أوغلو. ووقت حر مساءً على كورنيش أورتاكوي أو بيبك.",
          en: "A Bosphorus cruise, then Galata and Beyoğlu. Free time in the evening along the Ortaköy or Bebek shore.",
        },
      },
      {
        title: { tr: "Bursa ve Uludağ", ar: "بورصة وأولوداغ", en: "Bursa and Uludağ" },
        body: {
          tr: "Feribotla Marmara geçişi — yolculuğun kendisi manzara. Uludağ'a teleferikle çıkış; aralık–mart arası zirvede kar bulunur. Dönüşte Ulu Cami ve Koza Han.",
          ar: "عبور بحر مرمرة بالعبّارة — والرحلة نفسها مشهد. الصعود إلى أولوداغ بالتلفريك؛ ويوجد الثلج في القمة بين كانون الأول وآذار. وفي العودة الجامع الكبير وخان الحرير.",
          en: "Crossing the Marmara by ferry — the journey itself is a sight. Up Uludağ by cable car; there is snow at the summit from December to March. On the way back, the Grand Mosque and Koza Han.",
        },
      },
      {
        title: { tr: "Cumalıkızık ve serbest gün", ar: "جومالي كيزيك ويوم حر", en: "Cumalıkızık and a free day" },
        body: {
          tr: "Osmanlı köyü Cumalıkızık'ta sabah kahvaltısı ve yürüyüş, ardından İstanbul'a dönüş. Kalan zaman serbest — balayı ve aile programlarında boş bırakılan yarım günler en çok hatırlananlar oluyor.",
          ar: "فطور صباحي ونزهة في قرية جومالي كيزيك العثمانية، ثم العودة إلى إسطنبول. وما تبقّى من الوقت حر — فأنصاف الأيام المتروكة فارغة في برامج العائلات وشهر العسل هي غالباً الأكثر بقاءً في الذاكرة.",
          en: "Breakfast and a walk in the Ottoman village of Cumalıkızık, then back to Istanbul. The rest of the time is free — in family and honeymoon programmes the half-days left empty are often the most remembered.",
        },
      },
      {
        title: { tr: "Alışveriş ve dönüş", ar: "التسوق والعودة", en: "Shopping and departure" },
        body: {
          tr: "Uçuş saatine göre alışveriş ve havalimanına transfer. Bagaj araçta taşınır, elleriniz boş gezersiniz.",
          ar: "التسوق بحسب موعد الرحلة ثم التوصيل إلى المطار. وتُحمل الأمتعة في السيارة فتتجوّل ويداك فارغتان.",
          en: "Shopping according to your flight time, then the transfer to the airport. Luggage travels in the car so you walk around empty-handed.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer", "intercity"],
    faq: [
      {
        question: { tr: "Bursa hangi gün, sırası değiştirilebilir mi?", ar: "في أي يوم بورصة، وهل يمكن تغيير الترتيب؟", en: "Which day is Bursa, and can the order change?" },
        answer: {
          tr: "Programda dördüncü güne konuyor: ilk iki gün şehre alışma ve tarihî yarımada, sonra Boğaz, ardından şehir dışı. Sıralama değiştirilebilir ama hafta sonu feribot ve Uludağ yolu kalabalıklaşır; hafta içine denk getirmek daha rahat bir gün sağlıyor.",
          ar: "تُوضع في اليوم الرابع من البرنامج: اليومان الأولان للتأقلم مع المدينة وشبه الجزيرة التاريخية، ثم البوسفور، ثم الخروج من المدينة. ويمكن تغيير الترتيب، لكن العبّارة وطريق أولوداغ يزدحمان في عطلة نهاية الأسبوع؛ وتوافقها مع أيام الأسبوع يمنح يوماً أكثر راحة.",
          en: "It sits on day four: the first two days settle you into the city and the historic peninsula, then the Bosphorus, then out of town. The order can change, but the ferry and the Uludağ road get busy at weekends; a weekday makes for an easier day.",
        },
      },
      {
        question: { tr: "Uludağ'da kar ne zaman bulunur?", ar: "متى يوجد الثلج في أولوداغ؟", en: "When is there snow on Uludağ?" },
        answer: {
          tr: "Aralıktan mart sonuna kadar; ocak ve şubatta en kalın haline ulaşır. Yaz aylarında zirve yeşil ve serin olur, kar yoktur. Kar görmek programınızın asıl sebebiyse tarihi buna göre seçmek gerekir — yazın gidip kar bulamamak en sık yaşanan hayal kırıklığı.",
          ar: "من كانون الأول حتى نهاية آذار؛ ويبلغ ذروته في كانون الثاني وشباط. أما في الصيف فتكون القمة خضراء ومنعشة بلا ثلج. وإن كانت رؤية الثلج هي سبب برنامجك الأساسي فينبغي اختيار التاريخ على هذا الأساس — فالذهاب صيفاً وعدم إيجاد الثلج أكثر خيبة أمل متكررة.",
          en: "From December to the end of March, deepest in January and February. In summer the summit is green and cool, with no snow. If snow is the reason for your trip, the dates have to be chosen accordingly — going in summer and finding none is the most common disappointment.",
        },
      },
      {
        question: { tr: "Altı gün iki şehir için yeterli mi?", ar: "هل تكفي ستة أيام لمدينتين؟", en: "Are six days enough for two cities?" },
        answer: {
          tr: "Evet, çünkü Bursa günübirlik gidiliyor — konaklama değişmiyor, aynı otelde kalmaya devam ediyorsunuz. Bavul toplamak ve otel değiştirmek olmadığı için iki şehir tek şehir temposunda geziliyor. Üçüncü bir şehir eklenirse konaklama değişir ve süre sekiz güne çıkar.",
          ar: "نعم، لأن بورصة تُزار في يوم واحد — فالإقامة لا تتغيّر وتبقى في الفندق نفسه. ولأنه لا حاجة لحزم الحقائب وتبديل الفندق، تُزار المدينتان بإيقاع مدينة واحدة. أما إذا أُضيفت مدينة ثالثة فتتغيّر الإقامة وترتفع المدة إلى ثمانية أيام.",
          en: "Yes, because Bursa is a day trip — the accommodation does not change and you stay in the same hotel. With no packing and no hotel change, two cities move at the pace of one. Add a third city and the accommodation changes, taking the length to eight days.",
        },
      },
    ],
  },
  {
    slug: "istanbul-sapanca-bursa-8-gun",
    destinationSlug: "sapanca",
    days: 8,
    image: "/images/places/sapanca-yol.jpg",
    metaTitle: {
      tr: "Türkiye Turu: İstanbul, Sapanca, Bursa 8 Gün",
      ar: "برنامج سياحي في إسطنبول وسبانجا وبورصة 8 أيام",
      en: "Türkiye Tour: Istanbul, Sapanca, Bursa 8 Days",
    },
    name: {
      tr: "İstanbul, Sapanca ve Bursa 8 Günlük Program",
      ar: "برنامج إسطنبول وسبانجا وبورصة 8 أيام",
      en: "Istanbul, Sapanca and Bursa in 8 Days",
    },
    city: {
      tr: "İstanbul · Sapanca · Bursa",
      ar: "إسطنبول · سبانجا · بورصة",
      en: "Istanbul · Sapanca · Bursa",
    },
    excerpt: {
      tr: "Şehir, göl ve dağ bir arada; aileler için en dengeli süre ve iki günübirlik çıkış.",
      ar: "المدينة والبحيرة والجبل معاً؛ وهي المدة الأكثر توازناً للعائلات مع رحلتين خارج المدينة.",
      en: "City, lake and mountain together — the most balanced length for families, with two day trips.",
    },
    metaDescription: {
      tr: "Sekiz gün: şehir, göl ve dağ bir arada — İstanbul, sonra Sapanca ve Maşukiye, sonra Bursa ve Uludağ, arada serbest gün. Aileler için en dengeli süre.",
      ar: "ثمانية أيام تجمع المدينة والبحيرة والجبل: إسطنبول، ثم سبانجا ومعشوقية، ثم بورصة وأولوداغ، وبينها يوم حرّ. المدّة الأكثر توازناً للعائلات، بسيارة خاصة.",
      en: "Eight days combining city, lake and mountain: Istanbul, then Sapanca and Maşukiye, then Bursa and Uludağ, with a free day in between. The most balanced length for families.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Sekiz gün, üç yeri acele etmeden görmeye yeten süre — ve programın asıl mantığı bu: daha çok durak değil, daha az koşuşturma.\n\nDüzen şöyle: İstanbul, ardından Sapanca'da doğa günü, sonra Bursa. Sapanca en sakin durak; sitedeki programlar arasında yürüyüşün en az olduğu gün orası.\n\nİyi geldiği kişiler: iki haftadan kısa ama bir haftadan uzun izin kullananlar, şehirle doğayı aynı seyahatte isteyenler, ve küçük çocukla ya da yaşlı bir yakınla gezen aileler — araya sakin günler girdiği için tempo düşüyor.\n\nBu programda üçüncü bir şehir eklemeyi önermiyoruz. Sekiz güne dördüncü bir durak koymak iki günü daha yola verir; kazanılan şey kaybedilenden az.\n\nSekiz günden uzun kalıyorsanız İstanbul'u merkez tutmak yerine bir sahil şehrine geçmek daha iyi sonuç veriyor — Antalya ya da Bodrum. O noktada program çok şehirli bir plana dönüşüyor.",
          ar: "ثمانية أيام مدة تكفي لرؤية ثلاثة أماكن دون عجلة — وهذا منطق البرنامج الحقيقي: محطات أقلّ ركضاً لا محطات أكثر.\n\nوالترتيب: إسطنبول، ثم يوم طبيعة في سبانجا، ثم بورصة. وسبانجا أهدأ محطة؛ وهي اليوم الأقلّ مشياً بين برامج الموقع.\n\nيناسب: من إجازته أطول من أسبوع وأقصر من أسبوعين، ومن يريد المدينة والطبيعة في سفرة واحدة، والعائلات التي تسافر مع طفل صغير أو قريب مسنّ — فدخول أيام هادئة بينها يخفض الإيقاع.\n\nولا نقترح إضافة مدينة ثالثة إلى هذا البرنامج. فوضع محطة رابعة في ثمانية أيام يعطي يومين آخرين للطريق؛ وما يُكسب أقلّ ممّا يُفقد.\n\nوإن كانت إقامتك أطول من ثمانية أيام فالانتقال إلى مدينة ساحلية يعطي نتيجة أفضل من جعل إسطنبول مركزاً — أنطاليا أو بودروم. وعند تلك النقطة يتحوّل البرنامج إلى خطة متعدّدة المدن.",
          en: "Eight days is enough to see three places without hurrying — and that is the real logic of the programme: less rushing, not more stops.\n\nThe shape: Istanbul, then a day of countryside at Sapanca, then Bursa. Sapanca is the calmest stop; it is the day with the least walking of any programme on the site.\n\nIt suits: those with more than a week and less than a fortnight, anyone who wants both city and countryside in one trip, and families travelling with a small child or an elderly relative — the quiet days in between lower the pace.\n\nWe do not suggest adding a third city to this programme. A fourth stop in eight days gives two more days to the road; what you gain is less than what you lose.\n\nIf you are staying longer than eight days, moving to a coastal city works better than keeping Istanbul as the base — Antalya or Bodrum. At that point the plan becomes a multi-city one.",
        },
      },
    ],
    itinerary: [
      {
        title: { tr: "Varış ve karşılama", ar: "الوصول والاستقبال", en: "Arrival and welcome" },
        body: {
          tr: "Havalimanında karşılama, otele transfer ve dinlenme.",
          ar: "الاستقبال في المطار والتوصيل إلى الفندق والراحة.",
          en: "Met at the airport, taken to the hotel, and time to rest.",
        },
      },
      {
        title: { tr: "Tarihî yarımada", ar: "شبه الجزيرة التاريخية", en: "The historic peninsula" },
        body: {
          tr: "Sultanahmet, Ayasofya ve Topkapı; öğleden sonra Kapalıçarşı.",
          ar: "السلطان أحمد وآيا صوفيا وتوب كابي؛ وبعد الظهر البازار الكبير.",
          en: "Sultanahmet, Hagia Sophia and Topkapı; the Grand Bazaar in the afternoon.",
        },
      },
      {
        title: { tr: "Boğaz ve Beyoğlu", ar: "البوسفور وبي أوغلو", en: "The Bosphorus and Beyoğlu" },
        body: {
          tr: "Tekne turu, Galata Kulesi ve Beyoğlu; akşam Boğaz kıyısında serbest.",
          ar: "جولة بالقارب وبرج غلطة وبي أوغلو؛ ومساءً وقت حر على ساحل البوسفور.",
          en: "The cruise, Galata Tower and Beyoğlu; free time along the Bosphorus in the evening.",
        },
      },
      {
        title: { tr: "Sapanca ve Maşukiye", ar: "سبانجا وماشوكية", en: "Sapanca and Maşukiye" },
        body: {
          tr: "İstanbul'a 130 km; göl kenarında birkaç saat, Maşukiye'de şelale yürüyüşü ve alabalık. İlkbahar ve sonbaharda en iyi hali, yazın şehrin nemli sıcağından kaçış.",
          ar: "على بعد 130 كم من إسطنبول؛ ساعات على ضفة البحيرة، ونزهة إلى الشلال في ماشوكية وسمك السلمون المرقط. وأجمل ما تكون في الربيع والخريف، وفي الصيف هرباً من رطوبة المدينة وحرّها.",
          en: "130 km from Istanbul; a few hours by the lake, a walk to the waterfalls at Maşukiye and trout for lunch. At its best in spring and autumn; in summer, an escape from the city's humid heat.",
        },
      },
      {
        title: { tr: "Serbest gün", ar: "يوم حر", en: "A free day" },
        body: {
          tr: "Program yok. İsterseniz araç ve şoför gün boyu emrinizde kalır, güzergâhı siz belirlersiniz.",
          ar: "بلا برنامج. وإن شئت تبقى السيارة والسائق تحت تصرفك طوال اليوم وأنت من يحدد المسار.",
          en: "No programme. If you like, the car and driver stay at your disposal all day and you decide the route.",
        },
      },
      {
        title: { tr: "Bursa ve Uludağ", ar: "بورصة وأولوداغ", en: "Bursa and Uludağ" },
        body: {
          tr: "Feribotla Bursa'ya geçiş, Uludağ teleferiği ve şehir merkezinde Ulu Cami ile Koza Han.",
          ar: "العبور إلى بورصة بالعبّارة، وتلفريك أولوداغ، والجامع الكبير وخان الحرير في مركز المدينة.",
          en: "Over to Bursa by ferry, the Uludağ cable car, and the Grand Mosque and Koza Han in the city centre.",
        },
      },
      {
        title: { tr: "Alışveriş", ar: "التسوق", en: "Shopping" },
        body: {
          tr: "Nişantaşı, Bağdat Caddesi ya da alışveriş merkezleri; araç gün boyu yanınızda.",
          ar: "نيشانتاشي أو شارع بغداد أو المولات؛ والسيارة معك طوال اليوم.",
          en: "Nişantaşı, Bağdat Avenue or the malls; the vehicle is with you all day.",
        },
      },
      {
        title: { tr: "Dönüş", ar: "العودة", en: "Departure" },
        body: {
          tr: "Uçuş saatine göre otelden alış ve havalimanına transfer.",
          ar: "الانطلاق من الفندق بحسب موعد الرحلة والتوصيل إلى المطار.",
          en: "Collected from the hotel according to your flight and taken to the airport.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer", "intercity", "freeDay"],
    faq: [
      {
        question: { tr: "Sekiz günde üç yer yorucu olmaz mı?", ar: "ألا يكون ثلاثة أماكن في ثمانية أيام مرهقاً؟", en: "Isn't three places in eight days tiring?" },
        answer: {
          tr: "Programın kurulma biçimi bunu önlüyor: her güne tek ana bölge düşüyor, iki şehir dışı çıkış arka arkaya değil arayla konuyor ve ortada tam serbest bir gün var. Yorucu olan gün sayısı değil, günde kaç yere sıkıştırıldığı — üç durak pratik sınır, dördüncüsü keyifsiz geçiyor.",
          ar: "طريقة بناء البرنامج تمنع ذلك: لكل يوم منطقة رئيسية واحدة، والخروجان من المدينة ليسا متتاليين بل بينهما فاصل، وفي الوسط يوم حر بالكامل. فالمرهق ليس عدد الأيام بل كم مكاناً يُحشر في اليوم الواحد — وثلاث محطات هي الحد العملي، والرابعة تمرّ بلا متعة.",
          en: "The way the programme is built prevents it: one main area per day, the two out-of-town trips spaced rather than back to back, and a completely free day in the middle. What tires people is not the number of days but how many places are squeezed into one — three stops is the practical limit, a fourth passes without pleasure.",
        },
      },
      {
        question: { tr: "Serbest günde araç ve şoför yanımda mı?", ar: "هل تبقى السيارة والسائق معي في اليوم الحر؟", en: "Do I keep the car and driver on the free day?" },
        answer: {
          tr: "İsterseniz evet — araç ve şoför gün boyu emrinizde kalır, nereye gideceğinize siz karar verirsiniz ve her durakta beklenir. İstemezseniz o gün araç çıkmaz; otelde dinlenmek ya da yürüme mesafesinde gezmek de bir seçim. Rezervasyonda hangisini istediğinizi söylemeniz yeterli.",
          ar: "إن شئت فنعم — تبقى السيارة والسائق تحت تصرفك طوال اليوم، وأنت من يقرر الوجهات، ويُنتظر عند كل محطة. وإن لم تشأ فلا تخرج السيارة ذلك اليوم؛ فالراحة في الفندق أو التجوّل على مسافة مشي خيار أيضاً. ويكفي أن تخبرنا عند الحجز بما تريد.",
          en: "If you want, yes — the car and driver stay at your disposal all day, you decide where to go and you are waited for at every stop. If you would rather not, no vehicle goes out that day; resting at the hotel or wandering within walking distance is a choice too. Just tell us at booking.",
        },
      },
      {
        question: { tr: "Sapanca ve Bursa aynı güne sığar mı?", ar: "هل تتّسع سبانجا وبورصة ليوم واحد؟", en: "Can Sapanca and Bursa fit in one day?" },
        answer: {
          tr: "Hayır, ve denenmesini önermiyoruz. İkisi İstanbul'un iki farklı yönünde: Sapanca doğuda karayoluyla, Bursa güneyde feribotla. Aynı güne sıkıştırıldığında gün yolda geçer, iki yerin de yalnız otoparkı görülür. Bu yüzden programda ayrı günlerde ve arayla duruyorlar.",
          ar: "لا، ولا ننصح بمحاولة ذلك. فهما في اتجاهين مختلفين من إسطنبول: سبانجا شرقاً براً، وبورصة جنوباً بالعبّارة. وإذا حُشرتا في يوم واحد مضى اليوم على الطريق ولم يُرَ من المكانين إلا موقف السيارات. ولذلك تقعان في البرنامج في يومين منفصلين وبينهما فاصل.",
          en: "No, and we would not suggest trying. They lie in different directions from Istanbul: Sapanca east by road, Bursa south by ferry. Squeezed into one day, the day is spent on the road and you see little of either but the car park. That is why the programme places them on separate, spaced days.",
        },
      },
    ],
  },
  {
    slug: "trabzon-karadeniz-5-gun",
    destinationSlug: "trabzon",
    days: 5,
    image: "/images/places/uzungol-vadi.jpg",
    metaTitle: {
      tr: "Karadeniz Turu: Trabzon ve Uzungöl 5 Gün",
      ar: "برنامج سياحي في طرابزون والبحر الأسود 5 أيام",
      en: "Black Sea Tour: Trabzon and Uzungöl in 5 Days",
    },
    name: {
      tr: "Trabzon ve Karadeniz 5 Günlük Program",
      ar: "برنامج طرابزون والبحر الأسود 5 أيام",
      en: "Trabzon and the Black Sea in 5 Days",
    },
    city: { tr: "Trabzon", ar: "طرابزون", en: "Trabzon" },
    excerpt: {
      tr: "Uzungöl, Sümela ve yaylalar; yaz sıcağından kaçan aileler için yeşil rota.",
      ar: "أوزنجول وسوميلا والمرتفعات؛ المسار الأخضر للعائلات الهاربة من حر الصيف.",
      en: "Uzungöl, Sümela and the highlands — the green route for families escaping the summer heat.",
    },
    metaDescription: {
      tr: "Beş gün Trabzon: Uzungöl, Sümela Manastırı ve Karadeniz yaylaları, bir gün Ayder ya da serbest. Yaz sıcağından kaçan aileler için yeşil rota, özel araçla.",
      ar: "خمسة أيام في طرابزون: أوزنجول ودير سوميلا وهضاب البحر الأسود، مع يوم لآيدر أو يوم حرّ. المسار الأخضر للهاربين من حرّ الصيف، بسيارة خاصة وسائق.",
      en: "Five days in Trabzon: Uzungöl, the Sumela Monastery and the Black Sea highlands, with a day for Ayder or a free day. The green route for families escaping summer heat.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Trabzon'da beş gün, mesafelerden çıkan bir sayı. Gezilecek yerler şehir merkezinde değil ve tek güne sığmıyor: Uzungöl tek yön iki saat, Sümela ayrı bir gün.\n\nİyi geldiği kişiler: yeşil, sis ve yayla arayanlar, sıcaktan kaçmak isteyenler — yaz ortasında bile yaylalar serin. Körfez'den gelen misafirlerin Karadeniz'i özellikle sorması bu yüzden.\n\nZorlanabilecek kişiler: uzun araç yolculuğu küçük çocuklarda ve yaşlılarda yorgunluk yaratıyor; yollar da virajlı. Sümela'ya çıkış eğimli ve her yaşa uygun değil.\n\nMevsim burada başka yerlerden daha belirleyici: yayla sezonu haziran sonu–eylül. Kışın yollar kar nedeniyle kapanabiliyor ve Uzungöl'e ulaşım zorlaşıyor.\n\nTrabzon'a ulaşım uçakla: İstanbul'dan karayolu bin kilometreyi aşıyor ve tek yön bir gün alıyor. Uçak bileti programa dahil değil; isterseniz sizin adınıza alıyoruz ve varışta karşılıyoruz.",
          ar: "خمسة أيام في طرابزون رقم يخرج من المسافات. فالأماكن التي تُزار ليست في مركز المدينة ولا تتّسع ليوم واحد: أوزنجول ساعتان في الاتجاه الواحد، وسوميلا يوم مستقلّ.\n\nيناسب: من يطلب الخضرة والضباب والمرتفعات، ومن يهرب من الحرّ — فالمرتفعات باردة حتى في وسط الصيف. ولهذا يسأل ضيوف الخليج عن البحر الأسود على وجه الخصوص.\n\nوقد يشقّ على: فالطريق الطويل يُتعب الأطفال الصغار وكبار السنّ؛ والطرق ملتوية أيضاً. والصعود إلى سوميلا منحدر ولا يناسب كل الأعمار.\n\nوالموسم هنا أكثر حسماً منه في غيره: موسم المرتفعات من أواخر يونيو إلى سبتمبر. وفي الشتاء قد تُغلق الطرق بالثلج ويصعب الوصول إلى أوزنجول.\n\nوالوصول إلى طرابزون جوّاً: فالطريق البرّي من إسطنبول يتجاوز ألف كيلومتر ويستهلك يوماً في الاتجاه الواحد. وتذكرة الطيران غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت ونستقبلك عند الوصول.",
          en: "Five days in Trabzon is a number that comes out of the distances. The places worth seeing are not in the city centre and do not fit into one day: Uzungöl is two hours each way, Sümela is a day of its own.\n\nIt suits: people after greenery, mist and highlands, and those escaping the heat — the highlands stay cool even in midsummer. It is why Gulf guests ask about the Black Sea in particular.\n\nIt can be hard for: the long drives tire small children and older travellers, and the roads wind. The climb to Sümela is steep and does not suit every age.\n\nSeason matters more here than elsewhere: the highland season runs from late June to September. In winter roads can close with snow and reaching Uzungöl becomes difficult.\n\nTrabzon is reached by air: the road from Istanbul is over a thousand kilometres and takes a day each way. The flight is not part of the programme; we buy it in your name if you want, and meet you on arrival.",
        },
      },
    ],
    itinerary: [
      {
        title: { tr: "Varış", ar: "الوصول", en: "Arrival" },
        body: {
          tr: "Trabzon havalimanında karşılama ve otele transfer. Şehirde kısa bir gezinti.",
          ar: "الاستقبال في مطار طرابزون والتوصيل إلى الفندق. وجولة قصيرة في المدينة.",
          en: "Met at Trabzon airport and taken to the hotel, with a short look around the city.",
        },
      },
      {
        title: { tr: "Uzungöl", ar: "أوزنجول", en: "Uzungöl" },
        body: {
          tr: "Şehir merkezine yaklaşık yüz kilometre, büyük bölümü dağ yolu; tek yön iki saat. Tam günlük program, yolda çay bahçelerinde molalar.",
          ar: "نحو مئة كيلومتر عن مركز المدينة، ومعظم الطريق جبلي؛ ساعتان في الاتجاه الواحد. برنامج ليوم كامل، مع استراحات في حدائق الشاي على الطريق.",
          en: "About a hundred kilometres from the centre, mostly mountain road; two hours each way. A full-day programme with stops at tea gardens along the way.",
        },
      },
      {
        title: { tr: "Sümela ve çevresi", ar: "سوميلا وما حولها", en: "Sümela and around" },
        body: {
          tr: "Sümela Manastırı ve vadi manzaraları. Yürüyüş yokuşlu; çocuklu ailelerde tempo ona göre kurulur.",
          ar: "دير سوميلا ومناظر الوادي. والمسير فيه صعود؛ ويُضبط الإيقاع على ذلك مع العائلات التي معها أطفال.",
          en: "Sümela Monastery and the valley views. The walk is uphill; with children the pace is set accordingly.",
        },
      },
      {
        title: { tr: "Ayder ya da serbest gün", ar: "آيدر أو يوم حر", en: "Ayder or a free day" },
        body: {
          tr: "Yayla sezonu haziran sonu–eylül arası. Sezon dışındaysa gün serbest bırakılır ya da sahil boyunca gezilir.",
          ar: "موسم المرتفعات من أواخر حزيران حتى أيلول. وخارج الموسم يُترك اليوم حراً أو يُتجوَّل على طول الساحل.",
          en: "The highland season runs from late June to September. Outside it the day is left free, or spent along the coast.",
        },
      },
      {
        title: { tr: "Dönüş", ar: "العودة", en: "Departure" },
        body: {
          tr: "Uçuş saatine göre otelden alış ve havalimanına transfer.",
          ar: "الانطلاق من الفندق بحسب موعد الرحلة والتوصيل إلى المطار.",
          en: "Collected from the hotel according to your flight and taken to the airport.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer"],
    faq: [
      {
        question: { tr: "Trabzon'a nasıl gidiliyor, uçak dahil mi?", ar: "كيف يُذهب إلى طرابزون، وهل التذكرة مشمولة؟", en: "How do you get to Trabzon, is the flight included?" },
        answer: {
          tr: "Uçakla; İstanbul'dan karayolu bin kilometreyi aşıyor ve tek yön bir gün alıyor. Uçak bileti programa dahil değil ama isterseniz sizin adınıza biz alırız — tarih esnekliğinizi sorup en uygun saati birlikte seçeriz. Karşılama Trabzon havalimanında yapılır.",
          ar: "بالطائرة؛ فالطريق البري من إسطنبول يتجاوز ألف كيلومتر ويستغرق يوماً في الاتجاه الواحد. وتذكرة الطيران غير مشمولة في البرنامج، لكن يمكننا شراؤها نيابة عنك إن شئت — نسألك عن مرونة التواريخ ونختار معاً أنسب موعد. ويتم الاستقبال في مطار طرابزون.",
          en: "By air; the road from Istanbul is over a thousand kilometres and takes a full day each way. The flight is not part of the package, but we can book it for you — we ask how flexible your dates are and choose the best time together. You are met at Trabzon airport.",
        },
      },
      {
        question: { tr: "Yayla sezonu ne zaman açılıyor?", ar: "متى يبدأ موسم المرتفعات؟", en: "When does the highland season open?" },
        answer: {
          tr: "Haziran sonundan eylüle kadar. Bu aralığın dışında Ayder ve yüksek yaylalar sisli, soğuk ve zaman zaman yolu kapalı olabilir; program o günü sahil ve şehir çevresine çevirir. Uzungöl ve Sümela ise yıl boyunca gezilebilir, yalnız kış aylarında yol daha yavaş ilerler.",
          ar: "من أواخر حزيران حتى أيلول. وخارج هذه الفترة تكون آيدر والمرتفعات العالية ضبابية وباردة وقد يُغلق طريقها أحياناً؛ فيحوّل البرنامج ذلك اليوم إلى الساحل ومحيط المدينة. أما أوزنجول وسوميلا فيمكن زيارتهما طوال العام، غير أن الطريق يسير أبطأ في أشهر الشتاء.",
          en: "From late June to September. Outside that window Ayder and the higher plateaus are misty, cold and occasionally cut off; the programme turns that day towards the coast and the city instead. Uzungöl and Sümela can be visited year-round, though the road is slower in winter.",
        },
      },
      {
        question: { tr: "İstanbul programıyla birleştirilebilir mi?", ar: "هل يمكن دمجه مع برنامج إسطنبول؟", en: "Can it be combined with an Istanbul programme?" },
        answer: {
          tr: "Evet, en çok istenen birleşim bu: dört gün İstanbul, ardından iç hat uçuşuyla beş gün Karadeniz. Toplam dokuz–on gün ediyor ve iki bölge birbirinin tam zıddı olduğu için seyahat monotonlaşmıyor. İki programı birleştirdiğimizde uçuş saatlerini de birbirine göre ayarlarız.",
          ar: "نعم، وهذا هو الدمج الأكثر طلباً: أربعة أيام في إسطنبول ثم خمسة أيام في البحر الأسود برحلة داخلية. ويصبح المجموع تسعة إلى عشرة أيام، ولأن المنطقتين على طرفي نقيض لا تصبح الرحلة رتيبة. وعند دمج البرنامجين نضبط مواعيد الطيران بعضها على بعض.",
          en: "Yes, and it is the most requested combination: four days in Istanbul, then five on the Black Sea via a domestic flight. That comes to nine or ten days, and because the two regions are opposites the trip never becomes monotonous. When we combine them we also line the flights up with each other.",
        },
      },
    ],
  },
  {
    slug: "antalya-akdeniz-5-gun",
    destinationSlug: "antalya",
    days: 5,
    image: "/images/places/kaleici-liman.jpg",
    metaTitle: {
      tr: "Akdeniz Turu: Antalya 5 Gün",
      ar: "برنامج سياحي في أنطاليا لمدة 5 أيام",
      en: "Mediterranean Tour: Antalya in 5 Days",
    },
    name: {
      tr: "Antalya ve Akdeniz 5 Günlük Program",
      ar: "برنامج أنطاليا والبحر المتوسط 5 أيام",
      en: "Antalya and the Mediterranean in 5 Days",
    },
    city: {
      tr: "Antalya",
      ar: "أنطاليا",
      en: "Antalya",
    },
    excerpt: {
      tr: "Kaleiçi, Side, Düden Şelalesi ve tekne turu; deniz ile tarihi aynı programda birleştiren Akdeniz rotası.",
      ar: "كاليتشي وسيدة وشلال دودان وجولة القارب؛ مسار المتوسط الذي يجمع البحر والتاريخ في برنامج واحد.",
      en: "Kaleiçi, Side, the Düden Waterfall and a boat trip — the Mediterranean route that joins sea and history in one programme.",
    },
    metaDescription: {
      tr: "Beş gün Antalya: Kaleiçi ve şehir, Side ve antik sahil, Düden Şelalesi, bir serbest gün. Deniz ile tarihi aynı programda birleştiren Akdeniz rotası.",
      ar: "خمسة أيام في أنطاليا: كاليتشي والمدينة، وسيدة والساحل الأثري، وشلال دودان، ويوم حرّ. مسار المتوسط الذي يجمع البحر والتاريخ، بسيارة خاصة وسائق.",
      en: "Five days in Antalya: Kaleiçi and the city, Side and the ancient coast, the Düden waterfall, and a free day. The Mediterranean route that joins sea and history.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Beş gün Antalya'da hem denize hem şehre yeten süre. Program merkez, Lara ya da Belek–Side hattında kalındığı varsayımıyla kurulu; o üçünden hangisinde olursanız olun günlük çıkışlar aynı sürede yapılıyor.\n\nİyi geldiği kişiler: sahil tatili isteyip otelde kapalı kalmak istemeyenler, antik kentlerle ilgilenenler (Aspendos ve Perge merkeze bir saatten yakın), ve küçük çocuklu aileler — Lara, Belek ve Side kum, denize giriş kademeli.\n\nDikkat edilecek şey kalış yeri. Kemer'de, özellikle Alanya'da kalıyorsanız her gün yola çıkmak gerekiyor; Alanya merkeze 100-130 dakika, yani gidiş-dönüş dört saat. Kalış yerinizi söylerseniz güzergâhı ona göre kuruyoruz.\n\nMevsim: mayıs–haziran ve eylül en dengeli aylar. Temmuz–ağustos en sıcak ve en kalabalık; öğle saatleri küçük çocuklarda zorlayıcı oluyor.\n\nUçak bileti programa dahil değil; isterseniz sizin adınıza alıyoruz.",
          ar: "خمسة أيام في أنطاليا مدة تكفي للبحر والمدينة معاً. والبرنامج مبنيّ على افتراض الإقامة في المركز أو لارا أو خط بيليك–سيده؛ وأياً كان منها فالخروج اليومي يتمّ بالمدة نفسها.\n\nيناسب: من يريد إجازة ساحل ولا يريد البقاء حبيس الفندق، ومن يهتمّ بالمدن الأثرية (فأسبندوس وبيرغه على أقلّ من ساعة من المركز)، والعائلات ذات الأطفال الصغار — فلارا وبيليك وسيده رملية والنزول إلى البحر متدرّج.\n\nوما ينبغي الانتباه له مكان الإقامة. فإن كنت نازلاً في كيمر، وخاصة في ألانيا، لزم الخروج إلى الطريق كل يوم؛ فألانيا على 100 إلى 130 دقيقة من المركز، أي أربع ساعات ذهاباً وإياباً. وإن أخبرتنا بمكان إقامتك بنينا المسار عليه.\n\nوالموسم: مايو–يونيو وسبتمبر أكثر الأشهر توازناً. ويوليو وأغسطس أشدّها حرّاً وازدحاماً؛ وساعات الظهيرة فيهما ثقيلة على الأطفال الصغار.\n\nوتذكرة الطيران غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت.",
          en: "Five days in Antalya is enough for both the sea and the city. The programme assumes you are staying in the centre, Lara or on the Belek–Side stretch; from any of the three the daily outings take the same time.\n\nIt suits: people who want a beach holiday without being shut inside the hotel, anyone interested in ancient cities (Aspendos and Perge are under an hour from the centre), and families with small children — Lara, Belek and Side are sand, with a gradual entry into the water.\n\nWhat to watch is where you stay. In Kemer, and especially Alanya, you set out on the road every day; Alanya is 100 to 130 minutes from the centre, four hours there and back. Tell us where you are staying and we build the route around it.\n\nSeason: May–June and September are the most balanced months. July and August are the hottest and busiest; the midday hours are demanding with small children.\n\nThe flight is not part of the programme; we buy it in your name if you want.",
        },
      },
    ],
    itinerary: [
      {
        title: {
          tr: "Varış ve karşılama",
          ar: "الوصول والاستقبال",
          en: "Arrival and welcome",
        },
        body: {
          tr: "Antalya havalimanında isimli tabelayla karşılama ve otele transfer. Merkez ve Lara için yol 15–30 dakika, Belek 30–40, Side 60–75 dakika sürer. İlk gün bilerek boş bırakılır.",
          ar: "الاستقبال في مطار أنطاليا بلافتة تحمل اسمك والتوصيل إلى الفندق. ويستغرق الطريق إلى المركز ولارا من 15 إلى 30 دقيقة، وإلى بيليك 30 إلى 40، وإلى سيدة 60 إلى 75 دقيقة. ويُترك اليوم الأول فارغاً عن قصد.",
          en: "Met at Antalya airport with a name board and taken to your hotel. The drive is 15–30 minutes to the centre and Lara, 30–40 to Belek, 60–75 to Side. The first day is deliberately left open.",
        },
      },
      {
        title: {
          tr: "Kaleiçi ve şehir",
          ar: "كاليتشي والمدينة",
          en: "Kaleiçi and the city",
        },
        body: {
          tr: "Hadrian Kapısı, dar taş sokaklar, Osmanlı konakları ve eski limanda demirli gulet tekneleri. Öğleden sonra Düden Şelalesi'nin denize döküldüğü nokta, akşam Kaleiçi çarşısında serbest zaman.",
          ar: "بوابة هادريان والأزقة الحجرية الضيقة والبيوت العثمانية وقوارب الغوليت الراسية في الميناء القديم. وبعد الظهر النقطة التي يصبّ فيها شلال دودان في البحر، ومساءً وقت حر في سوق كاليتشي.",
          en: "Hadrian's Gate, narrow stone lanes, Ottoman houses and gulets moored in the old harbour. In the afternoon, the point where the Düden Waterfall meets the sea; in the evening, free time in the Kaleiçi bazaar.",
        },
      },
      {
        title: {
          tr: "Side ve antik sahil",
          ar: "سيدة والساحل الأثري",
          en: "Side and the ancient coast",
        },
        body: {
          tr: "Antik tiyatro ve Apollon Tapınağı denizin hemen kenarında; tarihi görmek için ayrı bir müzeye gitmek gerekmiyor. Dönüşte Manavgat çevresinde mola, ardından sahilde serbest zaman.",
          ar: "المسرح الأثري ومعبد أبولو على حافة البحر مباشرة؛ فلا حاجة لزيارة متحف منفصل لرؤية التاريخ. وفي العودة استراحة في محيط مانافغات، ثم وقت حر على الشاطئ.",
          en: "The ancient theatre and the Temple of Apollo stand right at the water's edge; you do not need a separate museum to see the history. A stop around Manavgat on the way back, then free time on the beach.",
        },
      },
      {
        title: {
          tr: "Tekne turu ya da serbest gün",
          ar: "جولة القارب أو يوم حر",
          en: "Boat trip or a free day",
        },
        body: {
          tr: "Deniz mevsimindeyseniz koylarda yüzme molalı tekne turu; dışındaysanız gün serbest bırakılır ya da Kemer tarafına, dağın denize indiği koylara geçilir. Araç ve şoför isterseniz gün boyu yanınızda kalır.",
          ar: "إن كنت في موسم البحر فجولة قارب مع استراحات سباحة في الخلجان؛ وإن كنت خارجه فيُترك اليوم حراً أو يُنتقل إلى جهة كمر حيث ينزل الجبل إلى البحر. وتبقى السيارة والسائق معك طوال اليوم إن شئت.",
          en: "In swimming season, a boat trip with swim stops in the bays; outside it, the day is left free or spent towards Kemer where the mountains meet the sea. The car and driver stay with you all day if you wish.",
        },
      },
      {
        title: {
          tr: "Alışveriş ve dönüş",
          ar: "التسوق والعودة",
          en: "Shopping and departure",
        },
        body: {
          tr: "Uçuş saatine göre çarşı ya da alışveriş merkezinde yarım gün, ardından havalimanına transfer. Aldıklarınız araçta taşınır.",
          ar: "نصف يوم في السوق أو المول بحسب موعد الرحلة، ثم التوصيل إلى المطار. وتُحمل مشترياتك في السيارة.",
          en: "Half a day at the bazaar or a mall depending on your flight, then the transfer to the airport. Purchases travel in the car.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer"],
    faq: [
      {
        question: {
          tr: "Antalya'da hangi bölgede kalmalıyım?",
          ar: "في أي منطقة أقيم في أنطاليا؟",
          en: "Which area should I stay in?",
        },
        answer: {
          tr: "Bu program merkez, Lara ya da Belek–Side hattında kalmaya göre kurulmuş; üçünden hangisinde olursanız olun günlük çıkışlar aynı sürede yapılır. Kemer ve özellikle Alanya'da kalırsanız her gün ekstra yol eklenir — Alanya merkeze 100–130 dakika uzaklıkta. Nerede kalacağınızı söylerseniz güzergâhı ona göre kurarız.",
          ar: "وُضع هذا البرنامج على أساس الإقامة في المركز أو لارا أو خط بيليك–سيدة؛ وأياً كان اختيارك من الثلاثة تُنفَّذ الخرجات اليومية في المدة نفسها. أما إن أقمت في كمر وخاصة ألانيا فيُضاف طريق إضافي كل يوم — فألانيا تبعد عن المركز 100 إلى 130 دقيقة. أخبرنا بمكان إقامتك ونضع المسار على أساسه.",
          en: "This programme assumes you are staying in the centre, Lara or on the Belek–Side stretch; from any of the three the day trips take the same time. Staying in Kemer, and especially Alanya, adds road time every day — Alanya is 100–130 minutes from the centre. Tell us where you are staying and we build the route around it.",
        },
      },
      {
        question: {
          tr: "Alanya bu programa eklenebilir mi?",
          ar: "هل يمكن إضافة ألانيا إلى هذا البرنامج؟",
          en: "Can Alanya be added?",
        },
        answer: {
          tr: "Eklenebilir ama ayrı bir tam gün ister; gidiş-dönüş dört saati yolda geçirir. Beş günlük programa sıkıştırmak yerine altı güne çıkarmak daha iyi sonuç veriyor. Alanya kalesi, Damlataş Mağarası ve uzun sahil bir günü hak ediyor.",
          ar: "يمكن، لكنه يتطلب يوماً كاملاً مستقلاً؛ إذ تمضي أربع ساعات على الطريق ذهاباً وإياباً. وبدل حشره في برنامج خمسة أيام، فإن رفعه إلى ستة أيام يعطي نتيجة أفضل. فقلعة ألانيا وكهف دامالاتاش والشاطئ الطويل تستحق يوماً كاملاً.",
          en: "It can be, but it needs a full day of its own; the round trip spends four hours on the road. Rather than squeezing it into five days, extending to six works better. Alanya's castle, the Damlataş Cave and the long beach deserve a day.",
        },
      },
      {
        question: {
          tr: "Deniz hangi aylarda ılık?",
          ar: "في أي الأشهر يكون البحر دافئاً؟",
          en: "Which months is the sea warm?",
        },
        answer: {
          tr: "Mayıstan ekime kadar; temmuz ve ağustos en sıcak dönem, hem denizde hem karada. Nisan ve kasımda hava gezmek için ideal ama deniz serin gelebilir. Kışın deniz soğuktur; buna karşılık şehir yeşil kalır ve aynı gün Toros dağlarında kar görülebilir.",
          ar: "من أيار حتى تشرين الأول؛ وتموز وآب أشدّ الفترات حرارة، في البحر والبر معاً. وفي نيسان وتشرين الثاني يكون الجو مثالياً للتجوّل لكن البحر قد يبدو بارداً. أما في الشتاء فالبحر بارد؛ في المقابل تبقى المدينة خضراء ويمكن رؤية الثلج في جبال طوروس في اليوم نفسه.",
          en: "May to October; July and August are the hottest, in the water and out of it. April and November are ideal for sightseeing but the sea can feel cool. In winter the sea is cold, though the city stays green and you can see snow in the Taurus mountains the same day.",
        },
      },
    ],
  },
  {
    slug: "bodrum-ege-5-gun",
    destinationSlug: "bodrum",
    days: 5,
    image: "/images/places/turgutreis.jpg",
    metaTitle: {
      tr: "Ege Turu: Bodrum 5 Gün",
      ar: "برنامج سياحي في بودروم لمدة 5 أيام",
      en: "Aegean Tour: Bodrum in 5 Days",
    },
    name: {
      tr: "Bodrum ve Ege 5 Günlük Program",
      ar: "برنامج بودروم وبحر إيجه 5 أيام",
      en: "Bodrum and the Aegean in 5 Days",
    },
    city: {
      tr: "Bodrum",
      ar: "بودروم",
      en: "Bodrum",
    },
    excerpt: {
      tr: "Kale, koylar, tekne turu ve Yalıkavak marinası; yarımadanın dört farklı yüzü beş güne yayılıyor.",
      ar: "القلعة والخلجان وجولة القارب ومارينا ياليكافاك؛ أربعة وجوه مختلفة لشبه الجزيرة موزّعة على خمسة أيام.",
      en: "The castle, the bays, a boat trip and Yalıkavak marina — the peninsula's four faces spread across five days.",
    },
    metaDescription: {
      tr: "Beş gün Bodrum: kale ve şehir merkezi, koylar, Yalıkavak marinası ve kuzey koyları, bir serbest gün. Yarımadanın dört ayrı yüzü, özel araç ve sabit fiyatla.",
      ar: "خمسة أيام في بودروم: القلعة ومركز المدينة، والخلجان، ومارينا ياليكافاك والخلجان الشمالية، ويوم حرّ. وجوه شبه الجزيرة الأربعة بسيارة خاصة وسعر ثابت.",
      en: "Five days in Bodrum: the castle and town centre, the coves, Yalıkavak marina and the northern bays, and a free day. The peninsula's four faces, private and fixed price.",
    },
    sections: [
      {
        heading: {
          tr: "Fiyatı ne belirliyor",
          ar: "ما الذي يحدّد السعر",
          en: "What sets the price",
        },
        body: {
          tr: "Paket sayfalarında sabit bir rakam yazmıyoruz ve sebebi şu: aynı program iki aile için aynı tutmuyor. Fiyatı dört şey belirliyor.\n\nKişi sayısı. Araç ve şoför maliyeti kişi başına değil araç başına; iki kişilik bir programla altı kişilik programın araç tarafı neredeyse aynı. Bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin biçimde iniyor.\n\nTarih. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek; kasım–mart en uygun. Aradaki fark otelde daha büyük, araçta daha küçük.\n\nOtel sınıfı ve semt. Programın otel kısmını siz seçiyorsunuz — anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz. Aynı program Sultanahmet'te üç yıldızla da Boğaz kıyısında beş yıldızla da kurulabiliyor.\n\nUçuş dahil mi. İç hat ve dış hat biletleri programa dahil değil; isterseniz sizin adınıza alıyoruz, istemezseniz kendiniz alırsınız.\n\nBu dördünü yazdığınızda aynı gün toplam tutarı ve gün gün taslağı gönderiyoruz. Söylenen rakam sonradan değişmiyor.",
          ar: "لا نكتب رقماً ثابتاً في صفحات البرامج، والسبب أن البرنامج الواحد لا يكلّف عائلتين المبلغ نفسه. والسعر تحدّده أربعة أمور.\n\nعدد الأشخاص. فكلفة السيارة والسائق للسيارة لا للفرد؛ وجانب السيارة في برنامج لشخصين يكاد يساوي جانبها في برنامج لستة. ولذلك ينخفض نصيب الفرد بوضوح عند العائلات الكبيرة.\n\nالتاريخ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي الأعلى؛ ومن نوفمبر إلى مارس الأنسب. والفرق بينهما أكبر في الفندق وأصغر في السيارة.\n\nدرجة الفندق وحيّه. فأنت من يختار الجزء الفندقي من البرنامج — ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر. والبرنامج نفسه يمكن بناؤه بثلاث نجوم في السلطان أحمد أو بخمس على ساحل البوسفور.\n\nوهل الطيران مشمول. فتذاكر الرحلات الداخلية والدولية غير مشمولة في البرنامج؛ نشتريها باسمك إن أردت أو تشتريها بنفسك.\n\nوحين تكتب لنا هذه الأربعة نرسل في اليوم نفسه المبلغ الإجمالي ومسوّدة يوماً بيوم. والرقم الذي يُقال لا يتغيّر بعد ذلك.",
          en: "We do not print a fixed figure on the programme pages, and the reason is that the same programme does not cost two families the same. Four things set the price.\n\nHow many you are. The cost of the car and driver is per vehicle, not per person; the vehicle side of a programme for two is almost the same as for six. So the share per person drops noticeably for larger families.\n\nThe date. The summer months and the two Eid periods are the highest; November to March the kindest. The gap is wider on the hotel than on the vehicle.\n\nHotel class and district. You choose the hotel part of the programme — we have no list of partner hotels and add no commission to the price. The same programme can be built with three stars in Sultanahmet or five on the Bosphorus shore.\n\nWhether flights are included. Domestic and international tickets are not part of the programme; we buy them in your name if you want, or you buy them yourself.\n\nWhen you send us those four, we return the total and a day-by-day draft the same day. The figure we give does not change afterwards.",
        },
      },
      {
        heading: {
          tr: "Bu program kime uyar",
          ar: "لمن يناسب هذا البرنامج",
          en: "Who this programme suits",
        },
        body: {
          tr: "Beş gün Bodrum yarımadasını görmeye rahat yeten süre. Yarımada uçtan uca kırk dakika olduğu için program hangi koyda kalırsanız kalın aynı şekilde işliyor.\n\nİyi geldiği kişiler: denizi ve tekneyi sevenler, sıcak havada ayakta gezmek istemeyenler, ve sakin bir tatil arayanlar. Koylar arası mesafeler kısa olduğu için gün yormuyor.\n\nDikkat edilecek şey koy seçimi. Yarımadanın bazı bölgeleri gece hayatı üzerine kurulu — merkezin bar sokağı ve Gümbet yaz gecelerinde geç saate kadar hareketli. Küçük çocuklu aileler için Turgutreis, Yalıkavak, Bitez ya da Gümüşlük daha rahat.\n\nBeklenmemesi gereken bir şey daha var: Bodrum'da Antalya'daki gibi çocuk kulüplü dev her şey dahil tesisler yaygın değil; oteller daha küçük ve butik ölçekli. Çocuk için gün boyu program sunan bir tesis arıyorsanız Akdeniz programı bu ihtiyaca daha çok cevap veriyor.\n\nMevsim: mayıs–ekim. Kasım–nisan arası yarımadanın büyük bölümü kapalı ve tekne gezisi çalışmıyor.",
          ar: "خمسة أيام مدة تكفي بأريحية لرؤية شبه جزيرة بودروم. ولأن شبه الجزيرة أربعون دقيقة من طرف إلى طرف يعمل البرنامج بالشكل نفسه أياً كان الخليج الذي تنزل فيه.\n\nيناسب: من يحبّ البحر والقارب، ومن لا يريد التجوال على قدميه في الحرّ، ومن يبحث عن إجازة هادئة. ولأن المسافات بين الخلجان قصيرة لا يُتعب اليوم.\n\nوما ينبغي الانتباه له اختيار الخليج. فبعض مناطق شبه الجزيرة قائمة على حياة الليل — فشارع الحانات في المركز وغومبت حيّان حتى وقت متأخر في ليالي الصيف. والأريح للعائلات ذات الأطفال الصغار تورغوت ريس أو ياليكاواك أو بيتز أو غوموشلوك.\n\nوثمّة ما لا ينبغي توقّعه أيضاً: فالمنشآت الضخمة بنظام «كل شيء مشمول» ونوادي الأطفال، كما في أنطاليا، ليست شائعة في بودروم؛ ففنادقها أصغر وأقرب إلى حجم البوتيك. فإن كنت تبحث عن منشأة تقدّم برنامجاً للطفل طوال اليوم فبرنامج المتوسط يلبّي هذه الحاجة أكثر.\n\nوالموسم: من مايو إلى أكتوبر. ومن نوفمبر إلى أبريل يكون القسم الأكبر من شبه الجزيرة مغلقاً ولا تعمل جولة القارب.",
          en: "Five days is comfortably enough to see the Bodrum peninsula. Because the peninsula is forty minutes end to end, the programme works the same way whichever bay you stay in.\n\nIt suits: people who like the water and boats, those who do not want to be on their feet in the heat, and anyone after a quiet holiday. With short distances between the bays, the days are not tiring.\n\nWhat to watch is the choice of bay. Parts of the peninsula are built around nightlife — the bar street in town and Gümbet stay lively until late on summer nights. For families with small children, Turgutreis, Yalıkavak, Bitez or Gümüşlük are easier.\n\nThere is one more thing not to expect: the huge all-inclusive resorts with kids' clubs, as in Antalya, are not common in Bodrum; the hotels are smaller and closer to boutique scale. If you want a property that runs a full day's programme for a child, the Mediterranean programme answers that better.\n\nSeason: May to October. From November to April most of the peninsula is closed and the boat trip does not run.",
        },
      },
    ],
    itinerary: [
      {
        title: {
          tr: "Varış ve karşılama",
          ar: "الوصول والاستقبال",
          en: "Arrival and welcome",
        },
        body: {
          tr: "Bodrum–Milas havalimanında karşılama ve otele transfer; yarımadaya göre 30–50 dakika. Akşam kaldığınız koyda serbest zaman.",
          ar: "الاستقبال في مطار بودروم–ميلاس والتوصيل إلى الفندق؛ من 30 إلى 50 دقيقة بحسب موقعك في شبه الجزيرة. ووقت حر مساءً في الخليج الذي تقيم فيه.",
          en: "Met at Bodrum–Milas airport and taken to your hotel; 30–50 minutes depending on where you are on the peninsula. Free time in your bay in the evening.",
        },
      },
      {
        title: {
          tr: "Bodrum merkez ve kale",
          ar: "مركز بودروم والقلعة",
          en: "Bodrum centre and the castle",
        },
        body: {
          tr: "Bodrum Kalesi ve Sualtı Arkeoloji Müzesi, Antik Tiyatro'dan liman manzarası, ardından çarşıda serbest zaman. Akşam marinada yürüyüş.",
          ar: "قلعة بودروم ومتحف الآثار تحت الماء، وإطلالة الميناء من المسرح الأثري، ثم وقت حر في السوق. ونزهة مسائية في المارينا.",
          en: "Bodrum Castle and the Museum of Underwater Archaeology, harbour views from the ancient theatre, then free time in the bazaar. An evening walk along the marina.",
        },
      },
      {
        title: {
          tr: "Tekne turu",
          ar: "جولة القارب",
          en: "Boat trip",
        },
        body: {
          tr: "Günün merkezi denizde: üç–dört koyda yüzme molası ve teknede öğle yemeği. Tarifeli bir koy turudur, tekne başka misafirlerle paylaşılır; özel yat kiralama hizmeti vermiyoruz.",
          ar: "محور اليوم في البحر: استراحات سباحة في ثلاثة أو أربعة خلجان وغداء على متن القارب. وهي جولة خلجان مجدولة والقارب مشترك مع ضيوف آخرين؛ ولا نقدّم خدمة تأجير اليخوت الخاصة.",
          en: "The day's centre is the water: swim stops in three or four bays and lunch on board. It is a scheduled bay trip and the boat is shared with other guests; we do not offer private yacht charter.",
        },
      },
      {
        title: {
          tr: "Yalıkavak ve kuzey koyları",
          ar: "ياليكافاك وخلجان الشمال",
          en: "Yalıkavak and the northern bays",
        },
        body: {
          tr: "Yalıkavak marinası, Türkbükü ve Gündoğan tarafı; yarımadanın en sakin ucu. Gün batımı için Turgutreis'e geçilebilir. Yarımada küçük olduğu için bunların hepsi tek güne sığar.",
          ar: "مارينا ياليكافاك وجهة توركبوكو وغوندوغان؛ وهي أهدأ أطراف شبه الجزيرة. ويمكن الانتقال إلى تورغوتريس لمشاهدة الغروب. ولأن شبه الجزيرة صغيرة يتّسع كل هذا ليوم واحد.",
          en: "Yalıkavak marina, Türkbükü and Gündoğan — the calmest end of the peninsula. You can move on to Turgutreis for the sunset. Because the peninsula is small, all of this fits in one day.",
        },
      },
      {
        title: {
          tr: "Serbest gün ve dönüş",
          ar: "يوم حر والعودة",
          en: "A free day and departure",
        },
        body: {
          tr: "Uçuş saatine göre koyda son bir sabah ya da çarşıda alışveriş, ardından havalimanına transfer.",
          ar: "صباح أخير في الخليج أو تسوق في السوق بحسب موعد الرحلة، ثم التوصيل إلى المطار.",
          en: "A last morning in the bay or shopping in the bazaar depending on your flight, then the transfer to the airport.",
        },
      },
    ],
    includes: ["transfer", "vehicle", "guide", "prayer", "freeDay"],
    faq: [
      {
        question: {
          tr: "Bodrum'da hangi koyda kalmalıyım?",
          ar: "في أي خليج أقيم في بودروم؟",
          en: "Which bay should I stay in?",
        },
        answer: {
          tr: "Yarımada uçtan uca kırk dakika olduğu için hangi koyda kalırsanız kalın program aksamaz. Sakinlik ve marina için Yalıkavak ya da Türkbükü; merkeze yakınlık ve hareket için Gümbet ve Bitez; aileler ve gün batımı için Turgutreis. Nerede kalacağınızı söylerseniz günlerin sırasını ona göre çeviririz.",
          ar: "لأن شبه الجزيرة تُقطع في أربعين دقيقة من طرف إلى طرف فلن يتعطل البرنامج أياً كان الخليج الذي تقيم فيه. للهدوء والمارينا: ياليكافاك أو توركبوكو؛ وللقرب من المركز والحيوية: غومبيت وبيتز؛ وللعائلات والغروب: تورغوتريس. أخبرنا بمكان إقامتك ونعيد ترتيب الأيام على أساسه.",
          en: "Because the peninsula is forty minutes end to end, the programme works from any bay. For quiet and a marina, Yalıkavak or Türkbükü; for proximity to the centre and some life, Gümbet and Bitez; for families and sunsets, Turgutreis. Tell us where you are staying and we reorder the days around it.",
        },
      },
      {
        question: {
          tr: "Kışın Bodrum'a gitmek olur mu?",
          ar: "هل تصلح بودروم للزيارة شتاءً؟",
          en: "Does Bodrum work in winter?",
        },
        answer: {
          tr: "Açıkça söyleyelim: önermiyoruz. Kasımdan nisana kadar yarımadanın büyük bölümü kapanır; otel, restoran ve tekne seçeneği çok azalır ve deniz zaten girilecek sıcaklıkta olmaz. Bu program mayıs–ekim arası için kurulmuştur. Kış aylarında Türkiye'de deniz arıyorsanız Antalya daha iyi bir cevap.",
          ar: "لنقلها بصراحة: لا ننصح بذلك. فمن تشرين الثاني حتى نيسان يُغلق معظم شبه الجزيرة؛ وتقلّ خيارات الفنادق والمطاعم والقوارب كثيراً، والبحر أصلاً ليس بدرجة تسمح بالسباحة. وقد وُضع هذا البرنامج لما بين أيار وتشرين الأول. وإن كنت تبحث عن البحر في تركيا شتاءً فأنطاليا جواب أفضل.",
          en: "Plainly: we would not recommend it. From November to April much of the peninsula closes; hotels, restaurants and boats thin out sharply and the sea is not warm enough to swim anyway. This programme is built for May to October. If you want the sea in Türkiye in winter, Antalya is the better answer.",
        },
      },
      {
        question: {
          tr: "İstanbul'la birleştirilebilir mi?",
          ar: "هل يمكن دمجه مع إسطنبول؟",
          en: "Can it be combined with Istanbul?",
        },
        answer: {
          tr: "Evet ve sık isteniyor: dört gün İstanbul, ardından kısa bir iç hat uçuşuyla beş gün Bodrum. Şehir ve deniz arka arkaya gelince seyahat monotonlaşmıyor. İki programı birleştirdiğimizde uçuş saatlerini birbirine göre ayarlar, iki şehirdeki karşılamaları da biz yaparız.",
          ar: "نعم، وهو مطلوب كثيراً: أربعة أيام في إسطنبول ثم خمسة في بودروم برحلة داخلية قصيرة. وحين تتعاقب المدينة والبحر لا تصبح الرحلة رتيبة. وعند دمج البرنامجين نضبط مواعيد الطيران بعضها على بعض ونتولى الاستقبال في المدينتين.",
          en: "Yes, and it is often requested: four days in Istanbul, then five in Bodrum on a short domestic flight. City followed by sea keeps the trip from becoming monotonous. When we combine them we line up the flights and handle the meet-and-greet in both cities.",
        },
      },
    ],
  },
];

/**
 * Bir paket sayfasının altında gösterilecek diğer paketler.
 *
 * Önceki hali `packages.filter(...).slice(0, 3)` idi: her sayfada hep
 * ilk üç paket görünüyordu. Sonuç, bağlantı denetiminde çıktı — Antalya
 * ve Bodrum paketlerine başka HİÇBİR paketten bağlantı gitmiyordu, o
 * ikisi listeye hiç girmiyordu çünkü dizinin sonundalar. İlk üç paket
 * sekiz bağlantı alırken son ikisi üç bağlantıyla kalıyordu.
 *
 * Aynı hata rehberlerde ve güzergâh sayfalarında da vardı ve orada
 * kaydırmayla çözülmüştü; burada gözden kaçmış. Liste her paket için
 * farklı bir yerden başlıyor, böylece altı paketin her biri eşit sayıda
 * bağlantı alıyor.
 */
export function relatedPackages(slug: string, count = 3) {
  const current = packages.findIndex((item) => item.slug === slug);
  if (current < 0) return packages.slice(0, count);

  const rest = [...packages.slice(current + 1), ...packages.slice(0, current)];
  return rest.slice(0, count);
}

export function packageBySlug(slug: string) {
  return packages.find((item) => item.slug === slug);
}
