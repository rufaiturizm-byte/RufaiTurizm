/**
 * Misafirin GELDİĞİ ülkeye göre sayfalar.
 *
 * NEDEN VAR. Körfez'den gelen misafir "Türkiye turu" diye değil,
 * "السفر إلى تركيا من السعودية" diye arıyor — yani kendi ülkesinden
 * yola çıkan bir soru soruyor: vizem var mı, ne zaman gitmeliyim,
 * orada beni kim karşılayacak. Site bugün bu soruyu hiçbir yerde
 * ülkeye özel cevaplamıyordu.
 *
 * HEDEF ÜLKELER işletmenin kararı (21 Ekim 2026): Suudi Arabistan,
 * BAE ve İran. İran burada YOK çünkü İranlı misafir Farsça arıyor ve
 * sitede Farsça sürüm yok; ona ayrı bir karar gerekiyor — Arapça bir
 * sayfa İran aramalarında çıkmaz.
 *
 * VİZE BİLGİSİ DOĞRULANDI (21 Ekim 2026, T.C. Dışişleri Bakanlığı
 * "Visa Information For Foreigners" sayfası): Suudi ve BAE için
 * "90 days in any 180-day period", İran için "up to 90 days".
 * Vize kuralları değişir; sayfada bu açıkça yazıyor ve resmî kaynağa
 * bağlantı veriliyor. Kendi cümlemizle kesin tarih vaadi YOK.
 *
 * UÇUŞ SÜRESİ VE HAVAYOLU ADI BİLEREK YAZILMADI: doğrulanmadı.
 * Yazılan tek şey direkt uçuş yapıldığı ve bileti misafir adına
 * aldığımız — ikisi de kendi hizmetimizin gerçeği.
 */

type Text = { tr: string; ar: string; en: string };

export interface OriginSection {
  heading: Text;
  body: Text;
}

export interface Origin {
  slug: string;
  /** Kapak — şehir değil, varış ülkesinin karesi. */
  image: string;
  country: Text;
  title: Text;
  intro: Text;
  /** Doğrulanmış künye satırları. */
  facts: { label: Text; value: Text }[];
  sections: OriginSection[];
  faq: { question: Text; answer: Text }[];
}

/** Vize bilgisinin alındığı resmî kaynak — sayfada görünür bağlantı. */
export const visaSourceUrl = "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa";

export const origins: Origin[] = [
  {
    slug: "saudi-arabia",
    image: "/images/places/suleymaniye.jpg",
    country: { tr: "Suudi Arabistan", ar: "السعودية", en: "Saudi Arabia" },
    title: {
      tr: "Suudi Arabistan'dan Türkiye'ye seyahat",
      ar: "السفر إلى تركيا من السعودية",
      en: "Travelling to Türkiye from Saudi Arabia",
    },
    intro: {
      tr: "Suudi pasaportu Türkiye'ye vizesiz giriyor ve iki ülke arasında saat farkı yok. Geriye tek soru kalıyor: indiğiniz andan dönüş uçuşuna kadar işi kim yürütecek. Biz onu yapıyoruz — havalimanı karşılaması, Arapça konuşan şoför, otel rezervasyonu ve gün gün program.",
      ar: "الجواز السعودي يدخل تركيا بلا تأشيرة، ولا فرق في التوقيت بين البلدين. ويبقى سؤال واحد: من يتولّى الأمر من لحظة الهبوط حتى رحلة العودة. نحن نتولّاه — الاستقبال في المطار، وسائق يتحدّث العربية، وحجز الفندق، وبرنامج يوماً بيوم.",
      en: "A Saudi passport enters Türkiye without a visa, and there is no time difference between the two countries. One question remains: who runs things from the moment you land until your flight home. We do — airport meet-and-greet, an Arabic-speaking driver, hotel booking and a day-by-day programme.",
    },
    facts: [
      {
        label: { tr: "Vize", ar: "التأشيرة", en: "Visa" },
        value: {
          tr: "Umuma mahsus pasaport: 180 günde 90 güne kadar vizesiz",
          ar: "الجواز العادي: بلا تأشيرة حتى 90 يوماً خلال 180 يوماً",
          en: "Ordinary passport: visa-free up to 90 days in any 180-day period",
        },
      },
      {
        label: { tr: "Saat farkı", ar: "فرق التوقيت", en: "Time difference" },
        value: { tr: "Yok — iki ülke de aynı saat diliminde", ar: "لا يوجد — البلدان في المنطقة الزمنية نفسها", en: "None — both countries share the same time zone" },
      },
      {
        label: { tr: "Para birimi", ar: "العملة", en: "Currency" },
        value: { tr: "Türk lirası (TL). Riyal şehirde bozdurulur, havalimanında kur kötüdür", ar: "الليرة التركية. يُصرَف الريال في المدينة؛ فسعر الصرف في المطار أسوأ", en: "Turkish lira. Change riyals in the city; airport rates are worse" },
      },
      {
        label: { tr: "Uçuş", ar: "الطيران", en: "Flights" },
        value: { tr: "Riyad, Cidde ve Dammam'dan İstanbul'a direkt uçuş var; bileti sizin adınıza biz alıyoruz", ar: "توجد رحلات مباشرة إلى إسطنبول من الرياض وجدة والدمام؛ ونشتري التذكرة باسمكم", en: "Direct flights to Istanbul from Riyadh, Jeddah and Dammam; we buy the ticket in your name" },
      },
    ],
    sections: [
      {
        heading: { tr: "Vize: ne gerekiyor, ne gerekmiyor", ar: "التأشيرة: ما يلزم وما لا يلزم", en: "Visa: what is needed and what is not" },
        body: {
          tr: "T.C. Dışişleri Bakanlığı'nın yayınladığı listeye göre umuma mahsus ve resmî pasaport sahipleri 180 gün içinde 90 güne kadar vizesiz kalabiliyor. Yani turistik bir seyahat için önceden vize almanız gerekmiyor.\n\nKurallar değişebilir ve değiştiğinde ilk yazıldığı yer resmî sayfadır. Uçuştan önce aşağıdaki bağlantıdan teyit edin; biz de rezervasyon sırasında kontrol ediyoruz. Pasaportun giriş tarihinden itibaren en az altı ay geçerli olmasını havayolları ayrıca arıyor.",
          ar: "بحسب القائمة التي تنشرها وزارة الخارجية التركية، يمكن لحاملي الجواز العادي والرسمي البقاء حتى 90 يوماً خلال 180 يوماً بلا تأشيرة. أي لا يلزمكم استخراج تأشيرة مسبقة للسفر السياحي.\n\nوالقواعد قد تتغيّر، وأول مكان يُكتب فيه التغيير هو الصفحة الرسمية. فتحقّقوا منها عبر الرابط أدناه قبل السفر؛ ونحن نتحقّق أيضاً عند الحجز. كما تشترط شركات الطيران أن يكون الجواز صالحاً ستة أشهر على الأقل من تاريخ الدخول.",
          en: "According to the list published by Türkiye's Ministry of Foreign Affairs, holders of ordinary and official passports may stay up to 90 days within any 180-day period without a visa. So no visa is needed in advance for a tourist trip.\n\nRules change, and the official page is where a change appears first. Check it through the link below before you fly; we check it at booking too. Airlines separately require a passport valid for at least six months from the date of entry.",
        },
      },
      {
        heading: { tr: "Ne zaman gelinir", ar: "متى تأتون", en: "When to come" },
        body: {
          tr: "Yaz ayları Suudi misafirin en yoğun dönemi ve bunun sebebi okul tatili. Temmuz–ağustosta İstanbul sıcak ve kalabalık; otel fiyatları yılın en yükseğinde oluyor ve rezervasyonu erken yapmak gerekiyor.\n\nNisan–mayıs ile eylül–ekim hem havası hem fiyatı en dengeli dönem. Ramazan ayında şehir sakinleşiyor, oteller uygunluyor; bayramdan sonraki hafta ise yeniden yoğunlaşıyor.\n\nKaradeniz (Trabzon, Uzungöl, Ayder) haziran sonundan eylüle kadar açık; o bölgeyi programa koyacaksanız tarihi buna göre seçmek gerekiyor.",
          ar: "أشهر الصيف هي الأكثر ازدحاماً للضيف السعودي، وسببها العطلة المدرسية. ففي يوليو وأغسطس تكون إسطنبول حارّة ومزدحمة؛ وأسعار الفنادق في أعلى مستوياتها ويلزم الحجز مبكراً.\n\nأمّا أبريل–مايو وسبتمبر–أكتوبر فأكثر الفترات توازناً في الطقس والسعر. وفي رمضان تهدأ المدينة وتصبح الفنادق أنسب؛ ثم يعود الازدحام في الأسبوع التالي للعيد.\n\nوالبحر الأسود (طرابزون وأوزنجول وآيدر) مفتوح من أواخر يونيو حتى سبتمبر؛ فإن أردتم إدراج تلك المنطقة في البرنامج فاختاروا التاريخ على أساسها.",
          en: "Summer is the busiest period for Saudi guests, and the reason is the school holidays. In July and August Istanbul is hot and crowded; hotel prices are at their highest of the year and booking early matters.\n\nApril–May and September–October are the most balanced months for both weather and price. During Ramadan the city quietens and hotels soften; the week after Eid fills up again.\n\nThe Black Sea (Trabzon, Uzungöl, Ayder) is open from late June to September; if that region is going into your programme, pick the dates around it.",
        },
      },
      {
        heading: { tr: "İndiğiniz andan itibaren", ar: "من لحظة هبوطكم", en: "From the moment you land" },
        body: {
          tr: "Karşılama isimli tabelayla kapıda: uçuş saatinizi takip ediyoruz, rötar olursa şoför bekliyor ve ek ücret çıkmıyor. Araç Mercedes Vito — bagajla birlikte altı kişi, arka bölümde ayrı klima.\n\nŞoför Arapça konuşuyor. Bu küçük bir ayrıntı gibi duruyor ama günün büyük kısmı araçta geçiyor ve her soruyu çeviriyle sormak zorunda kalmamak seyahati değiştiriyor.\n\nOtel rezervasyonunu da sizin adınıza yapıyoruz: bölgeyi, bütçeyi ve kaç kişi olduğunuzu söylüyorsunuz, fiyatı otelden alıp iletiyoruz. Aile odası, ilave yatak ve banyoda şattaf gibi ayrıntıları yazılı teyit ediyoruz.",
          ar: "الاستقبال عند الباب بلوحة تحمل الاسم: نتابع موعد رحلتكم، وإن تأخّرت انتظر السائق بلا رسوم إضافية. والسيارة مرسيدس فيتو — ستة أشخاص مع الأمتعة، وتكييف مستقل في القسم الخلفي.\n\nوالسائق يتحدّث العربية. قد يبدو تفصيلاً صغيراً، لكنّ معظم اليوم يمضي في السيارة، وألّا تضطروا إلى سؤال كل شيء عبر ترجمة يغيّر الرحلة.\n\nونحجز الفندق باسمكم أيضاً: تخبروننا بالمنطقة والميزانية وعدد الأشخاص، فنأخذ السعر من الفندق ونرسله إليكم. ونؤكّد كتابةً تفاصيل مثل غرفة العائلة والسرير الإضافي والشطّاف في الحمّام.",
          en: "You are met at the door with a name board: we track your flight, and if it is delayed the driver waits at no extra charge. The vehicle is a Mercedes Vito — six people with luggage, separate air conditioning in the rear.\n\nThe driver speaks Arabic. It sounds like a small detail, but most of the day is spent in the car, and not having to ask every question through a translation changes the trip.\n\nWe book the hotel in your name too: you tell us the area, the budget and how many you are; we get the price from the hotel and send it to you. Details such as a family room, an extra bed and a bidet spray in the bathroom are confirmed in writing.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'ye vize gerekiyor mu?", ar: "هل تلزم تأشيرة لدخول تركيا؟", en: "Is a visa needed for Türkiye?" },
        answer: {
          tr: "Umuma mahsus pasaport sahipleri için hayır: 180 günde 90 güne kadar vizesiz. Bu bilgi Dışişleri Bakanlığı'nın resmî listesinden alındı ve sayfanın altında kaynağa bağlantı var. Kurallar değişebilir, uçuştan önce teyit edin.",
          ar: "لا لحاملي الجواز العادي: حتى 90 يوماً خلال 180 يوماً بلا تأشيرة. وهذه المعلومة مأخوذة من القائمة الرسمية لوزارة الخارجية، ورابط المصدر في أسفل الصفحة. والقواعد قد تتغيّر، فتحقّقوا قبل السفر.",
          en: "For ordinary passport holders, no: visa-free for up to 90 days in any 180-day period. This comes from the Ministry of Foreign Affairs' official list, linked at the foot of this page. Rules can change, so confirm before you fly.",
        },
      },
      {
        question: { tr: "Fiyatlar kişi başına mı?", ar: "هل الأسعار للشخص؟", en: "Are prices per person?" },
        answer: {
          tr: "Araç başına. İki kişiyle altı kişi arasında araç tarafı değişmiyor, bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin iniyor. Otel ayrı hesaplanıyor ve fiyatı otelden alıyoruz.",
          ar: "للسيارة. فالجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة، ولهذا ينخفض نصيب الفرد بوضوح في العائلات الكبيرة. أمّا الفندق فيُحسب على حدة ونأخذ سعره من الفندق.",
          en: "Per vehicle. The vehicle side does not change between two people and six, so the per-person figure drops noticeably for larger families. The hotel is counted separately and we get its price from the hotel.",
        },
      },
      {
        question: { tr: "Ödeme nasıl yapılıyor?", ar: "كيف يتمّ الدفع؟", en: "How is payment made?" },
        answer: {
          tr: "Rezervasyon WhatsApp üzerinden kuruluyor ve sitede ödeme ekranı yok. Tutar ve ödeme şekli yazışmada netleşiyor; teyit edilen rakam sonradan değişmiyor.",
          ar: "يتمّ الحجز عبر واتساب، ولا توجد شاشة دفع في الموقع. ويتّضح المبلغ وطريقة الدفع في المراسلة؛ والرقم المؤكَّد لا يتغيّر بعد ذلك.",
          en: "The booking is made over WhatsApp and there is no payment screen on the site. The amount and the method are settled in the conversation; once confirmed, the figure does not change.",
        },
      },
    ],
  },
  {
    slug: "uae",
    image: "/images/places/bogaz-yali.jpg",
    country: { tr: "Birleşik Arap Emirlikleri", ar: "الإمارات", en: "United Arab Emirates" },
    title: {
      tr: "Dubai ve BAE'den Türkiye'ye seyahat",
      ar: "السفر إلى تركيا من دبي والإمارات",
      en: "Travelling to Türkiye from Dubai and the UAE",
    },
    intro: {
      tr: "BAE pasaportu Türkiye'ye vizesiz giriyor ve saat farkı yalnız bir saat. Dubai'den gelen misafirin beklentisi yüksek oluyor: zamanında karşılama, temiz ve geniş araç, soru sorulduğunda net cevap. Programı buna göre kuruyoruz.",
      ar: "الجواز الإماراتي يدخل تركيا بلا تأشيرة، وفرق التوقيت ساعة واحدة فقط. والضيف القادم من دبي يأتي بتوقّعات عالية: استقبال في موعده، وسيارة نظيفة وواسعة، وجواب واضح عند السؤال. ونضع البرنامج على هذا الأساس.",
      en: "A UAE passport enters Türkiye without a visa, and the time difference is only one hour. Guests arriving from Dubai come with high expectations: being met on time, a clean and roomy vehicle, and a straight answer when they ask. We build the programme around that.",
    },
    facts: [
      {
        label: { tr: "Vize", ar: "التأشيرة", en: "Visa" },
        value: {
          tr: "Umuma mahsus pasaport: 180 günde 90 güne kadar vizesiz",
          ar: "الجواز العادي: بلا تأشيرة حتى 90 يوماً خلال 180 يوماً",
          en: "Ordinary passport: visa-free up to 90 days in any 180-day period",
        },
      },
      {
        label: { tr: "Saat farkı", ar: "فرق التوقيت", en: "Time difference" },
        value: { tr: "Türkiye, BAE'den bir saat geride", ar: "تركيا متأخّرة ساعة واحدة عن الإمارات", en: "Türkiye is one hour behind the UAE" },
      },
      {
        label: { tr: "Para birimi", ar: "العملة", en: "Currency" },
        value: { tr: "Türk lirası (TL). Dirhem şehirde bozdurulur", ar: "الليرة التركية. يُصرَف الدرهم في المدينة", en: "Turkish lira. Change dirhams in the city" },
      },
      {
        label: { tr: "Uçuş", ar: "الطيران", en: "Flights" },
        value: { tr: "Dubai ve Abu Dabi'den İstanbul'a direkt uçuş var; bileti sizin adınıza biz alıyoruz", ar: "توجد رحلات مباشرة إلى إسطنبول من دبي وأبوظبي؛ ونشتري التذكرة باسمكم", en: "Direct flights to Istanbul from Dubai and Abu Dhabi; we buy the ticket in your name" },
      },
    ],
    sections: [
      {
        heading: { tr: "Vize ve pasaport", ar: "التأشيرة والجواز", en: "Visa and passport" },
        body: {
          tr: "T.C. Dışişleri Bakanlığı listesine göre umuma mahsus ve resmî pasaport sahipleri 180 gün içinde 90 güne kadar vizesiz kalabiliyor; turistik seyahat için önceden vize almak gerekmiyor.\n\nKurallar değişebilir — uçuştan önce aşağıdaki resmî bağlantıdan teyit edin. BAE'de yaşayan ama başka ülke pasaportu taşıyan misafirlerde kural pasaporta göre değişiyor; rezervasyon sırasında hangi pasaportla geleceğinizi yazmanız yeterli, biz kontrol ediyoruz.",
          ar: "بحسب قائمة وزارة الخارجية التركية يمكن لحاملي الجواز العادي والرسمي البقاء حتى 90 يوماً خلال 180 يوماً بلا تأشيرة؛ ولا يلزم استخراج تأشيرة مسبقة للسفر السياحي.\n\nوالقواعد قد تتغيّر — فتحقّقوا من الرابط الرسمي أدناه قبل السفر. أمّا المقيمون في الإمارات بجواز دولة أخرى فالقاعدة عندهم بحسب الجواز؛ ويكفي أن تذكروا عند الحجز بأي جواز ستأتون، ونحن نتحقّق.",
          en: "According to the Turkish Ministry of Foreign Affairs list, holders of ordinary and official passports may stay up to 90 days within any 180-day period without a visa; no advance visa is needed for a tourist trip.\n\nRules can change — check the official link below before you fly. For residents of the UAE travelling on another country's passport the rule follows that passport; just tell us at booking which passport you are travelling on and we will check.",
        },
      },
      {
        heading: { tr: "Dubai'den gelen misafirin sorduğu şeyler", ar: "ما يسأل عنه الضيف القادم من دبي", en: "What guests from Dubai ask about" },
        body: {
          tr: "En sık gelen üç soru şu: araç gerçekten fotoğraftaki gibi mi, şoför İngilizce ya da Arapça konuşuyor mu, fiyat sonradan değişiyor mu.\n\nÜçünün de cevabı sitede yazılı. Filo fotoğrafları işletmenin kendi çekimi, stok değil. Şoför Arapça konuşuyor. Teyit edilen fiyat değişmiyor ve araç başına.\n\nDubai'den gelen misafir genelde kısa kalıyor — üç ya da dört gece. Bu sürede İstanbul'u gezip bir de Sapanca ya da Bursa eklemek mümkün; ama üç şehri aynı programa sıkıştırmak günün yarısını yola vermek demek, onu önermiyoruz.",
          ar: "أكثر ثلاثة أسئلة تصلنا: هل السيارة كما في الصورة فعلاً، وهل يتحدّث السائق العربية أو الإنجليزية، وهل يتغيّر السعر لاحقاً.\n\nوأجوبة الثلاثة مكتوبة في الموقع. صور الأسطول من تصوير الشركة نفسها لا صور مخزنية. والسائق يتحدّث العربية. والسعر المؤكَّد لا يتغيّر وهو للسيارة.\n\nوالضيف القادم من دبي يقيم عادةً مدّة قصيرة — ثلاث أو أربع ليالٍ. وفي هذه المدّة يمكن التجوّل في إسطنبول وإضافة سبانجا أو بورصة؛ أمّا حشر ثلاث مدن في برنامج واحد فيعني إعطاء نصف اليوم للطريق، ولا نقترحه.",
          en: "The three questions we get most: is the vehicle really the one in the photograph, does the driver speak Arabic or English, and does the price change later.\n\nAll three are answered on the site. The fleet photographs are the company's own, not stock. The driver speaks Arabic. A confirmed price does not change, and it is per vehicle.\n\nGuests from Dubai usually stay a short time — three or four nights. In that time Istanbul plus Sapanca or Bursa is comfortable; squeezing three cities into one programme means giving half the day to the road, and we do not recommend it.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'ye vize gerekiyor mu?", ar: "هل تلزم تأشيرة لدخول تركيا؟", en: "Is a visa needed for Türkiye?" },
        answer: {
          tr: "BAE pasaportu için hayır: 180 günde 90 güne kadar vizesiz. Kaynak Dışişleri Bakanlığı'nın resmî listesi ve bağlantısı sayfanın altında. Başka bir ülke pasaportuyla geliyorsanız kural o pasaporta göre değişir.",
          ar: "لا بالنسبة للجواز الإماراتي: حتى 90 يوماً خلال 180 يوماً بلا تأشيرة. والمصدر القائمة الرسمية لوزارة الخارجية ورابطها في أسفل الصفحة. وإن كنتم قادمين بجواز دولة أخرى فالقاعدة بحسب ذلك الجواز.",
          en: "For a UAE passport, no: visa-free up to 90 days in any 180-day period. The source is the Ministry of Foreign Affairs' official list, linked at the foot of this page. If you travel on another country's passport, the rule follows that passport.",
        },
      },
      {
        question: { tr: "Üç gecede ne yapılır?", ar: "ماذا يمكن فعله في ثلاث ليالٍ؟", en: "What fits into three nights?" },
        answer: {
          tr: "İstanbul'un ana hattı rahat sığıyor: tarihî yarımada, Boğaz ve çarşılar. Dördüncü gece eklenirse Sapanca ya da Bursa günübirlik girebiliyor. Varış ve dönüş günleri havalimanı transferiyle geçiyor, programı ona göre kuruyoruz.",
          ar: "يتّسع الخطّ الرئيسي لإسطنبول براحة: شبه الجزيرة التاريخية والبوسفور والأسواق. وبإضافة ليلة رابعة يمكن إدخال سبانجا أو بورصة كرحلة يوم. أمّا يوما الوصول والمغادرة فيمضيان في النقل من المطار وإليه، ونضع البرنامج على هذا الأساس.",
          en: "Istanbul's main line fits comfortably: the historic peninsula, the Bosphorus and the bazaars. Add a fourth night and Sapanca or Bursa can go in as a day trip. The arrival and departure days go to the airport transfer, and we build the programme around that.",
        },
      },
    ],
  },
];

export function originBySlug(slug: string) {
  return origins.find((origin) => origin.slug === slug);
}
