/**
 * Şehir şehir "şoförlü araç" sayfaları.
 *
 * NEDEN VAR. Körfez misafiri hizmeti şehriyle birlikte arıyor:
 * "سيارة مع سائق في أنطاليا". Rakiplerin dördünde de bu küme var
 * (şehir bazlı şoför/araç sayfaları), bizde yalnız tek bir Vito hizmet
 * sayfası vardı ve o da İstanbul'u anlatıyor.
 *
 * İSTANBUL BURADA YOK ve bu bilinçli: `/خدماتنا/vito-vip` zaten tam
 * olarak o sayfa ve başlığı "سيارة مع سائق في إسطنبول". İkinci bir
 * İstanbul sayfası açmak kendi sayfamızla yarışmak olurdu.
 *
 * ÜÇ ŞEHİR VAR, ALTI DEĞİL. Bursa ve Sapanca'nın kendi havalimanı yok
 * ve oraya İstanbul'dan gidiliyor — yani o ikisinde "şehir içinde
 * şoförlü araç" diye ayrı bir hizmet yok, İstanbul programının parçası.
 * Anlatacak ayrı şeyi olmayan şehir buraya girmiyor; `transfer-routes.ts`
 * dosyasındaki eşiğin aynısı.
 *
 * HER RAKAM DOĞRULANMIŞ. Mesafeler ve süreler sitenin kendi güzergâh
 * verisinden (`transfer-routes.ts`) ve paket programlarından geliyor;
 * burada yeni bir sayı uydurulmadı.
 *
 * FİYAT YOK. Sayfa "günlük şu kadar" demiyor: tutar güne, güzergâha ve
 * saate göre değişiyor ve sitenin geri kalanında da fiyat ancak
 * doğrulanabildiği yerde yazılıyor.
 */

type Text = { tr: string; ar: string; en: string };

export interface ChauffeurSection {
  heading: Text;
  body: Text;
}

export interface ChauffeurCity {
  /** URL parçası — şehir sayfalarıyla aynı slug. */
  slug: string;
  name: Text;
  /** Kapak görseli — şehir sayfasıyla aynı kare. */
  image: string;
  title: Text;
  intro: Text;
  sections: ChauffeurSection[];
  faq: { question: Text; answer: Text }[];
  /** Aynı şehrin bölge sayfası. */
  destinationSlug: string;
  /** Aynı şehirdeki havalimanı güzergâhları. */
  routeSlugs: string[];
  /** Aynı şehrin günübirlik turu. */
  tourSlug?: string;
}

export const chauffeurCities: ChauffeurCity[] = [
  {
    slug: "antalya",
    name: { tr: "Antalya", ar: "أنطاليا", en: "Antalya" },
    image: "/images/places/kaleici-liman.jpg",
    title: {
      tr: "Antalya'da şoförlü araç",
      ar: "سيارة مع سائق في أنطاليا",
      en: "A car with driver in Antalya",
    },
    intro: {
      tr: "Antalya'da tatilin ne kadar yorucu geçeceğini otelinizin hangi bölgede olduğu belirliyor. Havalimanından Belek yarım saat, Alanya ise iki buçuk saate kadar çıkıyor — ve bu mesafe her gezide tekrarlanıyor. Şoförlü araç tam burada işe yarıyor: aynı araç ve aynı şoför tatil boyunca sizinle kalıyor.",
      ar: "ما يحدّد مقدار إرهاق إجازتكم في أنطاليا هو المنطقة التي يقع فيها فندقكم. فمن المطار إلى بيليك نصف ساعة، أمّا ألانيا فتصل إلى ساعتين ونصف — وهذه المسافة تتكرّر في كل خروج. وهنا تنفع السيارة مع سائق: السيارة نفسها والسائق نفسه يبقيان معكم طوال الإجازة.",
      en: "What decides how tiring a holiday in Antalya will be is the area your hotel sits in. Belek is half an hour from the airport; Alanya can take up to two and a half hours — and that distance repeats on every outing. This is exactly where a car with driver earns its place: the same vehicle and the same driver stay with you for the whole holiday.",
    },
    sections: [
      {
        heading: {
          tr: "Bölgeler arası mesafeler",
          ar: "المسافات بين المناطق",
          en: "Distances between the areas",
        },
        body: {
          tr: "Antalya Havalimanı'ndan Belek 30–45 dakika, Kemer 50 dakika–1,5 saat, Side 55 dakika–1,5 saat, Alanya 1 saat 45 dakika–2,5 saat. Süreler trafiğe göre değişiyor ve yaz aylarında sahil yolu akşamüstü belirgin yavaşlıyor.\n\nBu sayılar önemli çünkü Alanya'da kalıp her gün şehir merkezine inmek, günün dört saatini yola vermek demek. Nerede kaldığınızı söylediğinizde günü ona göre kuruyoruz.",
          ar: "من مطار أنطاليا إلى بيليك 30–45 دقيقة، وإلى كيمر 50 دقيقة–ساعة ونصف، وإلى سيدة 55 دقيقة–ساعة ونصف، وإلى ألانيا ساعة و45 دقيقة–ساعتان ونصف. وتتغيّر المدد بحسب الزحام، ويبطؤ طريق الساحل بوضوح قبيل المساء في الصيف.\n\nوهذه الأرقام مهمّة، لأنّ الإقامة في ألانيا والنزول يومياً إلى مركز المدينة يعني إعطاء أربع ساعات من اليوم للطريق. فإذا أخبرتمونا أين تقيمون رتّبنا اليوم على أساسه.",
          en: "From Antalya Airport it is 30–45 minutes to Belek, 50 minutes to 1.5 hours to Kemer, 55 minutes to 1.5 hours to Side, and 1 hour 45 minutes to 2.5 hours to Alanya. Times vary with traffic, and in summer the coast road slows noticeably in the late afternoon.\n\nThese numbers matter: staying in Alanya and driving into the centre every day means giving four hours of the day to the road. Tell us where you are staying and we build the day around it.",
        },
      },
      {
        heading: {
          tr: "Araç ve şoför",
          ar: "السيارة والسائق",
          en: "The vehicle and the driver",
        },
        body: {
          tr: "Mercedes Vito: bagajla birlikte altı kişi, geniş diz mesafesi, kararmış camlar ve arka bölümde ayrı klima. Şoför Arapça konuşuyor, yani yol boyunca çeviri aramak gerekmiyor.\n\nAraç gün boyunca emrinizde kalıyor: her durakta bekliyor, alışverişte bagajı araçta bırakabiliyorsunuz ve program ortasında fikrinizi değiştirmek mümkün.",
          ar: "مرسيدس فيتو: ستة أشخاص مع الأمتعة، ومسافة واسعة بين المقاعد، ونوافذ معتمة، وتكييف مستقل في القسم الخلفي. والسائق يتحدّث العربية، فلا حاجة إلى البحث عن ترجمة في الطريق.\n\nوتبقى السيارة تحت تصرّفكم طوال اليوم: تنتظر عند كل محطة، ويمكنكم ترك الأمتعة فيها أثناء التسوّق، ويمكن تغيير الرأي في منتصف البرنامج.",
          en: "A Mercedes Vito: six people with luggage, generous legroom, tinted windows and separate air conditioning in the rear. The driver speaks Arabic, so there is no hunting for a translator along the way.\n\nThe car stays at your disposal through the day: it waits at every stop, you can leave your shopping in it, and you can change your mind mid-programme.",
        },
      },
      {
        heading: {
          tr: "Nerelere gidiliyor",
          ar: "إلى أين تذهبون",
          en: "Where people go",
        },
        body: {
          tr: "En çok istenen günler Kaleiçi ve Düden Şelalesi, Konyaaltı sahili, Aspendos ve Perge antik kentleri, Side antik kenti ve Manavgat. Bunların hepsi merkezden bir saatin içinde.\n\nAlanya ve Olympos uzak uçta: ikisi de ayrı bir güne yazılmalı, başka durakla aynı güne sıkıştırılmamalı.",
          ar: "أكثر الأيام طلباً: كالِه إيتشي وشلال دودان، وشاطئ كونيالتي، ومدينتا أسبندوس وبيرغي الأثريتان، ومدينة سيدة الأثرية ومانافغات. وكلّها ضمن ساعة من المركز.\n\nأمّا ألانيا وأوليمبوس ففي الطرف البعيد: كلٌّ منهما يحتاج يوماً مستقلاً ولا يُحشر مع محطة أخرى في اليوم نفسه.",
          en: "The days most often asked for: Kaleiçi and the Düden Waterfall, Konyaaltı beach, the ancient cities of Aspendos and Perge, and Side with Manavgat. All of them are within an hour of the centre.\n\nAlanya and Olympos sit at the far end: each needs its own day and should not be squeezed in alongside another stop.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Fiyat kişi başına mı?",
          ar: "هل السعر للشخص؟",
          en: "Is the price per person?",
        },
        answer: {
          tr: "Hayır, araç başına. İki kişiyle altı kişi arasında araç tarafı değişmiyor; bu yüzden kalabalık ailelerde kişi başına düşen tutar belirgin iniyor. Kesin rakam tarihi, bölgeyi ve programı yazdığınızda WhatsApp'tan geliyor.",
          ar: "لا، بل للسيارة. فالجانب المتعلّق بالسيارة لا يتغيّر بين شخصين وستة؛ ولهذا ينخفض نصيب الفرد بوضوح في العائلات الكبيرة. ويصلكم الرقم النهائي عبر واتساب حين تكتبون التاريخ والمنطقة والبرنامج.",
          en: "No, per vehicle. The vehicle side does not change between two people and six, which is why the per-person figure drops noticeably for larger families. The exact figure comes over WhatsApp once you tell us the date, the area and the programme.",
        },
      },
      {
        question: {
          tr: "Şoför rehberlik de yapıyor mu?",
          ar: "هل يقوم السائق بدور المرشد أيضاً؟",
          en: "Does the driver also act as a guide?",
        },
        answer: {
          tr: "Şoför yolu, bölgeyi ve pratik soruları biliyor ve Arapça konuşuyor. Antik kentlerde anlatım isteyen misafirler için ayrıca profesyonel rehber ayarlıyoruz; bunu rezervasyonda söylemeniz yeterli.",
          ar: "السائق يعرف الطريق والمنطقة والأسئلة العملية ويتحدّث العربية. أمّا من يرغب بشرح داخل المدن الأثرية فنوفّر له مرشداً محترفاً؛ ويكفي ذكر ذلك عند الحجز.",
          en: "The driver knows the roads, the region and the practical questions, and speaks Arabic. For guests who want commentary inside the ancient cities we arrange a professional guide as well; just say so when booking.",
        },
      },
      {
        question: {
          tr: "Otelden mi alıyorsunuz?",
          ar: "هل تقلّوننا من الفندق؟",
          en: "Do you collect us from the hotel?",
        },
        answer: {
          tr: "Evet, her gün otelin kapısından. Havalimanı karşılaması da aynı araçla yapılıyor; isimli tabelayla kapıda bekliyoruz ve uçuş saatinizi takip ediyoruz.",
          ar: "نعم، كل يوم من باب الفندق. والاستقبال من المطار يتمّ بالسيارة نفسها؛ ننتظركم عند الباب بلوحة تحمل الاسم ونتابع موعد رحلتكم.",
          en: "Yes, from the hotel door every day. The airport meet-and-greet uses the same vehicle; we wait at the door with a name board and follow your flight time.",
        },
      },
    ],
    destinationSlug: "antalya",
    routeSlugs: [
      "antalya-havalimani-kemer-transfer",
      "antalya-havalimani-belek-transfer",
      "antalya-havalimani-side-transfer",
      "antalya-havalimani-alanya-transfer",
    ],
    tourSlug: "antalya-turu",
  },
  {
    slug: "bodrum",
    name: { tr: "Bodrum", ar: "بودروم", en: "Bodrum" },
    image: "/images/places/bodrum-koyu.jpg",
    title: {
      tr: "Bodrum'da şoförlü araç",
      ar: "سيارة مع سائق في بودروم",
      en: "A car with driver in Bodrum",
    },
    intro: {
      tr: "Bodrum yarımadası uçtan uca kırk dakika. Mesafeler kısa ama koylar birbirinden bağımsız ve aralarında toplu taşıma zayıf; akşam yemeği başka koyda, tekne turu başka iskelede oluyor. Şoförlü araç bu dağınıklığı toparlıyor.",
      ar: "شبه جزيرة بودروم أربعون دقيقة من طرفها إلى طرفها. المسافات قصيرة لكنّ الخلجان منفصلة بعضها عن بعض والنقل العام بينها ضعيف؛ فالعشاء في خليج والجولة البحرية من مرفأ آخر. والسيارة مع سائق تجمع هذا التشتّت.",
      en: "The Bodrum peninsula is forty minutes end to end. Distances are short, but the bays are separate from one another and public transport between them is thin; dinner is in one bay and the boat trip leaves from another. A car with driver pulls that scatter together.",
    },
    sections: [
      {
        heading: {
          tr: "Havalimanından koylara",
          ar: "من المطار إلى الخلجان",
          en: "From the airport to the bays",
        },
        body: {
          tr: "Bodrum–Milas Havalimanı'ndan Bodrum merkez 40 dakika–1 saat, Turgutreis 50 dakika–1 saat 15 dakika, Yalıkavak 55 dakika–1 saat 20 dakika.\n\nYarımada içinde koydan koya geçiş genelde yirmi–otuz dakika; yani bir günde iki ya da üç koyu rahatça görebiliyorsunuz.",
          ar: "من مطار بودروم–ميلاس إلى مركز بودروم 40 دقيقة–ساعة، وإلى تورغوتريس 50 دقيقة–ساعة وربع، وإلى ياليكافاك 55 دقيقة–ساعة وثلث.\n\nأمّا التنقّل بين خليج وآخر داخل شبه الجزيرة فنحو عشرين إلى ثلاثين دقيقة؛ أي يمكنكم رؤية خليجين أو ثلاثة في يوم واحد بلا عناء.",
          en: "From Bodrum–Milas Airport it is 40 minutes to an hour to central Bodrum, 50 minutes to 1 hour 15 to Turgutreis, and 55 minutes to 1 hour 20 to Yalıkavak.\n\nWithin the peninsula, hopping from one bay to the next is usually twenty to thirty minutes, so two or three bays fit comfortably into a single day.",
        },
      },
      {
        heading: {
          tr: "Hangi koy hangi aileye uyar",
          ar: "أي خليج يناسب أي عائلة",
          en: "Which bay suits which family",
        },
        body: {
          tr: "Bodrum merkez ve Gümbet yaz geceleri geç saate kadar hareketli; sakinlik arayan aileler için Turgutreis, Yalıkavak, Bitez ve Gümüşlük daha rahat.\n\nBu fark şoförlü araçla önemsizleşiyor: sessiz bir koyda kalıp akşam yemeğine merkeze inmek, dönüşte taksi aramak zorunda kalmadan mümkün oluyor.",
          ar: "مركز بودروم وغومبيت ينبضان بالحركة حتى وقت متأخر في ليالي الصيف؛ أمّا العائلات التي تبحث عن الهدوء فتناسبها تورغوتريس وياليكافاك وبيتز وغوموشلوك.\n\nوهذا الفارق يصغر مع السيارة مع سائق: يمكنكم الإقامة في خليج هادئ والنزول إلى المركز للعشاء من دون البحث عن سيارة أجرة في العودة.",
          en: "Central Bodrum and Gümbet stay lively until late on summer nights; families after quiet find Turgutreis, Yalıkavak, Bitez and Gümüşlük easier.\n\nWith a car and driver that difference stops mattering: you can stay in a quiet bay and still come into town for dinner without hunting for a taxi on the way back.",
        },
      },
      {
        heading: {
          tr: "Sezon uyarısı",
          ar: "تنبيه الموسم",
          en: "A note on the season",
        },
        body: {
          tr: "Yarımada mayıs–ekim arası çalışıyor. Kasımdan nisana restoranların, otellerin ve tekne turlarının büyük kısmı kapanıyor; deniz de yüzülecek sıcaklıkta olmuyor.\n\nKış aylarında Türkiye'de deniz isteyen misafirlere Antalya'yı öneriyoruz — bunu söylemek bizim için daha dürüst.",
          ar: "تعمل شبه الجزيرة بين مايو وأكتوبر. ومن نوفمبر إلى أبريل يُغلق معظم المطاعم والفنادق والجولات البحرية؛ كما أنّ البحر لا يكون دافئاً بما يكفي للسباحة.\n\nونقترح أنطاليا على من يريد البحر في تركيا في أشهر الشتاء — وقول ذلك أصدق من جهتنا.",
          en: "The peninsula runs from May to October. From November to April most restaurants, hotels and boat trips close, and the sea is not warm enough to swim in anyway.\n\nFor guests who want the sea in Türkiye in winter we suggest Antalya instead — saying so is the honest answer.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Tekne turuna da götürüyor musunuz?",
          ar: "هل تنقلوننا إلى الجولة البحرية أيضاً؟",
          en: "Do you take us to the boat trip as well?",
        },
        answer: {
          tr: "İskeleye götürüyor ve dönüşte bekliyoruz. Teknenin kendisini biz işletmiyoruz; yat ve tekne kiralama verdiğimiz hizmetler arasında değil ve olmayan bir hizmeti varmış gibi göstermiyoruz.",
          ar: "ننقلكم إلى المرفأ وننتظركم عند العودة. أمّا القارب نفسه فلا نشغّله؛ فتأجير اليخوت والقوارب ليس من خدماتنا ولا نُظهر خدمة لا نقدّمها.",
          en: "We take you to the pier and wait for you on the way back. We do not run the boat itself; yacht and boat charter is not one of our services and we do not present a service we do not provide.",
        },
      },
      {
        question: {
          tr: "Araç kaç saat emrimizde?",
          ar: "كم ساعة تكون السيارة تحت تصرّفنا؟",
          en: "How many hours is the car at our disposal?",
        },
        answer: {
          tr: "Günlük kullanımda saat aralığını birlikte belirliyoruz; yarımadadaki mesafeler kısa olduğu için çoğu aile sabah çıkıp akşam yemeğinden sonra dönecek şekilde planlıyor. Saat sınırını rezervasyonda yazıyoruz, sonradan sürpriz çıkmıyor.",
          ar: "في الاستخدام اليومي نحدّد النطاق الزمني معاً؛ ولأنّ المسافات في شبه الجزيرة قصيرة تخطّط معظم العائلات للخروج صباحاً والعودة بعد العشاء. ونكتب الحدّ الزمني في الحجز فلا تظهر مفاجآت لاحقاً.",
          en: "For a day's use we agree the hours together; because distances on the peninsula are short, most families plan to set out in the morning and return after dinner. The time limit is written into the booking, so nothing surprises you later.",
        },
      },
    ],
    destinationSlug: "bodrum",
    routeSlugs: [
      "bodrum-havalimani-bodrum-merkez-transfer",
      "bodrum-havalimani-yalikavak-transfer",
      "bodrum-havalimani-turgutreis-transfer",
    ],
    tourSlug: "bodrum-turu",
  },
  {
    slug: "trabzon",
    name: { tr: "Trabzon", ar: "طرابزون", en: "Trabzon" },
    image: "/images/places/uzungol.jpg",
    title: {
      tr: "Trabzon'da şoförlü araç",
      ar: "سيارة مع سائق في طرابزون",
      en: "A car with driver in Trabzon",
    },
    intro: {
      tr: "Trabzon'da gezilecek yerlerin neredeyse hiçbiri şehir merkezinde değil. Uzungöl tek yön iki saat ve yolun büyük bölümü dağ yolu; Sümela ayrı bir gün istiyor. Karadeniz'de şoförlü araç konfor değil, programın kendisi.",
      ar: "تكاد لا تكون أيٌّ من الأماكن التي تُزار في طرابزون داخل مركز المدينة. فأوزنجول ساعتان في الاتجاه الواحد ومعظم الطريق جبلي؛ وسوميلا تحتاج يوماً مستقلاً. والسيارة مع سائق في البحر الأسود ليست رفاهية، بل هي البرنامج نفسه.",
      en: "Almost nothing worth seeing in Trabzon is in the city centre. Uzungöl is two hours each way, most of it mountain road; Sümela needs a day of its own. On the Black Sea coast a car with driver is not a comfort, it is the programme itself.",
    },
    sections: [
      {
        heading: {
          tr: "Mesafeler ve yol",
          ar: "المسافات والطريق",
          en: "Distances and the road",
        },
        body: {
          tr: "Uzungöl şehir merkezine yaklaşık yüz kilometre ve tek yön iki saat; yolun büyük bölümü virajlı dağ yolu. Sümela Manastırı ayrı bir gün ve vadi manzaralı yürüyüş yokuşlu.\n\nAyder ve yüksek yaylalar haziran sonu–eylül arası açık; sezon dışında sisli, soğuk ve zaman zaman yol kapalı olabiliyor.",
          ar: "أوزنجول على نحو مئة كيلومتر من مركز المدينة وساعتان في الاتجاه الواحد؛ ومعظم الطريق جبلي متعرّج. ودير سوميلا يحتاج يوماً مستقلاً، والمشي فيه صاعد بإطلالات على الوادي.\n\nأمّا آيدر والمرتفعات العالية فمفتوحة بين أواخر يونيو وسبتمبر؛ وخارج الموسم تكون ضبابية باردة وقد يُغلق الطريق أحياناً.",
          en: "Uzungöl is about a hundred kilometres from the city centre and two hours each way, most of it winding mountain road. Sümela Monastery needs its own day, and the valley-view walk is uphill.\n\nAyder and the high plateaus are open from late June to September; out of season they are misty, cold and the road is sometimes closed.",
        },
      },
      {
        heading: {
          tr: "Dağ yolunda şoför farkı",
          ar: "فرق السائق في الطريق الجبلي",
          en: "What the driver changes on a mountain road",
        },
        body: {
          tr: "Karadeniz'de yol, Antalya sahilinden farklı: dar, virajlı ve yağış sık. Bölgeyi bilen bir şoförle gitmek, kiralık araçla gitmekten hem güvenli hem hızlı oluyor.\n\nMola yerleri de deneyimle biliniyor — yolda çay bahçeleri ve manzara durakları var ve hangisinin açık olduğu mevsime göre değişiyor.",
          ar: "الطريق في البحر الأسود يختلف عن ساحل أنطاليا: ضيّق ومتعرّج والأمطار متكرّرة. والسفر مع سائق يعرف المنطقة أكثر أماناً وأسرع من قيادة سيارة مستأجرة.\n\nكما تُعرف أماكن الاستراحة بالخبرة — ففي الطريق حدائق شاي ومواقف إطلالة، وأيّها مفتوح يتغيّر بحسب الموسم.",
          en: "The roads here are not the Antalya coast: narrow, winding and often wet. Travelling with a driver who knows the region is both safer and faster than taking a rental car.\n\nThe stopping places are known from experience too — there are tea gardens and viewpoints along the way, and which ones are open changes with the season.",
        },
      },
      {
        heading: {
          tr: "Tipik günler",
          ar: "الأيام المعتادة",
          en: "Typical days",
        },
        body: {
          tr: "Bir gün Uzungöl (tam gün, yolda molalarla), bir gün Sümela ve çevresi, bir gün Ayder ya da sahil boyunca serbest gezi. Varış ve dönüş günleri havalimanı transferiyle geçiyor.\n\nÇocuklu ailelerde tempo düşürülebiliyor: dağ yolu uzun ve küçük çocuk için yorucu, o yüzden gün sayısını artırıp durak sayısını azaltmak daha iyi sonuç veriyor.",
          ar: "يوم لأوزنجول (يوم كامل مع استراحات في الطريق)، ويوم لسوميلا وما حولها، ويوم لآيدر أو تجوال حرّ على الساحل. أمّا يوما الوصول والمغادرة فيمضيان في النقل من المطار وإليه.\n\nويمكن تخفيف الإيقاع مع العائلات التي معها أطفال: الطريق الجبلي طويل ومُتعب للصغار، ولذلك تكون زيادة عدد الأيام وتقليل عدد المحطات أفضل.",
          en: "One day for Uzungöl (a full day with stops along the road), one for Sümela and around it, one for Ayder or a free run along the coast. The arrival and departure days go to the airport transfer.\n\nWith small children the pace can drop: the mountain road is long and tiring for them, so adding a day and cutting stops works better.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Uzungöl'e tek günde gidip dönülür mü?",
          ar: "هل يمكن الذهاب إلى أوزنجول والعودة في يوم واحد؟",
          en: "Can Uzungöl be done in a single day?",
        },
        answer: {
          tr: "Evet, tam günlük program olarak. Tek yön iki saat olduğu için gün yolda dört saat geçiyor; sabah erken çıkıp akşam dönmek gerekiyor. Aynı güne ikinci bir durak koymayı önermiyoruz.",
          ar: "نعم، كبرنامج ليوم كامل. ولأنّ الاتجاه الواحد ساعتان يمضي من اليوم أربع ساعات في الطريق؛ فيلزم الخروج باكراً والعودة مساءً. ولا نقترح إضافة محطة ثانية في اليوم نفسه.",
          en: "Yes, as a full-day programme. Since it is two hours each way, four hours of the day go to the road; you need an early start and an evening return. We do not recommend adding a second stop to the same day.",
        },
      },
      {
        question: {
          tr: "Kış aylarında gidilir mi?",
          ar: "هل يمكن الزيارة في أشهر الشتاء؟",
          en: "Is it worth coming in winter?",
        },
        answer: {
          tr: "Uzungöl ve Sümela yıl boyunca gezilebiliyor, yalnız kışın yol şartlarına göre plan değişebiliyor. Ayder ve yüksek yaylalar için haziran sonu–eylül arasını beklemek gerekiyor; sezon dışında o günü sahile ya da şehir çevresine çeviriyoruz.",
          ar: "يمكن زيارة أوزنجول وسوميلا طوال السنة، غير أنّ الخطة قد تتغيّر شتاءً بحسب أحوال الطريق. أمّا آيدر والمرتفعات العالية فتحتاج الانتظار إلى أواخر يونيو–سبتمبر؛ وخارج الموسم نحوّل ذلك اليوم إلى الساحل أو محيط المدينة.",
          en: "Uzungöl and Sümela can be visited all year, though in winter the plan may shift with road conditions. Ayder and the high plateaus need late June to September; out of season we turn that day towards the coast or the area around the city.",
        },
      },
    ],
    destinationSlug: "trabzon",
    routeSlugs: [],
    tourSlug: "trabzon-turu",
  },
];

export function chauffeurCityBySlug(slug: string) {
  return chauffeurCities.find((city) => city.slug === slug);
}
