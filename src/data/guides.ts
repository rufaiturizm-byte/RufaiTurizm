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

/**
 * Rehberin konu grubu.
 *
 * On sekiz yazı tek bir ızgarada duruyordu: hangi yazının neyle ilgili
 * olduğu ancak başlığı okuyunca anlaşılıyordu. Gruplar hem taramayı
 * kolaylaştırıyor hem de listeye anahtar kelimeli ara başlıklar veriyor.
 */
export type GuideTopic = "arrival" | "planning" | "daytrips" | "practical";

/** Listede görünecek sıra. */
export const guideTopics: GuideTopic[] = ["arrival", "planning", "daytrips", "practical"];

export function guidesByTopic(topic: GuideTopic) {
  return guides.filter((guide) => guide.topic === topic);
}

/**
 * Yazının altında gösterilecek ilgili rehberler.
 *
 * Önceki hali `guides.filter(başkası).slice(0, 3)` idi: her yazı dizinin
 * ilk üç rehberini gösteriyordu. İki sonucu vardı — balayı yazısının
 * altında "havalimanından şehre nasıl gidilir" çıkıyordu, ve on sekiz
 * rehberin on beşi başka hiçbir rehberden İÇ LİNK ALMIYORDU. İlk üçü
 * bütün bağlantı değerini kendine topluyordu.
 *
 * Şimdi önce aynı konudakiler, yer kalırsa sıradaki konulardan
 * tamamlanıyor. Başlangıç noktası yazının kendi sırasından kayıyor, bu
 * yüzden aynı konudaki dört yazı birbirinin aynısını göstermiyor ve
 * her rehber en az bir yerden bağlantı alıyor.
 */
export function relatedGuides(slug: string, count = 3) {
  const current = guides.find((guide) => guide.slug === slug);
  if (!current) return guides.slice(0, count);

  const sameTopic = guidesByTopic(current.topic).filter((guide) => guide.slug !== slug);
  const others = guides.filter(
    (guide) => guide.slug !== slug && guide.topic !== current.topic,
  );

  // Kaydırma: aynı konudaki her yazı listeye farklı bir yerden başlasın.
  const offset = guides.indexOf(current);
  const rotate = <T,>(list: T[]) =>
    list.length ? list.slice(offset % list.length).concat(list.slice(0, offset % list.length)) : list;

  return [...rotate(sameTopic), ...rotate(others)].slice(0, count);
}

export interface Guide {
  slug: string;
  topic: GuideTopic;
  image: string;
  title: Text;
  excerpt: Text;
  facts: GuideFact[];
  sections: GuideSection[];
  faq: GuideFaq[];
  /**
   * Arama sonucundaki başlık ve açıklama.
   *
   * `title` ve `excerpt` sayfada ve kartta okunmak için yazıldı; arama
   * sonucunun ölçüleri başka: başlık 60 karakterde kesiliyor (marka eki
   * dahil), açıklama ise 155'e kadar yer veriyor ve tek satırlık bir
   * özet o alanın yarısını boş bırakıyor. Bu yüzden ayrı yazılıyorlar.
   * Verilmezse `title` ve `excerpt` kullanılır.
   */
  seo?: { title?: Text; description?: Text };
}

export const guides: Guide[] = [
  {
    slug: "istanbul-havalimanindan-sehre-ulasim",
    topic: "arrival",
    image: "/images/places/havalimani.jpg",
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
    seo: {
      title: { tr: "İstanbul Havalimanı'ndan Şehre Ulaşım", ar: "من مطار إسطنبول إلى المدينة", en: "Istanbul Airport to City Centre" },
      description: {
        tr: "İstanbul Havalimanı merkeze 45–50 km. Metro, taksi ve özel transfer seçenekleri, gerçek yolculuk süreleri ve bagajlı bir aileyle hangisinin işe yaradığı.",
        ar: "مطار إسطنبول يبعد 45–50 كم عن المركز. خيارات المترو والتاكسي والنقل الخاص، وأوقات الرحلة الحقيقية، وأيّها يناسب عائلة مع أمتعة.",
        en: "Istanbul Airport is 45–50 km from the centre. Metro, taxi and private transfer options, real journey times, and which one works with luggage and family.",
      },
    },
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
        image: "/images/fleet/vito-exterior.jpg",
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
      {
        heading: {
          tr: "Terminalden çıkış: gerçekte kaç dakika",
          ar: "الخروج من الصالة: كم دقيقة فعلاً",
          en: "Getting out of the terminal: how many minutes really",
        },
        body: {
          tr: "Uçak indikten sonra kapıdan çıkana kadar geçen süre çoğu planın dışında kalıyor. İstanbul Havalimanı çok büyük: uçaktan pasaport kontrolüne yürümek tek başına on-on beş dakika sürebiliyor.\n\nPasaport kontrolü yoğun saatlerde yirmi dakikayı buluyor, bagajın banda düşmesi on beş-yirmi dakika daha. Toplamda iniş saatinden yaklaşık kırk beş dakika sonra çıkışta oluyorsunuz; kalabalık bir saatte bir saati geçebiliyor.\n\nÇıkış kapıları birbirinden uzak ve hangi kapıdan çıkacağınız bagaj bandına göre değişiyor. Bu, şoförle buluşma noktasının önceden netleşmesi gereken tek havalimanı; \"çıkışta buluşuruz\" burada yetersiz bir tarif.\n\nBiz uçuşu numarasından takip ediyoruz, yani şoför sizin çıkacağınız kapıyı biliyor ve orada isimli tabelayla bekliyor. Rötar olursa bekleme için ek ücret çıkmıyor.\n\nBu süreleri bilmek özellikle aktarmalı uçuşlarda ve gece varışlarında işe yarıyor: otele varış saatini iniş saatiyle aynı sanmak, ilk günün planını bozan en yaygın hata.",
          ar: "المدة بين هبوط الطائرة والخروج من الباب تغيب عن معظم الخطط. ومطار إسطنبول كبير جداً: فالمشي من الطائرة إلى ختم الجوازات وحده قد يستغرق عشر إلى خمس عشرة دقيقة.\n\nويبلغ ختم الجوازات عشرين دقيقة في ساعات الذروة، ونزول الحقائب على السير خمس عشرة إلى عشرين دقيقة أخرى. وفي المجموع تكون عند المخرج بعد نحو خمس وأربعين دقيقة من الهبوط؛ وقد تتجاوز الساعة في وقت مزدحم.\n\nوأبواب الخروج متباعدة، ويختلف بابك بحسب سير الحقائب. وهذا هو المطار الوحيد الذي يجب أن تتحدّد فيه نقطة اللقاء بالسائق مسبقاً؛ فعبارة \"نلتقي عند المخرج\" وصف غير كافٍ هنا.\n\nونحن نتابع الرحلة برقمها، أي أن السائق يعرف الباب الذي ستخرج منه وينتظر هناك بلافتة تحمل اسمك. وإن تأخرت الطائرة فلا رسوم على الانتظار.\n\nومعرفة هذه المدد تنفع خاصةً في الرحلات ذات التوقّف وفي الوصول ليلاً: فظنّ أن ساعة الوصول إلى الفندق هي ساعة الهبوط أشيع خطأ يُفسد خطة اليوم الأول.",
          en: "The time between the plane landing and walking out of the door is missing from most plans. Istanbul Airport is very large: the walk from the aircraft to passport control alone can take ten to fifteen minutes.\n\nPassport control reaches twenty minutes at busy hours, and bags another fifteen to twenty on the belt. In total you are at the exit about forty-five minutes after landing; at a busy hour it can pass an hour.\n\nThe exits are far apart and which one you use depends on your baggage belt. This is the one airport where the meeting point with the driver must be settled in advance; \"we'll meet at the exit\" is not a sufficient description here.\n\nWe track the flight by its number, so the driver knows which door you will come out of and waits there with a name board. If the plane is late there is no waiting charge.\n\nKnowing these times helps especially on connecting flights and night arrivals: assuming the hotel arrival time equals the landing time is the commonest mistake that wrecks the first day's plan."
        },
      },
      {
        heading: {
          tr: "Hangi semte ne kadar sürer",
          ar: "كم تستغرق الطريق إلى كل حيّ",
          en: "How long to each district",
        },
        body: {
          tr: "İstanbul Havalimanı şehrin kuzeybatısında ve mesafe semte göre belirgin biçimde değişiyor.\n\nTaksim ve Şişli yaklaşık 40 kilometre; trafiksiz 45 dakika, akşamüstü bir buçuk saat. Sultanahmet 45 kilometre ve benzer süre, ama tarihi yarımadaya girişte dar sokaklar süreyi uzatabiliyor. Beşiktaş ve Ortaköy 42 kilometre.\n\nAnadolu yakası daha uzak: Kadıköy'e 55 kilometre ve köprü geçişiyle bir-iki saat arası. Anadolu yakasında kalacaksanız Sabiha Gökçen'e inmek bu yolu yarıya indiriyor.\n\nSüreyi belirleyen asıl şey mesafe değil saat. Sabah yedi-on ve akşam beş-sekiz arası şehre giriş en yoğun; aynı yol gece yarısı yarım saatte alınıyor.\n\nOtelin tam adresini rezervasyonda aldığımızda süreyi tahmin değil gerçek olarak söylüyoruz — aynı semt adı içinde bile oteller arasında yirmi dakika fark olabiliyor. \"Sultanahmet\" demek yetmiyor; sokak adı fark yaratıyor.",
          ar: "يقع مطار إسطنبول شمال غرب المدينة، وتختلف المسافة بوضوح بحسب الحيّ.\n\nتقسيم وشيشلي على نحو أربعين كيلومتراً؛ خمس وأربعون دقيقة بلا زحام وساعة ونصف قبيل المساء. والسلطان أحمد على خمسة وأربعين كيلومتراً بمدة مشابهة، لكن الأزقّة الضيّقة عند دخول شبه الجزيرة التاريخية قد تطيل الوقت. وبشيكتاش وأورتاكوي على اثنين وأربعين كيلومتراً.\n\nوالجهة الآسيوية أبعد: كاديكوي على خمسة وخمسين كيلومتراً وبين ساعة وساعتين مع عبور الجسر. وإن كنت ستقيم في الجهة الآسيوية فالهبوط في صبيحة كوكتشن يختصر هذا الطريق إلى النصف.\n\nوالذي يحدّد المدة ليس المسافة بل الساعة. فالدخول إلى المدينة أشدّ ازدحاماً بين السابعة والعاشرة صباحاً وبين الخامسة والثامنة مساءً؛ ويُقطع الطريق نفسه في نصف ساعة منتصف الليل.\n\nوحين نأخذ عنوان الفندق الكامل عند الحجز نقول المدة حقيقةً لا تخميناً — فالفارق بين فندقين داخل الحيّ الواحد قد يبلغ عشرين دقيقة. ولا يكفي قول \"السلطان أحمد\"؛ فاسم الشارع يُحدث فرقاً.",
          en: "Istanbul Airport sits in the north-west of the city, and the distance varies noticeably by district.\n\nTaksim and Şişli are about 40 km; forty-five minutes clear, an hour and a half in the late afternoon. Sultanahmet is 45 km and a similar time, though the narrow streets entering the historic peninsula can stretch it. Beşiktaş and Ortaköy are 42 km.\n\nThe Asian side is further: 55 km to Kadıköy and between one and two hours with the bridge crossing. If you are staying on the Asian side, landing at Sabiha Gökçen halves that drive.\n\nWhat sets the time is not the distance but the hour. Entry into the city is heaviest between seven and ten in the morning and five and eight in the evening; the same road takes half an hour at midnight.\n\nWith the exact hotel address at booking we give the time as fact rather than estimate — even within one district name two hotels can be twenty minutes apart. Saying \"Sultanahmet\" is not enough; the street name makes a difference."
        },
      },
    ],
  },
  {
    slug: "sabiha-gokcenden-istanbula-ulasim",
    topic: "arrival",
    image: "/images/places/bogaz-kopru.jpg",
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
    seo: {
      title: { tr: "Sabiha Gökçen'den İstanbul'a Ulaşım", ar: "من صبيحة كوكجن إلى إسطنبول", en: "Sabiha Gökçen to Istanbul" },
      description: {
        tr: "Sabiha Gökçen Anadolu yakasında: Avrupa yakasına 60–90 dakika. İki havalimanı arasındaki fark, gece inen uçuşlar ve karşılama noktası.",
        ar: "صبيحة كوكجن في الجانب الآسيوي: 60–90 دقيقة إلى الجانب الأوروبي. الفرق بين المطارين، والرحلات الليلية، ونقطة الاستقبال.",
        en: "Sabiha Gökçen sits on the Asian side: 60–90 minutes to the European side. The difference between the two airports, night arrivals and where you are met.",
      },
    },
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
          tr: "Sabiha Gökçen (SAW) Anadolu yakasında, Pendik yakınlarındadır. Kadıköy ve Ataşehir gibi Anadolu yakası bölgelerine yakınlığı büyük avantajdır: yol yarım saatte biter ve köprüye hiç girilmez. Ancak oteliniz Sultanahmet, Taksim ya da Beşiktaş'taysa Boğaz'ı geçmeniz gerekir; bu, mesafeyi ve trafiğe bağlı süreyi belirgin biçimde artırır.\n\nRakamla söyleyelim: Kadıköy'e yaklaşık 40 kilometre ve trafiksiz 35-45 dakika. Taksim'e ise 55 kilometre ve köprüden geçerek 60-90 dakika; akşam saatlerinde iki saati bulduğu oluyor. Aradaki fark tek bir yolculukta yarım saat gibi görünse de, dört gecelik bir seyahatte gidiş-dönüş iki saat eder.\n\nBu yüzden havalimanı seçimi bilet fiyatından önce otel adresine bakarak yapılmalı. Avrupa yakasında kalacak bir misafirin Sabiha Gökçen'e inmesi çoğu zaman bilet farkından daha pahalıya mal oluyor — üstelik bedeli parayla değil, tatilin ilk ve son günüyle ödeniyor.",
          ar: "يقع مطار صبيحة كوكجن (SAW) في الجانب الآسيوي قرب بنديك، وقربه من مناطق مثل كاديكوي وآتاشهير ميزة كبيرة: ينتهي الطريق في نصف ساعة ولا تدخل الجسر أصلاً. لكن إذا كان فندقك في السلطان أحمد أو تقسيم أو بشكتاش فعليك عبور البوسفور، وهذا يزيد المسافة والوقت بوضوح حسب الازدحام.\n\nولنقل ذلك بالأرقام: نحو أربعين كيلومتراً إلى كاديكوي، و35-45 دقيقة بلا زحام. أما إلى تقسيم فخمسة وخمسون كيلومتراً و60-90 دقيقة مع عبور الجسر؛ وقد تبلغ ساعتين في ساعات المساء. وقد يبدو الفارق نصف ساعة في رحلة واحدة، لكنه ساعتان ذهاباً وإياباً في سفرة من أربع ليالٍ.\n\nولذلك ينبغي اختيار المطار بالنظر إلى عنوان الفندق قبل سعر التذكرة. فهبوط من سيقيم في الجانب الأوروبي في صبيحة كوكجن يكلّفه غالباً أكثر من فارق التذكرة — والثمن لا يُدفع مالاً بل من أول أيام الإجازة وآخرها.",
          en: "Sabiha Gökçen (SAW) is on the Asian side near Pendik, which is a real advantage for districts like Kadıköy and Ataşehir: the drive is over in half an hour and you never touch a bridge. But if your hotel is in Sultanahmet, Taksim or Beşiktaş you have to cross the Bosphorus, and that lengthens both distance and traffic-dependent travel time.\n\nIn figures: about 40 km to Kadıköy, 35-45 minutes without traffic. To Taksim it is 55 km and 60-90 minutes across a bridge; in the evening it can reach two hours. The gap looks like half an hour on one journey, but over a four-night trip it is two hours there and back.\n\nSo the airport should be chosen by looking at the hotel address before the ticket price. For a guest staying on the European side, landing at Sabiha Gökçen usually costs more than the fare difference — and the price is paid not in money but in the first and last day of the holiday.",
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
          en: "A large share of flights into Sabiha Gökçen land late at night, when public transport thins out. With children in tow, a pre-arranged pickup becomes the easiest part of the trip. Getting the driver's name and plate number in advance is the detail that helps most while waiting at midnight in an unfamiliar city.\n\nThere is a practical reason too: the metro and the airport buses run to a timetable, and after midnight the gaps stretch. A family with luggage and sleeping children changing vehicles twice at one in the morning is the part of the trip people remember, and not fondly.\n\nWe track the flight by its number. If the plane is late the driver waits and there is no extra charge for it — this is written down because at that hour it is the question guests worry about most.",
        },
      },
      {
        heading: {
          tr: "Havalimanından çıkış: ne kadar sürer",
          ar: "الخروج من المطار: كم يستغرق",
          en: "Getting out of the airport: how long it takes",
        },
        body: {
          tr: "Uçak indikten sonra dışarı çıkmak da zaman alıyor ve bu süre çoğu planın dışında kalıyor. Pasaport kontrolü yoğun saatlerde yirmi dakikayı bulabiliyor, bagajın banda düşmesi on beş-yirmi dakika daha. Yani iniş saatinden yaklaşık kırk dakika sonra çıkışta olursunuz; kalabalık bir saatte bir saat.\n\nSabiha Gökçen'in bu konuda bir avantajı var: terminal küçük ve tek çıkış noktası var. İstanbul Havalimanı'nda çıkış kapıları birbirinden uzak ve hangi kapıdan çıkacağınız bagaj bandına göre değişiyor; burada böyle bir karışıklık yok. Bagajınızı alıp yürüdüğünüz tek kapıdan çıkıyorsunuz.\n\nBiz uçuşu numarasından takip ettiğimiz için şoför sizden önce orada oluyor. Rötar olursa bekleme için ek ücret çıkmıyor. Kendi hattınız çalışmıyorsa da sorun değil: isimli tabelayla beklediğimiz için birbirimizi bulmak internete bağlı değil.",
          ar: "الخروج بعد هبوط الطائرة يستغرق وقتاً أيضاً، وهذا الوقت يغيب عن معظم الخطط. فقد يبلغ ختم الجوازات عشرين دقيقة في ساعات الذروة، ونزول الحقائب على السير خمس عشرة إلى عشرين دقيقة أخرى. أي أنك تكون عند المخرج بعد نحو أربعين دقيقة من الهبوط؛ وساعة كاملة في وقت مزدحم.\n\nولصبيحة كوكجن ميزة هنا: الصالة صغيرة ولها نقطة خروج واحدة. أما في مطار إسطنبول فأبواب الخروج متباعدة ويختلف بابك بحسب سير الحقائب؛ ولا يوجد هذا الالتباس هنا. تأخذ حقيبتك وتخرج من الباب الوحيد الذي تمشي إليه.\n\nولأننا نتابع الرحلة برقمها يكون السائق هناك قبلك. وإن تأخرت الطائرة فلا رسوم على الانتظار. ولا مشكلة إن لم يعمل خطك: فنحن ننتظر بلافتة تحمل اسمك، أي أن لقاءنا لا يعتمد على الإنترنت.",
          en: "Getting out after the plane lands takes time too, and that time is missing from most plans. Passport control can reach twenty minutes at busy hours, and bags another fifteen to twenty on the belt. So you reach the exit about forty minutes after landing; an hour at a busy time.\n\nSabiha Gökçen has an advantage here: the terminal is small and there is a single exit. At Istanbul Airport the exits are far apart and which one you use depends on your baggage belt; there is no such confusion here. You collect your bag and walk out of the one door in front of you.\n\nBecause we track the flight by its number the driver is there before you. If the plane is late there is no waiting charge. And it does not matter if your own line is not working: we wait with a name board, so finding each other does not depend on the internet."
        },
      },
      {
        heading: {
          tr: "Anadolu yakasında kalmak mantıklı mı",
          ar: "هل الإقامة في الجانب الآسيوي منطقية",
          en: "Does staying on the Asian side make sense",
        },
        body: {
          tr: "Sabiha Gökçen'e ineceksek Anadolu yakasında kalmak akla geliyor ve bazı misafirler için gerçekten doğru cevap. Kadıköy ve Üsküdar aynı bütçeye Avrupa yakasından daha geniş oda veriyor, sokakları daha az turistik ve yemek daha ucuz. Kadıköy'ün çarşısı ve sahil hattı başlı başına gezilecek bir yer.\n\nAma tarihi yerler karşı yakada. Ayasofya, Sultanahmet, Topkapı, Kapalıçarşı — hepsi Avrupa yakasında ve her gün karşıya geçmek gerekiyor. Vapurla yirmi dakika ve keyifli; ama sabah ve akşam iki kez yapılınca güne bir saat ekliyor.\n\nPratik ayrım şu: üç günlük bir seyahatte Avrupa yakasında kalın, çünkü yolda geçen her saat toplam sürenin büyük bir yüzdesi. Bir hafta ve üzerinde Anadolu yakası mantıklı; hem daha ucuz hem şehri turist gibi değil oturan gibi görüyorsunuz. Karar verirken bize otelin adresini söylemeniz yeterli, transferi ona göre planlıyoruz.",
          ar: "إن كنا سنهبط في صبيحة كوكجن فقد يخطر الإقامة في الجانب الآسيوي، وهو فعلاً الجواب الصحيح لبعض الضيوف. فكاديكوي وأسكودار تعطيان غرفة أوسع بالميزانية نفسها مقارنة بالجانب الأوروبي، وشوارعهما أقل سياحية والطعام أرخص. وسوق كاديكوي وخط الساحل مكان يستحق التجوّل بذاته.\n\nلكن المعالم التاريخية في الضفة المقابلة. آيا صوفيا والسلطان أحمد وتوب كابي والسوق المسقوف — كلها في الجانب الأوروبي، ويلزم العبور كل يوم. والعبّارة عشرون دقيقة وممتعة؛ لكن تكرارها صباحاً ومساءً يضيف ساعة إلى اليوم.\n\nوالتمييز العملي: في رحلة من ثلاثة أيام أقم في الجانب الأوروبي، لأن كل ساعة على الطريق نسبة كبيرة من المدة الإجمالية. أما في أسبوع فأكثر فالجانب الآسيوي منطقي؛ فهو أرخص وترى المدينة كمقيم لا كسائح. ويكفي أن تقول لنا عنوان الفندق عند القرار، ونخطّط النقل على أساسه.",
          en: "If we are landing at Sabiha Gökçen, staying on the Asian side comes to mind, and for some guests it is genuinely the right answer. Kadıköy and Üsküdar give a larger room for the same budget than the European side, their streets are less touristic and food is cheaper. Kadıköy's market and shore road are worth wandering in their own right.\n\nBut the historic sights are on the other bank. Hagia Sophia, the Blue Mosque, Topkapı, the Grand Bazaar — all on the European side, and you cross every day. The ferry takes twenty minutes and is a pleasure; but done twice a day it adds an hour.\n\nThe practical split: on a three-day trip, stay on the European side, because every hour on the move is a large percentage of the total. For a week or more the Asian side makes sense; it is cheaper and you see the city as a resident rather than a tourist. When you decide, just tell us the hotel address and we plan the transfer around it."
        },
      },
    ],
  },
  {
    slug: "istanbulda-nerede-kalinir",
    topic: "practical",
    image: "/images/places/sultanahmet.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Nerede Kalınır? Semt Rehberi", ar: "أين تسكن في إسطنبول؟ دليل الأحياء", en: "Where to Stay in Istanbul: District Guide" },
      description: {
        tr: "Sultanahmet, Taksim, Şişli ve Boğaz kıyısı karşılaştırmalı: hangi semt kime uyar, metroya uzaklık, akşamları nasıl bir yer ve ilk ziyarette hangisi seçilmeli.",
        ar: "مقارنة بين السلطان أحمد وتقسيم وشيشلي وساحل البوسفور: أي حي يناسب مَن، والقرب من المترو، وكيف يكون المساء، وما يُختار في الزيارة الأولى.",
        en: "Sultanahmet, Taksim, Şişli and the Bosphorus shore compared: which district suits whom, distance to the metro, what evenings are like, and where to stay first.",
      },
    },
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
      {
        heading: {
          tr: "Asya yakasında kalmak: Kadıköy ve çevresi",
          ar: "الإقامة في الجانب الآسيوي: كاديكوي وما حولها",
          en: "Staying on the Asian side: Kadıköy and around",
        },
        body: {
          tr: "İstanbul'un yarısı Asya yakasında ve turistlerin çoğu orada hiç kalmıyor. Bu, semt seçimini genişleten bir boşluk.\n\nKadıköy'ün karakteri Avrupa yakasının turistik semtlerinden farklı: burası şehrin kendi hayatını yaşadığı yer. Salı pazarı, balık çarşısı, kitapçılar, kahveciler. Fiyatlar aynı yıldız sayısı için Sultanahmet ve Beşiktaş'tan gözle görülür biçimde daha uygun.\n\nUlaşım sanıldığı kadar zor değil. Marmaray Söğütlüçeşme'den Sirkeci'ye tünelden geçiyor ve tarihî yarımadaya varış çeyrek saati buluyor. Kadıköy–Eminönü ve Kadıköy–Karaköy vapurları da hem ulaşım hem de günde iki kez Boğaz manzarası demek.\n\nBir avantajı daha var: Sabiha Gökçen Havalimanı Asya yakasında. Oradan uçuyorsanız transfer süresi yarıya iniyor.\n\nBunun bedeli şu: tarihî yarımadaya her gidiş bir geçiş demek. Üç günlük bir ilk ziyarette bu kayıp ağır basıyor. Bir haftadan uzun kalanlar, ikinci kez gelenler ve kalabalıktan uzak durmak isteyenler içinse Kadıköy çoğu zaman daha iyi bir tatil veriyor.",
          ar: "نصف إسطنبول في الجانب الآسيوي، ومعظم السيّاح لا يقيمون فيه أبداً. وهذه فجوة توسّع خيارات الأحياء.\n\nوطابع كاديكوي مختلف عن الأحياء السياحية في الجانب الأوروبي: فهنا تعيش المدينة حياتها هي. سوق الثلاثاء وسوق السمك والمكتبات والمقاهي. والأسعار لعدد النجوم نفسه أنسب بوضوح منها في السلطان أحمد وبشيكتاش.\n\nوالتنقّل ليس صعباً كما يُظنّ. فقطار مرمراي يعبر النفق من سوغوتلوتششمه إلى سيركجي، والوصول إلى شبه الجزيرة التاريخية يبلغ ربع ساعة. وعبّارات كاديكوي–أمينونو وكاديكوي–كاراكوي تجمع بين التنقّل وإطلالة على البوسفور مرّتين في اليوم.\n\nوثمّة ميزة أخرى: مطار صبيحة كوكجن في الجانب الآسيوي. فإن كنت تسافر منه انخفضت مدة النقل إلى النصف.\n\nوثمن ذلك: كل ذهاب إلى شبه الجزيرة التاريخية يعني عبوراً. وفي زيارة أولى من ثلاثة أيام تكون هذه الخسارة راجحة. أما من يقيم أكثر من أسبوع، أو يزور للمرة الثانية، أو يريد الابتعاد عن الزحام، فكاديكوي تمنحه في الغالب إجازة أفضل.",
          en: "Half of Istanbul is on the Asian side, and most visitors never stay there. That gap widens the choice of districts.\n\nKadıköy has a different character from the tourist quarters across the water: this is where the city lives its own life. The Tuesday market, the fish market, bookshops, coffee houses. For the same star rating, prices are noticeably kinder than in Sultanahmet or Beşiktaş.\n\nGetting across is not as hard as it sounds. The Marmaray runs through the tunnel from Söğütlüçeşme to Sirkeci, and the historic peninsula is about a quarter of an hour away. The Kadıköy–Eminönü and Kadıköy–Karaköy ferries are both transport and a Bosphorus view twice a day.\n\nThere is one more advantage: Sabiha Gökçen Airport is on the Asian side. If you fly from there, the transfer time halves.\n\nThe price of all this: every trip to the historic peninsula is a crossing. On a three-day first visit that loss outweighs the gain. For anyone staying longer than a week, coming a second time, or wanting to keep away from the crowds, Kadıköy usually makes for a better holiday."
        },
        image: "/images/places/kadikoy.jpg",
        imageAlt: {
          tr: "Kadıköy iskelesi ve sahil",
          ar: "رصيف كاديكوي والساحل",
          en: "The Kadıköy pier and shore",
        },
      },
      {
        heading: {
          tr: "Fatih, Aksaray ve Laleli: Arapçanın her yerde konuşulduğu bölge",
          ar: "الفاتح وأكسراي ولاليلي: المنطقة التي تُتكلَّم فيها العربية في كل مكان",
          en: "Fatih, Aksaray and Laleli: where Arabic is spoken everywhere",
        },
        body: {
          tr: "Körfez'den gelen misafirlerin önemli bir bölümü bu üçgende kalıyor ve bunun somut sebepleri var.\n\nBirincisi dil. Aksaray ve Laleli'de tabelaların çoğu Arapça, lokantalarda ve dükkânlarda Arapça konuşuluyor. Türkçe ya da İngilizce bilmeyen bir misafir için bu, günlük hayatı tamamen değiştiren bir kolaylık.\n\nİkincisi yemek. Bölgede helal seçenek aramak gerekmiyor; Suriye, Lübnan ve Irak mutfağından lokantalar sokak aralarında. Sahur ve iftar saatlerinde açık yerler bulunuyor.\n\nÜçüncüsü konum ve fiyat. T1 tramvayı Aksaray'dan geçip Sultanahmet ve Eminönü'ne gidiyor; Yenikapı hem metro hem Marmaray aktarma noktası. Aynı yıldız sayısı Sultanahmet'ten belirgin biçimde daha uygun.\n\nDürüst tarafını da yazalım: bölge kalabalık, gürültülü ve binaların çoğu eski. Sokaklar akşam geç saatte de hareketli. Sessiz bir otel, geniş bir lobi ya da bakımlı bir sokak arıyorsanız burası o bölge değil. Küçük çocuklu bir aile için akşam gürültüsü uykuyu etkileyebiliyor — otelin ana cadde üzerinde mi ara sokakta mı olduğunu sormak burada başka semtlerden daha önemli.",
          ar: "قسم كبير من ضيوفنا القادمين من الخليج يقيمون في هذا المثلث، ولذلك أسباب ملموسة.\n\nأولها اللغة. ففي أكسراي ولاليلي معظم اللافتات بالعربية، والعربية تُتكلَّم في المطاعم والمحال. وهذا لضيف لا يعرف التركية ولا الإنجليزية تيسير يغيّر الحياة اليومية كلها.\n\nوثانيها الطعام. فلا حاجة في المنطقة إلى البحث عن خيار حلال؛ فمطاعم المطبخ السوري واللبناني والعراقي في الأزقّة. وتجد أماكن مفتوحة في أوقات السحور والإفطار.\n\nوثالثها الموقع والسعر. فترام T1 يمرّ من أكسراي إلى السلطان أحمد وأمينونو؛ ويني قابي نقطة تحويل للمترو ولمرمراي معاً. وعدد النجوم نفسه أنسب بوضوح منه في السلطان أحمد.\n\nولنكتب الجانب الصريح أيضاً: المنطقة مزدحمة وصاخبة ومعظم مبانيها قديمة. والشوارع حيّة حتى وقت متأخر من الليل. فإن كنت تبحث عن فندق هادئ أو بهو واسع أو شارع مرتّب فليست هذه منطقتك. وعند عائلة معها أطفال صغار قد تؤثّر ضوضاء الليل في النوم — والسؤال عمّا إذا كان الفندق على الشارع الرئيسي أم في زقاق جانبي أهمّ هنا منه في سائر الأحياء.",
          en: "A large share of our guests from the Gulf stay in this triangle, and there are concrete reasons for it.\n\nThe first is language. In Aksaray and Laleli most signs are in Arabic, and Arabic is spoken in the restaurants and shops. For a guest with no Turkish or English, that changes daily life entirely.\n\nThe second is food. You do not have to search for a halal option here; Syrian, Lebanese and Iraqi kitchens line the side streets. Places stay open for suhoor and iftar.\n\nThe third is location and price. The T1 tram runs from Aksaray to Sultanahmet and Eminönü; Yenikapı is an interchange for both the metro and the Marmaray. The same star rating costs noticeably less than in Sultanahmet.\n\nNow the frank side: the area is crowded and noisy, and most of the buildings are old. The streets are busy late into the evening. If you want a quiet hotel, a spacious lobby or a well-kept street, this is not that district. For a family with small children the evening noise can affect sleep — asking whether the hotel is on the main road or a side street matters more here than anywhere else."
        },
      },
      {
        heading: {
          tr: "Bütçe: uygun otel hangi semtte çıkar, karşılığında ne verilir",
          ar: "الميزانية: في أي حي تجد فندقاً بسعر مناسب، وما مقابله",
          en: "Budget: which districts come cheaper, and what you give up",
        },
        body: {
          tr: "İstanbul'da aynı yıldız sayısı semtten semte belirgin biçimde farklı fiyatlanıyor. Sıralama kabaca şöyle işliyor.\n\nEn uygun taraf: Fatih, Aksaray, Laleli ve Şişli'nin ara sokakları. Ardından Asya yakası — Kadıköy ve çevresi. Ortada Taksim ve Beyoğlu; burada aynı sokakta bile fiyat çok değişiyor. En pahalı uç: Boğaz kıyısı (Ortaköy, Beşiktaş, Bebek) ve Nişantaşı. Sultanahmet ise ikiye ayrılıyor — meydana bakan oteller pahalı, birkaç sokak arkası çok daha uygun.\n\nMevsim ikinci belirleyici. Yaz ayları, ramazan bayramı ve kurban bayramı dönemi en yüksek fiyatların olduğu zaman. Kasım–mart arası aynı otel çok daha uygun oluyor.\n\nBir uyarı: iyi bir semtte beklenenin çok altında bir fiyat genelde bir şey anlatıyor. Penceresiz ya da bodrum kat oda, ana cadde gürültüsü, asansörsüz bina, ya da otelin adındaki semtte olmaması. Bunlar ilan metninde yazmıyor. Rezervasyondan önce odanın hangi katta olduğunu ve penceresinin nereye baktığını yazılı olarak sormak, bu farkların çoğunu önceden ortaya çıkarıyor.\n\nBizim tarafımızdan bir not: otel fiyatına komisyon eklemiyoruz ve anlaşmalı otel listemiz yok. Kendiniz de rezerve edebilirsiniz; bizden isterseniz bu soruları sizin adınıza sorup cevabı yazılı iletiyoruz.",
          ar: "في إسطنبول يُسعَّر عدد النجوم نفسه تسعيراً مختلفاً بوضوح من حيّ إلى آخر. والترتيب يجري تقريباً هكذا.\n\nالجهة الأنسب: الفاتح وأكسراي ولاليلي والأزقّة الجانبية في شيشلي. يليها الجانب الآسيوي — كاديكوي وما حولها. وفي الوسط تقسيم وبي أوغلو؛ وهنا يتفاوت السعر كثيراً حتى في الشارع الواحد. والطرف الأغلى: ساحل البوسفور (أورتاكوي وبشيكتاش وبَبَك) ونيشانتاشي. أما السلطان أحمد فينقسم قسمين — الفنادق المطلّة على الساحة غالية، وما وراءها بشوارع قليلة أنسب كثيراً.\n\nوالموسم عامل ثانٍ. فأشهر الصيف وفترتا عيد الفطر وعيد الأضحى هي زمن أعلى الأسعار. ومن نوفمبر إلى مارس يصير الفندق نفسه أنسب بكثير.\n\nوتنبيه: السعر الذي يقلّ كثيراً عن المتوقّع في حيّ جيّد يقول شيئاً عادةً. غرفة بلا نافذة أو في الطابق السفلي، أو ضجيج الشارع الرئيسي، أو بناء بلا مصعد، أو أن الفندق ليس في الحي الذي يحمل اسمه. وهذا لا يُكتب في نصّ الإعلان. والسؤال كتابةً قبل الحجز عن طابق الغرفة وعمّا تطلّ عليه نافذتها يكشف معظم هذه الفروق مسبقاً.\n\nوملاحظة من جهتنا: لا نضيف عمولة على سعر الفندق وليست لدينا قائمة فنادق متعاقدة. ويمكنك الحجز بنفسك؛ وإن أردت منّا سألنا هذه الأسئلة نيابةً عنك وأرسلنا الجواب كتابةً.",
          en: "In Istanbul the same star rating is priced very differently from district to district. The order runs roughly like this.\n\nThe kindest side: Fatih, Aksaray, Laleli and the side streets of Şişli. Then the Asian side — Kadıköy and around. In the middle sit Taksim and Beyoğlu, where prices swing widely even along one street. At the expensive end: the Bosphorus shore (Ortaköy, Beşiktaş, Bebek) and Nişantaşı. Sultanahmet splits in two — hotels facing the square are dear, a few streets back is far kinder.\n\nSeason is the second factor. The summer months and the two Eid periods carry the highest prices. From November to March the same hotel costs considerably less.\n\nA warning: a price far below expectation in a good district usually means something. A windowless or basement room, main-road noise, a building without a lift, or a hotel that is not in the district its name claims. None of this appears in the listing text. Asking in writing before booking which floor the room is on and what the window faces brings most of these differences out in advance.\n\nA note from our side: we add no commission to hotel prices and keep no list of partner hotels. You can book yourself; if you would rather we did it, we ask these questions on your behalf and send you the answers in writing."
        },
      },
      {
        heading: {
          tr: "“Deniz manzarası” ve “Boğaz'a sıfır” ilanda ne demek",
          ar: "ماذا يعني «إطلالة على البحر» و«على البوسفور مباشرة» في الإعلان",
          en: "What “sea view” and “right on the Bosphorus” mean in a listing",
        },
        body: {
          tr: "Otel ilanlarında en çok yanlış anlaşılan iki ifade bunlar ve ikisi de çok aranıyor.\n\n“Deniz manzarası” bir tanım değil, bir iddia. Odanın balkonunun bir köşesinden binalar arasında görünen bir şerit de bu adla satılabiliyor. Dürüst oteller buna “kısmi deniz manzarası” diyor; böyle bir ibare varsa ciddiye alın.\n\nİkinci karışıklık su ile ilgili. Sultanahmet ve Kumkapı tarafındaki oteller Marmara Denizi'ni görüyor, Boğaz'ı değil. İkisi farklı manzara: Marmara açık deniz ve gemi trafiği, Boğaz ise iki yaka, köprüler ve vapurlar. “Deniz manzaralı” arayıp Boğaz bekleyen misafir burada hayal kırıklığına uğruyor.\n\nBoğaz'a gerçekten sıfır otel sayısı az ve fiyatı yüksek. “Boğaz manzaralı” diyen otellerin çoğu yamaçta ve manzara çatıların üzerinden. Bu kötü demek değil — bazen daha geniş bir manzara demek — ama sahil yürüyüşü beklentisiyle rezerve edilmemeli.\n\nBir başka ayrıntı: Sultanahmet'te birçok otelde en iyi manzara çatı terasında, odalarda değil. İlan fotoğrafları genelde terastan çekiliyor.\n\nÇözüm tek bir soruda: “Bize rezerve edeceğiniz odanın penceresinden çekilmiş bir fotoğraf gönderir misiniz?” Cevap veren otel doğru söylüyordur; cevap vermeyen otel de size bir şey söylemiş olur.",
          ar: "هاتان أكثر عبارتين يُساء فهمهما في إعلانات الفنادق، وكلتاهما كثيرة البحث.\n\nفـ«إطلالة على البحر» ليست وصفاً بل ادّعاء. فقد يُباع بهذا الاسم شريطٌ يُرى بين المباني من زاوية شرفة الغرفة. والفنادق الصادقة تسمّي هذا «إطلالة جزئية على البحر»؛ فإن وجدت هذه العبارة فخذها بجدّية.\n\nوالالتباس الثاني يتعلق بالماء نفسه. ففنادق جهة السلطان أحمد وكومكابي تطلّ على بحر مرمرة لا على البوسفور. وهما منظران مختلفان: مرمرة بحر مفتوح وحركة سفن، أما البوسفور فضفّتان وجسور وعبّارات. والضيف الذي يبحث عن «إطلالة بحرية» وهو ينتظر البوسفور يُصاب هنا بخيبة.\n\nوالفنادق الواقعة فعلاً على البوسفور مباشرة قليلة وأسعارها مرتفعة. ومعظم من يقول «إطلالة على البوسفور» يقع على المنحدر والمنظر من فوق السطوح. وهذا ليس سيّئاً — بل قد يكون منظراً أوسع — لكن لا يُحجز بتوقّع المشي على الكورنيش.\n\nوتفصيل آخر: في كثير من فنادق السلطان أحمد يكون أجمل منظر على سطح الفندق لا في الغرف. وصور الإعلان تُلتقط من السطح غالباً.\n\nوالحلّ في سؤال واحد: «هل ترسلون لنا صورة ملتقطة من نافذة الغرفة التي ستحجزونها لنا؟» فالفندق الذي يجيب صادق؛ والذي لا يجيب يكون قد قال لك شيئاً أيضاً.",
          en: "These are the two most misread phrases in hotel listings, and both are heavily searched.\n\n“Sea view” is a claim, not a description. A strip of water glimpsed between buildings from one corner of the balcony can be sold under that name. Honest hotels call it a “partial sea view”; if you see that wording, take it seriously.\n\nThe second confusion is about which water. Hotels around Sultanahmet and Kumkapı look onto the Sea of Marmara, not the Bosphorus. They are different views: Marmara is open sea and shipping traffic, while the Bosphorus gives you two shores, bridges and ferries. A guest who searches for a sea view expecting the Bosphorus is disappointed here.\n\nHotels genuinely on the Bosphorus are few and expensive. Most that say “Bosphorus view” sit up the slope, looking over rooftops. That is not a bad thing — it can be a wider view — but it should not be booked in the expectation of a waterfront walk.\n\nOne more detail: in many Sultanahmet hotels the best view is from the roof terrace, not the rooms. The listing photographs are usually taken from the terrace.\n\nThe remedy is a single question: “Could you send a photograph taken from the window of the room you will book for us?” A hotel that answers is telling the truth; one that does not has also told you something."
        },
      },
      {
        heading: {
          tr: "Otelin adı semtini söylemez: adresi haritada doğrulayın",
          ar: "اسم الفندق لا يدلّ على حيّه: تحقّق من العنوان على الخريطة",
          en: "A hotel's name does not tell you its district: check the address on a map",
        },
        body: {
          tr: "Bu rehberdeki bütün semt tavsiyelerini boşa çıkarabilecek tek şey var: otelin adındaki semtte olmaması.\n\nİstanbul'da otel isimlerinde semt adı kullanmak serbest. Adında “Taksim” geçen bir otel meydana yirmi dakika yürüme mesafesinde ve yokuş yukarı olabiliyor. “Sultanahmet” adlı bir otel Kumkapı'da çıkabiliyor. Yorumlarda en sık geçen şikâyet de bu.\n\nKontrolü iki dakika sürüyor: otelin tam adresini isteyin, haritada aratın ve en yakın metro ya da tramvay durağına yürüme süresini ölçün. “Metroya yakın” ifadesi ölçü değil; “Şişhane durağına 6 dakika yürüyüş” ölçüdür.\n\nİkinci kontrol yokuş. İstanbul'un merkez semtlerinin çoğu eğimli. Haritada 700 metre görünen bir yol, bavulla ya da çocuk arabasıyla dik bir yokuşsa bambaşka bir şey. Sokak görünümüne bakmak bunu önceden gösteriyor.\n\nSon olarak konumun asıl önemi şurada: doğru semtte kalmak, günde bir buçuk saat yol farkı yaratıyor. Beş günlük bir tatilde bu, tam bir gün demek. Otel seçiminin geri kalanı — oda tipi, kahvaltı, banyo — ayrı bir rehberin konusu; biz burada yalnız semti ele aldık.\n\nHangi semtin size uyduğuna kaç kişi olduğunuz, kaç gün kalacağınız ve hangi havalimanına ineceğiniz birlikte karar veriyor. Bu üçünü yazın, size uygun iki-üç semt çıkaralım — otel seçimi sizin, biz yalnız bölgeyi daraltıyoruz.",
          ar: "ثمّة أمر واحد قد يُبطل كل نصائح الأحياء في هذا الدليل: ألّا يكون الفندق في الحي الذي يحمل اسمه.\n\nففي إسطنبول يجوز استعمال اسم الحي في أسماء الفنادق. وقد يكون فندق في اسمه «تقسيم» على مسافة عشرين دقيقة مشياً من الساحة وفي طريق صاعد. وقد يتبيّن أن فندقاً اسمه «السلطان أحمد» يقع في كومكابي. وهذه أكثر شكوى تتكرّر في التقييمات.\n\nوالتحقّق يستغرق دقيقتين: اطلب العنوان الكامل للفندق، وابحث عنه على الخريطة، وقِس زمن المشي إلى أقرب محطة مترو أو ترام. فعبارة «قريب من المترو» ليست مقياساً؛ أما «ست دقائق مشياً إلى محطة شيشهانه» فمقياس.\n\nوالتحقّق الثاني هو الانحدار. فمعظم أحياء إسطنبول المركزية مائلة. والطريق الذي يبدو على الخريطة 700 متر شيءٌ آخر تماماً إن كان صعوداً حادّاً مع حقيبة أو عربة طفل. والنظر إلى مشهد الشارع يُظهر هذا مسبقاً.\n\nوأهمية الموقع الحقيقية هنا: الإقامة في الحي الصحيح تفرق ساعةً ونصفاً من الطريق في اليوم. وفي إجازة من خمسة أيام يعني ذلك يوماً كاملاً. أما بقية اختيار الفندق — نوع الغرفة والفطور والحمّام — فموضوع دليل آخر؛ ونحن تناولنا هنا الحيّ وحده.\n\nويقرّر أيُّ حيّ يناسبك ثلاثةُ أمور معاً: عددكم، وعدد أيام إقامتكم، والمطار الذي ستصلون إليه. فاكتب لنا هذه الثلاثة نستخرج لك حيّين أو ثلاثة تناسبك — واختيار الفندق لك، ونحن نضيّق المنطقة فحسب.",
          en: "One thing can undo every district recommendation in this guide: the hotel not being in the district its name claims.\n\nIn Istanbul, using a district name in a hotel's name is unrestricted. A hotel with “Taksim” in its name can be a twenty-minute walk uphill from the square. One called “Sultanahmet” can turn out to be in Kumkapı. It is the complaint that recurs most often in reviews.\n\nChecking takes two minutes: ask for the full address, search it on a map, and measure the walking time to the nearest metro or tram stop. “Close to the metro” is not a measurement; “six minutes' walk to Şişhane station” is.\n\nThe second check is the gradient. Most of Istanbul's central districts are steep. A route that looks like 700 metres on a map is another thing entirely if it is a sharp climb with a suitcase or a pushchair. Street view shows this in advance.\n\nWhy location matters in the end: staying in the right district is worth about an hour and a half of travel a day. Over a five-day holiday that is a full day. The rest of choosing a hotel — room type, breakfast, bathroom — belongs to another guide; here we have dealt only with the district.\n\nWhich district suits you is decided by three things together: how many you are, how many nights you stay, and which airport you land at. Write us those three and we will narrow it to two or three districts — the hotel is your choice, we only narrow the area."
        },
      },
    ],
  },
  {
    slug: "sapanca-masukiye-rehberi",
    topic: "daytrips",
    image: "/images/places/sapanca-orman.jpg",
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
    seo: {
      title: { tr: "Sapanca ve Maşukiye Rehberi", ar: "دليل سبانجا وماشوكية", en: "Sapanca and Maşukiye Guide" },
      description: {
        tr: "İstanbul'a 130 km, günübirlik gidilir. Göl, şelaleler ve alabalık lokantaları; hangi mevsimde gitmeli ve çocuklu ailelerle nelere dikkat edilmeli.",
        ar: "تبعد 130 كم عن إسطنبول وتصلح لرحلة يوم. البحيرة والشلالات ومطاعم السمك؛ وأفضل موسم للزيارة، وما يُراعى مع الأطفال.",
        en: "130 km from Istanbul and doable in a day. The lake, the waterfalls and trout restaurants; the best season to go and what to watch for with children.",
      },
    },
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
      {
        heading: {
          tr: "Maşukiye ve Kartepe: gölün ötesi",
          ar: "ماشوكية وكارتيبه: ما وراء البحيرة",
          en: "Maşukiye and Kartepe: beyond the lake",
        },
        body: {
          tr: "Sapanca'yı yalnız göl sanmak eksik kalır; asıl gün gölün güneyindeki ormanda geçiyor. Maşukiye, dere boyunca kurulmuş alabalık restoranlarıyla bilinen bir köy: masalar suyun üstüne kurulu, su sesi öğle molasını uzatıyor ve yazın hava gölden birkaç derece daha serin.\n\nOrmandaki şelaleler kısa yürüyüşlerle görülüyor. Yollar toprak ve nemli olabiliyor; kaymayan ayakkabı işe yarıyor ve bebek arabası her patikada rahat gitmiyor.\n\nKartepe yukarıda, yaklaşık bin altı yüz metrede. Yol boyunca çıkarken Sapanca Gölü'nü yukarıdan gören bir manzara noktası var ve fotoğraf molası orada veriliyor. Kışın kar için tercih ediliyor ama o dönemde yol koşulları değişken; sabah hava durumuna bakmadan çıkılmıyor.\n\nÜçünü tek güne sığdırmak mümkün: sabah göl kıyısı, öğle Maşukiye, öğleden sonra Kartepe manzarası. Bu, sitedeki en sakin programın neden en sakin olduğunu da açıklıyor — üç durak da birbirine yakın ve yürüyüş isteğe bağlı.",
          ar: "من الناقص أن تُظنّ سبانجا بحيرةً فقط؛ فاليوم الحقيقي يمضي في الغابة جنوب البحيرة. وماشوكية قرية معروفة بمطاعم سمك السلمون المرقّط المقامة على النهر: الطاولات فوق الماء، وصوت الماء يطيل استراحة الغداء، والجو صيفاً أبرد من البحيرة بدرجات.\n\nوشلالات الغابة تُرى بمشي قصير. وقد تكون الدروب ترابية ورطبة؛ والحذاء غير الزلق ينفع، وعربة الطفل لا تسير بسهولة في كل ممرّ.\n\nوكارتيبه في الأعلى على نحو ألف وستمئة متر. وعلى الطريق صعوداً نقطة إطلالة ترى بحيرة سبانجا من فوق، وعندها تكون وقفة التصوير. وتُقصد شتاءً للثلج لكن حال الطريق في تلك الفترة متقلّبة؛ ولا يُخرج دون النظر في حال الطقس صباحاً.\n\nويمكن جمع الثلاثة في يوم واحد: ضفة البحيرة صباحاً، وماشوكية ظهراً، وإطلالة كارتيبه بعد الظهر. وهذا يفسّر أيضاً لماذا هذا أهدأ برنامج لدينا — فالمحطات الثلاث متقاربة والمشي اختياري.",
          en: "Thinking of Sapanca as only a lake sells it short; the real day is spent in the forest south of it. Maşukiye is a village known for the trout restaurants built along the stream: tables set out over the water, the sound of it stretching lunch out, and air a few degrees cooler than at the lake in summer.\n\nThe waterfalls in the forest are reached on short walks. The paths can be earth and damp; shoes with grip help, and a pushchair does not run easily on every one.\n\nKartepe is above, at around 1,600 metres. On the way up there is a viewpoint looking down on Lake Sapanca, and the photo stop is made there. It draws visitors for snow in winter, but road conditions then are changeable; nobody sets off without checking the morning forecast.\n\nAll three fit into one day: the lakeshore in the morning, Maşukiye at midday, the Kartepe view in the afternoon. That also explains why this is the calmest programme we run — the three stops are close together and the walking is optional."
        },
      },
      {
        heading: {
          tr: "Mevsim mevsim Sapanca",
          ar: "سبانجا في كل موسم",
          en: "Sapanca season by season",
        },
        body: {
          tr: "İlkbahar (nisan–mayıs) burada en güzel dönem: orman tamamen yeşil, şelaleler kar suyuyla güçlü, hava yürümeye elverişli. Yağmur ihtimali var ama zaten ormana gidiyorsunuz.\n\nYaz (haziran–ağustos) İstanbul'un sıcağından kaçmak için tercih ediliyor; Maşukiye ormanı gölgeli ve serin. Hafta sonları çok kalabalık — İstanbul'dan gelen günübirlikçiler aynı yolları kullanıyor. Hafta içi gitmek aynı yeri bambaşka gösteriyor.\n\nSonbahar (eylül–kasım) fotoğraf için en iyi zaman: orman renk değiştiriyor, kalabalık dağılıyor ve göl kıyısı sakin.\n\nKış (aralık–mart) Kartepe'de kar demek ve İstanbul'dan en yakın kar burası. Ama göl kıyısı ıslak ve soğuk, orman patikaları çamurlu. Kar hedefiniz değilse kış Sapanca'nın en zayıf mevsimi.\n\nHer mevsim geçerli olan bir not: göle girilmiyor. Sapanca yüzmek için değil, yürümek ve oturmak için bir yer — denize girmek isteyen misafire Antalya ya da Bodrum öneriyoruz.",
          ar: "الربيع (نيسان–أيار) أجمل فترة هنا: الغابة خضراء تماماً، والشلالات قوية بماء الثلج الذائب، والجو يسمح بالمشي. واحتمال المطر قائم لكنك ذاهب إلى الغابة أصلاً.\n\nوالصيف (حزيران–آب) يُفضَّل هرباً من حرّ إسطنبول؛ فغابة ماشوكية ظليلة وباردة. وعطل نهاية الأسبوع مزدحمة جداً — فقادمو اليوم الواحد من إسطنبول يستعملون الطرق نفسها. والذهاب في أيام الأسبوع يُظهر المكان نفسه مختلفاً تماماً.\n\nوالخريف (أيلول–تشرين الثاني) أفضل وقت للتصوير: تتغيّر ألوان الغابة، ويتفرّق الزحام، وتهدأ ضفة البحيرة.\n\nوالشتاء (كانون الأول–آذار) يعني الثلج في كارتيبه، وهو أقرب ثلج إلى إسطنبول. لكن ضفة البحيرة مبتلّة وباردة ودروب الغابة موحلة. وإن لم يكن الثلج هدفك فالشتاء أضعف مواسم سبانجا.\n\nوملاحظة تسري في كل موسم: لا يُسبح في البحيرة. فسبانجا مكان للمشي والجلوس لا للسباحة — ومن يريد السباحة ننصحه بأنطاليا أو بودروم.",
          en: "Spring (April to May) is the finest window here: the forest fully green, the waterfalls strong with snowmelt, the air right for walking. Rain is possible, but you are going into the forest anyway.\n\nSummer (June to August) is chosen as an escape from Istanbul's heat; the Maşukiye forest is shaded and cool. Weekends are very crowded — day-trippers from Istanbul use the same roads. Going midweek shows you the same place transformed.\n\nAutumn (September to November) is the best time for photographs: the forest turns, the crowds disperse and the lakeshore is quiet.\n\nWinter (December to March) means snow at Kartepe, the nearest snow to Istanbul. But the lakeshore is wet and cold and the forest paths muddy. If snow is not your aim, winter is Sapanca's weakest season.\n\nOne note that holds all year: you do not swim in the lake. Sapanca is a place for walking and sitting, not bathing — guests who want to swim we point towards Antalya or Bodrum."
        },
      },
    ],
  },
  {
    slug: "trabzon-uzungol-karadeniz",
    topic: "daytrips",
    image: "/images/places/uzungol.jpg",
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
    seo: {
      title: { tr: "Trabzon, Uzungöl ve Karadeniz Yaylaları", ar: "طرابزون وأوزنجول وهضاب البحر الأسود", en: "Trabzon, Uzungöl and the Black Sea" },
      description: {
        tr: "Uzungöl, Sümela ve Ayder için kaç gün gerekir, yayla sezonu ne zaman açılır, Trabzon'a neden uçakla gidilir — Karadeniz programını kurmadan önce.",
        ar: "كم يوماً يلزم لأوزنجول وسوميلا وآيدر، ومتى يبدأ موسم المرتفعات، ولماذا يُذهب إلى طرابزون جواً — قبل وضع برنامج البحر الأسود.",
        en: "How many days Uzungöl, Sümela and Ayder need, when the highland season opens, and why you fly to Trabzon — before planning a Black Sea trip.",
      },
    },
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
      {
        heading: {
          tr: "Ayder ve yaylalar: Rize'ye geçmek",
          ar: "آيدر والمرتفعات: الانتقال إلى ريزه",
          en: "Ayder and the highlands: crossing into Rize",
        },
        body: {
          tr: "Karadeniz programının en çok istenen parçası yaylalar ve bunların çoğu Trabzon'da değil, Rize sınırlarında. Ayder Yaylası Trabzon'a yaklaşık 200 kilometre ve tek yön üç saat; yani ayrı bir tam gün istiyor.\n\nYayla sezonu haziran sonunda açılıyor ve eylülde kapanıyor. Bu aralığın dışında yollar sisli, soğuk ve zaman zaman kapalı oluyor. Mayısta gelip \"yaylaları göremedik\" diyen misafir her yıl oluyor; tarih konuşulurken bunu baştan söylemek gerekiyor.\n\nAyder'e giden yol Fırtına Vadisi'nden geçiyor: dere boyunca ahşap teraslı restoranlar, kemer köprüler ve çay bahçeleri. Yolun kendisi varış noktası kadar değerli, bu yüzden mola vermeden geçilmiyor.\n\nYaylada hava sahilden belirgin biçimde soğuk: ağustos sabahı on beş derece, akşam daha da düşüyor. İnce bir mont ya da hırka mevsim ne olursa olsun bavulda olmalı.\n\nSezon dışındaysanız gün Uzungöl, Sümela ve sahil çevresine çevriliyor — bu üçü yıl boyunca gezilebiliyor.",
          ar: "أكثر أجزاء برنامج البحر الأسود طلباً هي المرتفعات، ومعظمها ليس في طرابزون بل ضمن حدود ريزه. فمرتفعات آيدر على نحو مئتي كيلومتر من طرابزون وثلاث ساعات في الاتجاه الواحد؛ أي أنها تحتاج يوماً كاملاً مستقلاً.\n\nويبدأ موسم المرتفعات في أواخر حزيران وينتهي في أيلول. وخارج هذا المدى تكون الطرق ضبابية وباردة وقد تُغلق أحياناً. وفي كل عام يأتي ضيف في أيار ثم يقول \"لم نرَ المرتفعات\"؛ ويجب قول ذلك من البداية عند الحديث عن التواريخ.\n\nوالطريق إلى آيدر يمرّ بوادي فرتينا: مطاعم بشرفات خشبية على النهر، وجسور مقوّسة، وبساتين شاي. والطريق نفسه لا يقلّ قيمةً عن الوجهة، ولذلك لا يُقطع بلا وقفات.\n\nوالجو في المرتفعات أبرد بوضوح من الساحل: خمس عشرة درجة صباح آب، وينخفض أكثر مساءً. ويجب أن يكون في الحقيبة معطف خفيف أو سترة في أي موسم.\n\nوإن كنت خارج الموسم يُحوَّل اليوم إلى أوزنجول وسوميلا ومحيط الساحل — وهذه الثلاثة تُزار طوال السنة.",
          en: "The most requested part of a Black Sea programme is the highlands, and most of them are not in Trabzon but inside Rize province. Ayder plateau is about 200 km from Trabzon and three hours each way; it needs a separate full day.\n\nThe highland season opens at the end of June and closes in September. Outside that window the roads are misty, cold and sometimes shut. Every year a guest arrives in May and says \"we couldn't see the highlands\"; it has to be said plainly when dates are discussed.\n\nThe road to Ayder runs up the Fırtına valley: restaurants on wooden terraces over the river, arched stone bridges, tea gardens. The road is worth as much as the destination, which is why it is not driven without stops.\n\nUp on the plateau it is noticeably colder than the coast: fifteen degrees on an August morning, lower in the evening. A light jacket or cardigan belongs in the case whatever the season.\n\nOutside the season the day turns to Uzungöl, Sümela and the coast — all three can be visited all year."
        },
      },
      {
        heading: {
          tr: "Karadeniz mutfağı ve ne alınır",
          ar: "مطبخ البحر الأسود وماذا تشتري",
          en: "Black Sea food, and what to take home",
        },
        body: {
          tr: "Karadeniz mutfağı Türkiye'nin geri kalanından farklı ve iki malzeme etrafında dönüyor: mısır ve karalahana. Muhlama (kuymak) erimiş peynirle mısır unundan yapılıyor ve bölgenin imzası; kahvaltıda ya da öğle yemeğinde bulunuyor, ağır bir yemek olduğu için akşam tercih edilmiyor.\n\nHamsi mevsimi kasım–şubat; bu aylarda tavası, pilavı ve buğulaması her yerde. Yaz aylarında hamsi taze bulunmuyor, o dönemde alabalık öne çıkıyor — dere üstü restoranlarda ızgara olarak.\n\nHamsiköy sütlacı Trabzon–Zigana yolu üzerinde ve tur güzergâhında mola noktası; fırında pişiyor ve üstü kararmış oluyor.\n\nAlınacak şeyler yiyecek: Rize çayı, fındık, mısır unu ve bal. Yayla balı gerçek olduğunda pahalıdır — çok ucuz olan yayla balı değildir. Çay paketlisi her yerde satılıyor ama kaliteli olanı bahçenin kendi satış yerinden çıkıyor.\n\nBu duraklar günü uzatmıyor çünkü zaten yol üstündeler; program kurulurken mola noktaları olarak yerleştiriliyor.",
          ar: "مطبخ البحر الأسود مختلف عن بقية تركيا ويدور حول مادتين: الذرة والكرنب الأسود. والمحلمة (كويماك) تُصنع من دقيق الذرة مع الجبن الذائب وهي توقيع المنطقة؛ تُقدَّم في الفطور أو الغداء، ولا تُفضَّل مساءً لأنها ثقيلة.\n\nوموسم الأنشوجة من تشرين الثاني إلى شباط؛ وفي هذه الأشهر تجدها مقلية وبالأرز ومطهوّة على البخار في كل مكان. ولا تتوفر طازجة في الصيف، فيتقدّم سمك السلمون المرقّط بدلاً منها — مشويّاً في المطاعم المقامة على الأنهار.\n\nوأرز هامسي كوي باللبن على طريق طرابزون–زيغانا وهو محطة استراحة على مسار الجولة؛ يُخبز في الفرن ويكون وجهه محمّراً.\n\nوما يُشترى طعام: شاي ريزه، والبندق، ودقيق الذرة، والعسل. وعسل المرتفعات إن كان حقيقياً فهو غالٍ — والرخيص جداً ليس عسل مرتفعات. والشاي المعبّأ يُباع في كل مكان لكن جيّده يخرج من منفذ البستان نفسه.\n\nوهذه المحطات لا تطيل اليوم لأنها على الطريق أصلاً؛ وتُوضع في البرنامج كنقاط استراحة.",
          en: "Black Sea cooking differs from the rest of Türkiye and turns on two ingredients: maize and black cabbage. Muhlama, made of cornmeal with melted cheese, is the region's signature; it appears at breakfast or lunch and is rarely chosen in the evening because it is heavy.\n\nAnchovy season runs November to February; in those months it is fried, cooked with rice and steamed everywhere. Fresh anchovy is not available in summer, when trout takes its place — grilled at the restaurants built over the streams.\n\nHamsiköy rice pudding sits on the Trabzon–Zigana road and is a stop on the tour route; it is baked and comes with a browned top.\n\nWhat you take home is food: Rize tea, hazelnuts, cornmeal and honey. Genuine highland honey is expensive — very cheap highland honey is not highland honey. Packaged tea is sold everywhere, but the good sort comes from the plantation's own outlet.\n\nThese stops do not lengthen the day because they are already on the road; they are placed in the programme as rest points."
        },
      },
    ],
  },
  {
    slug: "turkiyeye-ne-zaman-gitmeli",
    topic: "planning",
    image: "/images/places/bursa-kis.jpg",
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
    seo: {
      title: { tr: "Türkiye'ye Ne Zaman Gitmeli? Mevsim Rehberi", ar: "متى تزور تركيا؟ دليل المواسم", en: "When to Visit Türkiye: Season Guide" },
      description: {
        tr: "Ay ay hava, kalabalık ve fiyat dengesi. Nisan–mayıs neden en rahat dönem, yaz sıcağında nereye kaçılır, kar için hangi aylar planlanır.",
        ar: "الطقس والزحام وتوازن الأسعار شهراً بشهر. لماذا نيسان وأيار أريح فترة، وإلى أين يُهرب من حر الصيف، وأي الأشهر تُخطَّط لرؤية الثلج.",
        en: "Weather, crowds and prices month by month. Why April–May is the easiest window, where to escape the summer heat, and which months to plan for snow.",
      },
    },
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
      {
        heading: {
          tr: "Ay ay: hangi ayda ne olur",
          ar: "شهراً بشهر: ماذا يحدث في كل شهر",
          en: "Month by month: what each one is like",
        },
        body: {
          tr: "Aralık ve ocak İstanbul'da soğuk ve nemli; sıcaklık genellikle sıfırın üstünde ama rüzgâr hissedileni düşürüyor. Kar her yıl garanti değil, düştüğünde şehir yavaşlıyor. Buna karşılık müzelerde sıra yok, otel fiyatları yılın en düşük seviyesinde ve Uludağ ile Kartepe'de kar bu aylarda kesin.\n\nŞubat ve mart geçiş ayları: hava değişken, bir gün güneş bir gün yağmur. Mart sonunda laleler açmaya başlıyor ve şehir yeşeriyor. Nisan ve mayıs yılın en dengeli iki ayı — gezmek için ideal sıcaklık, açık lale bahçeleri, henüz başlamamış kalabalık.\n\nHaziran sıcak ama katlanılır; deniz mevsimi Antalya ve Bodrum'da açılıyor. Temmuz ve ağustos yılın en sıcak ve en kalabalık dönemi: sahilde kırk dereceyi geçen günler, İstanbul'da nemli bir ağırlık. Bu aylarda Karadeniz yaylaları en mantıklı seçenek — Trabzon'da ağustos sabahı on beş derece.\n\nEylül yazın devamı ama kalabalık azalmış: deniz hâlâ ılık, hava gezilebilir. Ekim yılın ikinci en iyi ayı. Kasımda yağmur artıyor, gün kısalıyor; şehir gezisi için hâlâ iyi, sahil için değil.",
          ar: "كانون الأول وكانون الثاني باردان ورطبان في إسطنبول؛ والحرارة فوق الصفر عادةً لكن الريح تخفض المحسوس. والثلج غير مضمون كل عام، وحين ينزل تبطؤ المدينة. في المقابل لا طوابير في المتاحف، وأسعار الفنادق في أدنى مستوياتها في السنة، والثلج في أولوداغ وكارتيبه مضمون في هذين الشهرين.\n\nوشباط وآذار شهرا انتقال: الجو متقلّب، يوم شمس ويوم مطر. وفي أواخر آذار تبدأ زهور التوليب بالتفتّح وتخضرّ المدينة. ونيسان وأيار أكثر شهري السنة توازناً — حرارة مثالية للتجوّل، وحدائق توليب مفتوحة، وزحام لم يبدأ بعد.\n\nوحزيران حارّ لكنه محتمل؛ ويفتح موسم البحر في أنطاليا وبودروم. وتموز وآب أشدّ الشهور حرّاً وازدحاماً: أيام تتجاوز الأربعين درجة على الساحل، وثقل رطب في إسطنبول. وفي هذين الشهرين تكون مرتفعات البحر الأسود أعقل خيار — فصباح آب في طرابزون خمس عشرة درجة.\n\nوأيلول امتداد للصيف لكن بزحام أقل: البحر ما زال دافئاً والجو يسمح بالتجوّل. وتشرين الأول ثاني أفضل شهور السنة. وفي تشرين الثاني يزيد المطر ويقصر النهار؛ ولا يزال جيداً لجولة المدينة، لا للساحل.",
          en: "December and January are cold and damp in Istanbul; the temperature usually stays above freezing but the wind lowers how it feels. Snow is not guaranteed every year, and the city slows when it falls. In exchange there are no queues at the museums, hotel prices are at their lowest of the year, and snow on Uludağ and Kartepe is certain in these months.\n\nFebruary and March are transitional: changeable weather, sun one day and rain the next. Late March brings the first tulips and the city greens. April and May are the two most balanced months of the year — ideal walking temperatures, tulip gardens open, crowds not yet begun.\n\nJune is hot but bearable; the swimming season opens in Antalya and Bodrum. July and August are the hottest and busiest stretch: days above forty degrees on the coast, a humid weight in Istanbul. In those months the Black Sea highlands are the sensible answer — an August morning in Trabzon is fifteen degrees.\n\nSeptember is summer continued with the crowds thinned: the sea is still warm, the air lets you move. October is the second-best month of the year. In November the rain increases and the days shorten; still good for a city trip, not for the coast."
        },
      },
      {
        heading: {
          tr: "Neye göre seçmeli: deniz, gezi ya da kar",
          ar: "على أي أساس تختار: بحر أم تجوّل أم ثلج",
          en: "Choosing by purpose: sea, sightseeing or snow",
        },
        body: {
          tr: "Ay seçmenin doğru yolu takvime değil amaca bakmak. Üç ayrı tatil var ve üçünün en iyi zamanı farklı.\n\nDeniz için mayıs sonundan ekim başına kadar; su temmuz–eylül arasında en ılık hâlinde. Antalya'nın denizi Ege'den daha uzun süre sıcak kalıyor. Sahil oteli arıyorsanız kasım–nisan arası uygun değil, bazı tesisler kapanıyor.\n\nŞehir gezmek için nisan–mayıs ve eylül–ekim. Bu dört ay hem yürünecek hava veriyor hem müzelerde sıra kısa. Temmuz ve ağustosta İstanbul gezilebilir ama öğle saatleri zor; program sabah erkene ve ikindi sonrasına yayılıyor.\n\nKar için aralık–mart, Uludağ ve Kartepe. İstanbul'da kar yağabilir ama garanti değil ve yağdığında ulaşım aksıyor; kar görmek amacıysa dağa çıkmak gerekiyor.\n\nYaz sıcağından kaçmak için Karadeniz. Temmuz–ağustos Trabzon ve yaylalar Körfez'den gelen misafirin en çok tercih ettiği rota — ama yayla sezonu haziran sonunda açıyor, mayısta yollar hâlâ sisli ve zaman zaman kapalı olabiliyor.",
          ar: "الطريقة الصحيحة لاختيار الشهر هي النظر إلى الغرض لا إلى الرزنامة. فهناك ثلاث إجازات مختلفة، وأفضل وقت لكلٍّ منها مختلف.\n\nللبحر: من أواخر أيار حتى أوائل تشرين الأول؛ والماء في أدفأ حالاته بين تموز وأيلول. وبحر أنطاليا يبقى دافئاً مدة أطول من بحر إيجه. وإن كنت تبحث عن فندق على الشاطئ فما بين تشرين الثاني ونيسان غير مناسب، وبعض المنشآت تُغلق.\n\nولتجوّل المدينة: نيسان–أيار وأيلول–تشرين الأول. فهذه الشهور الأربعة تعطي جوّاً يسمح بالمشي وطوابير قصيرة في المتاحف. ويمكن التجوّل في إسطنبول في تموز وآب لكن ساعات الظهيرة شاقّة؛ ويُوزَّع البرنامج على الصباح الباكر وما بعد العصر.\n\nوللثلج: كانون الأول–آذار، في أولوداغ وكارتيبه. وقد يتساقط الثلج في إسطنبول لكنه غير مضمون، وحين ينزل تتعطّل الحركة؛ فإن كان الثلج هو الغرض فلا بدّ من الصعود إلى الجبل.\n\nوللهرب من حرّ الصيف: البحر الأسود. فطرابزون والمرتفعات في تموز وآب أكثر المسارات تفضيلاً عند ضيوف الخليج — لكن موسم المرتفعات يبدأ في أواخر حزيران، وفي أيار تبقى الطرق ضبابية وقد تُغلق أحياناً.",
          en: "The right way to pick a month is to look at the purpose, not the calendar. There are three different holidays here and the best time for each is different.\n\nFor the sea: late May to early October; the water is at its warmest from July to September. Antalya's sea stays warm longer than the Aegean. If you want a beach hotel, November to April will not do — some properties close.\n\nFor city sightseeing: April-May and September-October. Those four months give you weather you can walk in and short museum queues. Istanbul can be seen in July and August, but the middle of the day is hard going; the programme spreads to the early morning and late afternoon.\n\nFor snow: December to March, on Uludağ and Kartepe. Snow can fall in Istanbul but is not guaranteed, and when it does the city seizes up; if snow is the point, you have to go up the mountain.\n\nTo escape the summer heat: the Black Sea. Trabzon and the highlands in July and August are the route Gulf guests choose most — but the highland season opens at the end of June, and in May the roads are still misty and occasionally closed."
        },
      },
      {
        heading: {
          tr: "Kalabalık ve fiyatın en yüksek olduğu haftalar",
          ar: "الأسابيع الأعلى ازدحاماً وسعراً",
          en: "The busiest and most expensive weeks",
        },
        body: {
          tr: "Takvimde üç dönem diğerlerinden belirgin biçimde ayrılıyor ve tarihiniz esnekse bunları bilmek en büyük tasarrufu sağlıyor.\n\nBirincisi temmuz ortası–ağustos sonu. Hem yurt dışından hem Türkiye içinden talep aynı anda zirvede; sahil otelleri dolu, uçak biletleri yılın en yüksek seviyesinde.\n\nİkincisi ramazan bayramı ve kurban bayramı haftaları. Türkiye'de resmî tatil oldukları için iç turizm patlıyor: oteller doluyor, şehirlerarası yollar tıkanıyor. Körfez'den gelen misafirin tatili de çoğu zaman aynı haftaya denk geldiği için iki talep üst üste biniyor.\n\nÜçüncüsü yılbaşı haftası. İstanbul'da otel fiyatları kısa süreliğine yükseliyor, ardından ocakta yılın en düşük seviyesine iniyor.\n\nBu üç dönemin bir hafta öncesi ya da sonrası aynı tatili belirgin biçimde ucuza ve çok daha rahat yaşatıyor. Rezervasyonu bu tarihlerde aylar öncesinden yapmak gerekiyor; son iki haftada ya seçenek kalmıyor ya fiyat normalin çok üstüne çıkıyor.",
          ar: "تنفصل ثلاث فترات في الرزنامة عن غيرها بوضوح، ومعرفتها تحقّق أكبر توفير إن كانت تواريخك مرنة.\n\nالأولى من منتصف تموز إلى أواخر آب. فالطلب من خارج البلد ومن داخل تركيا في ذروته معاً؛ فنادق الساحل ممتلئة وأسعار الطيران في أعلى مستوياتها في السنة.\n\nوالثانية أسبوعا عيد الفطر وعيد الأضحى. ولأنهما عطلة رسمية في تركيا تنفجر السياحة الداخلية: تمتلئ الفنادق وتزدحم الطرق بين المدن. وغالباً ما تتزامن إجازة ضيوف الخليج مع الأسبوع نفسه، فيتراكب الطلبان.\n\nوالثالثة أسبوع رأس السنة. ترتفع أسعار الفنادق في إسطنبول لفترة قصيرة، ثم تنزل في كانون الثاني إلى أدنى مستوياتها في السنة.\n\nوالأسبوع السابق أو اللاحق لهذه الفترات الثلاث يمنحك الإجازة نفسها بسعر أقل بوضوح وبراحة أكبر بكثير. ويلزم الحجز قبل أشهر في هذه التواريخ؛ ففي آخر أسبوعين لا تبقى خيارات أو يرتفع السعر كثيراً فوق المعتاد.",
          en: "Three stretches stand clearly apart in the calendar, and knowing them delivers the biggest saving if your dates are flexible.\n\nThe first runs from mid-July to the end of August. Demand from abroad and from inside Türkiye peaks together; coastal hotels are full and air fares are at their highest of the year.\n\nThe second is the weeks of Eid al-Fitr and Eid al-Adha. Because they are public holidays in Türkiye, domestic travel explodes: hotels fill and the intercity roads clog. Gulf guests' holidays often fall in the same week, so the two demands stack.\n\nThe third is the week of New Year. Hotel prices in Istanbul rise briefly, then drop in January to their lowest of the year.\n\nThe week before or after any of these three gives you the same holiday noticeably cheaper and far more comfortably. Booking in those dates has to happen months ahead; in the last fortnight either nothing is left or the price is far above normal."
        },
      },
    ],
  },
  {
    slug: "istanbulda-bir-hafta-aile-programi",
    topic: "planning",
    image: "/images/places/galata.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Bir Hafta: Aile Programı", ar: "أسبوع في إسطنبول: برنامج عائلي", en: "One Week in Istanbul: Family Plan" },
      description: {
        tr: "Gün gün yedi günlük program: beş gün şehir, iki gün Sapanca ya da Bursa. Çocuklu ailelerde günde kaç durak gezilir ve şehir dışı hangi güne konur.",
        ar: "برنامج سبعة أيام يوماً بيوم: خمسة أيام للمدينة ويومان لسبانجا أو بورصة. كم محطة في اليوم مع الأطفال، وفي أي يوم يُوضع الخروج من المدينة.",
        en: "A seven-day plan, day by day: five days in the city, two for Sapanca or Bursa. How many stops a day with children, and where the day trips belong.",
      },
    },
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
      {
        heading: {
          tr: "Programı yeniden sıralamak gereken günler",
          ar: "الأيام التي يلزم فيها إعادة ترتيب البرنامج",
          en: "The days that force you to reorder the plan",
        },
        body: {
          tr: "Yukarıdaki sıralama iyi bir çerçeve ama takvimin kendisi bazı günleri yerinden oynatıyor.\n\nBirincisi kapalı günler. Müzelerin ve sarayların bir kısmının haftalık kapalı günü var; Dolmabahçe Sarayı pazartesi günleri ziyarete kapalı ve gişe on yediye kadar açık. Bu bilgi zaman zaman değişiyor, bu yüzden bir bloga değil kurumun kendi sayfasına bakmak gerekiyor. Programı kurmadan önce görmek istediğiniz üç-dört yeri listeleyip kapalı günlerini yan yana yazmak, haftanın iskeletini kendiliğinden belirliyor.\n\nİkincisi cuma. Camiler ibadet vakitlerinde ziyarete kapanıyor ve cuma öğle namazı bunun en uzunu. Ayasofya ve Sultanahmet Camii'ni cuma günü öğleden önceye ya da ikindiden sonraya almak, kapıda beklemeyi ortadan kaldırıyor.\n\nÜçüncüsü hava. İstanbul'da yağmur genellikle bir gün sürmüyor ama o günü açık havada geçirmek anlamsız. Boğaz turu ve şehir dışı günleri, kapalı mekân günleriyle — Kapalıçarşı, müzeler, alışveriş merkezi — yer değiştirebilecek biçimde planlanmalı. Bu esnekliği baştan kurmak, sonradan program bozmaktan kolay.\n\nDördüncüsü ramazan ve bayram. Bu dönemde şehir daha kalabalık, akşamları daha hareketli, gündüzleri bazı lokantalar kapalı olabiliyor. Sahur ve iftar saatleri günü tamamen yeniden kuruyor.",
          ar: "الترتيب السابق إطار جيّد، لكن التقويم نفسه يزحزح بعض الأيام عن مواضعها.\n\nأولها أيام الإغلاق. فبعض المتاحف والقصور له يوم إغلاق أسبوعي؛ وقصر دولما بهجة مغلق للزيارة أيام الاثنين وشبّاك التذاكر مفتوح حتى الخامسة. وهذه المعلومة تتغيّر أحياناً، ولذلك يلزم النظر في صفحة المؤسسة نفسها لا في مدوّنة. وقبل بناء البرنامج، اكتب ثلاثة أو أربعة أماكن تريد رؤيتها وضع أيام إغلاقها إلى جوارها، فيتحدّد هيكل الأسبوع من تلقاء نفسه.\n\nوثانيها الجمعة. فالمساجد تُغلق أمام الزيارة في أوقات العبادة، وصلاة الجمعة أطولها. ووضع آيا صوفيا وجامع السلطان أحمد يوم الجمعة قبل الظهر أو بعد العصر يُلغي الانتظار على الباب.\n\nوثالثها الطقس. فالمطر في إسطنبول لا يدوم يوماً كاملاً عادةً، لكن قضاء ذلك اليوم في الهواء الطلق لا معنى له. فينبغي تخطيط يوم جولة البوسفور وأيام خارج المدينة بحيث يمكن تبديلها بأيام الأماكن المغلقة — السوق المسقوف والمتاحف والمركز التجاري. وبناء هذه المرونة من البداية أسهل من إفساد البرنامج لاحقاً.\n\nورابعها رمضان والعيد. ففي هذه الفترة تكون المدينة أكثر ازدحاماً وأكثر حيوية في المساء، وقد تُغلق بعض المطاعم نهاراً. ومواعيد السحور والإفطار تعيد بناء اليوم كلّه.",
          en: "The order above is a good frame, but the calendar itself moves some days out of place.\n\nFirst, closing days. Some museums and palaces have a weekly closing day; Dolmabahçe Palace is closed to visitors on Mondays, with the ticket office open until five. This information changes from time to time, so check the institution's own page rather than a blog. Before building the plan, list the three or four places you most want to see and write their closing days beside them — the skeleton of the week decides itself.\n\nSecond, Friday. Mosques close to visitors during prayer times, and Friday midday prayer is the longest. Putting Hagia Sophia and the Blue Mosque before noon or after mid-afternoon on a Friday removes the wait at the door.\n\nThird, the weather. Rain in Istanbul rarely lasts a whole day, but spending that day outdoors makes no sense. The Bosphorus cruise and the out-of-town days should be planned so they can swap with indoor days — the Grand Bazaar, museums, a shopping centre. Building that flexibility in from the start is easier than unpicking the plan later.\n\nFourth, Ramadan and the Eids. The city is busier then, livelier in the evenings, and some restaurants may be closed during the day. Suhoor and iftar times rebuild the day completely."
        },
      },
      {
        heading: {
          tr: "Çocukla tempo: bir günde kaç durak",
          ar: "الإيقاع مع الأطفال: كم محطة في اليوم",
          en: "Pace with children: how many stops in a day",
        },
        body: {
          tr: "Bir haftalık programın çökmesinin en sık sebebi güne fazla şey koymak. Kural basit: küçük çocuklu bir ailede günde iki ana durak.\n\nBir ana durak yaklaşık iki-üç saat demek — geliş, sıra, gezme ve mola dahil. Üçüncü durak kâğıt üzerinde sığıyor, gerçekte sığmıyor: çocuk yoruluyor, sıcakta huysuzlanıyor ve akşam programı da bozuluyor.\n\nGünün ortasına otele dönmek zaman kaybı gibi görünüyor ama değil. İki saatlik bir ara — uyku ya da sadece serinleme — akşamı kurtarıyor. Otelin merkeze yakın olması bu yüzden manzaradan önemli; öğle arası için kırk dakika yol harcayan bir aile bunu yapamıyor.\n\nMolayı nereye vereceğinizi önceden bilmek de işe yarıyor. Tarihî yarımadada Gülhane Parkı ve çay bahçeleri, Boğaz kıyısında sahil boyu, Beyoğlu'nda ara sokaklardaki küçük meydanlar. Ayakta mola vermek mola değil.\n\nYemek saatleri de tempoyu belirliyor. Aç bir çocukla müze sırasında beklemek programın en kötü yirmi dakikası. Ana duraklardan önce yemek, sonra değil.\n\nSon olarak: bir günü tamamen boş bırakın. Yedi günün altısını doldurun, birini havuza, parka ya da hiçbir şeye ayırın. Bu boş gün, önceki günlerde kaçırdığınız şeyin de yedeği oluyor.",
          ar: "أكثر ما يُسقط برنامج الأسبوع هو حشو اليوم بأكثر مما يحتمل. والقاعدة بسيطة: محطتان رئيسيتان في اليوم للعائلة التي معها أطفال صغار.\n\nوالمحطة الرئيسية تعني ساعتين إلى ثلاث — يدخل فيها الوصول والانتظار والتجوال والاستراحة. والمحطة الثالثة تتّسع على الورق ولا تتّسع في الواقع: فالطفل يتعب ويتضجّر في الحرّ ويفسد برنامج المساء أيضاً.\n\nوالعودة إلى الفندق منتصف اليوم تبدو إضاعةً للوقت وليست كذلك. فاستراحة ساعتين — نوماً أو مجرّد تبريد — تنقذ المساء. ولهذا يكون قرب الفندق من المركز أهمّ من الإطلالة؛ فالعائلة التي تنفق أربعين دقيقة طريقاً لاستراحة الظهر لا تستطيع فعل ذلك.\n\nومعرفة مكان الاستراحة مسبقاً تنفع أيضاً. ففي شبه الجزيرة التاريخية حديقة كولخانه ومقاهي الشاي، وعلى ساحل البوسفور امتداد الكورنيش، وفي بي أوغلو الساحات الصغيرة في الأزقّة. والاستراحة وقوفاً ليست استراحة.\n\nومواعيد الطعام تحدّد الإيقاع كذلك. فالانتظار في طابور متحف مع طفل جائع أسوأ عشرين دقيقة في البرنامج. فليكن الطعام قبل المحطات الرئيسية لا بعدها.\n\nوأخيراً: اترك يوماً فارغاً تماماً. املأ ستة من سبعة، وخصّص واحداً للمسبح أو الحديقة أو لا شيء. وهذا اليوم الفارغ يصير احتياطاً لما فاتك في الأيام السابقة.",
          en: "The commonest reason a week-long plan collapses is putting too much into a day. The rule is simple: two main stops a day for a family with small children.\n\nA main stop means roughly two to three hours — arrival, queue, visit and a break included. A third stop fits on paper and not in reality: the child tires, gets fretful in the heat, and the evening goes with it.\n\nGoing back to the hotel in the middle of the day looks like lost time. It is not. A two-hour break — a nap, or simply cooling off — saves the evening. That is why a central hotel matters more than a view; a family that spends forty minutes travelling for a midday break cannot take one.\n\nKnowing in advance where you will stop also helps. On the historic peninsula, Gülhane Park and the tea gardens; along the Bosphorus, the waterfront; in Beyoğlu, the small squares off the side streets. A break taken standing up is not a break.\n\nMealtimes set the pace too. Waiting in a museum queue with a hungry child is the worst twenty minutes of the plan. Eat before the main stops, not after.\n\nFinally: leave one day completely empty. Fill six of the seven and give one to the pool, a park, or nothing at all. That empty day doubles as the spare for whatever you missed earlier in the week."
        },
      },
      {
        heading: {
          tr: "Yokuş, taş sokak ve bebek arabası",
          ar: "المنحدرات والأزقّة الحجرية وعربة الطفل",
          en: "Hills, cobbles and pushchairs",
        },
        body: {
          tr: "Haritada kısa görünen mesafeler İstanbul'da her zaman kısa değil, çünkü şehir tepeler üzerine kurulu.\n\nSultanahmet'in sokaklarının çoğu arnavut kaldırımı. Bebek arabası bu zeminde ağır ilerliyor ve tekerlek küçükse takılıyor. Galata ve Beyoğlu tarafında ana mesele yokuş: Karaköy'den Galata Kulesi'ne çıkış kısa ama dik. Tünel füniküleri bu yokuşun bir bölümünü alıyor ve çoğu ziyaretçi varlığından haberdar değil.\n\nToplu taşımada durum karışık. Metro istasyonlarının çoğunda asansör var; tramvay duraklarına çoğunlukla rampayla iniliyor; ama eski vapur iskelelerinde ve bazı üst geçitlerde merdiven kaçınılmaz.\n\nPratik sonuç: iki yaşın altındaki çocuk için kanguru taşıyıcı, İstanbul'da bebek arabasından çoğu zaman daha rahat. Arabayı tercih ediyorsanız büyük tekerlekli ve tek elle katlanabilen bir model fark yaratıyor.\n\nYetişkinler için tek bir madde: rahat, kapalı ve kaymayan ayakkabı. Bir haftalık programda günde altı-sekiz kilometre yürünüyor ve bunun önemli bölümü düz olmayan zeminde. Yeni alınmış bir ayakkabıyla İstanbul'a gelmek, ikinci günü topuk yarasıyla geçirmek demek.\n\nSıcak aylarda su ve şapka listenin başında; tarihî yarımadada gölge sanıldığından az.",
          ar: "المسافات التي تبدو قصيرة على الخريطة ليست قصيرة دائماً في إسطنبول، لأن المدينة قائمة على تلال.\n\nفمعظم أزقّة السلطان أحمد مرصوفة بالحجارة. وعربة الطفل تتقدّم بثقل على هذه الأرضية وتتعثّر إن كانت عجلاتها صغيرة. وفي جهة غلطة وبي أوغلو تكون المسألة الأساسية الانحدار: فالصعود من كاراكوي إلى برج غلطة قصير لكنه حادّ. وقطار تونيل المائل يختصر جزءاً من هذا الصعود، ومعظم الزوار لا يعلمون بوجوده.\n\nوالحال في النقل العام مختلطة. ففي معظم محطات المترو مصاعد؛ ويُنزَل إلى محطات الترام بمنحدرات في الغالب؛ لكن الدرج لا مفرّ منه في أرصفة العبّارات القديمة وبعض الجسور العلوية.\n\nوالنتيجة العملية: حمّالة الصدر للطفل دون السنتين أريح في إسطنبول من العربة في أغلب الأحيان. وإن فضّلت العربة فإن طرازاً بعجلات كبيرة يُطوى بيد واحدة يُحدث فرقاً.\n\nوللكبار بند واحد: حذاء مريح مغلق غير قابل للانزلاق. ففي برنامج أسبوع يُمشى ستة إلى ثمانية كيلومترات يومياً، وقسم كبير منها على أرض غير مستوية. والقدوم إلى إسطنبول بحذاء جديد يعني قضاء اليوم الثاني بجرح في العقب.\n\nوفي الأشهر الحارّة يتصدّر الماءُ والقبعةُ القائمةَ؛ فالظلّ في شبه الجزيرة التاريخية أقلّ مما يُظنّ.",
          en: "Distances that look short on a map are not always short in Istanbul, because the city is built on hills.\n\nMost of Sultanahmet's streets are cobbled. A pushchair moves heavily over that surface and catches if the wheels are small. Around Galata and Beyoğlu the main issue is the gradient: the climb from Karaköy up to the Galata Tower is short but steep. The Tünel funicular takes part of that climb off you, and most visitors do not know it exists.\n\nPublic transport is mixed. Most metro stations have lifts; tram stops are usually reached by ramp; but stairs are unavoidable at the older ferry piers and some footbridges.\n\nThe practical upshot: for a child under two, a carrier is usually more comfortable in Istanbul than a pushchair. If you prefer the pushchair, a model with large wheels that folds one-handed makes a real difference.\n\nFor adults, one item: comfortable, closed, non-slip shoes. A week's programme means six to eight kilometres of walking a day, much of it on uneven ground. Arriving in Istanbul in newly bought shoes means spending day two with a blistered heel.\n\nIn the hot months, water and a hat head the list; there is less shade on the historic peninsula than people expect."
        },
      },
      {
        heading: {
          tr: "Bir hafta değil de beş gün ya da on gün olursa",
          ar: "وإن كانت المدّة خمسة أيام أو عشرة بدل الأسبوع",
          en: "If it is five days or ten instead of a week",
        },
        body: {
          tr: "Yedi gün İstanbul için rahat bir süre ama herkesin takvimi buna uymuyor. Programı kısaltmanın ve uzatmanın doğru sırası var.\n\nBeş güne inerken kesilecek yer şehir dışı günleridir, tarihî yarımada değil. Bursa ya da Sapanca'yı çıkarıp iki günü şehre bırakmak, her günü yarım bırakmaktan iyi. Beş günlük düzen şöyle oluyor: iki gün tarihî yarımada, bir gün Boğaz ve Beyoğlu, bir gün tek bir şehir dışı ya da Adalar, bir gün alışveriş ve serbest.\n\nÜç güne inildiğinde bambaşka bir program gerekiyor; onu ayrı bir rehberde ele aldık.\n\nOn güne çıkarken hata, aynı listeye daha çok durak eklemek olur. Doğrusu tempoyu düşürmek ve mesafeyi açmak: ikinci bir şehir dışı gün, Asya yakasına bir tam gün, bir de hiç plan yapılmayan iki gün. On günlük programlarda misafirlerin en çok memnun kaldığı kısım genelde plansız bıraktığımız günler oluyor.\n\nOn günden uzun kalıyorsanız İstanbul'u tek merkez yapmak yerine ikinci bir şehre geçmek daha iyi sonuç veriyor — Antalya, Bodrum, Trabzon ya da Bursa. Bu noktada program çok şehirli bir plana dönüşüyor ve uçuş ile konaklamanın birlikte kurulması gerekiyor.\n\nBiz bu planı kaç kişi olduğunuza, çocukların yaşına ve hangi tarihlerde geleceğinize göre çıkarıyoruz. Programı yazıp gönderiyoruz; beğenmezseniz değiştiriyoruz, bir bedeli yok.",
          ar: "سبعة أيام مدّة مريحة لإسطنبول، لكن تقويم كل إنسان لا يوافق ذلك. ولاختصار البرنامج وتمديده ترتيب صحيح.\n\nفعند النزول إلى خمسة أيام يكون الحذف من أيام خارج المدينة لا من شبه الجزيرة التاريخية. فإخراج بورصة أو سبانجا وترك يومين للمدينة خير من ترك كل يوم ناقصاً. ويصير نظام الخمسة أيام هكذا: يومان في شبه الجزيرة التاريخية، ويوم للبوسفور وبي أوغلو، ويوم لرحلة واحدة خارج المدينة أو للجزر، ويوم للتسوّق والوقت الحرّ.\n\nوعند النزول إلى ثلاثة أيام يلزم برنامج مختلف تماماً؛ وقد تناولناه في دليل مستقلّ.\n\nوعند الصعود إلى عشرة أيام يكون الخطأ إضافة محطات أكثر إلى القائمة نفسها. والصواب خفض الإيقاع وتوسيع المسافة: يوم ثانٍ خارج المدينة، ويوم كامل في الجانب الآسيوي، ويومان بلا خطة أصلاً. وفي برامج العشرة أيام يكون أكثر ما يرضي الضيوف عادةً هو الأيام التي تركناها بلا تخطيط.\n\nوإن كانت إقامتك أطول من عشرة أيام فالانتقال إلى مدينة ثانية يعطي نتيجة أفضل من جعل إسطنبول مركزاً وحيداً — أنطاليا أو بودروم أو طرابزون أو بورصة. وعند هذه النقطة يتحوّل البرنامج إلى خطة متعدّدة المدن ويلزم بناء الطيران والإقامة معاً.\n\nونحن نستخرج هذه الخطة بحسب عددكم وأعمار الأطفال والتواريخ التي ستأتون فيها. نكتب البرنامج ونرسله؛ وإن لم يعجبك غيّرناه، ولا مقابل لذلك."
          ,
          en: "Seven days is a comfortable length for Istanbul, but not everyone's calendar agrees. There is a right order for cutting the plan down and for stretching it.\n\nWhen coming down to five days, cut the out-of-town days, not the historic peninsula. Dropping Bursa or Sapanca and leaving two days for the city beats leaving every day half-finished. A five-day shape looks like this: two days on the historic peninsula, one for the Bosphorus and Beyoğlu, one for a single day trip or the islands, and one for shopping and free time.\n\nAt three days you need an entirely different plan; we have covered that in a separate guide.\n\nWhen stretching to ten days, the mistake is adding more stops to the same list. The right move is to slow the pace and widen the distance: a second day trip, a full day on the Asian side, and two days with no plan at all. On ten-day programmes, the part guests are happiest with is usually the days we left unplanned.\n\nIf you are staying longer than ten days, moving to a second city works better than making Istanbul your only base — Antalya, Bodrum, Trabzon or Bursa. At that point the plan becomes a multi-city one, and flights and hotels have to be built together.\n\nWe draw this plan up according to how many you are, the children's ages and the dates you are coming. We write the programme and send it; if you do not like it we change it, at no cost."
        },
      },
    ],
  },
  {
    slug: "arapca-konusan-sofor-ve-rehber",
    topic: "practical",
    image: "/images/chauffeur.jpg",
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
    seo: {
      title: { tr: "Arapça Konuşan Şoför ve Rehber", ar: "سائق ومرشد يتحدث العربية", en: "Arabic-Speaking Driver and Guide" },
      description: {
        tr: "Dil, fiyattan sonra seyahat konforunu en çok belirleyen şey. Karşılamada, alışverişte ve turda nerede işe yarar, rehber ile şoför arasındaki fark nedir.",
        ar: "اللغة هي العامل الأهم بعد السعر في راحة الرحلة. أين تنفع عند الاستقبال والتسوق والجولة، وما الفرق بين المرشد والسائق.",
        en: "After price, language shapes the trip more than anything. Where it helps at arrivals, shopping and on tour, and how a guide differs from a driver.",
      },
    },
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
      {
        heading: {
          tr: "Rehber belgesi ne demek, kim ne yapabilir",
          ar: "ماذا تعني رخصة الإرشاد ومن يفعل ماذا",
          en: "What a guiding licence means, and who may do what",
        },
        body: {
          tr: "Türkiye'de turist rehberliği belgeye bağlı bir meslek. Müzelerde ve ören yerlerinde grup gezdirmek, tarihi anlatmak belgeli rehberin işi; belgesiz kişinin bu işi yapması yasal değil.\n\nŞoförlük ayrı bir iş. Şoför sizi otelden alır, güzergâhı bilir, park eder, bekler ve gün sonunda otele bırakır. Arapça konuşan bir şoför yolda sohbet eder, nereye gittiğinizi anlatır, restoran ve alışveriş konusunda fikir verir — ama müze içinde anlatım yapmaz.\n\nİkisinin karıştırılması misafirin en sık yaşadığı hayal kırıklığı: \"Arapça rehber\" diye ayarlanan hizmet aslında Arapça konuşan bir şoför çıkıyor ve müzede kimse anlatmıyor.\n\nBiz ikisini ayrı söylüyoruz. Şoförümüz Arapça konuşuyor ve bu her turda geçerli. Belgeli rehber isteyen misafire ayrıca ayarlıyoruz ve bunu program kurulurken netleştiriyoruz — sürpriz olmaması için.\n\nBirçok müzede sesli rehber cihazı da var ve Arapça seçeneği bulunuyor; belgeli rehber almak istemeyen ama anlatım isteyen misafir için pratik bir orta yol.",
          ar: "الإرشاد السياحي في تركيا مهنة مرتبطة برخصة. فمرافقة المجموعات داخل المتاحف والمواقع الأثرية وشرح التاريخ عمل المرشد المرخّص؛ ولا يجوز قانوناً لغير المرخّص أن يقوم به.\n\nوالسياقة عمل آخر. فالسائق يأخذك من الفندق، ويعرف المسار، ويركن وينتظر، ويعيدك إلى الفندق في آخر اليوم. والسائق الذي يتحدث العربية يحادثك في الطريق ويخبرك إلى أين تذهبون ويعطيك رأياً في المطاعم والتسوّق — لكنه لا يشرح داخل المتحف.\n\nوالخلط بينهما أكثر ما يسبّب خيبة أمل للضيف: فالخدمة التي رُتّبت باسم \"مرشد عربي\" تتبيّن سائقاً يتحدث العربية، ولا يشرح أحد في المتحف.\n\nونحن نقول الأمرين منفصلين. سائقنا يتحدث العربية وهذا سارٍ في كل جولة. ومن يريد مرشداً مرخّصاً نرتّبه له إضافةً، ونوضّح ذلك عند وضع البرنامج — كي لا تكون مفاجأة.\n\nوفي كثير من المتاحف جهاز إرشاد صوتي وفيه خيار عربي؛ وهو حلّ وسط عملي لمن لا يريد مرشداً مرخّصاً لكنه يريد شرحاً.",
          en: "Tourist guiding in Türkiye is a licensed profession. Taking groups through museums and archaeological sites and explaining the history is the licensed guide's work; it is not legal for an unlicensed person to do it.\n\nDriving is a separate job. The driver collects you from the hotel, knows the route, parks, waits and returns you at the end of the day. An Arabic-speaking driver talks with you on the road, tells you where you are going and offers opinions on restaurants and shopping — but does not give commentary inside a museum.\n\nConfusing the two is the disappointment guests meet most often: a service arranged as an \"Arabic guide\" turns out to be an Arabic-speaking driver, and nobody explains anything in the museum.\n\nWe state the two separately. Our driver speaks Arabic and that holds on every tour. For guests who want a licensed guide we arrange one in addition, and we make it clear when the programme is built — so there is no surprise.\n\nMany museums also have audio guides with an Arabic option; a practical middle way for guests who do not want a licensed guide but do want commentary."
        },
      },
      {
        heading: {
          tr: "Dil neden ilk günden sonra da önemli",
          ar: "لماذا تبقى اللغة مهمة بعد اليوم الأول",
          en: "Why language still matters after the first day",
        },
        body: {
          tr: "Karşılamada dilin işe yaradığı açık. Ama asıl fark seyahatin ortasında ortaya çıkıyor — plan değiştiğinde.\n\nYağmur başladığında, bir müze beklenmedik şekilde kapalı olduğunda, çocuk yorulduğunda ya da yemek yeri değiştirmek istediğinizde bunu anlatmanız gerekiyor. İşaretle anlatılabilecek şeyler sınırlı; \"beş dakika daha bekleyelim\" ile \"burayı iptal edip otele dönelim\" arasındaki fark kelime istiyor.\n\nAlışverişte de öyle. Pazarlık yapmak, bir ürünün ne olduğunu sormak, kargo ve iade koşullarını öğrenmek dil işi. Şoförün araya girmesi gerekmiyor ama gerektiğinde girebilmesi rahatlatıyor.\n\nBir de acil durum var: eczane, hastane, kaybolan pasaport. Bu durumların hiçbiri sık yaşanmıyor ama yaşandığında aracı olmayan misafir çok zorlanıyor.\n\nBizim tarafımızda rezervasyon da Arapça yürüyor: WhatsApp'tan yazışma, program taslağı, fiyat teyidi ve varış öncesi bilgilendirme — hepsi aynı dilde. Yolculuk başlamadan önce yanlış anlaşılan bir ayrıntı, yolculuk sırasında düzeltilmesi en zor şey.",
          ar: "من الواضح أن اللغة تنفع عند الاستقبال. لكن الفرق الحقيقي يظهر في منتصف الرحلة — حين تتغيّر الخطة.\n\nفحين يبدأ المطر، أو يكون متحف مغلقاً على غير المتوقّع، أو يتعب الطفل، أو تريد تغيير مكان الطعام، عليك أن تشرح ذلك. وما يمكن إيصاله بالإشارة محدود؛ والفرق بين \"لننتظر خمس دقائق أخرى\" و\"لنلغِ هذا ونعد إلى الفندق\" يحتاج كلمات.\n\nوكذلك في التسوّق. فالمساومة، والسؤال عن ماهية منتج، ومعرفة شروط الشحن والإرجاع، كلها عمل لغوي. ولا يلزم أن يتدخّل السائق، لكن قدرته على التدخّل عند الحاجة تريح.\n\nوهناك أيضاً الحالات الطارئة: صيدلية، مستشفى، جواز سفر ضائع. ولا يحدث شيء من هذا كثيراً، لكن حين يحدث يشقّ الأمر كثيراً على من لا وسيط له.\n\nومن جهتنا يجري الحجز بالعربية أيضاً: المراسلة عبر واتساب، ومسودّة البرنامج، وتأكيد السعر، والإعلام قبل الوصول — كلها باللغة نفسها. فالتفصيل الذي يُساء فهمه قبل بدء الرحلة هو أصعب ما يُصحَّح أثناءها.",
          en: "That language helps at the meeting point is obvious. But the real difference shows in the middle of a trip — when the plan changes.\n\nWhen it starts raining, when a museum is unexpectedly closed, when a child is tired, when you want to change where you eat, you have to explain it. What can be conveyed by gesture is limited; the difference between \"let's wait another five minutes\" and \"cancel this and take us back to the hotel\" needs words.\n\nShopping is the same. Haggling, asking what something is, learning the shipping and return terms — all language work. The driver does not need to step in, but being able to when needed is a relief.\n\nThen there are emergencies: a pharmacy, a hospital, a lost passport. None of these happen often, but when they do a guest without an intermediary struggles badly.\n\nOn our side the booking runs in Arabic too: the WhatsApp exchange, the draft programme, the price confirmation and the pre-arrival briefing — all in the same language. A detail misunderstood before the journey starts is the hardest thing to fix once it has."
        },
      },
    ],
  },
  {
    slug: "bursa-uludag-gunubirlik",
    topic: "daytrips",
    image: "/images/places/bursa-koy-sokak.jpg",
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
    seo: {
      title: { tr: "Bursa ve Uludağ Günübirlik Rehberi", ar: "دليل بورصة وأولوداغ ليوم واحد", en: "Bursa and Uludağ Day Trip" },
      description: {
        tr: "Feribotla yaklaşık 2,5 saat. Uludağ teleferiği, Ulu Cami, Koza Han ve Cumalıkızık; kar mevsimi ne zaman ve tek güne neler sığar.",
        ar: "نحو ساعتين ونصف بالعبّارة. تلفريك أولوداغ والجامع الكبير وخان الحرير وجومالي كيزيك؛ ومتى موسم الثلج وما يتّسع له يوم واحد.",
        en: "About 2.5 hours by ferry. The Uludağ cable car, the Grand Mosque, Koza Han and Cumalıkızık; when the snow season runs and what fits in one day.",
      },
    },
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
      {
        heading: {
          tr: "Günü nasıl kurmalı: saat saat",
          ar: "كيف تبني اليوم: ساعة بساعة",
          en: "How to shape the day, hour by hour",
        },
        body: {
          tr: "Günübirlik Bursa'nın tamamı yolun nasıl planlandığına bağlı. Sabah erken çıkmak şart: sekizde yola çıkan bir grup on buçukta Bursa'da oluyor, dokuz buçukta çıkan öğlene kalıyor ve gün yarıya iniyor.\n\nÖnerilen sıra şu: önce teleferik, çünkü sis ve rüzgâr genellikle öğleden sonra artıyor ve seferler o saatlerde daha çok durduruluyor. Zirvede bir-bir buçuk saat yeterli.\n\nİnişten sonra şehir merkezi: Ulu Cami, Yeşil Türbe ve Koza Han yürüme mesafesinde. Koza Han'ın avlusundaki çay bahçesi öğle molasının doğal yeri; İskender kebap da bu bölgede.\n\nGün Cumalıkızık'ta bitiyor. Köy merkeze on kilometre ve ikindi ışığı taş sokaklarda en güzel hâlinde. Kahvaltı sunan avlular öğleden sonra da açık oluyor.\n\nDönüş için feribot saatini önceden ayarlamak gerekiyor; son seferi kaçırmak karayoluyla iki buçuk saat demek. Bu yüzden gün planı feribot saatine göre kuruluyor, tersi değil.",
          ar: "يوم بورصة الواحد يعتمد كلّه على كيفية تخطيط الطريق. والخروج باكراً ضروري: فمن ينطلق في الثامنة يكون في بورصة في العاشرة والنصف، ومن ينطلق في التاسعة والنصف يصل ظهراً فينكمش اليوم إلى نصفه.\n\nوالترتيب المقترح: التلفريك أولاً، لأن الضباب والريح يشتدّان بعد الظهر عادةً وتُوقَف الرحلات في تلك الساعات أكثر. وساعة إلى ساعة ونصف في القمة تكفي.\n\nوبعد النزول مركز المدينة: الجامع الكبير والضريح الأخضر وخان كوزا على مسافة مشي. ومقهى الشاي في فناء خان كوزا هو المكان الطبيعي لاستراحة الغداء؛ وكباب الإسكندر في هذه المنطقة أيضاً.\n\nوينتهي اليوم في جومالي كيزيك. والقرية على عشرة كيلومترات من المركز، وضوء العصر أجمل ما يكون على الأزقّة الحجرية. والأفنية التي تقدّم الفطور تبقى مفتوحة بعد الظهر أيضاً.\n\nويلزم ضبط موعد العبّارة للعودة مسبقاً؛ ففوات آخر رحلة يعني ساعتين ونصف برّاً. ولذلك يُبنى برنامج اليوم على موعد العبّارة لا العكس.",
          en: "A day trip to Bursa depends entirely on how the travel is planned. Leaving early is essential: a group setting off at eight is in Bursa by half past ten; one leaving at half past nine arrives at midday and the day halves.\n\nThe suggested order: the cable car first, because mist and wind usually pick up in the afternoon and services are stopped more often then. An hour to an hour and a half at the top is enough.\n\nAfter coming down, the city centre: the Grand Mosque, the Green Tomb and Koza Han are within walking distance. The tea garden in Koza Han's courtyard is the natural place for a midday break; İskender kebab is in the same area.\n\nThe day ends at Cumalıkızık. The village is ten kilometres from the centre and the late-afternoon light is at its best on the stone lanes. The courtyards that serve breakfast stay open into the afternoon.\n\nThe return ferry time has to be fixed in advance; missing the last sailing means two and a half hours by road. So the day is built around the ferry time, not the other way round."
        },
      },
      {
        heading: {
          tr: "Bir gece kalmak neyi değiştirir",
          ar: "ماذا يغيّر المبيت ليلة",
          en: "What staying a night changes",
        },
        body: {
          tr: "Günübirlik Bursa ana başlıkları görmeye yetiyor ama günün iki buçuk saati yolda geçiyor ve tempo sıkışık. Bir gece kalmak bu tabloyu değiştiriyor.\n\nİkinci gün ortaya çıkan seçenekler: Uludağ'a teleferikle çıkıp yukarıda daha uzun kalmak, kaplıcalara gitmek (Çekirge bölgesi termal otelleriyle biliniyor), İznik'e geçmek ya da Cumalıkızık'ta kahvaltıyı acele etmeden yapmak.\n\nKüçük çocuklu ailelerde fark daha büyük: günübirlikte çocuk yolda yoruluyor ve ikinci yarıda program işlemiyor. Bir gecelik konaklama günü ikiye bölüyor ve iki gün de rahat geçiyor.\n\nBursa'da konaklama İstanbul'a göre belirgin biçimde uygun; termal otelleri de aynı bütçede daha iyi karşılık veriyor.\n\nAltı günlük İstanbul–Bursa programımız bu ikinci düzene göre kurulu: dört gün İstanbul, ardından Bursa'da bir gece. Günübirlik isteyen misafire de on saatlik tur veriyoruz — ikisi ayrı hizmet ve hangisinin size uyduğunu tarih ve kişi sayısına bakarak birlikte seçiyoruz.",
          ar: "رحلة اليوم الواحد إلى بورصة تكفي لرؤية العناوين الرئيسية، لكن ساعتين ونصف من اليوم تمضي على الطريق والإيقاع ضيّق. والمبيت ليلة يغيّر هذه الصورة.\n\nوالخيارات التي تظهر في اليوم الثاني: الصعود بالتلفريك إلى أولوداغ والبقاء فوق مدة أطول، أو الذهاب إلى الحمّامات المعدنية (منطقة تشكيرغه معروفة بفنادقها الحرارية)، أو الانتقال إلى إزنيك، أو تناول الفطور في جومالي كيزيك دون استعجال.\n\nوالفرق أكبر عند العائلات ذات الأطفال الصغار: ففي رحلة اليوم الواحد يتعب الطفل على الطريق ولا يعمل البرنامج في نصفه الثاني. والمبيت ليلة يقسم اليوم إلى قسمين فيمرّ اليومان بأريحية.\n\nوالإقامة في بورصة أنسب بوضوح منها في إسطنبول؛ وفنادقها الحرارية تعطي مقابلاً أفضل بالميزانية نفسها.\n\nوبرنامجنا إسطنبول–بورصة من ستة أيام مبنيّ على هذا الترتيب الثاني: أربعة أيام في إسطنبول ثم ليلة في بورصة. ونقدّم لمن يريد رحلة يوم واحد جولةً من عشر ساعات — وهما خدمتان مختلفتان، ونختار معاً أيّهما يناسبك بالنظر إلى التاريخ وعدد الأشخاص.",
          en: "A day trip to Bursa is enough for the headlines, but two and a half hours of the day go on the road and the pace is tight. Staying a night changes that picture.\n\nThe options that open up on a second day: taking the cable car up Uludağ and staying longer at the top, going to the thermal baths (the Çekirge district is known for its spa hotels), crossing to İznik, or having breakfast at Cumalıkızık without hurrying.\n\nThe difference is larger for families with small children: on a day trip the child tires on the road and the second half of the programme stops working. A night splits the day in two and both days pass comfortably.\n\nAccommodation in Bursa is noticeably kinder than in Istanbul, and its thermal hotels give better value at the same budget.\n\nOur six-day Istanbul–Bursa programme is built on that second pattern: four days in Istanbul, then a night in Bursa. For guests who want the day trip we run a ten-hour tour — they are two different services, and we choose together which suits you by looking at the dates and the number of people."
        },
      },
    ],
  },
  {
    slug: "turkiyede-alisveris-rehberi",
    topic: "practical",
    image: "/images/tours/istanbul.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Alışveriş Rehberi", ar: "دليل التسوق في إسطنبول", en: "Shopping in Istanbul: A Guide" },
      description: {
        tr: "Kapalıçarşı ve Mısır Çarşısı, Nişantaşı ve Bağdat Caddesi, alışveriş merkezleri. Nerede pazarlık geçer, ne nerede alınır ve poşetler nasıl taşınır.",
        ar: "البازار الكبير والسوق المصري، ونيشانتاشي وشارع بغداد، والمولات. أين تنفع المساومة، وما يُشترى من أين، وكيف تُحمل المشتريات.",
        en: "The Grand Bazaar and Spice Bazaar, Nişantaşı and Bağdat Avenue, the malls. Where haggling works, what to buy where, and how to carry it all.",
      },
    },
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
      {
        heading: {
          tr: "Şehir şehir: nerede ne alınır",
          ar: "مدينة مدينة: ماذا تشتري وأين",
          en: "City by city: what to buy where",
        },
        body: {
          tr: "İstanbul her şeyi bulabileceğiniz yer ama her şeyin en iyisi burada değil. Kapalıçarşı halı, altın, deri ve hediyelik için; Mısır Çarşısı baharat, lokum ve kuruyemiş için. Nişantaşı ve İstinye Park markalar için, Osmanbey ise toptan tekstilin merkezi — perakende alıcıya da satan mağazalar var ama pazarlık ve nakit beklenir.\n\nBursa ipek ve havlu demek. Koza Han yüzyıllardır ipek çarşısı ve hâlâ ipek eşarp satılıyor; Bursa havlusu ve bornozu Türkiye'nin geri kalanından daha ucuza ve daha iyi kalitede bulunuyor. Kestane şekeri de burada alınır.\n\nAntalya'da alışveriş turistik: Kaleiçi'nde hediyelik, büyük alışveriş merkezlerinde marka. Deri ve takı mağazaları turlarla anlaşmalı olabiliyor; acele etmeden ve karşılaştırarak almak gerekiyor.\n\nBodrum el yapımı sandalet, deniz temalı takı ve butik giyim için. Fiyatlar İstanbul'un üstünde çünkü sezonluk ve turistik.\n\nTrabzon'da alınacak şey yiyecek: çay, fındık, bal ve mısır unu. Yayla balı gerçek olduğunda pahalıdır — çok ucuz olan yayla balı değildir.",
          ar: "إسطنبول مكان تجد فيه كل شيء، لكن ليس فيها أفضل كل شيء. السوق المسقوف للسجاد والذهب والجلد والهدايا؛ وسوق المصريين للبهارات والملبن والمكسّرات. ونيشان تاشي وإستينيه بارك للماركات، أما عثمان بيه فمركز الجملة للنسيج — وفيه متاجر تبيع للأفراد أيضاً لكن يُتوقّع فيها المساومة والنقد.\n\nوبورصة تعني الحرير والمناشف. فخان كوزا سوق حرير منذ قرون وما زال يُباع فيه الوشاح الحريري؛ ومنشفة بورصة وبرنسها أرخص وأجود مما في بقية تركيا. والكستناء المحلّاة تُشترى هنا أيضاً.\n\nوالتسوّق في أنطاليا سياحي: هدايا في كالي إيتشي، وماركات في المولات الكبيرة. وقد تكون متاجر الجلد والمجوهرات متعاقدة مع الجولات؛ فينبغي الشراء دون استعجال وبعد المقارنة.\n\nوبودروم للصنادل اليدوية والمجوهرات ذات الطابع البحري والملابس البوتيك. والأسعار أعلى من إسطنبول لأنها موسمية وسياحية.\n\nوما يُشترى في طرابزون طعام: الشاي والبندق والعسل ودقيق الذرة. وعسل المرتفعات إن كان حقيقياً فهو غالٍ — والرخيص جداً ليس عسل مرتفعات.",
          en: "Istanbul is where you can find everything, but not where everything is best. The Grand Bazaar is for carpets, gold, leather and souvenirs; the Spice Bazaar for spices, Turkish delight and nuts. Nişantaşı and İstinye Park are for brands, while Osmanbey is the wholesale textile district — some shops sell retail too, but haggling and cash are expected.\n\nBursa means silk and towels. Koza Han has been a silk market for centuries and still sells silk scarves; Bursa towels and bathrobes are cheaper and better than elsewhere in Türkiye. Candied chestnuts are bought here too.\n\nShopping in Antalya is touristic: souvenirs in Kaleiçi, brands in the large malls. Leather and jewellery shops may have arrangements with tours; buy without hurrying and after comparing.\n\nBodrum is for handmade sandals, sea-themed jewellery and boutique clothing. Prices run above Istanbul because it is seasonal and touristic.\n\nWhat you buy in Trabzon is food: tea, hazelnuts, honey and cornmeal. Genuine highland honey is expensive — very cheap highland honey is not highland honey."
        },
      },
      {
        heading: {
          tr: "Fiyat, pazarlık ve vergi iadesi",
          ar: "السعر والمساومة واسترداد الضريبة",
          en: "Price, haggling and tax refunds",
        },
        body: {
          tr: "Pazarlık her yerde geçerli değil. Alışveriş merkezlerinde, zincir mağazalarda ve markette fiyat sabit; pazarlık etmeye çalışmak yalnız zaman kaybı. Kapalıçarşı, semt pazarları ve küçük hediyelik dükkânlarında ise pazarlık beklenen bir şey ve yapmadığınızda fazla ödemiş oluyorsunuz.\n\nPazarlığın basit kuralı: ilk fiyatı duyduğunuzda düşünmek için zaman alın ve iki dükkân daha gezin. Aynı ürünün fiyatı çarşı içinde belirgin biçimde değişebiliyor ve satıcı sizin ilk gördüğünüz dükkândan almanızı bekliyor. Kararlıysanız ayrılmaya yönelmek çoğu zaman fiyatı düşürüyor.\n\nBüyük alışverişlerde vergi iadesi (Tax Free) hakkınız var. Belirli bir tutarın üstünde alışverişte mağazadan fatura ve iade formu isteyin; havalimanında çıkıştan önce gümrükte onaylatıp ödemeyi alıyorsunuz. Formu almayı unutmak sonradan telafi edilmiyor, bu yüzden alışveriş anında sormak gerekiyor.\n\nSahte marka konusunda net olalım: Türkiye'de taklit ürün satan yerler var ve bunlar ucuz. Yurt dışına çıkarken gümrükte sorun çıkarabiliyor; bilerek alıyorsanız bunu hesaba katın.",
          ar: "المساومة لا تصلح في كل مكان. ففي المولات والمتاجر السلسلة والبقالات السعر ثابت، ومحاولة المساومة مضيعة للوقت. أما في السوق المسقوف وأسواق الأحياء ومحلات الهدايا الصغيرة فالمساومة أمر متوقّع، ومن لا يساوم يكون قد دفع زائداً.\n\nوقاعدة المساومة بسيطة: حين تسمع السعر الأول خذ وقتاً للتفكير وطُف على متجرين آخرين. فسعر المنتج نفسه قد يختلف بوضوح داخل السوق، والبائع يتوقّع أن تشتري من أول متجر رأيته. وإن كنت حازماً فالاتّجاه نحو المغادرة يخفّض السعر غالباً.\n\nولك حقّ استرداد الضريبة (Tax Free) في المشتريات الكبيرة. اطلب من المتجر الفاتورة واستمارة الاسترداد عند تجاوز مبلغ معيّن؛ ثم تصدّقها في الجمارك قبل المغادرة في المطار وتستلم المبلغ. ونسيان أخذ الاستمارة لا يُعوَّض لاحقاً، ولذلك يجب السؤال لحظة الشراء.\n\nولنكن واضحين في مسألة الماركات المقلّدة: توجد في تركيا أماكن تبيع منتجات مقلّدة وهي رخيصة. وقد تسبّب مشكلة في الجمارك عند الخروج من البلد؛ فإن كنت تشتريها عن علم فاحسب ذلك.",
          en: "Haggling does not apply everywhere. In malls, chain stores and supermarkets the price is fixed; trying to bargain only wastes time. In the Grand Bazaar, neighbourhood markets and small souvenir shops, haggling is expected and not doing it means overpaying.\n\nThe simple rule: when you hear the first price, take time to think and visit two more shops. The price of the same item can vary noticeably within the bazaar, and the seller expects you to buy from the first shop you saw. If you are firm, moving to leave usually brings the price down.\n\nOn large purchases you are entitled to a tax refund. Above a certain amount, ask the shop for the invoice and the refund form; you have it stamped at customs before departure at the airport and collect the payment. Forgetting to take the form cannot be fixed afterwards, so ask at the moment of purchase.\n\nLet us be plain about counterfeits: there are places in Türkiye selling fake branded goods and they are cheap. They can cause problems at customs when leaving the country; if you buy them knowingly, factor that in."
        },
      },
    ],
  },
  {
    slug: "istanbulda-helal-yemek-rehberi",
    topic: "practical",
    image: "/images/places/kadikoy.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Helal Yemek Rehberi", ar: "دليل الطعام الحلال في إسطنبول", en: "Halal Food in Istanbul: A Guide" },
      description: {
        tr: "Türkiye'de et ürünleri yaygın olarak helal. Nelere dikkat edilir, hangi semtte ne bulunur, Türk kahvaltısı ve Arap mutfağı nerede yenir.",
        ar: "اللحوم في تركيا حلال في الغالب. ما الذي يُنتبه إليه، وماذا يوجد في كل حي، وأين يُتناول الفطور التركي والمطبخ العربي.",
        en: "Meat in Türkiye is widely halal. What to watch for, what each district offers, and where to find Turkish breakfast and Arabic cuisine.",
      },
    },
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
      {
        heading: {
          tr: "Restoranda ne sorulur",
          ar: "ماذا تسأل في المطعم",
          en: "What to ask in a restaurant",
        },
        body: {
          tr: "Türkiye'de et zaten ağırlıklı olarak helal kesim ve domuz eti restoranların büyük çoğunluğunda hiç bulunmuyor. Yine de emin olmak isteyen misafirin soracağı iki net soru var: yemekte alkol kullanılıyor mu ve tatlıda jelatin var mı.\n\nAlkol bazı soslarda ve özellikle uluslararası mutfaklarda pişirme sırasında kullanılabiliyor; geleneksel Türk mutfağında bu alışkanlık yok ama otel restoranlarında ve fine dining mekânlarda sorulmaya değer. \"Bu yemekte şarap var mı\" sorusu Türkçe bilinen bir soru ve garsonlar yadırgamıyor.\n\nJelatin tatlıda ve bazı sütlü ürünlerde geçiyor. Türk tatlılarının çoğu (baklava, künefe, sütlaç, kazandibi) jelatin içermiyor ama pastane ürünlerinde ve paketli tatlılarda bulunabiliyor.\n\nAlkol servisi yapan bir restoran yemeğin helal olmadığı anlamına gelmiyor; ikisi ayrı şeyler. Alkolsüz bir ortam istiyorsanız bunu ayrıca sormanız gerekiyor — birçok aile restoranı ve kebapçı alkol servisi yapmıyor.",
          ar: "اللحم في تركيا مذبوح حلالاً في الغالب أصلاً، ولحم الخنزير لا يوجد في الغالبية العظمى من المطاعم. ومع ذلك فللضيف الذي يريد التأكّد سؤالان واضحان: هل يُستخدم الكحول في الطبخ، وهل في الحلوى جيلاتين.\n\nقد يُستخدم الكحول في بعض الصلصات وخاصة في المطابخ العالمية أثناء الطهي؛ وهذه العادة غير موجودة في المطبخ التركي التقليدي، لكنها تستحق السؤال في مطاعم الفنادق وأماكن الطعام الفاخر. وسؤال \"هل في هذا الطبق نبيذ\" سؤال معروف بالتركية ولا يستغربه النُّدُل.\n\nوالجيلاتين يوجد في الحلويات وبعض منتجات الألبان. ومعظم الحلويات التركية (البقلاوة والكنافة والأرز باللبن والكازانديبي) لا تحتوي جيلاتين، لكنه قد يوجد في منتجات المخابز والحلويات المعبّأة.\n\nوتقديم المطعم للكحول لا يعني أن طعامه غير حلال؛ فهما أمران مختلفان. وإن أردت مكاناً بلا كحول فعليك السؤال عن ذلك تحديداً — وكثير من المطاعم العائلية ومحلات الكباب لا تقدّم الكحول.",
          en: "Meat in Türkiye is predominantly halal-slaughtered already, and pork is absent from the great majority of restaurants. Still, a guest who wants certainty has two clear questions: is alcohol used in the cooking, and is there gelatine in the dessert.\n\nAlcohol can appear in some sauces and especially in international kitchens during cooking; traditional Turkish cooking does not use it, but it is worth asking in hotel restaurants and fine-dining places. \"Is there wine in this dish\" is a familiar question in Turkish and waiters do not find it odd.\n\nGelatine turns up in desserts and some dairy products. Most Turkish desserts — baklava, künefe, rice pudding, kazandibi — contain none, but it can be present in patisserie items and packaged sweets.\n\nA restaurant serving alcohol does not mean its food is not halal; the two are separate matters. If you want a place without alcohol you have to ask about that specifically — many family restaurants and kebab houses do not serve it."
        },
      },
      {
        heading: {
          tr: "Otel kahvaltısı ve çocuk menüsü",
          ar: "فطور الفندق وقائمة الأطفال",
          en: "Hotel breakfast and children's menus",
        },
        body: {
          tr: "Türk otel kahvaltısı açık büfe ve içeriği Körfez'den gelen misafire tanıdık geliyor: peynir çeşitleri, zeytin, domates, salatalık, yumurta, bal, reçel, ekmek. Şarküteri ürünleri (salam, sosis) sunulduğunda genellikle dana eti oluyor ama emin olmak için sormakta fayda var; birçok otel bu ürünlerin yanına içeriğini yazıyor.\n\nÇocuklu ailelerin en sık sorduğu şey sıcak süt ve sade yemek bulunup bulunmadığı. Açık büfede süt neredeyse her zaman var; sade pilav, makarna ve haşlanmış patates çoğu otelde bulunuyor. Baharatsız yemek istendiğinde mutfağa iletiliyor.\n\nÖğle ve akşam öğünleri için esnaf lokantası en pratik çözüm: vitrinde ne olduğunu görerek seçiyorsunuz, dil bilmek gerekmiyor ve fiyat turistik restoranın üçte biri. Bu lokantalarda alkol servisi olmuyor ve yemekler genellikle sade — çocuklu aile için en rahat seçenek.\n\nTurlarımızda öğle yemeği helal seçenek sunan yerlerde veriliyor ve bunu program kurulurken söylüyoruz; özel bir kısıtınız varsa (alerji, glutensiz) önceden bildirmeniz yeterli.",
          ar: "فطور الفنادق التركية بوفيه مفتوح، ومحتواه مألوف لضيف الخليج: أصناف الجبن والزيتون والطماطم والخيار والبيض والعسل والمربّى والخبز. وحين تُقدَّم منتجات اللحوم المصنّعة (السلامي والنقانق) تكون من لحم البقر عادةً، لكن يُستحسن السؤال للتأكّد؛ وكثير من الفنادق يكتب المحتوى بجانبها.\n\nوأكثر ما تسأل عنه العائلات ذات الأطفال هو توفّر الحليب الساخن والطعام غير المتبّل. والحليب موجود في البوفيه دائماً تقريباً؛ والأرز السادة والمعكرونة والبطاطا المسلوقة متوفرة في معظم الفنادق. وعند طلب طعام بلا بهارات يُبلَّغ المطبخ.\n\nوللغداء والعشاء يبقى المطعم الشعبي أعمل حلّ: تختار وأنت ترى ما في الواجهة، ولا تحتاج لغة، والسعر ثلث المطعم السياحي. ولا تُقدَّم الكحول في هذه المطاعم والطعام فيها سادة عادةً — وهو أريح خيار للعائلة ذات الأطفال.\n\nوفي جولاتنا يكون الغداء في أماكن تقدّم خيارات حلال، ونقول ذلك عند وضع البرنامج؛ وإن كان لديك قيد خاص (حساسية، خلوّ من الغلوتين) فيكفي إخبارنا مسبقاً.",
          en: "Turkish hotel breakfast is a buffet and its contents feel familiar to a Gulf guest: several cheeses, olives, tomato, cucumber, eggs, honey, jam, bread. Where cured meats are offered — salami, sausage — they are usually beef, but it is worth asking to be sure; many hotels label the contents beside them.\n\nWhat families with children ask most is whether there is warm milk and plain food. Milk is almost always on the buffet; plain rice, pasta and boiled potatoes are available at most hotels. A request for food without spices is passed to the kitchen.\n\nFor lunch and dinner a neighbourhood restaurant is the most practical answer: you choose by seeing what is in the display, no language is needed, and the price is a third of a tourist restaurant. These places do not serve alcohol and the food is usually plain — the easiest option for a family with children.\n\nOn our tours lunch is taken at places offering halal options, and we say so when the programme is built; if you have a specific restriction — an allergy, gluten-free — telling us in advance is enough."
        },
      },
    ],
  },
  {
    slug: "bogaz-turu-rehberi",
    topic: "daytrips",
    image: "/images/places/bogaz-vapur.jpg",
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
    seo: {
      title: { tr: "Boğaz Turu Rehberi: Tekne ve Saatler", ar: "دليل جولة البوسفور: القارب والتوقيت", en: "Bosphorus Cruise Guide: Boats and Times" },
      description: {
        tr: "Kısa tur 1,5–2 saat, tam gün turu Anadolu Kavağı'na kadar. Eminönü, Kabataş ve Beşiktaş kalkışları, ne görülür ve en iyi saat neden ikindi.",
        ar: "الجولة القصيرة 1.5–2 ساعة، وجولة اليوم الكامل حتى أناضولو كواغي. الانطلاق من إمينونو وكاباتاش وبشيكتاش، وماذا يُرى، ولماذا العصر أفضل وقت.",
        en: "Short cruises run 1.5–2 hours, full-day ones reach Anadolu Kavağı. Departures from Eminönü, Kabataş and Beşiktaş, what you see, and why late afternoon wins.",
      },
    },
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
          tr: "Eminönü, Kabataş ve Beşiktaş en yaygın kalkış noktaları. Sultanahmet'te kalanlar için Eminönü yürüme mesafesinde; Taksim'de kalanlar için Kabataş daha yakın. Turumuzdaki Boğaz gezisi bu tarifeli tur teknesiyle yapılıyor; sizi kalkış iskelesine biz bırakıyoruz.",
          ar: "إمينونو وكاباتاش وبشيكتاش هي أكثر نقاط الانطلاق شيوعاً. فمن يقيم في السلطان أحمد تكون إمينونو على مسافة مشي منه، ومن يقيم في تقسيم تكون كاباتاش أقرب إليه. وجولة البوسفور ضمن جولتنا تكون بقارب الجولات المجدولة هذا؛ ونحن نوصلك إلى رصيف الانطلاق.",
          en: "Eminönü, Kabataş and Beşiktaş are the most common departure points. If you are staying in Sultanahmet, Eminönü is within walking distance; from Taksim, Kabataş is closer. The Bosphorus trip inside our tour uses this scheduled tour boat; we drive you to the departure pier.",
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
      {
        heading: {
          tr: "Tekne türleri: vapur, tur teknesi, özel tekne",
          ar: "أنواع القوارب: العبّارة، قارب الجولات، القارب الخاص",
          en: "Kinds of boat: ferry, tour boat, private boat",
        },
        body: {
          tr: "Şehir hattı vapuru en ucuz ve en yerel seçenek. Eminönü'nden kalkıyor, İstanbulkart ile biniliyor ve iki yakayı da yakından geçiyor. Dezavantajı kalabalık olması ve saat çizelgesine bağlı kalmanız; oturacak yer bulmak yoğun saatlerde zor.\n\nTur teknesi turistler için düzenlenen tarifeli sefer. Eminönü ve Kabataş iskelelerinden kalkıyor, genellikle iki saat sürüyor ve Rumeli Hisarı ya da ikinci köprüye kadar çıkıp dönüyor. Güverte açık, anons var, fotoğraf için en rahatı. Bilet iskeleden alınıyor.\n\nÖzel tekne kiralamak üçüncü yol; grup halinde ya da özel bir gün için tercih ediliyor ve fiyatı diğer ikisinden belirgin biçimde yüksek. Biz özel yat ya da tekne kiralama hizmeti vermiyoruz — turumuzdaki Boğaz gezisi tarifeli tur teknesiyle yapılıyor.\n\nHangisini seçeceğiniz amaca bağlı: manzarayı görmek için vapur yeterli, rahat fotoğraf ve anlatım için tur teknesi, kalabalıktan uzak durmak için sabahın erken saatleri.",
          ar: "عبّارة الخطوط البلدية أرخص الخيارات وأكثرها محليةً. تنطلق من إمينونو، ويُركب فيها ببطاقة إسطنبول، وتمرّ قريباً من الضفتين. وعيبها الازدحام والتقيّد بجدول المواعيد؛ وإيجاد مقعد صعب في ساعات الذروة.\n\nوقارب الجولات رحلة مجدولة منظّمة للسيّاح. ينطلق من مرفأي إمينونو وكاباتاش، ويستغرق ساعتين عادةً، ويصعد حتى قلعة روملي أو الجسر الثاني ثم يعود. وسطحه مكشوف وفيه شرح صوتي، وهو الأريح للتصوير. والتذكرة تُشترى من المرفأ.\n\nواستئجار قارب خاص هو الطريق الثالث؛ يُفضَّل للمجموعات أو ليوم خاص، وسعره أعلى بوضوح من الاثنين الآخرين. ونحن لا نقدّم خدمة تأجير اليخوت أو القوارب الخاصة — ورحلة البوسفور في جولتنا تكون بقارب جولات مجدول.\n\nواختيارك يعتمد على الغرض: العبّارة تكفي لرؤية المنظر، وقارب الجولات للتصوير المريح والشرح، وساعات الصباح الباكر للابتعاد عن الزحام.",
          en: "The municipal ferry is the cheapest and most local option. It leaves from Eminönü, you board with an İstanbulkart, and it passes close to both shores. The drawbacks are the crowds and being tied to a timetable; finding a seat at busy hours is hard.\n\nA tour boat is a scheduled service organised for visitors. It leaves from the Eminönü and Kabataş piers, usually takes two hours, and runs up to Rumeli Fortress or the second bridge and back. The deck is open, there is commentary, and it is the easiest for photographs. Tickets are bought at the pier.\n\nChartering a private boat is the third route; chosen for groups or a special day, and priced noticeably above the other two. We do not offer private yacht or boat charter — the Bosphorus trip in our tour uses a scheduled tour boat.\n\nWhich to choose depends on the purpose: the ferry is enough to see the view, a tour boat for comfortable photographs and commentary, and the early morning for staying away from the crowds."
        },
      },
      {
        heading: {
          tr: "Yolun üstünde ne var: iskele iskele",
          ar: "ماذا على الطريق: مرفأً مرفأ",
          en: "What is along the way, pier by pier",
        },
        body: {
          tr: "Eminönü'nden kalkan bir tekne önce Galata Köprüsü'nün altından geçiyor; sağda tarihi yarımada silueti, solda Karaköy. Ardından Tophane ve Kabataş.\n\nDolmabahçe Sarayı sudan görüldüğünde asıl cephesiyle görünüyor — kara tarafından bakınca bu cephe görünmez. Hemen sonrasında Beşiktaş ve Ortaköy; Ortaköy Camii'nin köprünün ayağıyla birlikte göründüğü kare Boğaz'ın en çok fotoğraflanan noktası.\n\nKöprüyü geçtikten sonra iki yakada yalılar başlıyor: ahşap, çoğu on dokuzuncu yüzyıldan kalma kıyı konakları. Anadolu yakasında Kuzguncuk ve Beylerbeyi, Avrupa yakasında Arnavutköy ve Bebek.\n\nRumeli Hisarı çoğu turun dönüş noktası; Fatih Sultan Mehmet'in kuşatma öncesi yaptırdığı kale, sudan bakınca boyutu anlaşılıyor. Karşısında Anadolu Hisarı, daha küçük ve daha eski.\n\nDönüşte ışık değişiyor ve aynı kıyı bambaşka görünüyor — bu yüzden gidiş yönünde oturduğunuz taraf dönüşte de aynı kalıyorsa yer değiştirmek işe yarıyor.",
          ar: "القارب المنطلق من إمينونو يمرّ أولاً تحت جسر غلطة؛ على اليمين ظلّ شبه الجزيرة التاريخية وعلى اليسار كاراكوي. ثم توب هانه وكاباتاش.\n\nوقصر دولمة بهجة يُرى من الماء بواجهته الأصلية — وهذه الواجهة لا تُرى من جهة البرّ. ويليه مباشرةً بشيكتاش وأورتاكوي؛ والمشهد الذي يظهر فيه جامع أورتاكوي مع قاعدة الجسر هو أكثر نقاط البوسفور تصويراً.\n\nوبعد عبور الجسر تبدأ القصور الخشبية على الضفتين: بيوت ساحلية خشبية معظمها من القرن التاسع عشر. في الجهة الآسيوية كوزغونجوك وبيلربيي، وفي الأوروبية أرناؤوط كوي وبيبك.\n\nوقلعة روملي نقطة عودة معظم الجولات؛ وهي القلعة التي بناها محمد الفاتح قبل الحصار، ويُدرك حجمها من الماء. ويقابلها حصن الأناضول، أصغر وأقدم.\n\nوفي العودة يتغيّر الضوء فتبدو الضفة نفسها مختلفة تماماً — ولذلك يفيد تغيير المقعد إن كنت ستبقى في الجهة نفسها التي جلست فيها ذهاباً.",
          en: "A boat leaving Eminönü passes first under the Galata Bridge; the silhouette of the historic peninsula on one side, Karaköy on the other. Then Tophane and Kabataş.\n\nSeen from the water, Dolmabahçe Palace shows its true façade — the one you cannot see from the land side. Immediately after come Beşiktaş and Ortaköy; the frame in which the Ortaköy Mosque appears with the foot of the bridge is the most photographed point on the Bosphorus.\n\nPast the bridge the waterfront mansions begin on both shores: wooden houses, most of them nineteenth century. Kuzguncuk and Beylerbeyi on the Asian side, Arnavutköy and Bebek on the European.\n\nRumeli Fortress is the turning point of most tours; built by Mehmed the Conqueror before the siege, its scale only registers from the water. Opposite stands Anadolu Fortress, smaller and older.\n\nOn the way back the light changes and the same shore looks entirely different — which is why moving seats is worth it if you would otherwise stay on the same side."
        },
      },
    ],
  },
  {
    slug: "cocuklu-ailelerle-istanbul",
    topic: "practical",
    image: "/images/places/lale-bahce.jpg",
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
    seo: {
      title: { tr: "Çocuklu Ailelerle İstanbul", ar: "إسطنبول مع الأطفال", en: "Istanbul with Children" },
      description: {
        tr: "Bebek arabası tarihî yarımadada neden zor, günde kaç durak yeterli, çocuk koltuğu nasıl istenir ve hangi duraklar küçüklerle iyi geçer.",
        ar: "لماذا تصعب عربة الأطفال في شبه الجزيرة التاريخية، وكم محطة تكفي في اليوم، وكيف يُطلب مقعد الطفل، وأي المحطات تناسب الصغار.",
        en: "Why a pushchair is hard in the historic peninsula, how many stops a day is enough, how to request a child seat, and which stops suit small children.",
      },
    },
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
      {
        heading: {
          tr: "Bebek arabası nerede işe yarar, nerede yaramaz",
          ar: "أين تنفع عربة الطفل وأين لا تنفع",
          en: "Where a pushchair helps and where it does not",
        },
        body: {
          tr: "İstanbul'un tarihi bölgesi arnavut kaldırımı ve eğimli. Sultanahmet çevresinde bebek arabası kullanılabiliyor ama taşlar arabayı sarsıyor ve bazı sokaklarda merdiven çıkıyor. Kapalıçarşı'nın içi kalabalık olduğunda araba manevra yapamıyor.\n\nBuna karşılık Boğaz kıyısı yolu, Emirgan Korusu, alışveriş merkezleri ve modern semtlerin kaldırımları rahat. Vapurlarda araba sorun değil; metroda asansör var ama her istasyonda değil, bazı eski istasyonlarda yalnız merdiven bulunuyor.\n\nKüçük çocuklu ailelerin çoğu ikili bir çözüm kuruyor: kısa mesafeler için kanguru ya da sırt taşıyıcı, uzun yürüyüşler ve dinlenme için katlanabilir hafif araba. Büyük ve ağır arabalar İstanbul'da avantaj değil.\n\nAracın gün boyu yanınızda olması bu tabloyu değiştiriyor: araba, bavul ve alışveriş poşetleri araçta kalıyor, siz yalnız gezdiğiniz noktada iniyorsunuz. Çocuklu ailelerin özel araç talebinin asıl sebebi konfor değil, bu taşıma yükü.",
          ar: "المنطقة التاريخية في إسطنبول مرصوفة بالحصى ومائلة. ويمكن استعمال عربة الطفل حول السلطان أحمد لكن الحجارة تهزّ العربة وفي بعض الأزقّة درج. وداخل السوق المسقوف لا تستطيع العربة المناورة حين يشتدّ الزحام.\n\nفي المقابل فطريق ضفة البوسفور وحديقة أمير جان والمولات وأرصفة الأحياء الحديثة مريحة. ولا مشكلة في العبّارات؛ وفي المترو مصاعد لكن ليس في كل محطة، وبعض المحطات القديمة فيها درج فقط.\n\nومعظم العائلات ذات الأطفال الصغار تضع حلاً مزدوجاً: حمّالة صدر أو ظهر للمسافات القصيرة، وعربة خفيفة قابلة للطيّ للمشي الطويل والراحة. أما العربات الكبيرة الثقيلة فليست ميزة في إسطنبول.\n\nووجود السيارة معك طوال اليوم يغيّر هذه الصورة: تبقى العربة والحقائب وأكياس التسوّق في السيارة، وتنزل أنت عند نقطة التجوّل فقط. والسبب الحقيقي لطلب العائلات ذات الأطفال سيارةً خاصة ليس الرفاهية بل هذا الحمل.",
          en: "The historic district of Istanbul is cobbled and sloping. A pushchair can be used around Sultanahmet but the stones shake it and some lanes have steps. Inside the Grand Bazaar, a pushchair cannot manoeuvre when it is crowded.\n\nBy contrast the Bosphorus shore road, Emirgan Park, the malls and the pavements of modern districts are easy. Ferries are no problem; the metro has lifts but not at every station, and some older ones have only stairs.\n\nMost families with small children arrive at a two-part answer: a carrier for short distances, and a light folding pushchair for long walks and rest. Large heavy pushchairs are not an advantage in Istanbul.\n\nHaving the car with you all day changes this picture: the pushchair, luggage and shopping bags stay in the vehicle and you get out only at the place you are visiting. The real reason families with children ask for a private car is not comfort but this carrying load."
        },
      },
      {
        heading: {
          tr: "Günü çocuğa göre kurmak",
          ar: "بناء اليوم على مقاس الطفل",
          en: "Building the day around the child",
        },
        body: {
          tr: "Çocuklu bir programın en sık yapılan hatası yetişkin programını alıp kısaltmak. İşe yarayan yöntem farklı: günü bir ana durak ve bir serbest alan olarak kurmak. Sabah bir müze ya da tarihi yer, öğleden sonra park, sahil ya da havuz. Üst üste iki müze küçük çocukta çalışmıyor.\n\nÖğle uykusu olan bir çocuk varsa o saati programa yazın. Araç içinde uyumak çoğu zaman işe yarıyor; şehirler arası ya da uzun bir yol o saate denk getirildiğinde gün kayıp olmuyor.\n\nYemek saatlerini erkene alın. Türk restoranlarında akşam yemeği geç başlıyor; çocuklu aile için altı-yedi civarı hem sakin hem hızlı servis anlamına geliyor.\n\nÇocukların en çok sevdiği duraklar genellikle en tarihi olanlar değil: vapur yolculuğu, Boğaz'da martı beslemek, teleferik, akvaryum ve büyük parklar. Bunlardan birini her güne koymak, tarihi yerleri de sorunsuz gezdiriyor.\n\nYanınıza su, atıştırmalık ve yedek kıyafet alın — İstanbul'da market her yerde var ama sıcak bir günde sıra beklemek istemezsiniz.",
          ar: "أكثر خطأ في برنامج فيه أطفال هو أخذ برنامج الكبار واختصاره. والطريقة الناجحة مختلفة: أن يُبنى اليوم على محطة رئيسية واحدة ومساحة حرّة. متحف أو مكان تاريخي صباحاً، وحديقة أو شاطئ أو مسبح بعد الظهر. ومتحفان متتاليان لا ينفعان مع طفل صغير.\n\nوإن كان لديك طفل ينام في الظهيرة فاكتب تلك الساعة في البرنامج. والنوم داخل السيارة ينفع غالباً؛ فإذا وافقت تلك الساعةُ طريقاً طويلاً أو انتقالاً بين المدن لم يضع اليوم.\n\nوقدّم مواعيد الطعام. فالعشاء في المطاعم التركية يبدأ متأخراً؛ والسادسة أو السابعة تعني للعائلة ذات الأطفال هدوءاً وخدمة أسرع.\n\nوأكثر المحطات التي يحبها الأطفال ليست أكثرها تاريخيةً عادةً: رحلة العبّارة، وإطعام النوارس في البوسفور، والتلفريك، والأكواريوم، والحدائق الكبيرة. ووضع واحدة منها في كل يوم يجعل زيارة الأماكن التاريخية تمرّ بلا مشكلة.\n\nواحمل معك ماءً وخفيف طعام وملابس احتياطية — فالبقالات في كل مكان في إسطنبول، لكنك لا تريد الوقوف في طابور في يوم حارّ.",
          en: "The commonest mistake in a plan with children is taking the adult plan and shortening it. The method that works is different: build the day around one main stop and one open space. A museum or historic site in the morning, a park, shore or pool in the afternoon. Two museums back to back does not work with a small child.\n\nIf you have a child who naps at midday, write that hour into the plan. Sleeping in the car usually works; if a long drive or an intercity leg falls at that hour, the day is not lost.\n\nMove mealtimes earlier. Dinner starts late in Turkish restaurants; six or seven means both a calm room and faster service for a family with children.\n\nThe stops children like most are usually not the most historic: a ferry ride, feeding the gulls on the Bosphorus, a cable car, an aquarium, big parks. Putting one of these in every day makes the historic sites pass without trouble.\n\nCarry water, snacks and a change of clothes — there are shops everywhere in Istanbul, but you do not want to queue on a hot day."
        },
      },
    ],
  },
  {
    slug: "istanbulda-uc-gun-programi",
    topic: "planning",
    image: "/images/places/tarihi-yarimada.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Üç Gün: Kısa Program", ar: "ثلاثة أيام في إسطنبول", en: "Three Days in Istanbul" },
      description: {
        tr: "Üç güne tarihî yarımada, Boğaz ve Beyoğlu sığar; şehir dışı sığmaz. Gün gün program, nerede kalmalı ve kısa ziyarette neyi çıkarmak gerekir.",
        ar: "ثلاثة أيام تتّسع لشبه الجزيرة التاريخية والبوسفور وبي أوغلو، لا لما خارج المدينة. البرنامج يوماً بيوم، وأين تسكن، وماذا تحذف.",
        en: "Three days fit the historic peninsula, the Bosphorus and Beyoğlu — not day trips. A day-by-day plan, where to stay, and what to cut on a short visit.",
      },
    },
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
      {
        heading: {
          tr: "Üç gün yetmezse: beş, yedi ve on günlük şekiller",
          ar: "إن لم تكفِ ثلاثة أيام: أشكال الخمسة والسبعة والعشرة",
          en: "If three days is not enough: five, seven and ten-day shapes",
        },
        body: {
          tr: "Beş gün, İstanbul'u acele etmeden gezmenin alt sınırı. Üç günlük iskelete iki gün eklendiğinde Adalar ya da Emirgan gibi bir nefes günü ve bir alışveriş günü giriyor; her gün üç yer yerine iki yer görülüyor ve akşamlar boş kalıyor.\n\nYedi gün İstanbul'a bir günübirlik ekleme imkânı veriyor. En çok tercih edilen üçü Bursa (feribotla iki saat), Sapanca–Maşukiye (bir buçuk saat) ve Şile–Ağva. Bir günübirlik yedi günü zenginleştiriyor; iki günübirlik ise İstanbul'u eksik bırakıyor.\n\nOn gün iki şehir demek. Klasik birleşim dört-beş gün İstanbul, ardından iç hat uçuşuyla beş gün Antalya, Bodrum ya da Trabzon. İki bölge birbirinin zıddı olduğu için seyahat monotonlaşmıyor. Bu on günü tek şehre yaymak yerine ikiye bölmek neredeyse her zaman daha iyi sonuç veriyor.\n\nOn beş ve yirmi gün üç bölge kaldırıyor: İstanbul + bir sahil + Karadeniz gibi. Ama burada bir uyarı var — her şehir değişimi bir günü yolda harcatıyor. Üç şehir demek iki taşınma günü demek; bunu programa yazmayan aile tatilin üçte birini bavulla geçiriyor.",
          ar: "خمسة أيام هي الحدّ الأدنى لتجوّل في إسطنبول دون استعجال. فبإضافة يومين إلى الهيكل الثلاثي يدخل يوم تنفّس كجزر الأمراء أو أمير جان، ويوم للتسوّق؛ فتُرى مكانان في اليوم بدل ثلاثة وتبقى الأمسيات فارغة.\n\nوسبعة أيام تتيح إضافة رحلة يوم واحد إلى إسطنبول. وأكثرها تفضيلاً ثلاث: بورصة (ساعتان بالعبّارة)، وسبانجا–ماشوكية (ساعة ونصف)، وشيلة–آغوا. ورحلة يوم واحد تُثري الأيام السبعة؛ أما رحلتان فتتركان إسطنبول ناقصة.\n\nوعشرة أيام تعني مدينتين. والمزيج الكلاسيكي أربعة أو خمسة أيام في إسطنبول، ثم خمسة أيام في أنطاليا أو بودروم أو طرابزون برحلة داخلية. ولأن المنطقتين متضادّتان لا تصبح الرحلة رتيبة. وتقسيم هذه الأيام العشرة على مدينتين أفضل دائماً تقريباً من بسطها على مدينة واحدة.\n\nوخمسة عشر أو عشرون يوماً تحتمل ثلاث مناطق: إسطنبول + ساحل + البحر الأسود مثلاً. لكن هنا تنبيه — كل تغيير مدينة يستهلك يوماً على الطريق. فثلاث مدن تعني يومَي انتقال؛ والعائلة التي لا تكتب ذلك في البرنامج تقضي ثلث الإجازة مع الحقائب.",
          en: "Five days is the floor for seeing Istanbul without hurrying. Adding two days to the three-day skeleton makes room for a breathing day — the Princes' Islands or Emirgan — and a shopping day; you see two places a day instead of three and the evenings stay free.\n\nSeven days allows one day trip out of Istanbul. The three most chosen are Bursa (two hours by ferry), Sapanca and Maşukiye (an hour and a half), and Şile and Ağva. One day trip enriches a week; two leave Istanbul unfinished.\n\nTen days means two cities. The classic combination is four or five days in Istanbul, then five in Antalya, Bodrum or Trabzon on a domestic flight. Because the two regions are opposites, the trip does not go flat. Splitting those ten days between two cities almost always beats spreading them over one.\n\nFifteen or twenty days carries three regions: Istanbul plus a coast plus the Black Sea, say. But a warning belongs here — every change of city spends a day on the road. Three cities means two moving days; a family that does not write that into the plan spends a third of the holiday with the luggage."
        },
      },
      {
        heading: {
          tr: "Üç günlük planda en sık yapılan üç hata",
          ar: "أكثر ثلاثة أخطاء في برنامج الثلاثة أيام",
          en: "The three commonest mistakes in a three-day plan",
        },
        body: {
          tr: "Birincisi günü fazla doldurmak. İstanbul'da iki nokta arası mesafe haritada kısa görünüyor ama trafik ve yürüyüş süresi ekleniyor. Bir güne dört büyük yer koyan program kâğıtta çalışıyor, sahada çalışmıyor; gün sonunda hiçbir yer doğru dürüst görülmemiş oluyor. Günde iki ana durak ve bir yedek, üç gün için doğru ölçü.\n\nİkincisi varış ve dönüş günlerini tam gün saymak. Uçak öğlen inen bir misafirin ilk günü aslında yarım gün; otele yerleşmek, biraz dinlenmek ve akşam yakın çevreyi gezmek yeterli. Dönüş günü de öyle — uçuştan üç saat önce havalimanında olmak gerektiği için o gün ancak kahvaltı ve kısa bir yürüyüş kaldırıyor. Üç gecelik bir seyahat pratikte iki tam gündür.\n\nÜçüncüsü kapalı günleri kontrol etmemek. Bazı müzeler haftanın bir günü kapalı ve camiler namaz vakitlerinde ziyarete kapanıyor; cuma öğle vakti bu süre daha uzun. Programı kurmadan önce gitmek istediğiniz yerlerin kapalı gününe bakmak, tek bir kontrolle kurtarılabilecek bir gün demek.",
          ar: "الأول حشو اليوم أكثر من طاقته. فالمسافة بين نقطتين في إسطنبول تبدو قصيرة على الخريطة، لكن يُضاف إليها الزحام ووقت المشي. والبرنامج الذي يضع أربعة أماكن كبيرة في يوم واحد ينجح على الورق لا في الميدان؛ وفي آخر اليوم لا يكون أيّ مكان قد رُئي كما ينبغي. ومحطتان رئيسيتان في اليوم مع بديل احتياطي هو المقياس الصحيح لثلاثة أيام.\n\nوالثاني عدّ يومَي الوصول والمغادرة يومين كاملين. فمن تهبط طائرته ظهراً يكون يومه الأول نصف يوم في الحقيقة؛ يكفيه أن يستقرّ في الفندق ويرتاح قليلاً ويتجوّل مساءً في المحيط القريب. ويوم العودة كذلك — فلأنه يجب أن تكون في المطار قبل الرحلة بثلاث ساعات لا يحتمل ذلك اليوم سوى الفطور ونزهة قصيرة. فرحلة من ثلاث ليالٍ هي عملياً يومان كاملان.\n\nوالثالث عدم التحقّق من أيام الإغلاق. فبعض المتاحف تُغلق يوماً في الأسبوع، والمساجد تُغلق أمام الزوار في أوقات الصلاة، وتطول المدة ظهر الجمعة. والنظر في يوم إغلاق الأماكن التي تريدها قبل وضع البرنامج يعني يوماً كاملاً يمكن إنقاذه بتحقّق واحد.",
          en: "The first is overfilling the day. The distance between two points in Istanbul looks short on the map, but traffic and walking time are added to it. A plan with four major sights in one day works on paper and not on the ground; at the end of it nothing has been properly seen. Two main stops a day plus one spare is the right measure for three days.\n\nThe second is counting the arrival and departure days as full days. For a guest whose plane lands at midday, the first day is really a half; settling into the hotel, resting a little and walking the nearby streets in the evening is enough. The departure day is the same — because you must be at the airport three hours before the flight, that day carries only breakfast and a short walk. A three-night trip is in practice two full days.\n\nThe third is not checking closing days. Some museums close one day a week, and mosques close to visitors at prayer times, for longer at Friday midday. Looking up the closing day of the places you want before building the plan is a whole day saved by a single check."
        },
      },
    ],
  },
  {
    slug: "istanbulda-toplu-tasima-rehberi",
    topic: "arrival",
    image: "/images/places/tramvay.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Toplu Taşıma Rehberi", ar: "دليل المواصلات في إسطنبول", en: "Istanbul Public Transport Guide" },
      description: {
        tr: "İstanbulkart nasıl alınır, T1 tramvayı nereye gider, vapurla Boğaz nasıl geçilir ve ne zaman özel araç toplu taşımadan daha mantıklı olur.",
        ar: "كيف تُشترى بطاقة إسطنبول، وإلى أين يذهب ترام T1، وكيف يُعبر البوسفور بالعبّارة، ومتى تكون السيارة الخاصة أنسب من النقل العام.",
        en: "How to buy an İstanbulkart, where the T1 tram goes, how to cross the Bosphorus by ferry, and when a private vehicle beats public transport.",
      },
    },
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
      {
        heading: {
          tr: "İstanbulkart nereden alınır, nasıl doldurulur",
          ar: "من أين تُشترى بطاقة إسطنبول وكيف تُشحن",
          en: "Where to get an İstanbulkart and how to load it",
        },
        body: {
          tr: "Kart havalimanlarında, metro istasyonlarında ve iskelelerdeki otomatlardan alınıyor. Otomatlar Arapça ve İngilizce menü sunuyor; kartın kendisi için bir ücret ödüyorsunuz, üstüne bakiye yüklüyorsunuz.\n\nTek kart birden çok kişi için kullanılabiliyor: turnikeden geçerken art arda okutmanız yeterli. Dört kişilik bir aile için tek kart almak, dört ayrı kart almaktan hem ucuz hem pratik.\n\nDolum aynı otomatlardan ve büfelerden yapılıyor. Bakiye ekranda görünüyor; binerken yetmezse turnike geçirmiyor ve arkanızdaki sıra beklemek zorunda kalıyor — bu yüzden bakiyeyi bitmeden yüklemek iyi bir alışkanlık.\n\nKart metro, tramvay, otobüs, vapur, füniküler ve Marmaray'ın hepsinde geçiyor. Aynı yolculukta hat değiştirdiğinizde aktarma indirimi uygulanıyor; yani metrodan tramvaya geçmek iki tam bilet ödemek anlamına gelmiyor.\n\nAyrılırken kartta kalan bakiye iade edilmiyor; son gün fazla yükleme yapmamak mantıklı.",
          ar: "تُشترى البطاقة من المطارات ومحطات المترو والأجهزة الموجودة في المرافئ. وتوفّر الأجهزة قائمة بالعربية والإنجليزية؛ تدفع ثمن البطاقة نفسها ثم تشحن عليها رصيداً.\n\nويمكن استعمال بطاقة واحدة لعدة أشخاص: يكفي تمريرها متتاليةً عند البوابة. وشراء بطاقة واحدة لعائلة من أربعة أرخص وأعمل من شراء أربع بطاقات.\n\nوالشحن يتم من الأجهزة نفسها ومن الأكشاك. والرصيد يظهر على الشاشة؛ وإن لم يكفِ عند الركوب لا تفتح البوابة ويضطر من خلفك للانتظار — ولذلك فمن العادات الجيدة أن تشحن قبل نفاد الرصيد.\n\nوالبطاقة صالحة في المترو والترام والحافلات والعبّارات والقطار المائل ومرمراي جميعاً. ويُطبَّق خصم التحويل عند تغيير الخط في الرحلة نفسها؛ أي أن الانتقال من المترو إلى الترام لا يعني دفع تذكرتين كاملتين.\n\nولا يُستردّ الرصيد المتبقّي في البطاقة عند المغادرة؛ فمن المعقول ألا تشحن مبلغاً كبيراً في اليوم الأخير.",
          en: "The card is sold at the airports, metro stations and machines at the ferry piers. The machines offer Arabic and English menus; you pay for the card itself and then load credit onto it.\n\nOne card can be used for several people: tap it in succession at the turnstile. For a family of four, one card is both cheaper and more practical than four.\n\nTopping up is done at the same machines and at kiosks. The balance shows on the screen; if it is short when you board the gate will not open and the queue behind you waits — so loading before it runs out is a good habit.\n\nThe card works on the metro, trams, buses, ferries, funiculars and Marmaray alike. A transfer discount applies when you change lines within one journey, so going from metro to tram does not mean paying two full fares.\n\nAny credit left on the card is not refunded when you leave; it makes sense not to load a large sum on the last day."
        },
      },
      {
        heading: {
          tr: "Vapur: en keyifli ve en öngörülebilir hat",
          ar: "العبّارة: أمتع الخطوط وأكثرها قابلية للتوقّع",
          en: "The ferry: the most enjoyable and most predictable line",
        },
        body: {
          tr: "İstanbul'da toplu taşımanın en iyi parçası vapur. Trafiğe takılmıyor, saati belli, manzarası şehrin en pahalı turlarında satılan manzarayla aynı ve bileti bir metro yolculuğu kadar.\n\nEn çok kullanılan hatlar Eminönü–Üsküdar, Eminönü–Kadıköy, Karaköy–Kadıköy ve Beşiktaş–Üsküdar. Bunların hepsi yirmi dakika civarı ve gün boyu sık çalışıyor.\n\nAnadolu yakasında kalıyorsanız vapur günlük ulaşımınızın omurgası oluyor: köprü trafiğine girmeden karşıya geçiyorsunuz ve süre her seferinde aynı. Avrupa yakasında kalanlar içinse vapur bir ulaşım aracı değil, gezinin kendisi.\n\nÜst güvertede oturmak ve çay içmek İstanbulluların günlük alışkanlığı; martılara simit vermek de öyle. Bu, para vermeden yapılan ve çocukların en çok sevdiği aktivitelerden biri.\n\nAkşamüstü seferleri gün batımına denk geldiğinde tarihi yarımada silueti en iyi buradan görünüyor — tur teknesine binmeden, normal bilet fiyatına.",
          ar: "أفضل أجزاء النقل العام في إسطنبول هي العبّارة. فهي لا تعلق في الزحام، ومواعيدها معلومة، ومنظرها هو نفسه المنظر الذي يُباع في أغلى جولات المدينة، وتذكرتها بسعر رحلة مترو.\n\nوأكثر الخطوط استعمالاً إمينونو–أسكودار، وإمينونو–كاديكوي، وكاراكوي–كاديكوي، وبشيكتاش–أسكودار. وكلها نحو عشرين دقيقة وتعمل بتواتر طوال اليوم.\n\nوإن كنت مقيماً في الجهة الآسيوية صارت العبّارة عمود تنقّلك اليومي: تعبر إلى الضفة الأخرى دون دخول زحام الجسر، والمدة واحدة في كل مرة. أما المقيم في الجهة الأوروبية فالعبّارة عنده ليست وسيلة نقل بل هي النزهة نفسها.\n\nوالجلوس في السطح العلوي وشرب الشاي عادة يومية عند أهل إسطنبول، وكذلك إطعام النوارس السميت. وهو من أكثر ما يحبّه الأطفال ولا يكلّف شيئاً.\n\nوحين توافق رحلات العصر غروبَ الشمس يُرى ظلّ شبه الجزيرة التاريخية من هنا أفضل ما يكون — دون ركوب قارب جولات، وبسعر التذكرة العادية.",
          en: "The best part of public transport in Istanbul is the ferry. It does not get stuck in traffic, its times are known, its view is the same view sold on the city's most expensive tours, and the fare is that of a metro ride.\n\nThe most used lines are Eminönü–Üsküdar, Eminönü–Kadıköy, Karaköy–Kadıköy and Beşiktaş–Üsküdar. All run about twenty minutes and go frequently through the day.\n\nIf you are staying on the Asian side the ferry becomes the backbone of your daily travel: you cross without entering bridge traffic and the time is the same every trip. For those on the European side the ferry is not transport but the outing itself.\n\nSitting on the upper deck with a glass of tea is a daily habit for people in Istanbul, and so is feeding simit to the gulls. It is one of the things children enjoy most and it costs nothing.\n\nWhen the late-afternoon sailings meet the sunset, the silhouette of the historic peninsula is seen at its best from here — without boarding a tour boat, at the price of an ordinary ticket."
        },
      },
    ],
  },
  {
    slug: "istanbulda-hava-durumu-ve-giyim",
    topic: "planning",
    image: "/images/places/bogaz-yali.jpg",
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
    seo: {
      title: { tr: "İstanbul'da Hava ve Ne Giyilir", ar: "طقس إسطنبول وماذا تلبس", en: "Istanbul Weather and What to Wear" },
      description: {
        tr: "Yazın nem sıcaklığı yanıltır, kışın rüzgâr soğuğu keskinleştirir. Mevsim mevsim valize ne konur ve cami ziyaretinde nelere dikkat edilir.",
        ar: "في الصيف تخدع الرطوبة، وفي الشتاء تزيد الريح قسوة البرد. ماذا تضع في الحقيبة لكل موسم، وما يُراعى عند زيارة المساجد.",
        en: "Humidity misleads in summer, wind sharpens the cold in winter. What to pack season by season, and what to keep in mind when visiting mosques.",
      },
    },
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
      {
        heading: {
          tr: "Altı şehir, altı ayrı iklim",
          ar: "ست مدن، ستة مناخات مختلفة",
          en: "Six cities, six different climates",
        },
        body: {
          tr: "\"Türkiye'de hava nasıl\" diye tek bir cevap yok; gittiğiniz şehre göre aynı hafta içinde otuz derece fark yaşayabilirsiniz.\n\nİstanbul ılıman ve nemli. Yaz sıcaklığı otuz derece civarında ama nem hissedileni yükseltiyor; kış sıfırın hemen üstünde, rüzgâr soğuğu artırıyor. Yağmur yıla yayılmış, en çok kasım–mart arası.\n\nAntalya Akdeniz iklimi: yaz kuru ve çok sıcak, temmuz–ağustos kırk dereceyi geçiyor. Kış ılık ve yağışlı, on beş derece civarı; denize girilmez ama şehir gezilir.\n\nBodrum ve Ege daha kuru, yaz sıcağı Antalya'ya benzer ama rüzgâr sürekli ve bu sıcağı katlanılır kılıyor. Nem düşük olduğu için gölge serin.\n\nTrabzon ve Karadeniz Türkiye'nin en yağışlı bölgesi ve yazın en serin yeri. Ağustosta sahilde yirmi beş–otuz derece ve nemli; yaylada aynı sabah on beş derece. Yıl boyu yağmur ihtimali var, yazın bile.\n\nBursa ve Sapanca arada: İstanbul'dan biraz daha serin, kışın kar Uludağ ve Kartepe'de kesin. Sapanca'da göl kenarı sabahları serin, öğle sıcaklığı İstanbul'a yakın.",
          ar: "لا يوجد جواب واحد لسؤال \"كيف الطقس في تركيا\"؛ فقد تعيش فرق ثلاثين درجة في الأسبوع نفسه بحسب المدينة التي تقصدها.\n\nإسطنبول معتدلة ورطبة. حرارة الصيف حول الثلاثين لكن الرطوبة ترفع المحسوس؛ والشتاء فوق الصفر بقليل، والريح تزيد البرد. والمطر موزّع على السنة، وأكثره بين تشرين الثاني وآذار.\n\nوأنطاليا ذات مناخ متوسطي: صيف جافّ وشديد الحرارة، ويتجاوز تموز وآب الأربعين. وشتاؤها دافئ ممطر حول الخمس عشرة درجة؛ لا يُسبح فيه لكن تُزار المدينة.\n\nوبودروم وإيجه أكثر جفافاً، وحرّ الصيف يشبه أنطاليا لكن الريح دائمة وتجعله محتملاً. ولأن الرطوبة منخفضة يكون الظلّ بارداً.\n\nوطرابزون والبحر الأسود أكثر مناطق تركيا مطراً وأبردها صيفاً. ففي آب تكون الحرارة على الساحل بين خمس وعشرين وثلاثين درجة مع رطوبة؛ وفي المرتفعات في الصباح نفسه خمس عشرة درجة. واحتمال المطر قائم طوال السنة، حتى صيفاً.\n\nوبورصة وسبانجا بين هذا وذاك: أبرد قليلاً من إسطنبول، والثلج شتاءً مضمون في أولوداغ وكارتيبه. وفي سبانجا تكون ضفة البحيرة باردة صباحاً، وحرارة الظهيرة قريبة من إسطنبول.",
          en: "There is no single answer to \"what is the weather like in Türkiye\"; you can experience a thirty-degree difference in the same week depending on which city you go to.\n\nIstanbul is temperate and humid. Summer sits around thirty degrees but the humidity raises how it feels; winter is just above freezing and the wind sharpens the cold. Rain is spread through the year, heaviest from November to March.\n\nAntalya has a Mediterranean climate: dry and very hot in summer, passing forty degrees in July and August. Winter is mild and wet at around fifteen degrees; not for swimming, but the city is walkable.\n\nBodrum and the Aegean are drier; the summer heat resembles Antalya but the wind is constant and makes it bearable. With low humidity, the shade is cool.\n\nTrabzon and the Black Sea are the wettest part of Türkiye and the coolest in summer. In August the coast is twenty-five to thirty degrees and humid; the highlands are fifteen the same morning. Rain is possible all year, even in summer.\n\nBursa and Sapanca sit in between: a little cooler than Istanbul, with snow certain on Uludağ and Kartepe in winter. At Sapanca the lakeside is cool in the mornings while the midday temperature is close to Istanbul's."
        },
      },
      {
        heading: {
          tr: "Bavula ne koymalı: dört mevsim listesi",
          ar: "ماذا تضع في الحقيبة: قائمة للفصول الأربعة",
          en: "What to pack: a list for four seasons",
        },
        body: {
          tr: "Yaz (haziran–ağustos): ince pamuklu kıyafet, şapka, güneş gözlüğü, güneş kremi. Camiler için omuz ve dizi kapatan bir üst — ince bir gömlek ya da şal iş görüyor. Sahilde mayo ve havlu; İstanbul'da rahat yürüyüş ayakkabısı, çünkü tarihi yarımada baştan sona taş.\n\nİlkbahar ve sonbahar (nisan–mayıs, eylül–ekim): kat kat giyinmek en doğrusu. Sabah serin, öğle sıcak, akşam yine serin. İnce bir mont ya da hırka ve yanında katlanabilir bir yağmurluk. Bu iki dönemde tek bir kalın ceket yerine iki ince katman daha kullanışlı.\n\nKış (aralık–mart): kalın mont, atkı, su geçirmez ayakkabı. İstanbul'da kar her yıl düşmüyor ama yağmur düşüyor ve taş sokaklar kayganlaşıyor. Uludağ ya da Kartepe'ye çıkacaksanız eldiven ve bere; zirvede sıcaklık şehirden sekiz on derece düşük.\n\nKaradeniz'e gidiyorsanız mevsim ne olursa olsun yağmurluk. Ağustosta bile yağmur yiyebilirsiniz ve yayla yolunda sis olağan.",
          ar: "الصيف (حزيران–آب): ملابس قطنية خفيفة، وقبعة، ونظارة شمس، وواقٍ من الشمس. وللمساجد قطعة تستر الكتفين والركبتين — يفي قميص خفيف أو شال. وعلى الشاطئ مايوه ومنشفة؛ وفي إسطنبول حذاء مشي مريح، فشبه الجزيرة التاريخية حجر من أولها إلى آخرها.\n\nالربيع والخريف (نيسان–أيار، أيلول–تشرين الأول): الأصحّ اللبس على طبقات. فالصباح بارد والظهر حارّ والمساء بارد مجدداً. معطف خفيف أو سترة، ومعها معطف مطر قابل للطيّ. وفي هاتين الفترتين تنفع طبقتان خفيفتان أكثر من معطف سميك واحد.\n\nالشتاء (كانون الأول–آذار): معطف سميك، ولفاع، وحذاء لا ينفذ منه الماء. والثلج لا ينزل في إسطنبول كل عام لكن المطر ينزل، وتصبح الشوارع الحجرية زلقة. وإن كنت ستصعد إلى أولوداغ أو كارتيبه فقفازات وقبعة صوفية؛ فالحرارة في القمة أقل من المدينة بثماني إلى عشر درجات.\n\nوإن كنت ذاهباً إلى البحر الأسود فمعطف المطر في أي موسم. فقد يصيبك المطر حتى في آب، والضباب معتاد على طريق المرتفعات.",
          en: "Summer (June to August): light cotton clothes, a hat, sunglasses, sunscreen. For mosques, something covering shoulders and knees — a light shirt or a shawl does it. Swimwear and a towel on the coast; comfortable walking shoes in Istanbul, because the historic peninsula is stone from end to end.\n\nSpring and autumn (April-May, September-October): layers are the right answer. Cool in the morning, warm at midday, cool again in the evening. A light jacket or cardigan and a foldable raincoat with it. In these two windows two thin layers work better than one thick coat.\n\nWinter (December to March): a warm coat, a scarf, waterproof shoes. Snow does not fall in Istanbul every year but rain does, and the stone streets turn slippery. Going up to Uludağ or Kartepe, add gloves and a hat; the summit is eight to ten degrees below the city.\n\nIf you are heading to the Black Sea, take a raincoat whatever the season. You can catch rain even in August, and mist on the highland road is normal."
        },
      },
    ],
  },
  {
    slug: "turkiyede-sehirler-arasi-mesafeler",
    topic: "arrival",
    image: "/images/tours/trabzon.jpg",
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
    seo: {
      title: { tr: "Türkiye'de Şehirler Arası Mesafeler", ar: "المسافات بين مدن تركيا", en: "Distances Between Turkish Cities" },
      description: {
        tr: "Sapanca, Bursa, Yalova ve Şile günübirlik; Trabzon, Bodrum ve Antalya uçakla. Program kurarken işe yarayan üç saat kuralı ve gerçek süreler.",
        ar: "سبانجا وبورصة ويالوفا وشيله لرحلة يوم؛ وطرابزون وبودروم وأنطاليا جواً. قاعدة الثلاث ساعات المفيدة عند وضع البرنامج، والأوقات الحقيقية.",
        en: "Sapanca, Bursa, Yalova and Şile are day trips; Trabzon, Bodrum and Antalya need a flight. The three-hour rule for planning, and real journey times.",
      },
    },
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
          tr: "Sapanca yaklaşık 140 km, Yalova 130 km, Şile ve Ağva 70–100 km uzaklıktadır. Bursa'ya feribotla iki saat, Osmangazi Köprüsü üzerinden karayoluyla iki buçuk saat gidiliyor. Bunların hepsi sabah çıkıp akşam dönülecek mesafededir. Bursa en uzunudur ve gün içinde iki-üç durak sığar; daha fazlasını sıkıştırmak günü yolda geçirmek olur.",
          ar: "تبعد سبانجا نحو 140 كم، ويالوفا 130 كم، وشيله وآغوا 70–100 كم. ويُوصل إلى بورصة بالعبّارة في ساعتين، وبرّاً عبر جسر عثمان غازي في ساعتين ونصف. وكلها على مسافة تسمح بالخروج صباحاً والعودة مساءً. وبورصة أطولها، ويتّسع اليوم لمحطتين أو ثلاث؛ وحشر أكثر من ذلك يعني قضاء اليوم على الطريق.",
          en: "Sapanca is about 140 km away, Yalova 130 km, and Sile and Agva 70–100 km. Bursa is two hours by ferry, or two and a half by road over the Osmangazi Bridge. All are close enough to leave in the morning and return in the evening. Bursa is the longest, and two or three stops fit into the day; squeezing in more means spending the day on the road.",
        },
      },
      {
        heading: {
          tr: "Uçak isteyen şehirler",
          ar: "المدن التي تحتاج طائرة",
          en: "Cities that need a flight",
        },
        body: {
          tr: "Trabzon İstanbul'a yaklaşık 1.000 km, Bodrum 800 km, Antalya 700 km uzaklıktadır; karayoluyla gitmek bir günü tamamen alır. Bu şehirlere uçakla gidilir ve orada ayrıca araç gerekir, çünkü asıl gezilecek yerler şehir merkezlerinin dışındadır: Uzungöl, Sümela, Ayder ya da Ege koyları.",
          ar: "تبعد طرابزون عن إسطنبول نحو 1000 كم، وبودروم 800 كم، وأنطاليا 700 كم؛ والذهاب برّاً يستهلك يوماً كاملاً. تُقصد هذه المدن جواً، وتحتاج فيها إلى سيارة أيضاً، لأن الأماكن الأساسية خارج مراكز المدن: أوزنجول وسوميلا وآيدر أو خلجان إيجة.",
          en: "Trabzon is about 1,000 km from Istanbul, Bodrum 800 km and Antalya 700 km; driving takes a full day. These are reached by air, and you still need a vehicle there, because the places worth seeing lie outside the city centres: Uzungol, Sumela, Ayder or the Aegean bays.",
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
      {
        heading: {
          tr: "İstanbul'dan mesafeler: rakamla",
          ar: "المسافات من إسطنبول: بالأرقام",
          en: "Distances from Istanbul, in figures",
        },
        body: {
          tr: "Sapanca yaklaşık 140 kilometre, otoyoldan bir buçuk saat, trafikli saatte iki. Anadolu yakasından çıkıldığı için Kadıköy tarafında kalıyorsanız daha da kısa.\n\nBursa feribotla iki saat (Yenikapı ya da Pendik'ten Mudanya, ardından iskeleden merkeze yarım saat), karayoluyla Osmangazi Köprüsü üzerinden yaklaşık iki buçuk saat.\n\nAntalya karayoluyla 700 kilometre ve yaklaşık dokuz saat; kimse bu yolu tercih etmiyor, uçakla bir saat on dakika. Bodrum 800 kilometre, uçakla bir saat. Trabzon bin kilometreyi aşıyor ve karayolu tek yön bir gün alıyor; uçakla bir buçuk saat.\n\nBu rakamların pratik anlamı şu: Sapanca ve Bursa günübirlik, geri kalanı uçak istiyor. Şile ve Ağva da günübirlik listesine giriyor — Karadeniz kıyısında, İstanbul'a yaklaşık iki saat.\n\nGünübirlik bir çıkışta yolda geçen toplam süreyi hesaplamak gerekiyor: Sapanca gidiş-dönüş üç saat, Bursa beş saat. Beş saat yolda geçen bir günde görülebilecek şey sınırlı; Bursa'yı gerçekten görmek isteyen bir gece kalıyor.",
          ar: "سبانجا على نحو مئة وأربعين كيلومتراً، ساعة ونصف على الطريق السريع وساعتان في وقت الزحام. والخروج يكون من الجهة الآسيوية، فإن كنت في ناحية كاديكوي فالطريق أقصر.\n\nوبورصة ساعتان بالعبّارة (من ينيكابي أو بنديك إلى مودانيا، ثم نصف ساعة من المرفأ إلى المركز)، ونحو ساعتين ونصف برّاً من فوق جسر عثمان غازي.\n\nوأنطاليا سبعمئة كيلومتر برّاً ونحو تسع ساعات؛ ولا أحد يختار هذا الطريق، فالطائرة ساعة وعشر دقائق. وبودروم ثمانمئة كيلومتر، والطائرة ساعة. وطرابزون تتجاوز الألف كيلومتر ويستغرق الطريق البرّي يوماً في الاتجاه الواحد؛ والطائرة ساعة ونصف.\n\nومعنى هذه الأرقام عملياً: سبانجا وبورصة رحلة يوم، وما عداهما يحتاج طائرة. وتدخل شيلة وآغوا في قائمة رحلات اليوم أيضاً — على ساحل البحر الأسود، على نحو ساعتين من إسطنبول.\n\nوفي رحلة اليوم الواحد ينبغي حساب مجموع الوقت على الطريق: سبانجا ثلاث ساعات ذهاباً وإياباً، وبورصة خمس. وما يمكن رؤيته في يوم تمضي منه خمس ساعات على الطريق محدود؛ ومن يريد رؤية بورصة حقاً يبيت ليلة.",
          en: "Sapanca is about 140 km, ninety minutes on the motorway and two hours in traffic. You leave from the Asian side, so it is shorter still if you are staying around Kadıköy.\n\nBursa is two hours by ferry (Yenikapı or Pendik to Mudanya, then half an hour from the pier to the centre), or about two and a half hours by road over the Osmangazi Bridge.\n\nAntalya is 700 km and about nine hours by road; nobody chooses that, and the flight is an hour and ten minutes. Bodrum is 800 km, an hour by air. Trabzon is over a thousand kilometres and the road takes a full day one way; the flight is an hour and a half.\n\nThe practical meaning: Sapanca and Bursa are day trips, the rest need a plane. Şile and Ağva also belong on the day-trip list — on the Black Sea coast, about two hours from Istanbul.\n\nOn a day trip you have to count the total time on the road: Sapanca three hours there and back, Bursa five. What can be seen in a day that spends five hours travelling is limited; anyone who really wants to see Bursa stays a night."
        },
      },
      {
        heading: {
          tr: "İç hat uçuşu mu, karayolu mu",
          ar: "رحلة داخلية أم طريق برّي",
          en: "Domestic flight or road",
        },
        body: {
          tr: "Türkiye'de iç hat uçuşları sık ve mesafeler uzun olduğu için çoğu şehirlerarası yolculukta uçak tek mantıklı seçenek. Ama uçuşun \"bir saat\" olması yolculuğun bir saat sürdüğü anlamına gelmiyor.\n\nGerçek hesap şöyle: otelden havalimanına yol (İstanbul'da 45-90 dakika), uçuştan iki saat önce orada olmak, uçuş süresi, varış havalimanından otele yol. Bir saatlik bir uçuş kapıdan kapıya beş-altı saat ediyor. Bu yüzden iki gecelik bir kaçamak için uçak çoğu zaman mantıklı değil.\n\nKarayolu ise yalnız Sapanca, Bursa, Şile ve Ağva için geçerli. Bunların ötesinde araçla gitmek günü tamamen yolda geçirmek demek.\n\nÜçüncü bir seçenek var ama az biliniyor: yüksek hızlı tren. Ankara ve Konya hattı çalışıyor ve İstanbul'dan Ankara dört buçuk saat. Turistik rotalarda kullanışlı değil çünkü Antalya, Bodrum ve Trabzon'a hat yok.\n\nBiz şehirlerarası transferi karayolu mesafesi makulse araçla yapıyoruz; uzak şehirlerde uçuş bileti programa dahil değil ama isterseniz sizin adınıza alıyoruz ve varışta karşılıyoruz.",
          ar: "الرحلات الداخلية في تركيا كثيرة والمسافات طويلة، ولذلك تكون الطائرة الخيار المعقول الوحيد في معظم الأسفار بين المدن. لكن كون الرحلة \"ساعة\" لا يعني أن السفر يستغرق ساعة.\n\nوالحساب الحقيقي هكذا: الطريق من الفندق إلى المطار (45-90 دقيقة في إسطنبول)، والوجود هناك قبل الرحلة بساعتين، ومدة الطيران، ثم الطريق من مطار الوصول إلى الفندق. فرحلة ساعة تصير خمس أو ست ساعات من الباب إلى الباب. ولذلك لا تكون الطائرة معقولة غالباً لهروب من ليلتين.\n\nأما الطريق البرّي فيصلح لسبانجا وبورصة وشيلة وآغوا فقط. وما وراءها يعني قضاء اليوم كله على الطريق.\n\nوهناك خيار ثالث قليل المعرفة: القطار السريع. وخط أنقرة وقونية يعمل، وأنقرة على أربع ساعات ونصف من إسطنبول. لكنه غير عملي في المسارات السياحية لعدم وجود خط إلى أنطاليا وبودروم وطرابزون.\n\nونحن ننقلك بين المدن بالسيارة إن كانت المسافة البرّية معقولة؛ وفي المدن البعيدة لا تكون تذكرة الطيران ضمن البرنامج لكننا نشتريها باسمك إن أردت ونستقبلك عند الوصول.",
          en: "Domestic flights in Türkiye are frequent and the distances long, so a plane is the only sensible option on most intercity journeys. But a flight being \"one hour\" does not mean the journey takes an hour.\n\nThe real sum: hotel to airport (45-90 minutes in Istanbul), being there two hours before departure, the flight itself, then arrival airport to hotel. A one-hour flight becomes five or six hours door to door. That is why a plane rarely makes sense for a two-night break.\n\nThe road applies only to Sapanca, Bursa, Şile and Ağva. Beyond those, driving means spending the whole day travelling.\n\nThere is a third option that is little known: the high-speed train. The Ankara and Konya line runs, and Ankara is four and a half hours from Istanbul. It is not useful on tourist routes because there is no line to Antalya, Bodrum or Trabzon.\n\nWe do intercity transfers by road where the distance is reasonable; for distant cities the flight is not included in the programme, but we will buy it in your name if you wish and meet you on arrival."
        },
      },
    ],
  },
  {
    slug: "turkiyede-balayi-rehberi",
    topic: "practical",
    image: "/images/tours/bodrum.jpg",
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
    seo: {
      title: { tr: "Türkiye'de Balayı Rehberi", ar: "دليل شهر العسل في تركيا", en: "Honeymoon in Türkiye: A Guide" },
      description: {
        tr: "İstanbul, Boğaz ve Sapanca klasik rota; yazın Bodrum, kışın Uludağ. Kaç gün ayrılmalı, mahremiyet nasıl korunur ve program nasıl bölünür.",
        ar: "إسطنبول والبوسفور وسبانجا هي المسار الكلاسيكي؛ وبودروم صيفاً وأولوداغ شتاءً. كم يوماً يلزم، وكيف تُحفظ الخصوصية، وكيف يُقسَّم البرنامج.",
        en: "Istanbul, the Bosphorus and Sapanca is the classic route; Bodrum in summer, Uludağ in winter. How many days, how to keep privacy, how to split the trip.",
      },
    },
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
      {
        heading: {
          tr: "Nereye gitmeli: üç ayrı balayı",
          ar: "إلى أين تذهب: ثلاث أنواع من شهر العسل",
          en: "Where to go: three different honeymoons",
        },
        body: {
          tr: "Balayı için Türkiye'de üç ayrı rota var ve seçim çiftin ne istediğine göre değişiyor.\n\nDeniz ve sessizlik isteyen için Ege ve Akdeniz. Bodrum yarımadasında Türkbükü ve Göltürkbükü sakinliğiyle biliniyor; Antalya tarafında Kemer ve Kaleiçi'nin butik otelleri. Mayıs sonu–ekim arası deniz mevsimi, temmuz–ağustos hem en sıcak hem en kalabalık.\n\nŞehir ve manzara isteyen için İstanbul. Boğaz kıyısındaki oteller, akşam vapur yolculuğu, Ortaköy ve Bebek'te yemek. İstanbul balayının tamamı olmak yerine genellikle başı ya da sonu oluyor — üç gün İstanbul, ardından sahil.\n\nYeşil ve serinlik isteyen için Karadeniz. Uzungöl ve yaylalar yaz aylarında en çok tercih edilen rota; kalabalıktan uzak, hava serin. Ama mesafeler uzun ve yol dağ yolu; dinlenmekten çok gezmek isteyen çiftlere uygun.\n\nEn sık kurulan birleşim üç-dört gün İstanbul, ardından iç hat uçuşuyla beş gün sahil. İki bölge birbirinin zıddı olduğu için seyahat monotonlaşmıyor.",
          ar: "لشهر العسل في تركيا ثلاثة مسارات مختلفة، والاختيار يتبع ما يريده الزوجان.\n\nلمن يريد البحر والهدوء: إيجه والمتوسط. ففي شبه جزيرة بودروم تُعرف تركبوكو وغول‑تركبوكو بهدوئها؛ وفي ناحية أنطاليا فنادق كمر وكالي إيتشي البوتيك. وموسم البحر من أواخر أيار إلى تشرين الأول، وتموز وآب أشدّ حرّاً وازدحاماً.\n\nولمن يريد المدينة والمنظر: إسطنبول. فنادق ضفة البوسفور، ورحلة عبّارة مساءً، والعشاء في أورتاكوي وبيبك. وإسطنبول تكون عادةً بداية شهر العسل أو نهايته لا كلّه — ثلاثة أيام فيها ثم الساحل.\n\nولمن يريد الخضرة والبرودة: البحر الأسود. فأوزنجول والمرتفعات أكثر المسارات تفضيلاً في الصيف؛ بعيدة عن الزحام والجو بارد. لكن المسافات طويلة والطريق جبلي؛ فهي تناسب الزوجين اللذين يريدان التجوّل أكثر من الراحة.\n\nوأكثر التركيبات شيوعاً ثلاثة أو أربعة أيام في إسطنبول، ثم خمسة أيام على الساحل برحلة داخلية. ولأن المنطقتين متضادّتان لا تصبح الرحلة رتيبة.",
          en: "There are three separate honeymoon routes in Türkiye, and the choice follows what the couple wants.\n\nFor sea and quiet: the Aegean and the Mediterranean. On the Bodrum peninsula, Türkbükü and Göltürkbükü are known for their calm; on the Antalya side, the boutique hotels of Kemer and Kaleiçi. The swimming season runs from late May to October, with July and August both the hottest and the busiest.\n\nFor city and view: Istanbul. Hotels along the Bosphorus, an evening ferry, dinner at Ortaköy or Bebek. Istanbul is usually the beginning or the end of a honeymoon rather than all of it — three days there, then the coast.\n\nFor green and cool air: the Black Sea. Uzungöl and the highlands are the most chosen route in summer; away from the crowds, cool air. But the distances are long and the roads mountain roads; it suits couples who want to explore more than to rest.\n\nThe commonest combination is three or four days in Istanbul, then five on the coast by domestic flight. Because the two regions are opposites, the trip does not go flat."
        },
      },
      {
        heading: {
          tr: "Ne yapmıyoruz: gelin arabası ve sürpriz düzenleme",
          ar: "ما لا نقدّمه: سيارة العروس والتنظيمات المفاجئة",
          en: "What we do not do: wedding cars and surprise arrangements",
        },
        body: {
          tr: "Balayı sayfalarında sık geçen iki hizmet var ve ikisini de vermiyoruz; bunu baştan yazmak sonradan hayal kırıklığı yaşatmaktan iyi.\n\nGelin arabası ve düğün organizasyonu yapmıyoruz. Süslü araç, çiçek düzenlemesi, fotoğrafçı ayarlama gibi işler bizim alanımız değil. Aracımız siyah Mercedes Vito ve transfer aracı olarak çalışıyor.\n\nOtel odasına sürpriz düzenleme (çiçek, pasta, balon) da bizim yaptığımız bir şey değil. Bunu doğrudan otelden istemek hem daha güvenilir hem daha ucuz; çoğu otel bu isteği rezervasyon notuna eklediğinizde karşılıyor. Biz rezervasyonu sizin adınıza yaparken bu notu iletebiliyoruz ama düzenlemeyi otel yapıyor, biz değil.\n\nYaptığımız şey ulaşım ve program: havalimanı karşılaması, şehirler arası transfer, gün boyu araç ve şoför, özel turlar. Balayı çiftlerinin en çok istediği şey de zaten bu — kalabalık bir gruba katılmadan, kendi tempolarında gezmek.",
          ar: "هناك خدمتان تتكرران في صفحات شهر العسل ولا نقدّم أياً منهما؛ وكتابة ذلك من البداية أفضل من خيبة أمل لاحقة.\n\nلا نقدّم سيارة العروس ولا تنظيم الأعراس. فالسيارة المزيّنة وتنسيق الزهور وترتيب المصوّر ليست من مجالنا. وسيارتنا مرسيدس فيتو سوداء وتعمل سيارة نقل.\n\nولا نقوم كذلك بترتيب المفاجآت في غرفة الفندق (زهور، كعكة، بالونات). فطلب ذلك من الفندق مباشرةً أوثق وأرخص؛ ومعظم الفنادق تلبّيه إذا أضفته إلى ملاحظات الحجز. ونستطيع نحن إيصال هذه الملاحظة عند الحجز باسمك، لكن التنفيذ يكون من الفندق لا منّا.\n\nوما نقدّمه هو النقل والبرنامج: الاستقبال من المطار، والنقل بين المدن، وسيارة وسائق طوال اليوم، وجولات خاصة. وهذا أصلاً أكثر ما يطلبه الزوجان في شهر العسل — التجوّل بإيقاعهما دون الانضمام إلى مجموعة كبيرة.",
          en: "Two services appear often on honeymoon pages and we provide neither; writing that down at the start beats disappointing someone later.\n\nWe do not do wedding cars or wedding organisation. A decorated vehicle, floral arrangements, arranging a photographer — none of that is our field. Our vehicle is a black Mercedes Vito working as a transfer car.\n\nSurprise arrangements in the hotel room — flowers, a cake, balloons — are not something we do either. Asking the hotel directly is both more reliable and cheaper; most hotels will oblige if you add it to the booking notes. We can pass that note on when we book in your name, but the hotel does the arranging, not us.\n\nWhat we do is transport and the programme: airport meet-and-greet, intercity transfers, a car and driver by the day, private tours. That is what honeymoon couples ask for most anyway — moving at their own pace without joining a large group."
        },
      },
    ],
  },
  {
    slug: "antalya-bolge-rehberi",
    topic: "daytrips",
    image: "/images/places/kemer.jpg",
    title: {
      tr: "Antalya bölge rehberi: Kaleiçi, Side, Kemer, Belek ve Alanya",
      ar: "دليل منطقة أنطاليا: كاليتشي وسيدة وكمر وبيليك وألانيا",
      en: "The Antalya region: Kaleiçi, Side, Kemer, Belek and Alanya",
    },
    excerpt: {
      tr: "Antalya tek bir şehir değil, iki yüz kilometrelik bir sahil şeridi. Hangi ilçe kime uyar, mesafeler ne kadar, hangi mevsimde ne olur.",
      ar: "أنطاليا ليست مدينة واحدة بل شريط ساحلي بطول مئتي كيلومتر. أي منطقة تناسب مَن، وكم المسافات، وماذا يحدث في كل موسم.",
      en: "Antalya is not one city but two hundred kilometres of coast. Which district suits whom, how far apart they are, and what each season brings.",
    },
    facts: [
      {
        label: {
          tr: "Sahil uzunluğu",
          ar: "طول الساحل",
          en: "Coastline",
        },
        value: {
          tr: "Kemer'den Alanya'ya ~200 km",
          ar: "نحو 200 كم من كمر إلى ألانيا",
          en: "~200 km from Kemer to Alanya",
        },
      },
      {
        label: {
          tr: "Deniz sezonu",
          ar: "موسم البحر",
          en: "Swimming season",
        },
        value: {
          tr: "Mayıs – ekim",
          ar: "أيار – تشرين الأول",
          en: "May – October",
        },
      },
      {
        label: {
          tr: "Ulaşım",
          ar: "الوصول",
          en: "Getting there",
        },
        value: {
          tr: "Uçakla; İstanbul'dan ~1,5 saat",
          ar: "جواً؛ نحو ساعة ونصف من إسطنبول",
          en: "By air; ~1.5 hours from Istanbul",
        },
      },
    ],
    seo: {
      title: {
        tr: "Antalya Bölge Rehberi",
        ar: "دليل منطقة أنطاليا",
        en: "Antalya Region Guide",
      },
      description: {
        tr: "Kaleiçi, Side, Kemer, Belek ve Alanya karşılaştırmalı: hangi ilçe kime uyar, havalimanına mesafeler, deniz sezonu ve hangi ayda ne olur.",
        ar: "مقارنة بين كاليتشي وسيدة وكمر وبيليك وألانيا: أي منطقة تناسب مَن، والمسافات إلى المطار، وموسم البحر، وماذا يحدث في كل شهر.",
        en: "Kaleiçi, Side, Kemer, Belek and Alanya compared: which district suits whom, distances to the airport, the swimming season and what each month brings.",
      },
    },
    faq: [
      {
        question: {
          tr: "Antalya'da hangi bölgede kalmalıyım?",
          ar: "في أي منطقة أقيم في أنطاليا؟",
          en: "Which area should I stay in around Antalya?",
        },
        answer: {
          tr: "Şehir hayatı, müze ve çarşı istiyorsanız Kaleiçi ve merkez; sakin bir sahil tatili istiyorsanız Belek ya da Side; dağ ve deniz bir aradaysa Kemer; daha canlı ve uygun fiyatlı bir seçenek arıyorsanız Alanya. Aileler genelde merkeze yakın kalıp günübirlik çıkıyor; her gün otel değiştirmek bu bölgede en çok yorulan tercih.",
          ar: "إن أردت حياة المدينة والمتاحف والأسواق فكاليتشي والمركز؛ وإن أردت عطلة شاطئية هادئة فبيليك أو سيدة؛ وإن أردت الجبل والبحر معاً فكمر؛ وإن كنت تبحث عن خيار أكثر حيوية وأنسب سعراً فألانيا. والعائلات غالباً تقيم قرب المركز وتخرج في رحلات يومية؛ فتبديل الفندق كل يوم هو أكثر الخيارات إرهاقاً في هذه المنطقة.",
          en: "For city life, museums and bazaars, Kaleiçi and the centre; for a quiet beach holiday, Belek or Side; for mountains and sea together, Kemer; for something livelier and better value, Alanya. Families usually stay near the centre and take day trips — changing hotel every day is the most tiring choice in this region.",
        },
      },
      {
        question: {
          tr: "Antalya havalimanından ilçelere ne kadar sürer?",
          ar: "كم تستغرق الرحلة من مطار أنطاليا إلى المناطق؟",
          en: "How long is it from Antalya airport to the districts?",
        },
        answer: {
          tr: "Merkez ve Lara yaklaşık 15–30 dakika, Belek 30–40, Kemer 50–70, Side 60–75 ve Alanya 100–130 dakika. Süreler yaklaşıktır; yaz aylarında sahil yolu yoğunlaşır. Alanya'yı programa katacaksanız gidiş-dönüşün dört saati yolda geçeceğini hesaba katın.",
          ar: "المركز ولارا نحو 15 إلى 30 دقيقة، وبيليك 30 إلى 40، وكمر 50 إلى 70، وسيدة 60 إلى 75، وألانيا 100 إلى 130 دقيقة. وهذه أوقات تقريبية، ويزداد ازدحام الطريق الساحلي في الصيف. وإن أدرجت ألانيا في البرنامج فاحسب أن أربع ساعات ستمضي على الطريق ذهاباً وإياباً.",
          en: "The centre and Lara are roughly 15–30 minutes, Belek 30–40, Kemer 50–70, Side 60–75 and Alanya 100–130. These are approximate; the coast road gets busier in summer. If you add Alanya to the plan, allow four hours on the road for the round trip.",
        },
      },
      {
        question: {
          tr: "Yaz dışında Antalya'ya gitmek mantıklı mı?",
          ar: "هل من المنطقي زيارة أنطاليا خارج الصيف؟",
          en: "Is Antalya worth visiting outside summer?",
        },
        answer: {
          tr: "Evet, hatta bazı misafirler için daha iyi. Nisan–mayıs ve ekim–kasım aralığında hava ılık, kalabalık az ve gezmek rahat; deniz mayıs sonundan ekime kadar zaten girilebilir durumda. Kışın deniz soğuktur ama şehir yeşil kalır ve Toros dağlarında kar bulunur — sahilde on beş derece, dağda kar aynı gün mümkün.",
          ar: "نعم، بل هي أفضل لبعض الضيوف. ففي نيسان وأيار وتشرين الأول وتشرين الثاني يكون الجو دافئاً والزحام قليلاً والتجوّل مريحاً؛ والبحر صالح للسباحة من أواخر أيار حتى تشرين الأول. أما في الشتاء فالبحر بارد لكن المدينة تبقى خضراء ويوجد الثلج في جبال طوروس — خمس عشرة درجة على الساحل وثلج في الجبل في اليوم نفسه أمر ممكن.",
          en: "Yes, and for some guests it is better. April–May and October–November are mild, uncrowded and comfortable for sightseeing, and the sea is swimmable from late May to October anyway. In winter the sea is cold but the city stays green and there is snow in the Taurus mountains — fifteen degrees on the coast and snow in the mountains on the same day is possible.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Antalya bir şehir değil, bir sahil şeridi",
          ar: "أنطاليا ليست مدينة بل شريط ساحلي",
          en: "Antalya is a coastline, not a city",
        },
        body: {
          tr: "Haritada tek bir isim görünür ama Antalya'nın turistik bölgesi Kemer'den Alanya'ya iki yüz kilometre uzanır. Bu yüzden \"Antalya'ya gidiyoruz\" cümlesi tek başına bir şey anlatmaz: Kemer'de kalan biriyle Side'de kalan biri aynı tatili yaşamaz. Merkez, Roma ve Osmanlı katmanlarını taşıyan Kaleiçi'yle şehir tatili sunar; doğusu Belek ve Side'yle geniş kumsallara, batısı Kemer'le çam ormanı ve dağ eteğine açılır. Alanya en uzak ve en canlı uç.",
          ar: "على الخريطة يظهر اسم واحد، لكن منطقة أنطاليا السياحية تمتد مئتي كيلومتر من كمر إلى ألانيا. ولذلك فإن عبارة «سنذهب إلى أنطاليا» لا تقول شيئاً بمفردها: فمن يقيم في كمر لا يعيش العطلة نفسها التي يعيشها من يقيم في سيدة. المركز يقدّم عطلة مدينة بكاليتشي التي تحمل طبقات رومانية وعثمانية؛ وشرقه ينفتح على رمال واسعة في بيليك وسيدة، وغربه على غابات الصنوبر وسفح الجبل في كمر. وألانيا هي الطرف الأبعد والأكثر حيوية.",
          en: "On a map it looks like one name, but the tourist region of Antalya runs two hundred kilometres from Kemer to Alanya. \"We're going to Antalya\" therefore says little on its own: someone staying in Kemer is not having the same holiday as someone in Side. The centre offers a city break around Kaleiçi with its Roman and Ottoman layers; to the east Belek and Side open onto wide sands, to the west Kemer runs into pine forest and the foot of the mountains. Alanya is the furthest and liveliest end.",
        },
        image: "/images/tours/antalya.jpg",
        imageAlt: {
          tr: "Antalya Kaleiçi ve eski liman",
          ar: "كاليتشي أنطاليا والميناء القديم",
          en: "Kaleiçi and the old harbour, Antalya",
        },
      },
      {
        heading: {
          tr: "İlçe ilçe: hangisi kime uyar",
          ar: "منطقة منطقة: أيّها يناسب مَن",
          en: "District by district: which suits whom",
        },
        body: {
          tr: "Kaleiçi ve merkez, gezmeyi sevenler için: müze, çarşı, restoran ve Düden Şelalesi yakın. Belek sakin ve düzenlidir, geniş kumsalı ve golf sahalarıyla bilinir; kalabalıktan uzak durmak isteyen aileler burayı seçer. Side antik tiyatro ve Apollon Tapınağı'yla tarihi denizle birleştirir. Kemer'de dağ denize kadar iner, koylar küçük ve çamlıdır. Alanya kalesi, mağaraları ve uzun sahiliyle daha hareketli, fiyatlar da genelde daha uygundur.",
          ar: "كاليتشي والمركز لمن يحب التجوّل: المتاحف والأسواق والمطاعم وشلال دودان قريبة. وبيليك هادئة ومنظمة، تشتهر برمالها الواسعة وملاعب الغولف؛ وتختارها العائلات التي تريد الابتعاد عن الزحام. وسيدة تجمع التاريخ بالبحر بمسرحها الأثري ومعبد أبولو. وفي كمر ينزل الجبل حتى البحر، والخلجان صغيرة وتحيط بها أشجار الصنوبر. أما ألانيا فأكثر حركة بقلعتها وكهوفها وشاطئها الطويل، وأسعارها غالباً أنسب.",
          en: "Kaleiçi and the centre suit people who like to explore: museums, bazaars, restaurants and the Düden Waterfall are all close. Belek is calm and orderly, known for its wide sand and golf courses; families who want to avoid crowds choose it. Side joins history to the sea with its ancient theatre and Temple of Apollo. In Kemer the mountains come down to the water and the bays are small and pine-fringed. Alanya, with its castle, caves and long beach, is livelier, and prices are generally friendlier.",
        },
      },
      {
        heading: {
          tr: "Program kurarken",
          ar: "عند وضع البرنامج",
          en: "When planning",
        },
        body: {
          tr: "En sık yapılan hata her gün başka bir ilçeye gitmek. Sahil yolu tek şerittir ve yazın ağırlaşır; günde iki uzak durak, günün yarısını araçta geçirmek demektir. İşe yarayan düzen şu: merkeze ya da Belek–Side hattına yerleşip günübirlik çıkmak. Bir gün Kaleiçi ve şehir, bir gün Side ya da Kemer, bir gün tekne turu, bir gün tam serbest. Alanya eklenecekse ona ayrı bir tam gün ayırmak gerekir. Antalya turumuz bu düzenin bir günlük halidir; kalan günleri size göre kurarız.",
          ar: "أكثر خطأ يتكرر هو الذهاب كل يوم إلى منطقة مختلفة. فالطريق الساحلي ذو مسار واحد ويثقل في الصيف؛ ومحطتان بعيدتان في اليوم تعنيان قضاء نصف اليوم في السيارة. والترتيب المجدي هو الإقامة في المركز أو على خط بيليك–سيدة والخروج في رحلات يومية: يوم لكاليتشي والمدينة، ويوم لسيدة أو كمر، ويوم لجولة القارب، ويوم حر بالكامل. وإن أُضيفت ألانيا فتحتاج يوماً كاملاً خاصاً بها. وجولة أنطاليا لدينا هي النسخة اليومية من هذا الترتيب؛ وبقية الأيام نضعها على مقاسك.",
          en: "The commonest mistake is going to a different district every day. The coast road is single-lane and slows in summer; two distant stops in one day means half the day in the car. What works is basing yourself in the centre or on the Belek–Side stretch and taking day trips: one day for Kaleiçi and the city, one for Side or Kemer, one for a boat trip, one entirely free. If Alanya is added it needs a full day of its own. Our Antalya tour is the one-day version of this arrangement; we build the remaining days around you.",
        },
      },
      {
        heading: {
          tr: "Kum mu çakıl mı: sahil sahil fark",
          ar: "رمل أم حصى: الفرق من شاطئ إلى آخر",
          en: "Sand or pebble: the difference from beach to beach",
        },
        body: {
          tr: "Antalya'da tatili en çok belirleyen ama en az sorulan şey sahilin zemini. Aynı bölgede iki otel arasındaki asıl fark çoğu zaman bu.\n\nKum olan yerler: Lara, Belek ve Side. Uzun, geniş ve yumuşak kumsallar; denize giriş kademeli, su bir süre sığ kalıyor. Küçük çocuklu aileler için en rahat olanı bu üçü.\n\nÇakıl olan yerler: Konyaaltı ve Kemer koyları. Su daha berrak — kum yok, dolayısıyla dalga zemini bulandırmıyor — ama denize giriş sert ve bazı noktalarda birkaç adımda derinleşiyor. Deniz ayakkabısı burada tercih değil, gereklilik.\n\nBu ayrım otel seçiminde iki soruya dönüşüyor: sahil otelin kendisine mi ait yoksa yol geçiyor mu, ve zemin ne. İkincisi ilan metinlerinde çoğu zaman yazmıyor; uydu görüntüsünde rengine bakmak fikir veriyor, ama en kesin yol otele sormak.\n\nBir not daha: haziran ve eylülde deniz suyu Akdeniz'in en ılık halinde ve öğle güneşi çekilebilir düzeyde. Temmuz–ağustosta sahilde on bir ile on altı arası saatler küçük çocuklar için ağır; havuz o saatlerde denizden daha kullanışlı oluyor.",
          ar: "أكثر ما يحدّد شكل الإجازة في أنطاليا وأقلّ ما يُسأل عنه هو أرضية الشاطئ. فالفرق الحقيقي بين فندقين في المنطقة نفسها هو هذا غالباً.\n\nالأماكن الرملية: لارا وبيليك وسيده. شواطئ طويلة عريضة ناعمة؛ والنزول إلى البحر متدرّج والماء يبقى ضحلاً مسافةً. وهذه الثلاثة أريح ما يكون للعائلات ذات الأطفال الصغار.\n\nوالأماكن الحصوية: كونيا آلتي وخلجان كيمر. الماء فيها أصفى — إذ لا رمل، فلا يعكّر الموجُ القاعَ — لكن النزول حادّ ويعمُق في بعض المواضع بعد خطوات. وحذاء البحر هنا ليس تفضيلاً بل ضرورة.\n\nويتحوّل هذا التمييز عند اختيار الفندق إلى سؤالين: هل الشاطئ للفندق نفسه أم يفصل بينهما طريق، وما نوع الأرضية. والثاني لا يُكتب في نصوص الإعلان غالباً؛ والنظر إلى لونه في صورة الأقمار الصناعية يعطي فكرة، لكن أضمن طريق أن تسأل الفندق.\n\nوملاحظة أخرى: في يونيو وسبتمبر يكون ماء البحر في أدفأ حالات المتوسط وشمس الظهيرة محتملة. أما في يوليو وأغسطس فالساعات بين الحادية عشرة والرابعة ثقيلة على الأطفال الصغار على الشاطئ؛ والمسبح في تلك الساعات أنفع من البحر.",
          en: "The thing that shapes an Antalya holiday most, and gets asked about least, is what the beach is made of. The real difference between two hotels in the same area is usually this.\n\nSand: Lara, Belek and Side. Long, wide, soft beaches; the entry into the water is gradual and it stays shallow for a while. These three are the easiest for families with small children.\n\nPebble: Konyaaltı and the coves at Kemer. The water is clearer — no sand, so the waves do not cloud the bottom — but the entry is hard underfoot and in places it deepens within a few steps. Water shoes here are a necessity, not a preference.\n\nAt the hotel-choosing stage this turns into two questions: does the beach belong to the hotel or is there a road in between, and what is the surface. The second is often absent from listings; the colour on a satellite image gives you an idea, but asking the hotel is the sure way.\n\nOne more note: in June and September the sea is at its warmest and the midday sun is bearable. In July and August the hours between eleven and four are heavy for small children on the beach; the pool is more useful than the sea at that time of day."
        },
      },
      {
        heading: {
          tr: "Her şey dahil sistemi: neyin dahil olduğunu önceden sorun",
          ar: "نظام «كل شيء مشمول»: اسأل مسبقاً عمّا هو مشمول فعلاً",
          en: "All-inclusive: ask in advance what is actually included",
        },
        body: {
          tr: "Antalya'daki büyük sahil otellerinin çoğu her şey dahil çalışıyor ve bu, bölgeyi bütçe açısından öngörülebilir yapan şey. Ama \"dahil\" kelimesinin kapsamı otelden otele değişiyor.\n\nGenellikle dahil olanlar: üç ana öğün açık büfe, gün içinde atıştırmalık saatleri, yerli içecekler, havuz ve sahil şezlongu, otel içi animasyon.\n\nGenellikle dahil olmayanlar: à la carte restoranlarda rezervasyonlu akşam yemekleri (çoğu otelde konaklama başına belirli sayıda hakla sınırlı), ithal içecekler, spa ve masaj, deniz sporları, oda kasası ve minibar, bazı otellerde çocuk kulübünün belirli etkinlikleri.\n\n\"Ultra her şey dahil\" ifadesi resmî bir sınıflandırma değil, otelin kendi tanımı. Bir otelde ithal içeceği ve à la carte'ı kapsarken, başka bir otelde yalnız açık büfeye ek bir-iki kalem anlamına gelebiliyor. Bu yüzden ismi değil, listeyi sormak gerekiyor.\n\nSorulacak somut sorular şunlar: à la carte restoranlar konaklama boyunca kaç kez ücretsiz, çocuk yaş aralıkları nasıl belirlenmiş, oda kasası ücretli mi, sahilde şezlong ve şemsiye ek ücretli mi. Bu dördü, çoğu sürpriz kalemin çıktığı yerler.\n\nBiz otel rezervasyonunu sizin adınıza yapıyoruz ve bu soruları yazılı olarak soruyoruz; otelin cevabını olduğu gibi iletiyoruz. Fiyatın üstüne komisyon eklemiyoruz.",
          ar: "معظم الفنادق الساحلية الكبيرة في أنطاليا تعمل بنظام «كل شيء مشمول»، وهذا ما يجعل المنطقة قابلة للتقدير من حيث الميزانية. لكن مدى كلمة «مشمول» يختلف من فندق إلى فندق.\n\nما يُشمَل عادةً: ثلاث وجبات رئيسية مفتوحة، وأوقات وجبات خفيفة خلال اليوم، والمشروبات المحلية، والمسبح وكرسي الشاطئ، والأنشطة الترفيهية داخل الفندق.\n\nوما لا يُشمَل عادةً: عشاء المطاعم التي تُحجز مسبقاً (وهو في أغلب الفنادق محدود بعدد معيّن من المرات لكل إقامة)، والمشروبات المستوردة، والمنتجع الصحي والتدليك، والرياضات البحرية، وخزنة الغرفة والثلاجة الصغيرة، وبعض أنشطة نادي الأطفال في فنادق معيّنة.\n\nوعبارة «ألترا كل شيء مشمول» ليست تصنيفاً رسمياً بل تعريف الفندق نفسه. فقد تشمل في فندقٍ المشروباتِ المستوردة والمطاعمَ المحجوزة، وتعني في آخر بندين إضافيّين على البوفيه المفتوح لا غير. ولذلك يلزم السؤال عن القائمة لا عن الاسم.\n\nوالأسئلة العملية هي: كم مرّة تكون المطاعم المحجوزة مجانية طوال الإقامة، وكيف حُدّدت الفئات العمرية للأطفال، وهل خزنة الغرفة بمقابل، وهل كرسي الشاطئ ومظلّته بمقابل إضافي. وهذه الأربعة هي مواضع معظم البنود المفاجئة.\n\nونحن نحجز الفندق باسمك ونسأل هذه الأسئلة كتابةً وننقل جواب الفندق كما هو. ولا نضيف عمولة على السعر.",
          en: "Most of the large coastal hotels in Antalya run on an all-inclusive basis, and that is what makes the region predictable for a budget. But how far the word \"included\" stretches varies from hotel to hotel.\n\nUsually included: three main buffet meals, snack hours through the day, local drinks, a pool and beach lounger, and in-house entertainment.\n\nUsually not included: dinners at à la carte restaurants that need booking (in most hotels limited to a set number per stay), imported drinks, spa and massage, water sports, the room safe and minibar, and at some hotels certain kids' club activities.\n\n\"Ultra all-inclusive\" is not an official classification but the hotel's own description. At one property it covers imported drinks and the à la carte restaurants; at another it means one or two extras on top of the buffet. So ask for the list, not the label.\n\nThe concrete questions are these: how many free à la carte dinners across the stay, how the children's age bands are defined, whether the room safe is charged, and whether beach loungers and umbrellas cost extra. Those four are where most of the surprise items appear.\n\nWe book the hotel in your name and ask these questions in writing, then pass on the hotel's answer as it is. We add no commission to the price."
        },
      },
      {
        heading: {
          tr: "Denizden başka ne var: antik kentler, şelaleler, kanyon",
          ar: "ماذا هناك غير البحر: مدن أثرية وشلالات ووادٍ",
          en: "Beyond the sea: ancient cities, waterfalls and a canyon",
        },
        body: {
          tr: "Antalya yalnız sahil değil; bölge Türkiye'nin en yoğun antik kent kümesini barındırıyor ve çoğu otele bir saatten yakın.\n\nAspendos, Roma döneminden kalma tiyatrosuyla biliniyor — dünyada en iyi korunmuş örneklerden biri ve akustiği hâlâ çalışıyor. Merkeze doğu yönünde yaklaşık kırk beş kilometre.\n\nPerge merkeze en yakın antik kent; sütunlu caddesi, hamamları ve stadyumuyla bir şehir planının tamamı ayakta. Aspendos'la aynı gün gezilebiliyor.\n\nSide'de antik kent ile tatil bölgesi iç içe: Apollon Tapınağı'nın sütunları denizin kenarında duruyor ve gün batımında en çok fotoğraflanan yer orası.\n\nDüden Şelalesi ikiye ayrılıyor. Aşağı Düden doğrudan denize dökülüyor ve teknelerden ya da falezlerden izleniyor; Yukarı Düden şehrin içinde, ağaçlık bir park içinde ve serinliğiyle yaz öğlelerinin sığınağı.\n\nKöprülü Kanyon rafting bölgesi; su soğuk, tempo ailelere göre ayarlanabiliyor ve gün yarım günden uzun sürüyor.\n\nOlympos ve Yanartaş batı yönünde: kayadan çıkan doğal alevler karanlıkta görünüyor, bu yüzden akşamüstü gidiliyor.\n\nBunların hepsini bir haftaya sığdırmak mümkün değil ve gerekmiyor. İki antik kent, bir şelale ve bir doğa günü, denizden vazgeçmeden dolu bir hafta yapıyor.",
          ar: "أنطاليا ليست ساحلاً فحسب؛ فالمنطقة تضمّ أكثف تجمّع للمدن الأثرية في تركيا، ومعظمها على أقلّ من ساعة من الفنادق.\n\nأسبندوس معروفة بمسرحها الروماني — وهو من أفضل الأمثلة المحفوظة في العالم وصوتياته تعمل إلى اليوم. وتبعد نحو خمسة وأربعين كيلومتراً شرق المركز.\n\nوبيرغه أقرب مدينة أثرية إلى المركز؛ فشارعها المعمّد وحمّاماتها وملعبها تُبقي مخطّط مدينة كاملة قائماً. ويمكن زيارتها مع أسبندوس في يوم واحد.\n\nوفي سيده تتداخل المدينة الأثرية مع المنطقة السياحية: فأعمدة معبد أبولو قائمة على حافة البحر، وهي أكثر ما يُصوَّر عند الغروب.\n\nوشلال دودان قسمان. فدودان السفلي يصبّ في البحر مباشرة ويُشاهَد من القوارب أو من الجروف؛ ودودان العلوي داخل المدينة في حديقة مشجّرة، وبرودته ملجأ ظهيرات الصيف.\n\nووادي كوبرولو منطقة التجديف؛ ماؤه بارد، والإيقاع يمكن ضبطه بحسب العائلات، واليوم فيه يتجاوز نصف اليوم.\n\nوأوليمبوس ويانارطاش غرباً: ألسنة لهب طبيعية تخرج من الصخر وتُرى في العتمة، ولذلك يُذهب إليها بعد العصر.\n\nولا يمكن حشر هذا كلّه في أسبوع ولا حاجة إليه. فمدينتان أثريتان وشلال ويوم في الطبيعة تصنع أسبوعاً ممتلئاً دون التخلّي عن البحر.",
          en: "Antalya is not only coast; the region holds Türkiye's densest cluster of ancient cities, most of them under an hour from the hotels.\n\nAspendos is known for its Roman theatre — one of the best-preserved anywhere, and its acoustics still work. About forty-five kilometres east of the centre.\n\nPerge is the closest ancient city to town; its colonnaded street, baths and stadium leave the plan of a whole city standing. It can be seen on the same day as Aspendos.\n\nAt Side the ancient town and the resort are interwoven: the columns of the Temple of Apollo stand at the water's edge, and it is the most photographed place at sunset.\n\nThe Düden waterfall comes in two parts. Lower Düden falls straight into the sea and is watched from boats or the cliffs; Upper Düden is inside the city in a wooded park, and its coolness is a refuge on summer middays.\n\nKöprülü Canyon is the rafting area; the water is cold, the pace can be set for families, and the day runs longer than half a day.\n\nOlympos and Yanartaş lie west: natural flames rise from the rock and show up in the dark, which is why people go in the late afternoon.\n\nFitting all of this into one week is not possible and not necessary. Two ancient cities, a waterfall and a day in nature make a full week without giving up the sea."
        },
      },
      {
        heading: {
          tr: "Ay ay Antalya: hava, deniz ve kalabalık",
          ar: "أنطاليا شهراً بشهر: الطقس والبحر والزحام",
          en: "Antalya month by month: weather, sea and crowds",
        },
        body: {
          tr: "Antalya'nın sezonu uzun ve aylar arasındaki fark büyük. Tarih seçimi, otel seçiminden önce gelen karar.\n\nNisan ve mayıs: hava ılık, doğa yeşil, antik kentleri gezmek için yılın en rahat dönemi. Deniz mayıs sonuna doğru ısınmaya başlıyor; mayıs başında serin gelebiliyor. Kalabalık ve fiyat düşük.\n\nHaziran: çoğu misafir için en dengeli ay. Deniz ılık, güneş henüz ağır değil, oteller tam kadro çalışıyor ama temmuz kalabalığı başlamamış.\n\nTemmuz ve ağustos: en sıcak ve en kalabalık dönem. Öğle saatlerinde dışarıda gezmek zor; program sabah erken ve akşamüstü olmak üzere ikiye bölünüyor. Fiyatlar yılın zirvesinde. Küçük çocuklu aileler için en zorlayıcı iki ay bunlar.\n\nEylül: birçok deneyimli gezgin için en iyi ay. Deniz yaz boyunca ısınmış haliyle en ılık noktasında, sıcak çekilmiş, okullar açıldığı için kalabalık azalmış.\n\nEkim ve kasım: gezmek için mükemmel, deniz ekim boyunca girilebilir kalıyor. Kasımda yağmur ihtimali artıyor ve bazı sahil otelleri sezonu kapatıyor.\n\nAralık–mart: sahil sezonu kapalı ama şehir açık. Antalya kışın yeşil kalıyor ve aynı gün sahilde on beş derece ile Toroslar'da kar mümkün. Deniz tatili arayan için değil, şehir ve doğa arayan için.",
          ar: "موسم أنطاليا طويل والفرق بين الشهور كبير. واختيار التاريخ قرار يسبق اختيار الفندق.\n\nأبريل ومايو: الجوّ لطيف والطبيعة خضراء، وهي أريح فترة في السنة لزيارة المدن الأثرية. والبحر يبدأ بالدفء قرب نهاية مايو؛ وقد يكون بارداً في أوّله. والزحام والأسعار منخفضان.\n\nيونيو: أكثر الشهور توازناً لمعظم الضيوف. البحر دافئ، والشمس لم تثقُل بعد، والفنادق تعمل بكامل طاقتها دون أن يكون زحام يوليو قد بدأ.\n\nيوليو وأغسطس: أشدّ الفترات حرّاً وازدحاماً. والتجوال في الخارج ظهراً صعب؛ فينقسم البرنامج إلى صباح باكر وما بعد العصر. والأسعار في ذروة السنة. وهذان أصعب شهرين على العائلات ذات الأطفال الصغار.\n\nسبتمبر: أفضل شهر عند كثير من المسافرين المجرَّبين. فالبحر في أدفأ نقطة بعد أن سخُن طوال الصيف، والحرّ انحسر، والزحام قلّ لعودة المدارس.\n\nأكتوبر ونوفمبر: ممتازان للتجوال، والبحر يبقى صالحاً للسباحة طوال أكتوبر. وفي نوفمبر يزيد احتمال المطر وتُغلق بعض الفنادق الساحلية موسمها.\n\nديسمبر–مارس: الموسم الساحلي مغلق لكن المدينة مفتوحة. فأنطاليا تبقى خضراء شتاءً، ويمكن في اليوم نفسه أن تكون خمس عشرة درجة على الساحل وثلجٌ في جبال طوروس. ليست لمن يطلب إجازة بحر، بل لمن يطلب المدينة والطبيعة.",
          en: "Antalya's season is long and the months differ greatly. Choosing the dates is a decision that comes before choosing the hotel.\n\nApril and May: mild weather, green countryside, the easiest time of year for the ancient cities. The sea starts warming towards the end of May; in early May it can feel cold. Crowds and prices are low.\n\nJune: the most balanced month for most guests. The sea is warm, the sun is not yet heavy, the hotels are fully staffed and the July crowds have not started.\n\nJuly and August: the hottest and busiest stretch. Being outdoors at midday is hard; the day splits into early morning and late afternoon. Prices peak. These are the two most demanding months for families with small children.\n\nSeptember: for many seasoned travellers the best month. The sea is at its warmest after a whole summer of heating, the heat has eased, and the crowds thin as schools go back.\n\nOctober and November: excellent for sightseeing, and the sea stays swimmable through October. In November the chance of rain rises and some coastal hotels close their season.\n\nDecember to March: the beach season is shut but the city is open. Antalya stays green in winter, and on the same day it can be fifteen degrees on the coast and snowing in the Taurus mountains. Not for a beach holiday — for the city and the mountains."
        },
      },
    ],
  },
  {
    slug: "bodrum-ege-rehberi",
    topic: "daytrips",
    image: "/images/places/bodrum-koy.jpg",
    title: {
      tr: "Bodrum ve Ege rehberi: koylar, marinalar ve hangi mevsim",
      ar: "دليل بودروم وبحر إيجه: الخلجان والمارينا وأي موسم",
      en: "Bodrum and the Aegean: bays, marinas and when to go",
    },
    excerpt: {
      tr: "Yarımadanın hangi ucu kime uyar, tekne turu nasıl işler, deniz ne zaman ılıktır ve Bodrum'da bir hafta nasıl geçirilir.",
      ar: "أي طرف من شبه الجزيرة يناسب مَن، وكيف تسير جولة القارب، ومتى يدفأ البحر، وكيف يُقضى أسبوع في بودروم.",
      en: "Which end of the peninsula suits whom, how boat trips work, when the sea is warm, and how to spend a week in Bodrum.",
    },
    facts: [
      {
        label: {
          tr: "Konum",
          ar: "الموقع",
          en: "Location",
        },
        value: {
          tr: "Ege kıyısı, Muğla",
          ar: "ساحل بحر إيجه، موغلا",
          en: "Aegean coast, Muğla",
        },
      },
      {
        label: {
          tr: "Deniz sezonu",
          ar: "موسم البحر",
          en: "Swimming season",
        },
        value: {
          tr: "Haziran – ekim başı",
          ar: "حزيران – أوائل تشرين الأول",
          en: "June – early October",
        },
      },
      {
        label: {
          tr: "Yarımada içi",
          ar: "داخل شبه الجزيرة",
          en: "Across the peninsula",
        },
        value: {
          tr: "Uçtan uca 40 dk",
          ar: "40 دقيقة من طرف إلى طرف",
          en: "40 min end to end",
        },
      },
    ],
    seo: {
      title: {
        tr: "Bodrum ve Ege Rehberi",
        ar: "دليل بودروم وبحر إيجه",
        en: "Bodrum and Aegean Guide",
      },
      description: {
        tr: "Yalıkavak, Gümbet, Türkbükü ve Turgutreis karşılaştırmalı; tekne turu nasıl işler, deniz hangi aylarda ılık ve yarımadada mesafeler ne kadar.",
        ar: "مقارنة بين ياليكافاك وغومبيت وتوركبوكو وتورغوتريس؛ وكيف تسير جولة القارب، وفي أي الأشهر يدفأ البحر، وكم المسافات في شبه الجزيرة.",
        en: "Yalıkavak, Gümbet, Türkbükü and Turgutreis compared: how boat trips work, which months the sea is warm, and distances across the peninsula.",
      },
    },
    faq: [
      {
        question: {
          tr: "Bodrum'da hangi koyda kalmalıyım?",
          ar: "في أي خليج أقيم في بودروم؟",
          en: "Which bay should I stay in?",
        },
        answer: {
          tr: "Yalıkavak marinasıyla en gösterişli ve en sakin uçtur; Türkbükü sakin ve butik; Gümbet ve Bitez merkeze yakın, hareketli ve daha uygun; Turgutreis gün batımıyla bilinir ve aileler için rahat. Bodrum merkez kale, çarşı ve restoranlarla en canlısı. Yarımada küçük: bir uçtan diğerine yaklaşık kırk dakika, yani kaldığınız koy tatili belirler ama hiçbir yeri kaçırmanıza sebep olmaz.",
          ar: "ياليكافاك هي الطرف الأكثر أناقة وهدوءاً بمارينتها؛ وتوركبوكو هادئة وبوتيكية؛ وغومبيت وبيتز قريبتان من المركز وأكثر حيوية وأنسب سعراً؛ وتورغوتريس تشتهر بغروبها ومريحة للعائلات. أما مركز بودروم فهو الأكثر حياة بقلعته وسوقه ومطاعمه. وشبه الجزيرة صغيرة: نحو أربعين دقيقة من طرف إلى آخر، أي أن الخليج الذي تقيم فيه يحدد طابع العطلة لكنه لا يحرمك من أي مكان.",
          en: "Yalıkavak, with its marina, is the smartest and calmest end; Türkbükü is quiet and boutique; Gümbet and Bitez are close to the centre, livelier and better value; Turgutreis is known for its sunsets and comfortable for families. Bodrum centre, with the castle, bazaar and restaurants, is the liveliest. The peninsula is small — about forty minutes end to end — so the bay you choose sets the tone of the holiday without cutting you off from anywhere.",
        },
      },
      {
        question: {
          tr: "Tekne turu nasıl işliyor?",
          ar: "كيف تسير جولة القارب؟",
          en: "How do boat trips work?",
        },
        answer: {
          tr: "Bodrum turumuzun içindeki koy turu tarifeli bir gezidir: sabah limandan kalkar, üç–dört koyda yüzme molası verir ve öğle yemeğini teknede sunar. Ekonomiktir, ama tekne başka misafirlerle paylaşılır. Yarımadada özel yat ve tekne kiralayan işletmeler de var; biz bu hizmeti vermiyoruz ve aracılık da yapmıyoruz, o yüzden onu ayrıca kendiniz ayarlamanız gerekir. Her iki durumda da mayo, havlu ve güneş koruması gerekli.",
          ar: "جولة الخلجان ضمن جولتنا في بودروم رحلة مجدولة: تنطلق صباحاً من الميناء وتتوقف للسباحة في ثلاثة أو أربعة خلجان وتقدّم الغداء على متن القارب. وهي اقتصادية، لكن القارب مشترك مع ضيوف آخرين. وفي شبه الجزيرة منشآت تؤجّر اليخوت والقوارب الخاصة أيضاً؛ ونحن لا نقدّم هذه الخدمة ولا نتوسّط فيها، فيلزم أن ترتّبها بنفسك على حدة. وفي الحالين يلزم ملابس بحر ومنشفة وواقٍ من الشمس.",
          en: "The bay trip inside our Bodrum tour is a scheduled one: it leaves the harbour in the morning, stops to swim in three or four bays and serves lunch on board. It is economical, but the boat is shared with other guests. There are businesses on the peninsula that charter private yachts and boats as well; we do not offer that service and do not broker it, so you would arrange it yourself. Either way you need swimwear, a towel and sun protection.",
        },
      },
      {
        question: {
          tr: "Bodrum'a ne zaman gitmeli?",
          ar: "متى تُزار بودروم؟",
          en: "When should you visit Bodrum?",
        },
        answer: {
          tr: "Deniz için haziran–eylül; temmuz ve ağustos en sıcak ve en kalabalık dönem, ekim başına kadar deniz ılık kalır. Mayıs ve ekim gezmek için ideal: hava ılık, koylar boş, fiyatlar düşük ama deniz serin gelebilir. Kışın yarımadanın büyük bölümü kapanır — otel ve restoran seçeneği çok azalır, o yüzden kış ayları önerilmez.",
          ar: "للبحر من حزيران إلى أيلول؛ وتموز وآب أشدّ حرارة وأكثر ازدحاماً، ويبقى البحر دافئاً حتى أوائل تشرين الأول. وأيار وتشرين الأول مثاليان للتجوّل: الجو دافئ والخلجان خالية والأسعار منخفضة، لكن البحر قد يكون بارداً. أما في الشتاء فيُغلق معظم شبه الجزيرة — إذ تقلّ خيارات الفنادق والمطاعم كثيراً، ولذلك لا نوصي بأشهر الشتاء.",
          en: "For swimming, June to September; July and August are the hottest and busiest, and the sea stays warm into early October. May and October are ideal for exploring: mild weather, empty bays, lower prices, though the sea may feel cool. In winter much of the peninsula closes — hotels and restaurants thin out sharply, so the winter months are not recommended.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Yarımada küçük, karakterleri farklı",
          ar: "شبه الجزيرة صغيرة وطباعها مختلفة",
          en: "A small peninsula with distinct characters",
        },
        body: {
          tr: "Bodrum yarımadası uçtan uca kırk dakika sürer ama her koyun kendi karakteri vardır. Kuzeyde Yalıkavak ve Türkbükü sakin ve pahalı; batıda Turgutreis gün batımıyla ve daha geniş kumsalıyla ailelere uygun; merkeze yakın Gümbet ve Bitez hareketli ve uygun fiyatlı. Merkez ise kale, çarşı ve limanla günün her saati canlıdır. Mesafeler kısa olduğu için nerede kalırsanız kalın diğerlerini gün içinde görebilirsiniz — bu, Antalya'dan en belirgin farkı.",
          ar: "تُقطع شبه جزيرة بودروم في أربعين دقيقة من طرف إلى طرف، لكن لكل خليج طباعه. ففي الشمال ياليكافاك وتوركبوكو هادئتان وغاليتان؛ وفي الغرب تناسب تورغوتريس العائلات بغروبها ورمالها الأوسع؛ وقرب المركز تنبض غومبيت وبيتز بالحياة بأسعار أنسب. أما المركز فحيّ في كل ساعات اليوم بقلعته وسوقه ومينائه. ولأن المسافات قصيرة يمكنك رؤية البقية خلال اليوم أينما أقمت — وهذا أوضح فرق عن أنطاليا.",
          en: "The Bodrum peninsula takes forty minutes end to end, yet every bay has its own character. In the north, Yalıkavak and Türkbükü are calm and expensive; to the west, Turgutreis suits families with its sunsets and wider sand; near the centre, Gümbet and Bitez are lively and better value. The centre itself, with the castle, bazaar and harbour, is alive at every hour. Because the distances are short you can see the others during the day wherever you stay — the clearest difference from Antalya.",
        },
        image: "/images/tours/bodrum.jpg",
        imageAlt: {
          tr: "Bodrum sahili ve marina",
          ar: "ساحل بودروم والمارينا",
          en: "The Bodrum shore and marina",
        },
      },
      {
        heading: {
          tr: "Denizin ve teknenin düzeni",
          ar: "نظام البحر والقارب",
          en: "How the sea and the boats work",
        },
        body: {
          tr: "Bodrum'da tatilin merkezinde tekne vardır. Günlük koy turları üç–dört koyda yüzme molası verir ve öğle yemeğini teknede sunar; tekne başka misafirlerle paylaşılır. Ege'nin suyu Akdeniz'e göre bir tık serindir; deniz haziranda ısınır, ağustosta en ılık halini alır ve ekim başına kadar girilebilir. Koyların çoğu kum değil çakıl ya da platformdur — deniz ayakkabısı işe yarar, özellikle çocuklarda.",
          ar: "القارب في قلب العطلة في بودروم. فجولات الخلجان اليومية تتوقف للسباحة في ثلاثة أو أربعة خلجان وتقدّم الغداء على متنها؛ والقارب مشترك مع ضيوف آخرين. وماء بحر إيجه أبرد قليلاً من المتوسط؛ يدفأ البحر في حزيران ويبلغ أدفأ حالاته في آب ويبقى صالحاً للسباحة حتى أوائل تشرين الأول. ومعظم الخلجان ليست رملية بل حصوية أو ذات منصات — وحذاء البحر مفيد، خاصة للأطفال.",
          en: "In Bodrum the boat is at the centre of the holiday. Day bay trips stop to swim in three or four bays and serve lunch on board; the boat is shared with other guests. Aegean water is a touch cooler than the Mediterranean; the sea warms in June, peaks in August and stays swimmable into early October. Most bays are pebble or platform rather than sand — water shoes help, especially with children.",
        },
      },
      {
        heading: {
          tr: "Kaç gün ve neyle birlikte",
          ar: "كم يوماً ومع ماذا",
          en: "How many days, and with what",
        },
        body: {
          tr: "Yalnız Bodrum için üç–dört gün yeterli: bir gün merkez ve kale, bir gün tekne turu, bir gün koylarda serbest zaman. Daha uzun kalacaksanız Didim, Milas ya da Efes günübirlik eklenebilir. İstanbul'la birleştirmek de yaygın: dört gün İstanbul, ardından kısa bir iç hat uçuşuyla dört gün Bodrum. Şehir ve deniz arka arkaya geldiğinde seyahat monotonlaşmıyor — Karadeniz rotasıyla aynı mantık, sadece yeşil yerine mavi.",
          ar: "لبودروم وحدها تكفي ثلاثة أو أربعة أيام: يوم للمركز والقلعة، ويوم لجولة القارب، ويوم حر في الخلجان. وإن أطلت الإقامة فيمكن إضافة ديديم أو ميلاس أو أفسس كرحلة يومية. والدمج مع إسطنبول شائع أيضاً: أربعة أيام في إسطنبول ثم أربعة في بودروم برحلة داخلية قصيرة. وحين تتعاقب المدينة والبحر لا تصبح الرحلة رتيبة — المنطق نفسه في مسار البحر الأسود، لكن بالأزرق بدل الأخضر.",
          en: "For Bodrum alone, three or four days is enough: one for the centre and castle, one for a boat trip, one free in the bays. Staying longer, Didim, Milas or Ephesus can be added as day trips. Combining with Istanbul is common too: four days in Istanbul, then four in Bodrum on a short domestic flight. City followed by sea keeps the trip from becoming monotonous — the same logic as the Black Sea route, with blue instead of green.",
        },
      },
      {
        heading: {
          tr: "Denize nasıl giriliyor: çakıl, platform ve iskele",
          ar: "كيف يُنزل إلى البحر: الحصى والمنصّات والأرصفة",
          en: "How you get into the water: pebble, platform and jetty",
        },
        body: {
          tr: "Bodrum'u Antalya'dan ayıran en somut şey sahilin biçimi. Buraya geniş kumsal beklentisiyle gelen misafir şaşırıyor.\n\nYarımadanın koylarının çoğu çakıl ya da kayalık. Birçok otel ve plaj kulübü denize kumdan değil, betonarme platformdan ya da ahşap iskeleden giriyor: merdivenle iniliyor ve su birkaç adımda derinleşiyor. Bu düzen yüzme bilen yetişkin için rahat ve suyu berrak tutuyor — ama sığ suda oynayan küçük çocuk için uygun değil.\n\nKumsal arayan aileler için yarımadanın batı ucu daha iyi: Turgutreis ve çevresindeki koylarda kum daha yaygın ve giriş kademeli. Gümbet'te de kum var. Yalıkavak ve Türkbükü ise ağırlıklı olarak platform düzeni.\n\nPratik sonuçlar birkaç madde: deniz ayakkabısı hemen herkes için gerekli; küçük çocuklu ailelerde otelin havuzu denizden daha çok kullanılıyor, bu yüzden havuzun çocuk bölümü olup olmadığı gerçek bir soru; ve otel ilanındaki \"özel plaj\" ifadesi kumsal anlamına gelmiyor, çoğu zaman platform demek.\n\nRezervasyondan önce sorulacak tek cümle şu: \"Denize kumdan mı, platformdan mı giriliyor?\" Cevabı ilan metninde neredeyse hiç yazmıyor.",
          ar: "أوضح ما يفرّق بودروم عن أنطاليا هو شكل الشاطئ. والضيف الذي يأتي متوقّعاً شاطئاً رملياً واسعاً يُفاجأ.\n\nفمعظم خلجان شبه الجزيرة حصوية أو صخرية. وكثير من الفنادق ونوادي الشاطئ يُنزَل منها إلى البحر لا من الرمل بل من منصّة خرسانية أو رصيف خشبي: يُنزَل بسُلّم ويعمُق الماء بعد خطوات. وهذا الترتيب مريح للبالغ الذي يُحسن السباحة ويُبقي الماء صافياً — لكنه لا يناسب طفلاً صغيراً يلعب في الماء الضحل.\n\nوللعائلات التي تبحث عن الرمل يكون الطرف الغربي من شبه الجزيرة أفضل: ففي تورغوت ريس والخلجان حولها الرملُ أوسع انتشاراً والنزول متدرّج. وفي غومبت رمل أيضاً. أما ياليكاواك وتوركبوكو فيغلب عليهما نظام المنصّات.\n\nوالنتائج العملية بنود قليلة: حذاء البحر لازم للجميع تقريباً؛ وفي العائلات ذات الأطفال الصغار يُستعمل مسبح الفندق أكثر من البحر، فيصير وجود قسم للأطفال في المسبح سؤالاً حقيقياً؛ وعبارة «شاطئ خاص» في إعلان الفندق لا تعني الرمل، بل تعني المنصّة في الغالب.\n\nوالجملة الواحدة التي تُسأل قبل الحجز: «هل النزول إلى البحر من الرمل أم من منصّة؟» فجوابها لا يكاد يُكتب في نصّ الإعلان.",
          en: "The most concrete thing that separates Bodrum from Antalya is the shape of the shore. A guest who arrives expecting a wide sandy beach is surprised.\n\nMost of the peninsula's bays are pebble or rock. Many hotels and beach clubs enter the water not from sand but from a concrete platform or a wooden jetty: you go down a ladder and it deepens within a few steps. That arrangement is comfortable for an adult who swims and keeps the water clear — but it does not suit a small child playing in the shallows.\n\nFor families wanting sand, the western end of the peninsula is better: sand is more common around Turgutreis and its bays, and the entry is gradual. Gümbet has sand too. Yalıkavak and Türkbükü are mostly platform.\n\nA few practical consequences: water shoes are needed by almost everyone; families with small children use the hotel pool more than the sea, which makes whether the pool has a children's section a real question; and \"private beach\" in a listing does not mean sand — it usually means a platform.\n\nOne sentence to ask before booking: \"Do you enter the sea from sand or from a platform?\" The answer is almost never in the listing text."
        },
      },
      {
        heading: {
          tr: "Yarımadanın dışına: hangi günübirlik gerçekçi",
          ar: "خارج شبه الجزيرة: أي رحلة يوم واحد واقعية",
          en: "Beyond the peninsula: which day trips are realistic",
        },
        body: {
          tr: "Bodrum'da bir hafta kalan misafirin çoğu bir gün başka bir yer görmek istiyor. Hepsi aynı ölçüde mantıklı değil.\n\nDidim gerçekçi. Tek yön yaklaşık iki saat; Apollon Tapınağı'nın devasa sütunları ve Altınkum sahili aynı gün görülebiliyor. Yol boyunca zeytinlikler ve Milas ovası var.\n\nEfes de gerçekçi ama uzun. Tek yön iki buçuk–üç saat; yani gidiş-dönüş beş-altı saat araç. Antik kent geniş ve gölgesiz, yazın sabah erken gidilmesi gerekiyor. Bir günde yapılabiliyor, ama gün dolu geçiyor ve akşam yorgunluk oluyor.\n\nPamukkale günübirlik olarak önerilmiyor. Bodrum'dan tek yön dört saati aşıyor; sekiz saat araç, iki saat gezme demek — özellikle çocuklu ailelerde işe yaramıyor. Pamukkale'yi görmek istiyorsanız programı ya bir gece konaklamalı kuruyoruz ya da tatilin başka bir noktasına yerleştiriyoruz.\n\nYarımada içinde kalanlar zaten kısa: Gümüşlük'te akşamüstü, Yalıkavak marinası, Bodrum kalesi ve çarşısı — hiçbiri bir saati geçmiyor.\n\nGenel kural: Bodrum'da geçirilen bir haftaya en fazla bir uzun günübirlik sığıyor. İkisini üst üste koymak, tatilin ortasını yola çeviriyor.",
          ar: "معظم من يقيم أسبوعاً في بودروم يريد رؤية مكان آخر في يوم منه. وليست كلّها معقولة بالقدر نفسه.\n\nديديم واقعية. نحو ساعتين في الاتجاه الواحد؛ ويمكن رؤية أعمدة معبد أبولو الهائلة وشاطئ ألتين كوم في اليوم نفسه. وعلى الطريق بساتين زيتون وسهل ميلاس.\n\nوأفسس واقعية أيضاً لكنها طويلة. ساعتان ونصف إلى ثلاث في الاتجاه الواحد؛ أي خمس إلى ست ساعات ذهاباً وإياباً في السيارة. والمدينة الأثرية واسعة بلا ظلّ، فيلزم الذهاب صباحاً باكراً في الصيف. تُنجَز في يوم، لكن اليوم يمتلئ ويأتي التعب مساءً.\n\nوباموكّاله لا تُنصح كرحلة يوم واحد. فالاتجاه الواحد من بودروم يتجاوز أربع ساعات؛ أي ثماني ساعات سيارة وساعتين تجوالاً — ولا ينفع ذلك خصوصاً مع العائلات ذات الأطفال. فإن أردت رؤية باموكّاله بنينا البرنامج بمبيت ليلة أو وضعناها في نقطة أخرى من الإجازة.\n\nأما ما هو داخل شبه الجزيرة فقصير أصلاً: عصر في غوموشلوك، ومرسى ياليكاواك، وقلعة بودروم وسوقها — ولا يتجاوز أيّ منها ساعة.\n\nوالقاعدة العامة: لا يتّسع أسبوع في بودروم لأكثر من رحلة يوم واحد طويلة. ووضع اثنتين متتاليتين يحوّل منتصف الإجازة إلى طريق.",
          en: "Most guests staying a week in Bodrum want to see somewhere else for a day. Not all of the options make equal sense.\n\nDidim is realistic. About two hours each way; the vast columns of the Temple of Apollo and Altınkum beach fit into one day. The road runs past olive groves and the Milas plain.\n\nEphesus is realistic too, but long. Two and a half to three hours each way — five to six hours in the car altogether. The ancient city is large and unshaded, so in summer you have to go early. It can be done in a day, but the day is full and the evening is tired.\n\nPamukkale is not recommended as a day trip. It is over four hours each way from Bodrum: eight hours of driving for two hours of sightseeing — which does not work, especially with children. If you want to see Pamukkale we either build the programme with an overnight stay or place it elsewhere in the holiday.\n\nWhat lies inside the peninsula is short anyway: a late afternoon at Gümüşlük, the Yalıkavak marina, Bodrum castle and its bazaar — none of them more than an hour away.\n\nThe general rule: a week in Bodrum has room for at most one long day trip. Putting two back to back turns the middle of the holiday into a road."
        },
      },
      {
        heading: {
          tr: "Ay ay Bodrum ve kışın neden kapalı",
          ar: "بودروم شهراً بشهر ولماذا تُغلق شتاءً",
          en: "Bodrum month by month, and why it closes in winter",
        },
        body: {
          tr: "Bodrum'un sezonu Antalya'dan kısa ve bu, tarih seçimini daha önemli yapıyor.\n\nMayıs: hava ılık, koylar boş, fiyatlar düşük. Deniz yüzmek için çoğu misafire serin gelir; gezmek ve yürümek için iyi.\n\nHaziran: deniz ısınmıştır, yarımada tamamen açıktır ve temmuz kalabalığı henüz yoktur. Ailelere en uygun ay.\n\nTemmuz–ağustos: en sıcak, en kalabalık ve en pahalı dönem. Yollar akşamları yoğunlaşıyor, marina çevresinde park sorun oluyor ve tekne turlarında yer bulmak önceden ayarlamayı gerektiriyor. Meltem rüzgârı öğleden sonra kuvvetleniyor — bu sıcağı katlanılır kılıyor ama denizi dalgalandırıyor.\n\nEylül: yılın en dengeli ayı. Deniz yaz boyunca ısınmış haliyle en ılık noktasında, kalabalık dağılmış, hava hâlâ sıcak.\n\nEkim: deniz ay ortasına kadar girilebiliyor, hava gezmek için ideal. Ay sonuna doğru işletmeler kapanmaya başlıyor.\n\nKasım–nisan: yarımadanın büyük bölümü kapalı. Bu bir tercih değil, yapının kendisi — koylardaki otellerin, plaj kulüplerinin ve restoranların çoğu mevsimlik işletme ve kışın hizmet vermiyor. Bodrum merkezde ve Yalıkavak'ta yıl boyu açık birkaç yer kalıyor, ama seçenek çok daralıyor. Kış tatili için Bodrum doğru yer değil; bu aylarda Antalya ya da şehir programları daha iyi karşılık veriyor.",
          ar: "موسم بودروم أقصر من موسم أنطاليا، وهذا يجعل اختيار التاريخ أهمّ.\n\nمايو: الجوّ لطيف والخلجان خالية والأسعار منخفضة. والبحر يبدو بارداً للسباحة عند معظم الضيوف؛ لكنه شهر جيّد للتجوال والمشي.\n\nيونيو: البحر قد دفئ، وشبه الجزيرة مفتوحة تماماً، وزحام يوليو لم يأتِ بعد. وهو أنسب شهر للعائلات.\n\nيوليو وأغسطس: أشدّ الفترات حرّاً وازدحاماً وأغلاها. والطرق تزدحم مساءً، والوقوف حول المرسى يصير مشكلة، ويستلزم إيجادُ مكان في جولات القوارب ترتيباً مسبقاً. وريح الميلتيم تشتدّ بعد الظهر — فتجعل الحرّ محتملاً لكنها تُموّج البحر.\n\nسبتمبر: أكثر شهور السنة توازناً. فالبحر في أدفأ نقطة بعد صيف كامل من التسخين، والزحام تفرّق، والجوّ ما يزال دافئاً.\n\nأكتوبر: البحر صالح للسباحة حتى منتصف الشهر، والجوّ مثالي للتجوال. ومع نهايته تبدأ المنشآت بالإغلاق.\n\nنوفمبر–أبريل: القسم الأكبر من شبه الجزيرة مغلق. وليس هذا اختياراً بل بنية المكان نفسها — فمعظم فنادق الخلجان ونوادي الشاطئ والمطاعم منشآت موسمية لا تعمل شتاءً. ويبقى في مركز بودروم وفي ياليكاواك بضعة أماكن مفتوحة طوال السنة، لكن الخيارات تضيق كثيراً. فبودروم ليست المكان الصحيح لإجازة شتوية؛ وأنطاليا أو برامج المدن تعطي في هذه الشهور مقابلاً أفضل.",
          en: "Bodrum's season is shorter than Antalya's, which makes the choice of dates matter more.\n\nMay: mild weather, empty bays, low prices. The sea feels cool for swimming to most guests; good for walking and looking around.\n\nJune: the sea has warmed, the peninsula is fully open, and the July crowds have not arrived. The best month for families.\n\nJuly and August: the hottest, busiest and most expensive stretch. The roads fill in the evenings, parking around the marina becomes a problem, and getting a place on a boat trip needs arranging in advance. The meltem wind picks up in the afternoon — it makes the heat bearable but roughens the sea.\n\nSeptember: the most balanced month of the year. The sea is at its warmest after a whole summer, the crowds have dispersed, and it is still hot.\n\nOctober: the sea is swimmable until mid-month and the weather is ideal for sightseeing. Towards the end of the month businesses begin to close.\n\nNovember to April: most of the peninsula is shut. This is not a preference but the structure of the place — most of the bay hotels, beach clubs and restaurants are seasonal and do not operate in winter. A few places in Bodrum town and Yalıkavak stay open year-round, but the choice narrows sharply. Bodrum is not the right place for a winter holiday; in these months Antalya or a city programme gives better value."
        },
      },
      {
        heading: {
          tr: "Aileyle Bodrum: hangi koy, neyi beklememeli",
          ar: "بودروم مع العائلة: أيّ خليج، وما لا ينبغي توقّعه",
          en: "Bodrum with the family: which bay, and what not to expect",
        },
        body: {
          tr: "Bodrum tek bir tatil değil ve bu, aileler için hem fırsat hem risk.\n\nAçık yazalım: yarımadanın bazı bölgeleri gece hayatı üzerine kurulu. Bodrum merkezin bar sokağı ve Gümbet, yaz gecelerinde geç saate kadar müzik ve kalabalık demek. Bu bölgeler eğlence arayan genç gruplar için doğru; küçük çocuklu bir aile için değil. İlan fotoğraflarından bunu anlamak mümkün olmuyor.\n\nAileler için daha rahat olan uçlar şunlar. Turgutreis: batıya baktığı için gün batımı, daha geniş kum ve sakin bir sahil bandı; haftalık pazarı da var. Yalıkavak: sakin ve düzenli, marina çevresi yürüyüş için rahat, ama fiyat yarımadanın üst ucunda. Bitez: merkeze yakın olmasına rağmen sakin, mandalina bahçeleriyle çevrili. Gümüşlük: en sessizi, akşamüstü sahilde yemek için biliniyor.\n\nBeklenmemesi gerekenler de var. Bodrum'da Antalya'daki gibi geniş araziler üzerine kurulu, kaydırak ve çocuk kulübü içeren dev her şey dahil tesisler yaygın değil; buradaki oteller daha küçük ve butik ölçekli. Çocuk için gün boyu program sunan bir tesis arıyorsanız Antalya bölgesi bu ihtiyaca daha çok cevap veriyor.\n\nBunu baştan söylüyoruz çünkü yanlış bölge seçimi tatilin ilk gününde anlaşılıyor ve o noktada değiştirmek zor. Kaç kişi olduğunuzu, çocukların yaşını ve ne beklediğinizi yazarsanız hangi koyun size uyduğunu birlikte belirleriz — koyu ve oteli siz seçersiniz, biz yalnız alanı daraltırız.",
          ar: "بودروم ليست إجازة واحدة، وهذا فرصة وخطر معاً للعائلات.\n\nولنكتبها صريحة: بعض مناطق شبه الجزيرة قائمة على حياة الليل. فشارع الحانات في مركز بودروم وغومبت يعنيان في ليالي الصيف موسيقى وزحاماً حتى وقت متأخر. وهذه المناطق مناسبة لمجموعات الشباب الباحثين عن السهر؛ لا لعائلة معها أطفال صغار. ولا يمكن إدراك ذلك من صور الإعلانات.\n\nوالأطراف الأريح للعائلات هي هذه. تورغوت ريس: تطلّ غرباً فلها الغروب، ورملها أوسع وشريطها الساحلي هادئ؛ ولها سوق أسبوعي أيضاً. وياليكاواك: هادئة مرتّبة ومحيط المرسى مريح للمشي، لكن السعر في الطرف الأعلى من شبه الجزيرة. وبيتز: هادئة رغم قربها من المركز، تحيط بها بساتين اليوسفي. وغوموشلوك: أهدؤها، وتُعرف بالعشاء على الشاطئ بعد العصر.\n\nوثمّة ما لا ينبغي توقّعه أيضاً. فالمنشآت الضخمة القائمة على أراضٍ واسعة بنظام «كل شيء مشمول» ومزالق ونوادي أطفال، كما في أنطاليا، ليست شائعة في بودروم؛ ففنادقها أصغر وأقرب إلى حجم البوتيك. فإن كنت تبحث عن منشأة تقدّم برنامجاً للطفل طوال اليوم فمنطقة أنطاليا تلبّي هذه الحاجة أكثر.\n\nونقول هذا من البداية لأن اختيار المنطقة الخطأ يتبيّن في أول يوم من الإجازة، وتغييره عندئذٍ صعب. فاكتب لنا عددكم وأعمار الأطفال وما تتوقّعونه نحدّد معاً أيّ خليج يناسبكم — الخليج والفندق اختياركم، ونحن نضيّق المجال فحسب.",
          en: "Bodrum is not one holiday, and for families that is both an opportunity and a risk.\n\nLet us say it plainly: parts of the peninsula are built around nightlife. The bar street in Bodrum town and Gümbet mean music and crowds until late on summer nights. Those areas are right for young groups looking for that; they are not right for a family with small children. You cannot tell from listing photographs.\n\nThe easier ends for families are these. Turgutreis: facing west, so it has the sunset, wider sand and a calm shore strip; it also has a weekly market. Yalıkavak: quiet and orderly, with the marina area pleasant to walk, though the price is at the top end of the peninsula. Bitez: quiet despite being close to town, ringed by tangerine groves. Gümüşlük: the quietest, known for eating by the water in the late afternoon.\n\nThere are also things not to expect. The huge all-inclusive resorts on wide grounds with slides and kids' clubs, as in Antalya, are not common in Bodrum; the hotels here are smaller and closer to boutique scale. If you want a property that runs a full day's programme for a child, the Antalya region answers that need better.\n\nWe say this from the start because choosing the wrong area shows up on the first day of the holiday, and it is hard to change by then. Write us how many you are, the children's ages and what you are expecting, and we will work out together which bay suits you — the bay and the hotel are your choice, we only narrow the field."
        },
      },
    ],
  },
  {
    slug: "turkiyede-para-kart-ve-odeme",
    topic: "practical",
    image: "/images/places/kapalicarsi.jpg",
    title: {
      tr: "Türkiye'de para, kart ve ödeme: neyi nerede kullanırsınız",
      ar: "النقود والبطاقات والدفع في تركيا: ماذا تستخدم وأين",
      en: "Money, cards and payment in Türkiye: what works where",
    },
    excerpt: {
      tr: "Nakit mi kart mı, döviz nerede bozdurulur, bahşiş ne kadar — pratik cevaplar, kur tahmini yok.",
      ar: "نقداً أم بالبطاقة، وأين تصرف العملة، وكم البقشيش — إجابات عملية بلا تخمين لسعر الصرف.",
      en: "Cash or card, where to change money, how much to tip — practical answers, no rate guessing.",
    },
    seo: {
      title: {
        tr: "Türkiye'de Para, Kart ve Ödeme Rehberi",
        ar: "دليل النقود والبطاقات والدفع في تركيا",
        en: "Money, Cards and Payment in Türkiye",
      },
      description: {
        tr: "Nakit mi kart mı, dövizi nerede bozdurmalı, bahşiş ne kadar, kart neden reddedilir. Körfez'den gelen misafir için pratik ödeme rehberi.",
        ar: "نقداً أم بالبطاقة، وأين تصرف العملة، وكم البقشيش، ولماذا تُرفض البطاقة. دليل دفع عملي لضيوف الخليج.",
        en: "Cash or card, where to change money, how much to tip, why a card gets declined. A practical payment guide for Gulf visitors.",
      },
    },
    facts: [
      {
        label: { tr: "Para birimi", ar: "العملة", en: "Currency" },
        value: { tr: "Türk lirası (TL / ₺)", ar: "الليرة التركية (TL / ₺)", en: "Turkish lira (TL / ₺)" },
      },
      {
        label: { tr: "Kart geçerliliği", ar: "قبول البطاقات", en: "Card acceptance" },
        value: { tr: "Şehirde çok yaygın; pazarda ve küçük esnafta değil", ar: "واسع جداً في المدينة؛ لا في السوق الشعبي والدكاكين الصغيرة", en: "Very wide in the city; not in markets and small shops" },
      },
      {
        label: { tr: "Bozdurma", ar: "الصرافة", en: "Exchange" },
        value: { tr: "Şehirdeki döviz bürosu, havalimanı değil", ar: "مكاتب الصرافة في المدينة، لا في المطار", en: "Exchange offices in the city, not the airport" },
      },
      {
        label: { tr: "Bahşiş", ar: "البقشيش", en: "Tipping" },
        value: { tr: "Zorunlu değil; restoranda %5-10 âdet", ar: "غير إلزامي؛ المعتاد 5-10% في المطاعم", en: "Not required; 5-10% is customary in restaurants" },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Nakit mi kart mı: ikisi de lazım",
          ar: "نقداً أم بالبطاقة: تحتاج الاثنين",
          en: "Cash or card: you need both",
        },
        body: {
          tr: "Türkiye'de kartla ödeme çok yaygın. Restoran, otel, alışveriş merkezi, market, taksi, müze — hepsinde kart geçiyor ve temassız ödeme standart. Ama kartın işe yaramadığı yerler de var ve bunlar tam da misafirin gitmek istediği yerler: Kapalıçarşı'daki küçük tezgâhlar, sokak satıcıları, semt pazarları, bazı küçük lokantalar ve bahşiş. Cebinizde her zaman biraz nakit bulunsun; günlük harcamanın küçük kısmını nakit, büyük kısmını kart olarak planlamak işi görüyor.\n\nKartınızın yurt dışı kullanıma açık olduğundan emin olun ve seyahat tarihlerinizi bankanıza bildirin. Körfez bankalarının çoğunda bu, uygulamadan tek dokunuşla yapılan bir ayar. Bildirmeyen misafirin kartı ilk büyük harcamada güvenlik nedeniyle bloke oluyor ve bunu çözmek yurt dışından telefonla uğraşmak demek.",
          ar: "الدفع بالبطاقة واسع الانتشار في تركيا. المطاعم والفنادق والمولات والأسواق والتاكسي والمتاحف — كلها تقبل البطاقة، والدفع اللاتلامسي هو المعتاد. لكن هناك أماكن لا تنفع فيها البطاقة، وهي بالضبط الأماكن التي يريد الضيف الذهاب إليها: البسطات الصغيرة في السوق المسقوف، والباعة في الشارع، وأسواق الأحياء، وبعض المطاعم الصغيرة، والبقشيش. فليكن في جيبك دائماً بعض النقد؛ ويكفي أن تخطط لجزء صغير من المصروف اليومي نقداً والجزء الأكبر بالبطاقة.\n\nتأكد أن بطاقتك مفعّلة للاستخدام خارج البلد، وأبلغ مصرفك بتواريخ سفرك. في معظم مصارف الخليج هذا إعداد يتم بلمسة واحدة من التطبيق. ومن لا يُبلغ تُحجب بطاقته عند أول عملية كبيرة لأسباب أمنية، وحلّ ذلك يعني الاتصال بالمصرف من خارج البلد.",
          en: "Card payment is very widespread in Türkiye. Restaurants, hotels, malls, supermarkets, taxis, museums — all take cards, and contactless is standard. But there are places where a card is no use, and they are precisely the places guests want to go: the small stalls in the Grand Bazaar, street vendors, neighbourhood markets, some small restaurants, and tips. Always keep some cash on you; planning a small part of your daily spending as cash and the larger part on card works well.\n\nMake sure your card is enabled for use abroad and tell your bank your travel dates. At most Gulf banks this is a single tap in the app. A guest who does not do it finds the card blocked for security at the first large purchase — and fixing that means phoning the bank from another country.",
        },
      },
      {
        heading: {
          tr: "Dövizi nerede bozdurmalı",
          ar: "أين تصرف العملة",
          en: "Where to change money",
        },
        body: {
          tr: "Havalimanındaki döviz bürolarının kuru şehirdekilerden belirgin biçimde kötüdür. Bunun sebebi kötü niyet değil, kira: terminal içindeki bir metrekare şehirdekinin katı. Havalimanında yalnız ilk gün lazım olacak kadar bozdurun, gerisini şehirde yapın.\n\nŞehirde döviz bürosu her yerde var ve kurları vitrinde yazılı. Alış-satış farkı düşük olan bürolar genellikle turistik olmayan sokaklarda; Sultanahmet'in ana caddesindeki büro ile iki sokak arkadaki arasında gözle görülür fark çıkabiliyor. Bozdururken pasaport isteniyor, bu normal. Sokakta \"daha iyi kur\" diyerek yaklaşan kişilerden bozdurmayın.\n\nBankamatikten TL çekmek de mümkün ama iki ücret birden çıkabiliyor: bankamatiğin kendi ücreti ve kendi bankanızın yurt dışı işlem ücreti. Çekim yaparken ekranda \"kendi para biriminizde ödeyin\" seçeneği çıkarsa reddedin; o dönüşümün kuru genellikle kartınızın kurundan kötüdür.",
          ar: "سعر مكاتب الصرافة في المطار أسوأ بوضوح من أسعار المدينة. والسبب ليس سوء نية بل الإيجار: المتر المربع داخل الصالة يساوي أضعاف مثيله في المدينة. اصرف في المطار ما يكفي اليوم الأول فقط، والباقي في المدينة.\n\nمكاتب الصرافة منتشرة في المدينة وأسعارها معلّقة على الواجهة. والمكاتب ذات الفارق الأقل بين الشراء والبيع تكون غالباً في شوارع غير سياحية؛ وقد يظهر فرق ملموس بين مكتب على الشارع الرئيسي في السلطان أحمد وآخر على بُعد شارعين. ويُطلب جواز السفر عند الصرف، وهذا أمر طبيعي. ولا تصرف عند من يقترب منك في الشارع عارضاً \"سعراً أفضل\".\n\nيمكن أيضاً سحب الليرة من الصراف الآلي، لكن قد تُحتسب رسمان معاً: رسم الجهاز نفسه ورسم مصرفك على العمليات الخارجية. وإذا ظهر لك على الشاشة خيار \"الدفع بعملتك\" فارفضه؛ فسعر ذلك التحويل أسوأ عادةً من سعر بطاقتك.",
          en: "The exchange offices at the airport give noticeably worse rates than those in the city. The reason is not bad faith but rent: a square metre inside the terminal costs many times one in town. Change only what you need for the first day at the airport and do the rest in the city.\n\nExchange offices are everywhere in town and their rates are posted in the window. The ones with the narrowest buy-sell spread are usually on non-touristic streets; there can be a visible difference between an office on the main street in Sultanahmet and one two streets back. You will be asked for your passport, which is normal. Do not change money with anyone who approaches you in the street offering \"a better rate\".\n\nWithdrawing lira from an ATM is also possible, but two fees can apply: the machine's own fee and your bank's foreign transaction fee. If the screen offers to \"pay in your own currency\", decline; that conversion rate is usually worse than your card's.",
        },
      },
      {
        heading: {
          tr: "Bahşiş: ne kadar, nerede",
          ar: "البقشيش: كم وأين",
          en: "Tipping: how much and where",
        },
        body: {
          tr: "Türkiye'de bahşiş zorunlu değil ve kimse sizden istemez, ama yaygındır. Restoranda memnun kaldıysanız hesabın yüzde beş-onu âdettendir; hesaba servis ücreti eklenmişse ayrıca bahşiş beklenmez. Kahve ya da çay gibi küçük hesaplarda para üstünü bırakmak yeterli.\n\nOtelde bavulu odaya çıkaran görevliye ve oda temizliğine küçük bir miktar bırakmak yaygın. Taksi ve özel transferde bahşiş beklenmiyor; para üstünü yuvarlamak âdet. Rehberli bir turdan memnun kaldıysanız gün sonunda vermek isteyebilirsiniz ama bu tamamen isteğe bağlı.\n\nBizim şoförlerimiz bahşiş istemez ve fiyatın içinde böyle bir kalem yoktur. Vermek isterseniz kabul edilir, vermezseniz hizmet aynıdır — bunu yazıyoruz çünkü \"ne kadar vermem gerekiyor\" sorusu misafirin yolculuk boyunca kafasında dolaşan gereksiz bir yük oluyor.",
          ar: "البقشيش في تركيا غير إلزامي ولا يطلبه منك أحد، لكنه شائع. إذا أعجبك المطعم فمن المعتاد ترك خمسة إلى عشرة بالمئة من الفاتورة؛ وإن كانت رسوم الخدمة مضافة إلى الفاتورة فلا يُتوقع بقشيش إضافي. وفي الحسابات الصغيرة كالقهوة والشاي يكفي ترك الباقي.\n\nوفي الفندق يشيع ترك مبلغ صغير لمن يحمل الحقائب إلى الغرفة ولعاملات التنظيف. أما التاكسي والنقل الخاص فلا يُتوقع فيهما بقشيش؛ والمعتاد تقريب الباقي. وإذا أعجبتك جولة بمرشد فقد ترغب في إعطائه شيئاً في نهاية اليوم، لكن هذا اختياري تماماً.\n\nسائقونا لا يطلبون بقشيشاً وليس في السعر بند من هذا النوع. إن أردت أن تعطي فسيُقبل، وإن لم تعطِ فالخدمة هي نفسها — ونكتب هذا لأن سؤال \"كم ينبغي أن أعطي\" يبقى عبئاً لا لزوم له في ذهن الضيف طوال الرحلة.",
          en: "Tipping in Türkiye is not compulsory and nobody will ask you for it, but it is common. If you were happy with a restaurant, five to ten per cent of the bill is customary; if a service charge is already on the bill, no further tip is expected. On small bills like coffee or tea, leaving the change is enough.\n\nAt a hotel it is common to leave a small amount for the person who carries your bags up and for housekeeping. Taxis and private transfers do not expect a tip; rounding up is the custom. If you enjoyed a guided tour you may want to give something at the end of the day, but it is entirely optional.\n\nOur drivers do not ask for tips and there is no such line in the price. If you want to give something it will be accepted; if you do not, the service is the same — we write this down because \"how much am I supposed to give\" becomes an unnecessary weight in a guest's mind for the whole trip.",
        },
      },
      {
        heading: {
          tr: "Kartın reddedilmesinin üç sebebi",
          ar: "ثلاثة أسباب لرفض البطاقة",
          en: "Three reasons a card gets declined",
        },
        body: {
          tr: "Birincisi bankanızın güvenlik kilidi: yurt dışından ilk büyük harcamada kart otomatik bloke olabiliyor. Seyahat bildirimi bunu önlüyor.\n\nİkincisi temassız limiti. Türkiye'de belli bir tutarın üstündeki temassız ödemelerde şifre isteniyor; kartınızın şifresini bilmiyorsanız (Körfez'de sık sık yalnız temassız kullanıldığı için hatırlanmıyor) ödeme geçmiyor. Yola çıkmadan şifrenizi teyit edin.\n\nÜçüncüsü kartın yurt dışı e-ticaret ve POS ayarlarının kapalı olması. Bu ayar bazı bankalarda varsayılan olarak kapalı geliyor ve yalnız uygulamadan açılıyor.\n\nHepsinin ortak çözümü aynı: yola çıkmadan bankayı arayıp üç şeyi teyit etmek — yurt dışı kullanım açık mı, günlük limit ne, kartın şifresi ne. Beş dakikalık bir iş, ama yapılmadığında tatil ortasında saatler alıyor.",
          ar: "الأول هو القفل الأمني في مصرفك: قد تُحجب البطاقة تلقائياً عند أول عملية كبيرة من خارج البلد. وإشعار السفر يمنع ذلك.\n\nوالثاني حدّ الدفع اللاتلامسي. ففي تركيا يُطلب الرقم السري للمبالغ فوق حدّ معيّن؛ وإن كنت لا تعرف رقم بطاقتك (وهو أمر شائع في الخليج حيث يُستخدم اللاتلامسي وحده غالباً) فلن تمرّ العملية. تأكد من رقمك قبل السفر.\n\nوالثالث أن تكون إعدادات الشراء الخارجي ونقاط البيع مغلقة في البطاقة. هذا الإعداد مغلق افتراضياً في بعض المصارف ولا يُفتح إلا من التطبيق.\n\nوالحل واحد للثلاثة: اتصل بمصرفك قبل السفر وتأكد من ثلاثة أمور — هل الاستخدام الخارجي مفتوح، وما الحد اليومي، وما الرقم السري للبطاقة. عمل يستغرق خمس دقائق، لكن تركه يكلّف ساعات في منتصف الإجازة.",
          en: "The first is your bank's security lock: a card can be blocked automatically at the first large purchase from abroad. A travel notification prevents this.\n\nThe second is the contactless limit. In Türkiye a PIN is requested above a certain amount; if you do not know your card's PIN — common in the Gulf, where contactless alone is often used — the payment will not go through. Confirm your PIN before you travel.\n\nThe third is the card's foreign e-commerce and point-of-sale settings being switched off. At some banks this is off by default and can only be turned on in the app.\n\nThe fix for all three is the same: call your bank before you leave and confirm three things — is foreign use enabled, what is the daily limit, and what is the card's PIN. Five minutes of work that costs hours in the middle of a holiday when it is skipped.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'ye ne kadar nakit getirmeliyim?", ar: "كم من النقد ينبغي أن أحضر إلى تركيا؟", en: "How much cash should I bring to Türkiye?" },
        answer: {
          tr: "Kesin bir rakam veremeyiz çünkü harcama biçimi kişiden kişiye çok değişiyor. Pratik yaklaşım şu: otel, tur ve restoran gibi büyük kalemleri kartla ödemeyi planlayın, nakdi çarşı, pazar, küçük lokanta ve bahşiş gibi günlük küçük harcamalar için ayırın. Yanınızda az bir döviz getirip şehirde bozdurmak, çok nakit taşımaktan hem güvenli hem kolay.",
          ar: "لا نستطيع إعطاء رقم قاطع لأن طريقة الإنفاق تختلف كثيراً من شخص لآخر. والنهج العملي هو: خطّط لدفع البنود الكبيرة كالفندق والجولات والمطاعم بالبطاقة، واحتفظ بالنقد للمصاريف اليومية الصغيرة كالسوق والمطاعم الصغيرة والبقشيش. وإحضار مبلغ صغير من العملة وصرفه في المدينة أأمن وأسهل من حمل نقد كثير.",
          en: "We cannot give a firm figure because spending patterns vary a great deal. The practical approach: plan to pay the large items — hotel, tours, restaurants — by card, and keep cash for small daily spending such as the bazaar, markets, small restaurants and tips. Bringing a modest amount of foreign currency and changing it in town is both safer and easier than carrying a lot of cash.",
        },
      },
      {
        question: { tr: "Havalimanında döviz bozdurmak pahalı mı?", ar: "هل الصرف في المطار مكلف؟", en: "Is changing money at the airport expensive?" },
        answer: {
          tr: "Şehirdeki bürolara göre kuru belirgin biçimde düşük. Sebebi terminal kiraları. İlk gün için gereken kadar bozdurun — taksi, su, yemek — gerisini şehirde yapın. Aradaki fark tek seferde küçük görünse de bir haftalık tatilin toplamında hissedilir.",
          ar: "سعره أدنى بوضوح من مكاتب المدينة، والسبب إيجارات الصالة. اصرف ما يلزم لليوم الأول فقط — تاكسي وماء وطعام — واترك الباقي للمدينة. والفارق قد يبدو صغيراً في مرة واحدة، لكنه ملموس في مجموع إجازة أسبوع.",
          en: "The rate is noticeably lower than at offices in town, because of terminal rents. Change only what you need for the first day — taxi, water, a meal — and do the rest in the city. The difference looks small in one transaction but adds up over a week's holiday.",
        },
      },
      {
        question: { tr: "Şoföre bahşiş vermem gerekiyor mu?", ar: "هل يجب أن أعطي السائق بقشيشاً؟", en: "Am I expected to tip the driver?" },
        answer: {
          tr: "Hayır. Fiyatımızın içinde bahşiş kalemi yok ve şoförlerimiz bahşiş istemez. Vermek isterseniz kabul edilir, vermezseniz hizmet aynıdır. Bunu açıkça yazıyoruz çünkü \"ne kadar vermeliyim\" sorusu misafirin yolculuk boyunca taşıdığı gereksiz bir yük oluyor.",
          ar: "لا. ليس في سعرنا بند للبقشيش، وسائقونا لا يطلبونه. إن أردت أن تعطي فسيُقبل، وإن لم تعطِ فالخدمة هي نفسها. ونكتب هذا صراحةً لأن سؤال \"كم ينبغي أن أعطي\" يبقى عبئاً لا لزوم له يحمله الضيف طوال الرحلة.",
          en: "No. There is no tip line in our price and our drivers do not ask for one. If you want to give something it will be accepted; if you do not, the service is identical. We say this plainly because \"how much should I give\" becomes an unnecessary weight a guest carries for the whole trip.",
        },
      },
    ],
  },
  {
    slug: "ramazan-ve-bayramda-turkiye",
    topic: "planning",
    image: "/images/places/suleymaniye.jpg",
    title: {
      tr: "Ramazan ve bayramda Türkiye: ne değişir, ne değişmez",
      ar: "تركيا في رمضان والعيد: ما الذي يتغيّر وما الذي يبقى",
      en: "Türkiye in Ramadan and Eid: what changes and what does not",
    },
    excerpt: {
      tr: "Restoranlar açık mı, müzeler ne zaman kapanır, neden erken rezervasyon gerekir — mevsimin gerçek etkisi.",
      ar: "هل المطاعم مفتوحة، ومتى تُغلق المتاحف، ولماذا يلزم الحجز مبكراً — أثر الموسم الحقيقي.",
      en: "Are restaurants open, when do museums close, why book early — what the season actually changes.",
    },
    seo: {
      title: {
        tr: "Ramazan ve Bayramda Türkiye Seyahati Rehberi",
        ar: "دليل السفر إلى تركيا في رمضان والعيد",
        en: "Travelling in Türkiye during Ramadan and Eid",
      },
      description: {
        tr: "Ramazanda restoranlar açık mı, iftar nasıl planlanır, bayramda ne kapanır ve neden erken rezervasyon şart. Körfez'den gelen aileler için.",
        ar: "هل المطاعم مفتوحة في رمضان، وكيف يُخطَّط للإفطار، وماذا يُغلق في العيد، ولماذا الحجز المبكر ضروري. لعائلات الخليج.",
        en: "Are restaurants open in Ramadan, how to plan iftar, what closes at Eid and why booking early matters. For Gulf families.",
      },
    },
    facts: [
      {
        label: { tr: "Restoranlar", ar: "المطاعم", en: "Restaurants" },
        value: { tr: "Ramazanda gün boyu açık", ar: "مفتوحة طوال النهار في رمضان", en: "Open all day during Ramadan" },
      },
      {
        label: { tr: "Bayram tatili", ar: "عطلة العيد", en: "Eid holiday" },
        value: { tr: "Resmî tatil; iç turizm zirvede", ar: "عطلة رسمية؛ ذروة السياحة الداخلية", en: "Public holiday; domestic travel peaks" },
      },
      {
        label: { tr: "Rezervasyon", ar: "الحجز", en: "Booking" },
        value: { tr: "Bayram için aylar önce", ar: "قبل العيد بأشهر", en: "Months ahead for Eid" },
      },
      {
        label: { tr: "Camiler", ar: "المساجد", en: "Mosques" },
        value: { tr: "Namaz saatlerinde ziyarete kapalı", ar: "مغلقة للزيارة في أوقات الصلاة", en: "Closed to visitors at prayer times" },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Ramazanda hayat durmuyor",
          ar: "الحياة لا تتوقف في رمضان",
          en: "Life does not stop in Ramadan",
        },
        body: {
          tr: "Körfez'den gelen misafirin en sık sorduğu şey bu: \"Ramazanda gündüz yemek bulabilir miyiz?\" Cevap evet. Türkiye'de restoranlar, kafeler ve alışveriş merkezlerindeki yemek katları ramazan boyunca gün içinde açık kalıyor. Turistik bölgelerde neredeyse hiçbir şey değişmiyor; daha muhafazakâr mahallelerde bazı küçük esnaf gündüz kapalı olabiliyor ama iki sokak ötede açık bir yer bulunuyor.\n\nDeğişen şey akşam. İftara doğru şehir yavaşlıyor, trafik yoğunlaşıyor ve restoranlar dolduğu için rezervasyonsuz masa bulmak zorlaşıyor. Sultanahmet Meydanı ve Eyüp gibi yerlerde iftar sofraları kuruluyor, akşam kalabalık oluyor. Bunu bilerek plan yapmak yeterli: gezmeyi öğleden sonra bitirin, iftar için yeri önceden ayarlayın.",
          ar: "هذا أكثر ما يسأل عنه ضيوف الخليج: \"هل نجد طعاماً نهاراً في رمضان؟\" والجواب نعم. فالمطاعم والمقاهي وصالات الطعام في المولات تبقى مفتوحة نهاراً طوال رمضان في تركيا. وفي المناطق السياحية لا يكاد يتغيّر شيء؛ أما في الأحياء الأكثر محافظة فقد تُغلق بعض الدكاكين الصغيرة نهاراً، لكنك تجد مكاناً مفتوحاً على بُعد شارعين.\n\nالذي يتغيّر هو المساء. فمع اقتراب الإفطار تبطؤ المدينة ويشتدّ الزحام، وتمتلئ المطاعم فيصعب إيجاد طاولة بلا حجز. وتُقام موائد الإفطار في أماكن مثل ميدان السلطان أحمد وأيوب، فيكثر الناس مساءً. ويكفي أن تخطّط على هذا الأساس: أنهِ التجوّل بعد الظهر، ورتّب مكان الإفطار مسبقاً.",
          en: "This is what Gulf guests ask most often: \"Will we find food during the day in Ramadan?\" The answer is yes. Restaurants, cafés and mall food courts stay open through the day in Türkiye all through Ramadan. In tourist areas almost nothing changes; in more conservative neighbourhoods some small shops may close during daylight, but you will find somewhere open two streets away.\n\nWhat changes is the evening. As iftar approaches the city slows, traffic thickens, and restaurants fill so a table without a booking becomes hard to find. Iftar tables are set up in places such as Sultanahmet Square and Eyüp, and the evenings get crowded. Planning around it is enough: finish sightseeing in the afternoon and arrange where you will break the fast in advance.",
        },
      },
      {
        heading: {
          tr: "İftar ve namazı programa yerleştirmek",
          ar: "وضع الإفطار والصلاة في البرنامج",
          en: "Fitting iftar and prayer into the day",
        },
        body: {
          tr: "Ramazanda gün planı normalden farklı kurulur. Sabah geç başlamak mantıklı; öğleden sonra en verimli saatler. İftardan bir saat önce yolda olmak istemezsiniz, çünkü o saatte trafik en yoğun hâlinde ve herkes bir yere yetişmeye çalışıyor.\n\nİftar saati mevsime göre değişiyor: kışa denk gelen ramazanda akşam beş civarı, yaza denk geldiğinde sekiz buçuğu geçebiliyor. Yaz ramazanında gün uzun olduğu için gezi programı da rahat; kış ramazanında akşam erken bastırdığı için gündüz daha sıkışık.\n\nBizim turlarımızda güzergâh namaz vakitlerine göre kuruluyor ve yol üstündeki camilerde mola veriliyor — bu ramazana özel bir şey değil, yıl boyu böyle. Ramazanda tek fark, gün sonunu iftar yerine göre planlamamız: nerede olmak istediğinizi söyleyin, programı ona göre bitirelim.",
          ar: "يُبنى برنامج اليوم في رمضان على نحو مختلف. فمن المنطقي أن تبدأ الصباح متأخراً؛ وساعات ما بعد الظهر هي الأجدى. ولن ترغب أن تكون على الطريق قبل الإفطار بساعة، فذلك أشدّ أوقات الزحام ويحاول الجميع اللحاق بمكان ما.\n\nويختلف وقت الإفطار بحسب الموسم: في رمضان الشتاء يكون نحو الخامسة مساءً، وفي رمضان الصيف قد يتجاوز الثامنة والنصف. ولأن النهار طويل في رمضان الصيف يكون برنامج التجوّل مريحاً؛ أما في رمضان الشتاء فيحلّ المساء باكراً فيضيق النهار.\n\nوفي جولاتنا يُبنى المسار على أوقات الصلاة ويُتوقّف في المساجد الواقعة على الطريق — وهذا ليس خاصاً برمضان بل هو الحال طوال السنة. والفرق الوحيد في رمضان أننا نخطّط نهاية اليوم بحسب مكان الإفطار: قل لنا أين تريد أن تكون، وننهي البرنامج على ذلك.",
          en: "A day in Ramadan is built differently. Starting late in the morning makes sense; the afternoon is the most productive stretch. You do not want to be on the road an hour before iftar, because that is when traffic is heaviest and everyone is trying to reach somewhere.\n\nThe time of iftar shifts with the season: in a winter Ramadan it is around five in the afternoon, in a summer one it can be past half past eight. Because the day is long in a summer Ramadan the sightseeing programme is relaxed; in a winter Ramadan evening comes early and the daylight is tighter.\n\nOn our tours the route is built around prayer times with stops at mosques along the way — that is not specific to Ramadan, it is how we work all year. The only difference in Ramadan is that we plan the end of the day around where you want to break the fast: tell us the place and we finish the programme there.",
        },
      },
      {
        heading: {
          tr: "Bayram: en kalabalık, en erken dolan hafta",
          ar: "العيد: أزحم أسبوع وأسرعه امتلاءً",
          en: "Eid: the busiest week, and the first to fill",
        },
        body: {
          tr: "Ramazan Bayramı ve Kurban Bayramı Türkiye'de resmî tatil. Bu, ülke içindeki herkesin aynı anda tatile çıkması demek: oteller doluyor, uçak biletleri pahalılaşıyor, sahil yolları ve şehirlerarası güzergâhlar tıkanıyor. Körfez'den gelen misafirin tatili de çoğu zaman aynı haftaya denk geliyor, yani iki talep üst üste biniyor.\n\nSomut sonucu şu: bayram haftası için otel ve araç ayarlamak aylar öncesinden yapılmalı. Son iki haftaya kalındığında ya seçenek kalmıyor ya da fiyatlar normalin çok üstüne çıkıyor. Bu bizim koyduğumuz bir kural değil, piyasanın hâli — biz de o tarihlerde aynı arzın peşindeyiz.\n\nBayramın ilk günü çoğu müze ve resmî kurum kapalı, çarşılar yarım gün. İkinci günden itibaren normale dönüyor. Bayram sabahı camiler çok kalabalık; namaza gidecekseniz erken çıkmak gerekiyor.",
          ar: "عيد الفطر وعيد الأضحى عطلة رسمية في تركيا. ومعنى ذلك أن الجميع داخل البلد يخرجون في إجازة في الوقت نفسه: تمتلئ الفنادق، وترتفع أسعار تذاكر الطيران، وتزدحم طرق الساحل والمسارات بين المدن. وغالباً ما تتزامن إجازة ضيوف الخليج مع الأسبوع نفسه، فيتراكب الطلبان.\n\nوالنتيجة العملية: يجب ترتيب الفندق والسيارة لأسبوع العيد قبل أشهر. ومن يترك الأمر لآخر أسبوعين لا يجد خيارات أو يجد أسعاراً أعلى بكثير من المعتاد. وهذه ليست قاعدة نضعها نحن بل حال السوق — فنحن أيضاً نسعى وراء العرض نفسه في تلك التواريخ.\n\nوفي أول أيام العيد تكون معظم المتاحف والدوائر الرسمية مغلقة والأسواق نصف يوم، ثم يعود الأمر إلى طبيعته من اليوم الثاني. وصباح العيد تكون المساجد شديدة الازدحام؛ فإن كنت ستصلي فاخرج مبكراً.",
          en: "Eid al-Fitr and Eid al-Adha are public holidays in Türkiye. That means everyone inside the country goes on holiday at the same time: hotels fill, air fares rise, and the coast roads and intercity routes clog. Gulf guests' holidays often fall in the same week, so the two demands stack.\n\nThe practical consequence: hotels and vehicles for Eid week must be arranged months ahead. Leave it to the last fortnight and either there is nothing left or prices are far above normal. This is not a rule we impose; it is the state of the market — we are chasing the same supply on those dates.\n\nOn the first day of Eid most museums and government offices are closed and the bazaars work half a day. From the second day things return to normal. Mosques are very crowded on Eid morning; if you are going to pray, leave early.",
        },
      },
      {
        heading: {
          tr: "Camileri ziyaret ederken",
          ar: "عند زيارة المساجد",
          en: "When visiting mosques",
        },
        body: {
          tr: "Sultanahmet, Süleymaniye ve Ayasofya gibi camiler ibadete açık yapılar; müze değiller. Namaz vakitlerinde ziyarete kapatılıyorlar ve cuma günü öğle vaktinde kapalı kalma süresi daha uzun. Bir camiyi görmeyi planlıyorsanız vakti hesaba katın; kapıda beklemek yerine programı yarım saat kaydırmak yeterli.\n\nGiriş için omuz ve diz kapalı olmalı, kadınlar için başörtüsü gerekiyor. Girişte ücretsiz örtü veriliyor, yanınızda getirmek zorunda değilsiniz. Ayakkabılar çıkarılıp verilen poşete konuyor; çorap işe yarıyor.\n\nRamazanda camiler akşam teravih namazında çok dolu oluyor ve bu saatte ziyaret uygun değil. Gündüz saatleri, özellikle sabah, hem sakin hem fotoğraf için ışığı iyi.",
          ar: "مساجد مثل السلطان أحمد والسليمانية وآيا صوفيا أبنية مفتوحة للعبادة، وليست متاحف. تُغلق أمام الزوار في أوقات الصلاة، ويطول إغلاقها ظهر الجمعة. فإن كنت تنوي زيارة مسجد فاحسب الوقت؛ ويكفي تأخير البرنامج نصف ساعة بدل الانتظار عند الباب.\n\nويلزم للدخول ستر الكتفين والركبتين، وغطاء رأس للنساء. ويُعطى الغطاء مجاناً عند المدخل فلا حاجة لإحضاره. وتُخلع الأحذية وتوضع في كيس يُعطى لك؛ والجوارب تنفع.\n\nوفي رمضان تمتلئ المساجد جداً في صلاة التراويح مساءً، ولا تناسب تلك الساعة الزيارة. أما ساعات النهار، وخاصة الصباح، فهادئة وضوؤها جيد للتصوير.",
          en: "Mosques such as the Blue Mosque, Süleymaniye and Hagia Sophia are working places of worship, not museums. They close to visitors at prayer times, and the Friday midday closure is longer. If you plan to see a mosque, allow for the timing; shifting the programme by half an hour beats waiting at the door.\n\nShoulders and knees must be covered to enter, and women need a headscarf. A free covering is handed out at the entrance, so you do not have to bring one. Shoes come off and go into a bag you are given; socks are useful.\n\nIn Ramadan the mosques are very full for the evening tarawih prayer, and that hour is not suitable for a visit. Daytime, especially the morning, is both quieter and better lit for photographs.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Ramazanda Türkiye'de gündüz restoranlar açık mı?", ar: "هل المطاعم مفتوحة نهاراً في تركيا في رمضان؟", en: "Are restaurants open during the day in Ramadan in Türkiye?" },
        answer: {
          tr: "Evet. Restoranlar, kafeler ve alışveriş merkezlerindeki yemek katları gün boyu açık kalıyor; turistik bölgelerde neredeyse hiçbir şey değişmiyor. Daha muhafazakâr mahallelerde bazı küçük esnaf gündüz kapalı olabilir ama yakında açık bir yer bulunuyor. Değişen asıl şey akşam: iftara doğru trafik yoğunlaşıyor ve restoranlar doluyor.",
          ar: "نعم. تبقى المطاعم والمقاهي وصالات الطعام في المولات مفتوحة طوال النهار؛ ولا يكاد يتغيّر شيء في المناطق السياحية. وفي الأحياء الأكثر محافظة قد تُغلق بعض الدكاكين الصغيرة نهاراً، لكنك تجد مكاناً مفتوحاً قريباً. والذي يتغيّر فعلاً هو المساء: يشتدّ الزحام وتمتلئ المطاعم مع اقتراب الإفطار.",
          en: "Yes. Restaurants, cafés and mall food courts stay open all day; in tourist areas almost nothing changes. In more conservative neighbourhoods some small shops may close during daylight, but there is somewhere open nearby. What really changes is the evening: traffic thickens and restaurants fill as iftar approaches.",
        },
      },
      {
        question: { tr: "Bayramda gelmek mantıklı mı?", ar: "هل من المنطقي المجيء في العيد؟", en: "Does it make sense to come during Eid?" },
        answer: {
          tr: "Atmosfer için güzel ama pratik açıdan en zor hafta: Türkiye'de resmî tatil olduğu için iç turizm zirve yapıyor, oteller doluyor, biletler pahalılaşıyor ve yollar tıkanıyor. Gelecekseniz otel ve aracı aylar öncesinden ayarlayın. Tarihiniz esnekse bayramdan bir hafta önce ya da sonra gelmek aynı şehri çok daha rahat gezmenizi sağlıyor.",
          ar: "جميل من حيث الأجواء لكنه أصعب أسبوع عملياً: فلأنه عطلة رسمية في تركيا تبلغ السياحة الداخلية ذروتها، وتمتلئ الفنادق، وترتفع أسعار التذاكر، وتزدحم الطرق. فإن كنت قادماً فرتّب الفندق والسيارة قبل أشهر. وإن كانت تواريخك مرنة فالمجيء قبل العيد بأسبوع أو بعده يجعلك تتجوّل في المدينة نفسها براحة أكبر بكثير.",
          en: "Lovely for the atmosphere but practically the hardest week: because it is a public holiday in Türkiye, domestic travel peaks, hotels fill, fares rise and the roads clog. If you are coming, arrange the hotel and vehicle months ahead. If your dates are flexible, a week before or after Eid lets you see the same city far more comfortably.",
        },
      },
      {
        question: { tr: "Turlarınızda namaz molası veriliyor mu?", ar: "هل توجد وقفة للصلاة في جولاتكم؟", en: "Do your tours stop for prayers?" },
        answer: {
          tr: "Evet, güzergâh namaz vakitlerine göre kuruluyor ve yol üstündeki camilerde mola veriliyor. Bu ramazana özel değil, yıl boyu böyle çalışıyoruz. Öğle yemeği de helal seçenek sunan yerlerde veriliyor. Ramazanda tek fark, günü iftar yerine göre bitirmemiz — nerede olmak istediğinizi söylemeniz yeterli.",
          ar: "نعم، يُبنى المسار على أوقات الصلاة ويُتوقَّف في المساجد الواقعة على الطريق. وهذا ليس خاصاً برمضان بل هكذا نعمل طوال السنة. والغداء يكون في أماكن تقدّم خيارات حلال. والفرق الوحيد في رمضان أننا ننهي اليوم بحسب مكان الإفطار — يكفي أن تقول لنا أين تريد أن تكون.",
          en: "Yes, the route is built around prayer times with stops at mosques along the way. This is not specific to Ramadan; it is how we work all year. Lunch is taken at places offering halal options. The only difference in Ramadan is that we end the day around where you break the fast — just tell us the place.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-sim-kart-ve-internet",
    topic: "practical",
    image: "/images/places/telefon-galata.jpg",
    title: {
      tr: "Türkiye'de SIM kart ve internet: nasıl bağlanırsınız",
      ar: "شريحة الاتصال والإنترنت في تركيا: كيف تتصل",
      en: "SIM cards and internet in Türkiye: how to get online",
    },
    excerpt: {
      tr: "Turist SIM'i mi eSIM mi, nereden alınır, telefon neden kilitlenir — bağlantı kurmanın pratik yolu.",
      ar: "شريحة سياحية أم eSIM، ومن أين تُشترى، ولماذا يُقفل الهاتف — الطريق العملي للاتصال.",
      en: "Tourist SIM or eSIM, where to buy, why phones get blocked — the practical way to stay connected.",
    },
    seo: {
      title: {
        tr: "Türkiye'de SIM Kart, eSIM ve İnternet Rehberi",
        ar: "دليل شريحة الاتصال وeSIM والإنترنت في تركيا",
        en: "SIM Cards and Internet in Türkiye",
      },
      description: {
        tr: "Turist SIM kartı nereden alınır, eSIM daha mı iyi, telefon neden 120 gün sonra kilitlenir, ücretsiz wifi nerede var. Pratik bağlantı rehberi.",
        ar: "من أين تُشترى الشريحة السياحية، وهل eSIM أفضل، ولماذا يُقفل الهاتف بعد 120 يوماً، وأين الواي فاي المجاني. دليل اتصال عملي.",
        en: "Where to buy a tourist SIM, whether eSIM is better, why phones get blocked after 120 days, where free wifi is. A practical connectivity guide.",
      },
    },
    facts: [
      {
        label: { tr: "Nereden", ar: "من أين", en: "Where" },
        value: { tr: "Havalimanı ya da şehirdeki operatör bayisi", ar: "المطار أو وكيل المشغّل في المدينة", en: "Airport or an operator's shop in town" },
      },
      {
        label: { tr: "Gerekli belge", ar: "المطلوب", en: "What you need" },
        value: { tr: "Pasaport", ar: "جواز السفر", en: "Your passport" },
      },
      {
        label: { tr: "eSIM", ar: "eSIM", en: "eSIM" },
        value: { tr: "Uçmadan önce alınabilir; kayıt gerektirmez", ar: "يمكن شراؤها قبل السفر؛ لا تحتاج تسجيلاً", en: "Can be bought before you fly; no registration" },
      },
      {
        label: { tr: "Dikkat", ar: "انتبه", en: "Watch out" },
        value: { tr: "Yabancı telefon 120 gün sonra kilitlenir", ar: "الهاتف الأجنبي يُقفل بعد 120 يوماً", en: "A foreign phone is blocked after 120 days" },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Üç seçenek: turist SIM, eSIM, dolaşım",
          ar: "ثلاثة خيارات: شريحة سياحية، eSIM، تجوال",
          en: "Three options: tourist SIM, eSIM, roaming",
        },
        body: {
          tr: "Turist SIM kartı Türkiye'deki üç büyük operatörün hepsinde var ve genellikle belirli bir internet paketiyle satılıyor. Havalimanı gelen yolcu katında bayileri bulunuyor; şehirdeki mağazalardan almak çoğu zaman daha ucuz ama havalimanında almak ilk günü kurtarıyor. Alırken pasaport gerekiyor, kayıt işlemi birkaç dakika sürüyor.\n\neSIM, telefonu destekliyorsa en pratik yol: uçağa binmeden satın alıp uçaktan iner inmez etkinleştirebiliyorsunuz, mağaza aramak gerekmiyor ve fiziksel kartınız telefonda kalıyor — yani kendi numaranız açık kalırken internet eSIM'den geliyor. Türkiye'de eSIM hem yerli operatörlerden hem uluslararası sağlayıcılardan alınabiliyor.\n\nKendi hattınızla dolaşım (roaming) en kolay ama genellikle en pahalı seçenek. Kısa bir seyahatte, örneğin üç gün, dolaşım paketi almak SIM aramaktan daha mantıklı olabilir. Bir haftadan uzun kalacaksanız yerel bir çözüm neredeyse her zaman ucuza geliyor.",
          ar: "الشريحة السياحية متوفرة لدى المشغّلين الثلاثة الكبار في تركيا وتُباع عادةً مع باقة إنترنت محددة. ولهم وكلاء في صالة القادمين بالمطار؛ والشراء من متاجر المدينة أرخص غالباً، لكن الشراء في المطار ينقذ اليوم الأول. ويُطلب جواز السفر عند الشراء، ويستغرق التسجيل دقائق.\n\nأما eSIM فهي الأيسر إن كان هاتفك يدعمها: تشتريها قبل ركوب الطائرة وتفعّلها فور نزولك، فلا تحتاج للبحث عن متجر، وتبقى شريحتك الأصلية في الهاتف — أي يظل رقمك الخاص فعّالاً بينما يأتي الإنترنت من الـ eSIM. وتتوفر eSIM في تركيا من المشغّلين المحليين ومن مزوّدين دوليين.\n\nوالتجوال برقمك هو الأسهل لكنه الأغلى عادةً. وفي رحلة قصيرة، ثلاثة أيام مثلاً، قد يكون شراء باقة تجوال أعقل من البحث عن شريحة. أما إن كانت إقامتك أطول من أسبوع فالحلّ المحلي أرخص دائماً تقريباً.",
          en: "A tourist SIM is available from all three major operators in Türkiye and usually comes with a set data package. They have counters in the arrivals hall; buying in a city shop is often cheaper, but buying at the airport saves your first day. You need your passport, and registration takes a few minutes.\n\nAn eSIM is the most practical route if your phone supports it: you buy it before boarding and activate it the moment you land, with no shop to find, and your physical card stays in the phone — so your own number stays reachable while the data comes from the eSIM. eSIMs for Türkiye are sold both by local operators and by international providers.\n\nRoaming on your own line is the easiest but usually the most expensive. On a short trip — three days, say — a roaming bundle can make more sense than hunting for a SIM. Staying longer than a week, a local solution is almost always cheaper.",
        },
      },
      {
        heading: {
          tr: "120 gün kuralı: telefonunuz neden kilitlenir",
          ar: "قاعدة 120 يوماً: لماذا يُقفل هاتفك",
          en: "The 120-day rule: why your phone gets blocked",
        },
        body: {
          tr: "Türkiye'de yurt dışından getirilen bir telefon, içine Türk SIM kartı takıldıktan sonra belirli bir süre çalışır ve ardından şebekeye kapanır. Bu süre uzun zamandır 120 gün. Amaç kaçak telefon ticaretini engellemek; turisti hedeflemiyor ama sonucu turisti de etkiliyor.\n\nNormal bir tatilde bu kural sizi hiç ilgilendirmez — iki haftalık, hatta iki aylık bir seyahatte sorun çıkmaz. Ama Türkiye'ye sık gelen ya da uzun kalan misafirlerde ortaya çıkıyor: telefon bir gün aniden şebeke bulamaz oluyor ve wifi dışında çalışmıyor. Kilit telefona özel, SIM karta değil; kartı başka telefona takınca çalışıyor.\n\nSık gelenler için pratik çözüm eSIM ya da yalnız wifi kullanmak. Telefonu kalıcı olarak kaydettirmek mümkün ama harç ödemeli resmî bir işlem ve turist için genellikle mantıklı değil.",
          ar: "الهاتف المُحضَر من خارج تركيا يعمل مدة معيّنة بعد وضع شريحة تركية فيه ثم يُغلق أمام الشبكة. وهذه المدة 120 يوماً منذ زمن. والغرض منع تجارة الهواتف غير النظامية؛ وهي لا تستهدف السائح لكن نتيجتها تطاله.\n\nوفي إجازة عادية لا تعنيك هذه القاعدة إطلاقاً — فلا مشكلة في رحلة أسبوعين بل حتى شهرين. لكنها تظهر عند من يتردّد على تركيا كثيراً أو يطيل الإقامة: يفقد الهاتف الشبكة فجأة في يوم ما ولا يعمل إلا على الواي فاي. والقفل خاص بالهاتف لا بالشريحة؛ فالشريحة تعمل في هاتف آخر.\n\nوالحل العملي لمن يتردّد كثيراً هو eSIM أو الاكتفاء بالواي فاي. ويمكن تسجيل الهاتف بشكل دائم لكنها معاملة رسمية برسوم، وغالباً لا تناسب السائح.",
          en: "A phone brought in from abroad works for a set period in Türkiye once a Turkish SIM is put in it, and is then cut off from the network. That period has long been 120 days. The aim is to stop unregistered phone trading; it does not target tourists, but the effect reaches them.\n\nOn a normal holiday this rule will never concern you — a two-week or even two-month trip is fine. It shows up for guests who come often or stay long: one day the phone simply finds no network and works only on wifi. The block is on the handset, not the SIM; the card works in another phone.\n\nFor frequent visitors the practical answer is an eSIM or living on wifi. Registering the handset permanently is possible but it is an official procedure with a fee, and rarely worth it for a tourist.",
        },
      },
      {
        heading: {
          tr: "Wifi nerede var, nerede yok",
          ar: "أين يوجد واي فاي وأين لا",
          en: "Where there is wifi and where there is not",
        },
        body: {
          tr: "Otel, restoran, kafe ve alışveriş merkezlerinde ücretsiz wifi neredeyse standart; şifreyi personelden istemek yeterli. Havalimanlarında ücretsiz wifi var ama bağlanmak için genellikle telefon numarasıyla doğrulama gerekiyor ve yurt dışı numarası her zaman kabul edilmiyor — inişte ilk mesajınızı atamamanızın sebebi genelde bu.\n\nMüzelerde, camilerde ve toplu taşımada güvenilir bir bağlantı beklemeyin. Şehirlerarası yolda, özellikle Karadeniz'in dağ kesimlerinde ve Toroslar'da şebeke zaman zaman kesiliyor; harita kullanıyorsanız güzergâhı çevrimdışı indirin.\n\nAracımızdaki internet her zaman garanti değil: talep üzerine ayarlıyor ve rezervasyonda yazılı teyit veriyoruz. Yol boyunca kesintisiz bağlantı isteyen misafirin kendi eSIM'ini ya da SIM kartını alması daha güvenli — bu rehberi de bunun için yazdık. Şoförle iletişim WhatsApp üzerinden kuruluyor ve karşılama sırasında bağlantınız yoksa isimli tabelayla beklediğimiz için birbirimizi bulmak sorun olmuyor.",
          ar: "الواي فاي المجاني شبه قياسي في الفنادق والمطاعم والمقاهي والمولات؛ ويكفي طلب كلمة المرور من الموظفين. وفي المطارات يوجد واي فاي مجاني لكن الاتصال يتطلب عادةً تحققاً برقم هاتف، والرقم الأجنبي لا يُقبل دائماً — وهذا غالباً سبب عجزك عن إرسال أول رسالة عند الهبوط.\n\nولا تتوقع اتصالاً موثوقاً في المتاحف والمساجد والنقل العام. وعلى الطرق بين المدن، وخاصة في جبال البحر الأسود وطوروس، تنقطع الشبكة أحياناً؛ فإن كنت تستخدم الخرائط فحمّل المسار للاستخدام دون إنترنت.\n\nوالإنترنت في سيارتنا ليس مضموناً دائماً: نرتّبه عند الطلب ونرسل تأكيده كتابةً عند الحجز. ومن يريد اتصالاً متصلاً طوال الطريق فالأأمن له أن يأخذ eSIM خاصاً به أو شريحة — ولهذا كتبنا هذا الدليل. والتواصل مع السائق يتم عبر واتساب، وإن لم يكن لديك اتصال عند الاستقبال فلن تكون مشكلة لأننا ننتظر بلافتة تحمل اسمك.",
          en: "Free wifi is almost standard in hotels, restaurants, cafés and malls; asking staff for the password is enough. Airports have free wifi, but connecting usually needs verification by phone number and a foreign number is not always accepted — that is generally why you cannot send your first message on landing.\n\nDo not expect a reliable connection in museums, mosques or on public transport. On intercity roads, especially in the mountains of the Black Sea and the Taurus, the network drops from time to time; if you are using maps, download the route for offline use.\n\nInternet in our vehicle is not guaranteed: we arrange it on request and confirm it in writing at booking. Anyone who needs an unbroken connection along the way is safer buying their own eSIM or SIM — which is why we wrote this guide. Contact with the driver goes through WhatsApp, and if you have no connection at the meeting point it does not matter, because we wait with a name board.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Havalimanından mı yoksa şehirden mi SIM almalıyım?", ar: "هل أشتري الشريحة من المطار أم من المدينة؟", en: "Should I buy a SIM at the airport or in town?" },
        answer: {
          tr: "Şehirdeki operatör mağazaları genellikle daha ucuz, ama havalimanından almak ilk günü kurtarıyor: yer bulmak, ulaşım ayarlamak ve ailenizle haberleşmek için ilk saatler en çok bağlantı gereken saatler. Pratik yol, gerçekten acele etmiyorsanız uçmadan önce eSIM almak — indiğiniz anda çalışıyor ve mağaza aramanız gerekmiyor.",
          ar: "متاجر المشغّلين في المدينة أرخص عادةً، لكن الشراء من المطار ينقذ اليوم الأول: فالساعات الأولى هي أكثر ما تحتاج فيه الاتصال لإيجاد المكان وترتيب التنقّل والتواصل مع أهلك. والطريق العملي، إن لم تكن مستعجلاً حقاً، هو شراء eSIM قبل السفر — تعمل فور هبوطك ولا تحتاج للبحث عن متجر.",
          en: "Operator shops in town are usually cheaper, but buying at the airport saves your first day: the first hours are when you most need a connection to find your place, arrange transport and reach your family. The practical route, unless you are truly in a hurry, is to buy an eSIM before you fly — it works the moment you land and there is no shop to find.",
        },
      },
      {
        question: { tr: "Telefonum Türkiye'de kilitlenir mi?", ar: "هل يُقفل هاتفي في تركيا؟", en: "Will my phone be blocked in Türkiye?" },
        answer: {
          tr: "Normal bir tatilde hayır. Yurt dışından getirilen bir telefon, içine Türk SIM kartı takıldıktan 120 gün sonra şebekeye kapanıyor; iki haftalık ya da iki aylık bir seyahatte bu süreye ulaşmıyorsunuz. Kural sık gelen ve uzun kalan misafirleri etkiliyor. Kilit telefona özel, SIM karta değil.",
          ar: "في إجازة عادية لا. فالهاتف المُحضَر من الخارج يُغلق أمام الشبكة بعد 120 يوماً من وضع شريحة تركية فيه؛ ولا تبلغ هذه المدة في رحلة أسبوعين أو حتى شهرين. والقاعدة تمسّ من يتردّد كثيراً أو يطيل الإقامة. والقفل خاص بالهاتف لا بالشريحة.",
          en: "On a normal holiday, no. A phone brought from abroad is cut off from the network 120 days after a Turkish SIM is put in it; a two-week or even two-month trip does not reach that. The rule affects frequent and long-staying visitors. The block is on the handset, not the SIM.",
        },
      },
      {
        question: { tr: "Aracınızda wifi var mı?", ar: "هل يوجد واي فاي في سيارتكم؟", en: "Is there wifi in your vehicle?" },
        answer: {
          tr: "Her zaman değil. Araçta internet talebe göre ayarlanıyor; rezervasyonda söylerseniz o gün için hazırlıyor ve teyidini yazılı veriyoruz. Sabit bir hizmet olarak söz vermiyoruz, çünkü her araçta her gün garanti edemiyoruz. Karşılamada bağlantınız olmasa da sorun çıkmıyor: geliş kapısında isimli tabelayla bekliyoruz, yani sizi bulmamız için internete ihtiyaç yok. Otele vardığınızda oradaki wifi ile devam edebilirsiniz.",
          ar: "ليس دائماً. الإنترنت في السيارة يُرتَّب عند الطلب؛ فإن ذكرته عند الحجز هيّأناه لذلك اليوم وأرسلنا تأكيده كتابةً. ولا نَعِد به كخدمة ثابتة لأننا لا نضمنه في كل سيارة وكل يوم. ولن تكون هناك مشكلة إن لم يكن لديك اتصال عند الاستقبال: فنحن ننتظر عند بوابة الوصول بلافتة تحمل اسمك، أي لا نحتاج إنترنت لنجدك. وعند وصولك الفندق يمكنك المتابعة بواي فاي الفندق.",
          en: "Not always. Internet in the vehicle is arranged on request; tell us at booking and we prepare it for that day and confirm it in writing. We do not promise it as a fixed service, because we cannot guarantee it in every vehicle on every day. It does not matter if you have no connection at the meeting point: we wait at the arrivals gate with a name board, so no internet is needed for us to find you. Once at the hotel you can carry on with its wifi.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-tatil-butcesi-nasil-kurulur",
    topic: "planning",
    image: "/images/places/cay-ayasofya.jpg",
    title: {
      tr: "Türkiye tatil bütçesi: neyin ne kadar tuttuğunu anlamak",
      ar: "ميزانية إجازة تركيا: كيف تفهم ما الذي يكلّف وكم",
      en: "Budgeting a Türkiye holiday: understanding what costs what",
    },
    excerpt: {
      tr: "Bütçeyi asıl belirleyen dört kalem, gizli maliyetler ve aynı tatili ucuzlatan üç karar.",
      ar: "البنود الأربعة التي تحدّد الميزانية فعلاً، والتكاليف الخفية، وثلاثة قرارات تخفّض التكلفة.",
      en: "The four items that actually set the budget, the hidden costs, and three decisions that lower it.",
    },
    seo: {
      title: {
        tr: "Türkiye Tatil Bütçesi Nasıl Kurulur",
        ar: "كيف تضع ميزانية إجازة في تركيا",
        en: "How to Budget a Holiday in Türkiye",
      },
      description: {
        tr: "Bütçeyi belirleyen dört kalem, kimsenin hesaba katmadığı gizli maliyetler ve aynı tatili ucuzlatan üç karar. Rakam değil, yöntem.",
        ar: "البنود الأربعة التي تحدّد الميزانية، والتكاليف الخفية التي لا يحسبها أحد، وثلاثة قرارات تخفّض تكلفة الإجازة نفسها. منهج لا أرقام.",
        en: "The four items that set the budget, the hidden costs nobody counts, and three decisions that lower the cost of the same trip. Method, not numbers.",
      },
    },
    facts: [
      {
        label: { tr: "En büyük kalem", ar: "أكبر بند", en: "Biggest item" },
        value: { tr: "Konaklama — bütçenin genelde yarısı", ar: "الإقامة — نصف الميزانية عادةً", en: "Accommodation — usually half the budget" },
      },
      {
        label: { tr: "En çok değişen", ar: "الأكثر تقلّباً", en: "Most variable" },
        value: { tr: "Sezon; aynı otel iki katına çıkabilir", ar: "الموسم؛ قد يتضاعف سعر الفندق نفسه", en: "Season; the same hotel can double" },
      },
      {
        label: { tr: "En çok unutulan", ar: "الأكثر نسياناً", en: "Most forgotten" },
        value: { tr: "Şehir içi ulaşım ve müze girişleri", ar: "التنقّل داخل المدينة ورسوم المتاحف", en: "Getting around town and museum entries" },
      },
      {
        label: { tr: "Bizim fiyatımız", ar: "سعرنا", en: "Our price" },
        value: { tr: "Araç başına, kişi başına değil", ar: "لكل سيارة، لا لكل شخص", en: "Per vehicle, not per person" },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Neden bu sayfada rakam yok",
          ar: "لماذا لا توجد أرقام في هذه الصفحة",
          en: "Why there are no figures on this page",
        },
        body: {
          tr: "\"Türkiye'de bir hafta kaç paraya\" sorusunun internetteki cevaplarının çoğu bir sayı veriyor. O sayı yazıldığı gün bile yaklaşıktı; altı ay sonra kesinlikle yanlış. Türk lirası hareketli, otel fiyatları sezona göre iki katına çıkıp geri iniyor ve bir ailenin harcaması dört kişilik başka bir aileninkiyle iki kat fark edebiliyor.\n\nBu yüzden burada rakam değil yöntem var: bütçeyi hangi kalemler belirliyor, hangileri sizin kontrolünüzde, hangi maliyet kimsenin planına girmiyor. Kendi rakamınızı bu çerçeveyle çıkarmak, birinin geçen yıl yazdığı toplamı kullanmaktan çok daha isabetli oluyor.\n\nBizim kendi hizmetimizin fiyatını da burada yazmıyoruz. Fiyat tarihe, kişi sayısına ve güzergâha göre değişiyor ve WhatsApp'tan sorduğunuzda sabit bir rakam olarak veriliyor — rehber metnine yazılan bir sayı, o sözün denetlenmediği bir yer olurdu.",
          ar: "معظم الإجابات على الإنترنت عن سؤال \"كم تكلّف أسبوع في تركيا\" تعطي رقماً. وذلك الرقم كان تقريبياً يوم كُتب؛ وهو خطأ قطعاً بعد ستة أشهر. فالليرة التركية متحركة، وأسعار الفنادق تتضاعف ثم تعود بحسب الموسم، وقد يختلف إنفاق عائلة عن إنفاق عائلة أخرى من أربعة أفراد بالضعف.\n\nولذلك ما في هذه الصفحة منهج لا رقم: ما البنود التي تحدّد الميزانية، وأيّها تحت سيطرتك، وأي تكلفة لا تدخل في خطة أحد. واستخراج رقمك بهذا الإطار أدقّ بكثير من استعمال مجموع كتبه أحدهم العام الماضي.\n\nولا نكتب هنا سعر خدمتنا أيضاً. فالسعر يتغيّر بحسب التاريخ وعدد الأشخاص والمسار، ويُعطى رقماً ثابتاً حين تسأل عبر واتساب — والرقم المكتوب في نصّ دليل يكون مكاناً لا يُراقَب فيه ذلك الوعد.",
          en: "Most answers online to \"how much does a week in Türkiye cost\" give you a number. That number was approximate the day it was written; six months later it is certainly wrong. The lira moves, hotel prices double and fall back with the season, and one family's spending can differ from another family of four by a factor of two.\n\nSo what is here is a method, not a figure: which items set the budget, which are within your control, and which cost never makes it into anyone's plan. Working out your own number from that frame is far more accurate than using a total somebody wrote last year.\n\nWe do not put our own price here either. It varies with the date, the number of people and the route, and it is given as a fixed figure when you ask on WhatsApp — a number written into a guide would be a place where that promise goes unchecked.",
        },
      },
      {
        heading: {
          tr: "Bütçeyi belirleyen dört kalem",
          ar: "البنود الأربعة التي تحدّد الميزانية",
          en: "The four items that set the budget",
        },
        body: {
          tr: "Birincisi konaklama ve genellikle toplamın yarısı. Aynı şehirde, aynı gecede, dört yıldızlı bir otelle beş yıldızlı bir otel arasında kat farkı olabiliyor; semt de fiyatı belirliyor. Sultanahmet ve Taksim en pahalı, Şişli ve Anadolu yakası belirgin biçimde uygun.\n\nİkincisi ulaşım — hem oraya varmak hem orada dolaşmak. Uçak bileti sezona ve ne kadar önceden aldığınıza bağlı. Şehir içi ulaşım küçük görünüyor ama İstanbul gibi bir şehirde günde iki-üç yolculuk bir haftada toplanıyor; özellikle çocuklu ailelerde taksi ve özel araç tercih edildiği için bu kalem beklenenden büyük çıkıyor.\n\nÜçüncüsü yemek ve bu tamamen sizin kontrolünüzde. Otel kahvaltısı dahil bir odada sabahları çözülüyor; öğle ve akşam esnaf lokantasında yenirse turistik restoranın üçte birine iniyor ve çoğu zaman daha lezzetli oluyor.\n\nDördüncüsü gezi ve alışveriş. Müze girişleri, tekne turları, teleferik gibi kalemler tek tek küçük ama bir haftada toplamı görünür oluyor. Alışveriş ise bütçenin en öngörülemeyen parçası; Kapalıçarşı'ya \"bakmaya\" giren kimse boş çıkmıyor.",
          ar: "الأول الإقامة، وهي عادةً نصف المجموع. ففي المدينة نفسها والليلة نفسها قد يكون بين فندق أربع نجوم وآخر خمس نجوم فرق مضاعف؛ والحيّ يحدّد السعر أيضاً. فالسلطان أحمد وتقسيم الأغلى، وشيشلي والجانب الآسيوي أنسب بوضوح.\n\nوالثاني التنقّل — الوصول إلى هناك والتحرّك هناك. فتذكرة الطيران تتبع الموسم ومدى تبكيرك في الشراء. والتنقّل داخل المدينة يبدو صغيراً، لكن في مدينة كإسطنبول تتراكم رحلتان أو ثلاث يومياً على مدى أسبوع؛ ويكبر هذا البند أكثر من المتوقع خاصة عند العائلات ذات الأطفال لأنها تفضّل التاكسي والسيارة الخاصة.\n\nوالثالث الطعام، وهو تحت سيطرتك تماماً. فالغرفة التي يشملها الفطور تحلّ الصباح؛ والغداء والعشاء في مطعم شعبي ينزل إلى ثلث سعر المطعم السياحي ويكون ألذّ في الغالب.\n\nوالرابع التجوّل والتسوّق. فبنود مثل رسوم المتاحف وجولات القوارب والتلفريك صغيرة منفردة لكن مجموعها في أسبوع يصبح ملموساً. أما التسوّق فأقلّ أجزاء الميزانية قابلية للتوقّع؛ فمن يدخل السوق المسقوف \"للنظر\" لا يخرج فارغاً.",
          en: "The first is accommodation, usually half the total. In the same city on the same night the gap between a four-star and a five-star hotel can be a multiple; the district sets the price too. Sultanahmet and Taksim are the most expensive, Şişli and the Asian side noticeably kinder.\n\nThe second is transport — both getting there and moving around. Air fares follow the season and how far ahead you buy. Getting around town looks small, but in a city like Istanbul two or three journeys a day add up over a week; the item runs larger than expected for families with children, who prefer taxis and private cars.\n\nThe third is food, and this is entirely in your control. A room with breakfast included settles the mornings; lunch and dinner at a neighbourhood restaurant costs a third of a tourist one and is usually better.\n\nThe fourth is sightseeing and shopping. Museum entries, boat trips and cable cars are small one by one but visible in a week's total. Shopping is the least predictable part of the budget; nobody who goes into the Grand Bazaar \"just to look\" comes out empty-handed.",
        },
      },
      {
        heading: {
          tr: "Kimsenin hesaba katmadığı maliyetler",
          ar: "تكاليف لا يحسبها أحد",
          en: "The costs nobody counts",
        },
        body: {
          tr: "Havalimanı ile otel arası ilk ve son yolculuk. Bir hafta için düşünülen bütçede bu iki yolculuk genellikle unutuluyor, oysa gece varışında ya da bavullu bir aileyle en pahalı iki yolculuk bunlar oluyor.\n\nBankamatik ve kart ücretleri. Bir kere çekimde küçük, ama her çekimde iki ayrı ücret çıkabiliyor — makinenin kendi ücreti ve bankanızın yurt dışı işlem ücreti. Az sayıda büyük çekim yapmak, çok sayıda küçük çekimden ucuza geliyor.\n\nSu ve küçük harcamalar. Sıcak bir günde dört kişilik bir aile şaşırtıcı miktarda su alıyor; markete uğramak bunu üçte bire indiriyor.\n\nOtel dışında kalan öğünler. \"Kahvaltı dahil\" bir odada günde iki öğün açıkta kalıyor ve yedi günde on dört öğün ediyor. Bu kalemi baştan hesaplamak, tatilin ortasında bütçeyi yeniden kurmaktan iyi.\n\nBagaj. Dönüşte alışveriş yüzünden ek bagaj almak zorunda kalmak sık rastlanan bir sürpriz; havayolunun ücreti kapıda alındığında online alınandan yüksek oluyor.",
          ar: "الرحلة الأولى والأخيرة بين المطار والفندق. غالباً ما تُنسى هاتان الرحلتان في ميزانية أسبوع، مع أنهما أغلى رحلتين عند الوصول ليلاً أو مع عائلة وحقائب.\n\nرسوم الصرافات والبطاقات. صغيرة في السحب الواحد، لكن قد يُحتسب رسمان في كل سحب — رسم الجهاز ورسم مصرفك على العمليات الخارجية. وقلّة السحوبات الكبيرة أرخص من كثرة السحوبات الصغيرة.\n\nالماء والمصاريف الصغيرة. ففي يوم حارّ تشتري عائلة من أربعة كمية ماء مدهشة؛ والمرور على البقالة ينزل بذلك إلى الثلث.\n\nالوجبات خارج الفندق. ففي غرفة \"شاملة الفطور\" تبقى وجبتان يومياً، أي أربع عشرة وجبة في سبعة أيام. وحساب هذا البند من البداية أفضل من إعادة بناء الميزانية في منتصف الإجازة.\n\nالحقائب. الاضطرار لشراء وزن إضافي في العودة بسبب التسوّق مفاجأة متكررة؛ ورسم شركة الطيران عند البوابة أعلى منه عبر الإنترنت.",
          en: "The first and last journey between airport and hotel. These two are usually forgotten in a week's budget, yet on a night arrival or with a family and luggage they are the two most expensive rides.\n\nATM and card fees. Small on one withdrawal, but two separate fees can apply each time — the machine's own and your bank's foreign transaction charge. A few large withdrawals cost less than many small ones.\n\nWater and small purchases. On a hot day a family of four buys a surprising amount of water; a stop at a supermarket cuts that to a third.\n\nMeals outside the hotel. In a room with breakfast included, two meals a day remain — fourteen over seven days. Counting that item from the start beats rebuilding the budget mid-holiday.\n\nLuggage. Having to buy extra baggage on the way home because of shopping is a frequent surprise; the airline's fee at the gate is higher than online.",
        },
      },
      {
        heading: {
          tr: "Aynı tatili ucuzlatan üç karar",
          ar: "ثلاثة قرارات تخفّض تكلفة الإجازة نفسها",
          en: "Three decisions that lower the cost of the same trip",
        },
        body: {
          tr: "Birincisi tarih. Temmuz-ağustos ve bayram haftaları en pahalı dönem; aynı otel nisan, mayıs, ekim ya da kasımda belirgin biçimde ucuz ve şehir çok daha rahat geziliyor. Tarihiniz esnekse en büyük tasarruf burada.\n\nİkincisi semt. Sultanahmet'te kalmak yürüme mesafesini satın almak demek ve bunun bir bedeli var. Şişli, Fatih'in iç mahalleleri ya da Anadolu yakası aynı yıldız sayısında çok daha uygun; metro ile tarihi yarımadaya yarım saatte iniliyor. Günde bir saat yol, gecede ciddi bir fark karşılığında makul bir takas olabiliyor.\n\nÜçüncüsü ulaşımı toplamak. Dört kişilik bir aile için taksiyle üç ayrı yolculuk yapmak yerine gün boyu araç ve şoför tutmak çoğu zaman daha ucuza geliyor — hem beklemek yok hem bavul ve alışveriş poşetleri araçta kalıyor. Bizim fiyatımız araç başına, kişi başına değil; kalabalık ailelerde fark burada ortaya çıkıyor.",
          ar: "الأول التاريخ. فتموز وآب وأسابيع العيد أغلى المواسم؛ والفندق نفسه أرخص بوضوح في نيسان وأيار وتشرين الأول والثاني، والتجوّل في المدينة أريح بكثير. وإن كانت تواريخك مرنة فأكبر توفير هنا.\n\nوالثاني الحيّ. فالإقامة في السلطان أحمد تعني شراء مسافة المشي، ولذلك ثمن. أما شيشلي أو الأحياء الداخلية في الفاتح أو الجانب الآسيوي فأنسب بكثير عند العدد نفسه من النجوم؛ وتنزل إلى شبه الجزيرة التاريخية بالمترو في نصف ساعة. وقد تكون ساعة على الطريق يومياً مقايضة معقولة مقابل فرق جادّ في سعر الليلة.\n\nوالثالث تجميع التنقّل. فبدل ثلاث رحلات منفصلة بالتاكسي لعائلة من أربعة، يكون استئجار سيارة وسائق طوال اليوم أرخص في الغالب — فلا انتظار، وتبقى الحقائب وأكياس التسوّق في السيارة. وسعرنا لكل سيارة لا لكل شخص؛ وهنا يظهر الفرق عند العائلات الكبيرة.",
          en: "The first is the date. July, August and the Eid weeks are the most expensive; the same hotel is noticeably cheaper in April, May, October or November, and the city is far easier to move through. If your dates are flexible, the largest saving is here.\n\nThe second is the district. Staying in Sultanahmet means buying walking distance, and that has a price. Şişli, the inner neighbourhoods of Fatih or the Asian side are far kinder at the same star rating; the metro reaches the historic peninsula in half an hour. An hour a day on the move can be a reasonable trade for a serious difference per night.\n\nThe third is consolidating transport. For a family of four, hiring a car and driver for the day often costs less than three separate taxi journeys — no waiting, and luggage and shopping bags stay in the car. Our price is per vehicle, not per person; with larger families that is where the difference shows.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Türkiye'de bir hafta kaç paraya geliyor?", ar: "كم يكلّف أسبوع في تركيا؟", en: "How much does a week in Türkiye cost?" },
        answer: {
          tr: "Tek bir rakam vermek yanıltıcı olur: aynı hafta, aynı şehirde iki aile arasında iki kat fark çıkabiliyor ve döviz kuru ile sezon fiyatları sürekli değişiyor. Bütçeyi belirleyen dört kalem konaklama, ulaşım, yemek ve gezi-alışveriş; en büyüğü genellikle konaklama ve toplamın yaklaşık yarısı. Kendi rakamınızı bu dört kalemi ayrı ayrı hesaplayarak çıkarmak, birinin geçen yıl yazdığı toplamı kullanmaktan çok daha isabetli.",
          ar: "إعطاء رقم واحد مضلّل: ففي الأسبوع نفسه والمدينة نفسها قد يبلغ الفارق بين عائلتين الضعف، وسعر الصرف وأسعار المواسم في تغيّر دائم. والبنود الأربعة التي تحدّد الميزانية هي الإقامة والتنقّل والطعام والتجوّل والتسوّق؛ وأكبرها عادةً الإقامة، وهي نحو نصف المجموع. واستخراج رقمك بحساب هذه البنود الأربعة منفصلةً أدقّ بكثير من استعمال مجموع كتبه أحدهم العام الماضي.",
          en: "A single figure would mislead: in the same week and the same city two families can differ by a factor of two, and both the exchange rate and seasonal prices keep moving. The four items that set the budget are accommodation, transport, food, and sightseeing and shopping; the largest is usually accommodation, at roughly half the total. Working out your own figure from those four separately is far more accurate than using a total somebody wrote last year.",
        },
      },
      {
        question: { tr: "Fiyatınız kişi başına mı?", ar: "هل سعركم لكل شخص؟", en: "Is your price per person?" },
        answer: {
          tr: "Hayır, araç başına. Aynı araçta iki kişi de altı kişi de aynı ücreti ödüyor; kişi sayısı arttıkça kişi başına düşen tutar azalıyor. Kalabalık ailelerde fark burada ortaya çıkıyor: dört kişi için üç ayrı taksi yolculuğu yapmak yerine gün boyu araç tutmak çoğu zaman daha ucuza geliyor. Kesin fiyat tarihe, kişi sayısına ve güzergâha göre WhatsApp'tan sabit olarak veriliyor.",
          ar: "لا، لكل سيارة. فسواء كنتم شخصين أو ستة في السيارة نفسها فالأجرة واحدة؛ وكلما زاد العدد قلّ النصيب لكل شخص. وهنا يظهر الفرق عند العائلات الكبيرة: فاستئجار سيارة طوال اليوم أرخص غالباً من ثلاث رحلات تاكسي منفصلة لأربعة أشخاص. والسعر النهائي يُعطى ثابتاً عبر واتساب بحسب التاريخ وعدد الأشخاص والمسار.",
          en: "No, per vehicle. Two people and six people in the same car pay the same; the more of you there are, the less it works out per head. That is where the difference shows for larger families: hiring a car for the day often costs less than three separate taxi rides for four people. The final price is given as a fixed figure on WhatsApp according to the date, the number of people and the route.",
        },
      },
      {
        question: { tr: "Hangi ay daha ucuz?", ar: "أي شهر أرخص؟", en: "Which month is cheaper?" },
        answer: {
          tr: "Nisan, mayıs, ekim ve kasım hem otel hem uçak açısından belirgin biçimde uygun ve şehir çok daha rahat geziliyor. Temmuz-ağustos ile ramazan bayramı ve kurban bayramı haftaları en pahalı dönem: Türkiye'de resmî tatil olduğu için iç talep de aynı anda zirve yapıyor. Tarihiniz esnekse bayram haftasından bir hafta önce ya da sonra gelmek aynı tatili belirgin biçimde ucuzlatıyor.",
          ar: "نيسان وأيار وتشرين الأول والثاني أنسب بوضوح من حيث الفنادق والطيران معاً، والتجوّل في المدينة أريح بكثير. أما تموز وآب وأسبوعا عيد الفطر وعيد الأضحى فأغلى المواسم: فلأنها عطلة رسمية في تركيا يبلغ الطلب الداخلي ذروته في الوقت نفسه. وإن كانت تواريخك مرنة فالمجيء قبل أسبوع العيد أو بعده يخفّض تكلفة الإجازة نفسها بوضوح.",
          en: "April, May, October and November are noticeably kinder on both hotels and flights, and the city is far easier to move through. July and August, along with the weeks of Eid al-Fitr and Eid al-Adha, are the most expensive: because they are public holidays in Türkiye, domestic demand peaks at the same time. If your dates are flexible, coming a week before or after Eid lowers the cost of the same holiday noticeably.",
        },
      },
    ],
  },
  {
    slug: "otel-secerken-nelere-bakmali",
    topic: "practical",
    image: "/images/places/yalikavak.jpg",
    title: {
      tr: "Otel seçerken nelere bakmalı: yıldız, manzara, aile odası, banyo",
      ar: "ما الذي تنظر إليه عند اختيار الفندق: النجوم والإطلالة وغرفة العائلة والحمّام",
      en: "What to check when choosing a hotel: stars, view, family rooms, bathroom",
    },
    excerpt: {
      tr: "Yıldız sayısı ne anlatır ne anlatmaz, manzaranın gerçek bedeli, aile odası tuzağı ve sorulması gereken banyo sorusu.",
      ar: "ماذا يعني عدد النجوم وماذا لا يعني، والثمن الحقيقي للإطلالة، وفخّ غرفة العائلة، وسؤال الحمّام الذي يجب طرحه.",
      en: "What a star rating does and does not tell you, the real price of a view, the family-room trap, and the bathroom question to ask.",
    },
    seo: {
      title: {
        tr: "Türkiye'de Otel Seçme Rehberi",
        ar: "دليل اختيار الفندق في تركيا",
        en: "Choosing a Hotel in Türkiye",
      },
      description: {
        tr: "Yıldız sayısı neyi anlatır, deniz manzarası ne kadara mal olur, aile odası gerçekten kaç kişilik, banyoda şataf var mı nasıl sorulur.",
        ar: "ماذا يعني عدد النجوم، وكم تكلّف الإطلالة على البحر، وكم شخصاً تتّسع غرفة العائلة فعلاً، وكيف تسأل عن وجود شطّاف في الحمّام.",
        en: "What a star rating means, what a sea view really costs, how many a family room actually sleeps, and how to ask whether the bathroom has a bidet spray.",
      },
    },
    facts: [
      {
        label: { tr: "Yıldız", ar: "النجوم", en: "Stars" },
        value: { tr: "Tesis özelliğini ölçer, kaliteyi değil", ar: "تقيس مرافق المنشأة لا جودتها", en: "Measures facilities, not quality" },
      },
      {
        label: { tr: "Manzara", ar: "الإطلالة", en: "The view" },
        value: { tr: "Aynı otelde odalar arası ciddi fark", ar: "فرق كبير بين الغرف في الفندق نفسه", en: "A big gap between rooms in the same hotel" },
      },
      {
        label: { tr: "Aile odası", ar: "غرفة العائلة", en: "Family room" },
        value: { tr: "Tanımı otele göre değişir; teyit edin", ar: "تعريفها يختلف بين فندق وآخر؛ تأكّد", en: "Defined differently by each hotel; confirm" },
      },
      {
        label: { tr: "Bizim rolümüz", ar: "دورنا", en: "Our role" },
        value: { tr: "Oteli siz seçersiniz, komisyon almayız", ar: "أنت تختار الفندق ولا نأخذ عمولة", en: "You choose; we take no commission" },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Yıldız sayısı neyi anlatır, neyi anlatmaz",
          ar: "ماذا يعني عدد النجوم وماذا لا يعني",
          en: "What a star rating does and does not tell you",
        },
        body: {
          tr: "Türkiye'de yıldız, Kültür ve Turizm Bakanlığı'nın belgelendirdiği bir sınıflandırma ve tesisin ÖZELLİKLERİNİ ölçüyor: oda sayısı, asansör, restoran, toplantı salonu, havuz gibi kalemler. Hizmetin kalitesini, personelin ilgisini ya da odanın temizliğini ölçmüyor.\n\nSonuç şu: iyi işletilen bir dört yıldızlı otel, kötü işletilen bir beş yıldızlıdan daha iyi bir tatil verebiliyor. Beş yıldızın gerçekten fark yarattığı yerler büyük tesisler — havuz, spa, birden fazla restoran, geniş lobi. Şehir merkezinde küçük bir butik otelde bunların hiçbiri yok ama oda ve konum çok daha iyi olabiliyor.\n\nPratik yöntem: yıldıza değil, son altı ayın yorumlarına bakın ve özellikle tekrar eden şikâyeti arayın. Bir kişinin \"gürültülüydü\" demesi rastlantı; on kişinin aynı şeyi söylemesi bilgidir. Yorumları okurken kendi sezonunuza yakın tarihleri seçin — yazın klimadan şikâyet eden bir otel kışın sorunsuz olabilir.",
          ar: "النجوم في تركيا تصنيف تعتمده وزارة الثقافة والسياحة، وهي تقيس مرافق المنشأة: عدد الغرف، والمصعد، والمطعم، وقاعة الاجتماعات، والمسبح ونحوها. ولا تقيس جودة الخدمة ولا اهتمام الموظفين ولا نظافة الغرفة.\n\nوالنتيجة أن فندق أربع نجوم يُدار جيداً قد يمنحك إجازة أفضل من فندق خمس نجوم يُدار بسوء. والأماكن التي تُحدث فيها الخمس نجوم فرقاً حقيقياً هي المنشآت الكبيرة — المسبح والسبا وتعدّد المطاعم واتساع البهو. أما في فندق بوتيك صغير وسط المدينة فلا شيء من ذلك، لكن الغرفة والموقع قد يكونان أفضل بكثير.\n\nوالطريقة العملية: لا تنظر إلى النجوم بل إلى تقييمات الأشهر الستة الأخيرة، وابحث خاصةً عن الشكوى المتكررة. فقول شخص واحد \"كان مزعجاً\" مصادفة؛ وقول عشرة الشيء نفسه معلومة. واختر عند القراءة تواريخ قريبة من موسمك — فالفندق الذي يُشتكى من تكييفه صيفاً قد يكون بلا مشكلة شتاءً.",
          en: "In Türkiye the star rating is a classification certified by the Ministry of Culture and Tourism, and it measures a property's FACILITIES: number of rooms, lifts, restaurant, meeting room, pool and so on. It does not measure service quality, staff attentiveness or how clean the room is.\n\nThe consequence: a well-run four-star can give you a better holiday than a badly run five-star. Where five stars genuinely make a difference is in large resorts — pool, spa, several restaurants, a big lobby. A small boutique hotel in the city centre has none of that, yet the room and the location may be far better.\n\nThe practical method: look not at the stars but at the last six months of reviews, and specifically hunt for the repeated complaint. One person saying \"it was noisy\" is chance; ten people saying it is information. When reading, pick dates close to your own season — a hotel criticised for its air conditioning in summer may be faultless in winter.",
        },
      },
      {
        heading: {
          tr: "Deniz ve Boğaz manzarası: gerçek bedeli",
          ar: "الإطلالة على البحر والبوسفور: ثمنها الحقيقي",
          en: "Sea and Bosphorus views: the real price",
        },
        body: {
          tr: "\"Boğaz manzaralı otel\" araması çok yapılıyor ve haklı bir istek; ama iki ayrıntı fiyatı ve memnuniyeti belirliyor.\n\nBirincisi manzaranın DERECESİ. Otellerde genellikle üç kademe var: tam manzara, yan manzara ve \"kısmi manzara\". Sonuncusu çoğu zaman pencerenin kenarından bir dilim deniz demek ve fiyatı tam manzaraya yakın olabiliyor. Rezervasyon yaparken oda tipinin adını değil, o odadan çekilmiş fotoğrafı isteyin.\n\nİkincisi kaç saat o manzaraya bakacağınız. Şehir turu yapan bir aile odaya yalnız uyumaya dönüyor; manzara için ödenen fark, aslında karanlıkta kullanılan bir pencere için ödeniyor. Buna karşılık Boğaz kıyısında kahvaltı etmek ya da akşam balkonda oturmak planınızın bir parçasıysa fark yerini buluyor.\n\nAntalya'da \"deniz manzarası\" başka bir şey ifade ediyor: orada otel genellikle sahilde ve manzara odanın değil tesisin özelliği. Trabzon'da ise sahil oteli merkeze yakın ama yaylalara uzak olabiliyor — manzara ile mesafeyi birlikte düşünmek gerekiyor.",
          ar: "البحث عن \"فندق بإطلالة على البوسفور\" كثير (ويكتبها بعضهم \"البسفور\")، وهو طلب محقّ؛ لكن تفصيلين يحدّدان السعر والرضا.\n\nالأول درجة الإطلالة. ففي الفنادق ثلاث مراتب عادةً: إطلالة كاملة، وجانبية، و\"جزئية\". والأخيرة تعني غالباً شريحة من البحر من طرف النافذة، وقد يقترب سعرها من الكاملة. فعند الحجز لا تطلب اسم نوع الغرفة بل صورة مأخوذة من تلك الغرفة نفسها.\n\nوالثاني كم ساعة ستنظر إلى تلك الإطلالة. فالعائلة التي تتجوّل في المدينة لا تعود إلى الغرفة إلا للنوم؛ والفرق المدفوع مقابل الإطلالة يُدفع في الحقيقة لنافذة تُستعمل في الظلام. أما إن كان الفطور على ضفة البوسفور أو الجلوس في الشرفة مساءً جزءاً من خطتك فالفرق في محلّه.\n\nو\"الإطلالة على البحر\" في أنطاليا تعني شيئاً آخر: فالفندق هناك على الشاطئ غالباً، والإطلالة صفة للمنشأة لا للغرفة. أما في طرابزون فقد يكون فندق الساحل قريباً من المركز بعيداً عن المرتفعات — فينبغي التفكير في الإطلالة والمسافة معاً.",
          en: "\"Hotel with a Bosphorus view\" is a much-searched phrase and a fair wish; but two details decide both the price and the satisfaction.\n\nThe first is the DEGREE of the view. Hotels usually have three tiers: full view, side view and \"partial view\". The last often means a slice of sea from the edge of the window, and it can be priced close to a full view. When booking, ask not for the room type's name but for a photograph taken from that room.\n\nThe second is how many hours you will actually look at it. A family out sightseeing returns to the room only to sleep; the premium paid for the view is really being paid for a window used in the dark. If, on the other hand, breakfast by the Bosphorus or sitting on the balcony in the evening is part of your plan, the difference earns its keep.\n\nIn Antalya a \"sea view\" means something else: the hotel is usually on the beach and the view is a property of the resort rather than the room. In Trabzon a coastal hotel may be close to the centre but far from the highlands — view and distance have to be weighed together.",
        },
        image: "/images/places/bogaz-yali.jpg",
        imageAlt: {
          tr: "Boğaz kıyısındaki yalılar, denizden görünüm",
          ar: "القصور الخشبية على ضفة البوسفور، من البحر",
          en: "Waterfront mansions on the Bosphorus, seen from the water",
        },
      },
      {
        heading: {
          tr: "Aile odası: adı aynı, tanımı farklı",
          ar: "غرفة العائلة: الاسم واحد والتعريف مختلف",
          en: "Family rooms: same name, different definitions",
        },
        body: {
          tr: "\"Aile odası\" Türkiye'de standart bir tanımı olmayan bir ifade. Bir otelde iki yataklı geniş bir oda, başka bir otelde ara kapıyla bağlı iki oda, üçüncüsünde çekyatlı bir oda anlamına gelebiliyor. Beş kişilik bir aile için bu fark tatili belirliyor.\n\nRezervasyondan önce üç şeyi net sorun: odada kaç ayrı yatak var, çocuk için ilave yatak ücretli mi, ve iki oda alınacaksa bunlar bitişik olacak mı. Bitişiklik çoğu otelde \"talep üzerine\" yazıyor ve garanti değil — küçük çocuklu bir aile için bu, varışta öğrenilmemesi gereken bir bilgi.\n\nÇocuk yaş sınırlarına da bakın: birçok otelde belirli bir yaşa kadar çocuk ücretsiz kalıyor ama sınır otelden otele değişiyor ve yatak istenip istenmediğine göre farklılaşıyor. Bu ayrıntı fiyat teklifinde görünmüyor, sorulunca çıkıyor.\n\nBiz rezervasyonu sizin adınıza yaparken bu üç soruyu sizin yerinize soruyoruz ve cevabı yazılı olarak alıyoruz. Anlaşmalı otel listemiz yok — oteli siz seçiyorsunuz, biz yalnız teyit ediyoruz.",
          ar: "\"غرفة العائلة\" عبارة بلا تعريف موحّد في تركيا. فقد تعني في فندق غرفة واسعة بسريرين، وفي آخر غرفتين يربطهما باب داخلي، وفي ثالث غرفة فيها كنبة سرير. وهذا الفرق يحدّد الإجازة لعائلة من خمسة.\n\nاسأل قبل الحجز عن ثلاثة أمور بوضوح: كم سريراً منفصلاً في الغرفة، وهل السرير الإضافي للطفل بمقابل، وإن أخذتم غرفتين فهل ستكونان متجاورتين. فالتجاور مكتوب في معظم الفنادق \"حسب التوفّر\" وليس مضموناً — وهذه معلومة لا ينبغي أن تعرفها عائلة بأطفال صغار عند الوصول.\n\nوانظر أيضاً في حدود أعمار الأطفال: ففي فنادق كثيرة يقيم الطفل مجاناً حتى سنّ معيّنة، لكن الحدّ يختلف بين فندق وآخر ويتغيّر بحسب طلب سرير من عدمه. ولا يظهر هذا التفصيل في عرض السعر، بل يظهر عند السؤال.\n\nونحن حين نحجز باسمك نسأل هذه الأسئلة الثلاثة نيابةً عنك ونأخذ الجواب كتابةً. وليست لدينا قائمة فنادق متعاقدة — أنت تختار الفندق ونحن نتحقّق فقط.",
          en: "\"Family room\" has no standard definition in Türkiye. In one hotel it is a large room with two beds, in another two rooms joined by an internal door, in a third a room with a sofa bed. For a family of five that difference decides the holiday.\n\nAsk three things plainly before booking: how many separate beds are in the room, whether an extra bed for a child is charged, and if you take two rooms whether they will be adjacent. Adjacency is written as \"on request\" at most hotels and is not guaranteed — not something a family with small children should discover on arrival.\n\nLook at the child age limits too: at many hotels a child stays free up to a certain age, but the limit varies by hotel and shifts depending on whether a bed is requested. This detail does not appear in the quoted price; it appears when you ask.\n\nWhen we book in your name we ask these three questions for you and get the answer in writing. We have no list of partner hotels — you choose the hotel, we simply confirm.",
        },
      },
      {
        heading: {
          tr: "Banyoda şataf var mı: sorulması gereken soru",
          ar: "هل في الحمّام شطّاف: السؤال الذي يجب طرحه",
          en: "Is there a bidet spray: the question worth asking",
        },
        body: {
          tr: "Körfez'den gelen misafirin en sık aradığı ama Türk otellerinin ilanlarında neredeyse hiç yazmadığı özellik bu. Türkiye'de birçok otel banyosunda taharet musluğu ya da el duşu bulunuyor, ama bu bir standart değil ve oda tipine göre bile değişebiliyor. Otel sitesinde \"banyo özellikleri\" listesinde nadiren geçiyor.\n\nÖğrenmenin en kesin yolu doğrudan sormak. Rezervasyondan önce otele yazıp banyo fotoğrafı istemek, gelen cevabı da saklamak yeterli. Körfez misafiri ağırlayan oteller bu soruyu sık aldıkları için genellikle net cevap veriyor.\n\nAynı kategoride sorulmaya değer iki şey daha var: odada su ısıtıcı ya da çay-kahve seti bulunup bulunmadığı, ve kıbleyi gösteren bir işaret olup olmadığı. İkincisi büyük otellerde tavanda ya da çekmecede oluyor; olmadığında telefonun pusulası iş görüyor ama önceden bilmek rahat ettiriyor.\n\nBu soruları rezervasyonu sizin adınıza yaparken biz soruyoruz. Otel \"var\" diyorsa yazılı cevabı size iletiyoruz; emin değilse bunu da olduğu gibi söylüyoruz — varmış gibi göstermek varışta çıkan bir sorun olur.",
          ar: "هذه أكثر ميزة يبحث عنها ضيوف الخليج، ولا تكاد تُذكر في إعلانات الفنادق التركية. ففي كثير من حمّامات الفنادق في تركيا شطّاف أو دُش يدوي، لكنه ليس معياراً ثابتاً وقد يختلف حتى بحسب نوع الغرفة. ونادراً ما يرد في قائمة \"مواصفات الحمّام\" على موقع الفندق.\n\nوأضمن طريقة للمعرفة هي السؤال المباشر. يكفي أن تراسل الفندق قبل الحجز وتطلب صورة للحمّام، وأن تحتفظ بالجواب. والفنادق التي تستقبل ضيوف الخليج تتلقّى هذا السؤال كثيراً فتجيب عنه بوضوح عادةً.\n\nوفي الباب نفسه أمران آخران يستحقّان السؤال: هل في الغرفة سخّان ماء أو طقم شاي وقهوة، وهل توجد علامة تدلّ على القبلة. والثانية تكون في الفنادق الكبيرة على السقف أو في الدرج؛ وعند غيابها تفي بوصلة الهاتف بالغرض، لكن معرفة ذلك مسبقاً أريح.\n\nونحن نسأل هذه الأسئلة حين نحجز باسمك. فإن قال الفندق \"نعم\" أرسلنا لك الجواب كتابةً؛ وإن لم يكن متأكداً قلنا لك ذلك كما هو — فإظهار الأمر كأنه موجود يتحوّل إلى مشكلة عند الوصول.",
          en: "This is the feature Gulf guests search for most and Turkish hotel listings almost never mention. Many hotel bathrooms in Türkiye have a bidet tap or a hand shower, but it is not a standard and can vary even between room types. It rarely appears in the \"bathroom features\" list on a hotel's own site.\n\nThe surest way to find out is to ask directly. Message the hotel before booking, ask for a photograph of the bathroom, and keep the reply. Hotels that host Gulf guests get this question often and usually answer it clearly.\n\nTwo more things in the same category are worth asking: whether the room has a kettle or tea and coffee set, and whether there is a qibla marker. The second is on the ceiling or in a drawer at larger hotels; without one a phone compass does the job, but knowing in advance is easier.\n\nWe ask these questions when we book in your name. If the hotel says yes we pass you the written answer; if they are unsure we tell you that as it is — presenting it as present would become a problem on arrival.",
        },
      },
      {
        heading: {
          tr: "Konum: neye yakın olmalı",
          ar: "الموقع: قريباً من ماذا",
          en: "Location: near what",
        },
        body: {
          tr: "\"Merkezi otel\" ifadesi tek başına bir şey söylemiyor; asıl soru neye merkezi olduğu. İstanbul'da üç ayrı merkez var ve hangisine yakın olacağınız tatilinizi belirliyor: tarihi yarımada (Sultanahmet), gece ve yeme-içme (Taksim–Beyoğlu), alışveriş (Şişli–Nişantaşı).\n\nMetroya yakınlık çoğu zaman anıta yakınlıktan daha değerli. İstanbul'da trafik öngörülemez ama metro öngörülebilir; metro durağına beş dakika yürüme mesafesindeki bir otel, taksiyle yirmi dakikadaki bir otelden pratikte daha merkezi oluyor.\n\nHavalimanına yakınlık ise yalnız iki günü ilgilendiriyor: ilk ve son gün. Bunun için tatilin tamamını havalimanı bölgesinde geçirmek genellikle kötü bir takas — gece geç varan ya da erken uçan misafir için tek gecelik bir çözüm olarak düşünülebilir.\n\nOtelin adresini bize söylediğinizde transfer süresini tahmin değil gerçek olarak veriyoruz, çünkü aynı semt adı içinde bile oteller arasında yirmi dakika fark olabiliyor.",
          ar: "عبارة \"فندق في المركز\" لا تقول شيئاً بمفردها؛ والسؤال الحقيقي: مركز ماذا. ففي إسطنبول ثلاثة مراكز مختلفة، وقربك من أيّها يحدّد إجازتك: شبه الجزيرة التاريخية (السلطان أحمد)، والسهر والمطاعم (تقسيم–بي أوغلو)، والتسوّق (شيشلي–نيشان تاشي).\n\nوالقرب من المترو أثمن غالباً من القرب من معلم. فالزحام في إسطنبول لا يمكن توقّعه أما المترو فيمكن؛ والفندق الذي يبعد خمس دقائق مشياً عن محطة مترو أكثر مركزيةً عملياً من فندق يبعد عشرين دقيقة بالتاكسي.\n\nأما القرب من المطار فيخصّ يومين فقط: الأول والأخير. وقضاء الإجازة كلها في محيط المطار من أجل ذلك مقايضة سيئة عادةً — ويمكن التفكير فيه كحلّ لليلة واحدة لمن يصل متأخراً ليلاً أو يسافر باكراً.\n\nوحين تخبرنا بعنوان الفندق نعطيك مدة النقل حقيقةً لا تخميناً، لأن الفارق بين فندقين داخل الحيّ الواحد قد يبلغ عشرين دقيقة.",
          en: "\"Central hotel\" says nothing on its own; the real question is central to what. Istanbul has three separate centres, and which one you are near shapes your holiday: the historic peninsula (Sultanahmet), nightlife and eating (Taksim–Beyoğlu), and shopping (Şişli–Nişantaşı).\n\nBeing near a metro station is often worth more than being near a monument. Traffic in Istanbul is unpredictable; the metro is not. A hotel five minutes' walk from a metro stop is in practice more central than one twenty minutes away by taxi.\n\nProximity to the airport matters on two days only: the first and the last. Spending the whole holiday out by the airport for that is usually a poor trade — it can make sense as a one-night solution for a very late arrival or a very early departure.\n\nWhen you give us the hotel address we give you the transfer time as fact rather than estimate, because even within one district name two hotels can be twenty minutes apart.",
        },
      },
    ],
    faq: [
      {
        question: { tr: "Otel banyosunda şataf olup olmadığını nasıl öğrenirim?", ar: "كيف أعرف إن كان في حمّام الفندق شطّاف؟", en: "How do I find out whether a hotel bathroom has a bidet spray?" },
        answer: {
          tr: "En kesin yol otele doğrudan yazıp banyo fotoğrafı istemek; otel sitelerindeki özellik listelerinde bu madde neredeyse hiç geçmiyor. Türkiye'de birçok otelde taharet musluğu ya da el duşu var ama standart değil, oda tipine göre bile değişebiliyor. Rezervasyonu bizim yapmamız durumunda bu soruyu sizin yerinize soruyor ve cevabı yazılı olarak iletiyoruz; otel emin değilse bunu da olduğu gibi söylüyoruz.",
          ar: "أضمن طريقة هي مراسلة الفندق مباشرةً وطلب صورة للحمّام؛ فهذا البند لا يكاد يرد في قوائم المواصفات على مواقع الفنادق. وفي كثير من فنادق تركيا شطّاف أو دُش يدوي لكنه ليس معياراً، وقد يختلف حتى بحسب نوع الغرفة. وإن تولّينا نحن الحجز سألنا هذا السؤال نيابةً عنك وأرسلنا الجواب كتابةً؛ وإن لم يكن الفندق متأكداً قلنا لك ذلك كما هو.",
          en: "The surest way is to message the hotel directly and ask for a photograph of the bathroom; the item almost never appears in the feature lists on hotel websites. Many hotels in Türkiye have a bidet tap or hand shower, but it is not a standard and can vary even between room types. If we handle the booking we ask this for you and pass on the written answer; if the hotel is unsure, we tell you that as it is.",
        },
      },
      {
        question: { tr: "Beş yıldızlı otel her zaman daha mı iyi?", ar: "هل فندق الخمس نجوم أفضل دائماً؟", en: "Is a five-star hotel always better?" },
        answer: {
          tr: "Hayır. Türkiye'de yıldız, tesisin özelliklerini ölçen resmî bir sınıflandırma — oda sayısı, asansör, havuz, restoran gibi. Hizmet kalitesini ölçmüyor. İyi işletilen bir dört yıldızlı, kötü işletilen bir beş yıldızlıdan daha iyi bir tatil verebiliyor. Beş yıldızın gerçekten fark yarattığı yer büyük tesisler; şehir merkezindeki küçük butik otellerde bu kalemlerin çoğu zaten yok. Yıldız yerine son altı ayın yorumlarına ve orada tekrar eden şikâyete bakın.",
          ar: "لا. فالنجوم في تركيا تصنيف رسمي يقيس مرافق المنشأة — عدد الغرف والمصعد والمسبح والمطعم ونحوها. وهي لا تقيس جودة الخدمة. وقد يمنحك فندق أربع نجوم يُدار جيداً إجازة أفضل من فندق خمس نجوم يُدار بسوء. والخمس نجوم تُحدث فرقاً حقيقياً في المنشآت الكبيرة؛ أما فنادق البوتيك الصغيرة وسط المدينة فلا تملك أصلاً معظم هذه البنود. فانظر بدل النجوم إلى تقييمات الأشهر الستة الأخيرة وإلى الشكوى المتكررة فيها.",
          en: "No. In Türkiye the star rating is an official classification of a property's facilities — number of rooms, lifts, pool, restaurant and so on. It does not measure service. A well-run four-star can give a better holiday than a badly run five-star. Five stars genuinely matter at large resorts; a small boutique hotel in the city centre has most of those items anyway. Instead of stars, read the last six months of reviews and look for the repeated complaint.",
        },
      },
      {
        question: { tr: "Oteli siz mi seçiyorsunuz?", ar: "هل تختارون الفندق أنتم؟", en: "Do you choose the hotel?" },
        answer: {
          tr: "Hayır, oteli siz seçiyorsunuz. Anlaşmalı otel listemiz yok ve fiyatın üstüne komisyon koymuyoruz — bu yüzden sizi belirli bir otele yönlendirmek gibi bir çıkarımız da yok. Bölgeyi, bütçeyi ve kaç kişi olduğunuzu söylediğinizde uygun seçenekleri çıkarıp adınıza rezerve ediyoruz; aile odası, ilave yatak ve banyo gibi ayrıntıları da yazılı olarak teyit ediyoruz.",
          ar: "لا، أنت من يختار الفندق. ليست لدينا قائمة فنادق متعاقدة ولا نضيف عمولة على السعر — ولذلك ليست لنا مصلحة في توجيهك إلى فندق بعينه. وحين تخبرنا بالمنطقة والميزانية وعدد الأشخاص نستخرج الخيارات المناسبة ونحجز باسمك؛ ونؤكّد كتابةً تفاصيل مثل غرفة العائلة والسرير الإضافي والحمّام.",
          en: "No, you choose the hotel. We have no list of partner hotels and add no commission to the price — so we have no interest in steering you to a particular one. Tell us the area, the budget and how many you are, and we find suitable options and book in your name; we also confirm details such as the family room, an extra bed and the bathroom in writing.",
        },
      },
    ],
  },
  {
    slug: "istanbul-adalar-rehberi",
    topic: "daytrips",
    image: "/images/places/adalar.jpg",
    title: {
      tr: "Adalar: İstanbul'dan vapurla günübirlik rehber",
      ar: "جزر الأميرات: دليل رحلة يوم واحد بالعبّارة من إسطنبول",
      en: "The Princes' Islands: a day-trip guide by ferry from Istanbul",
    },
    excerpt: {
      tr: "Arabasız dört ada — hangi iskeleden kalkılır, bir güne kaçı sığar.",
      ar: "أربع جزر بلا سيارات — من أي رصيف تنطلق، وكم جزيرة يتّسع لها يوم واحد.",
      en: "Four car-free islands — which pier to sail from, and how many fit into one day.",
    },
    facts: [
      {
        label: { tr: "Ulaşım", ar: "الوصول", en: "Getting there" },
        value: { tr: "Yalnız deniz yoluyla", ar: "بحراً فقط", en: "By sea only" },
      },
      {
        label: { tr: "Yolculuk", ar: "مدة العبور", en: "Crossing" },
        value: { tr: "İskeleye göre 30 dk – 1,5 saat", ar: "من 30 دقيقة إلى ساعة ونصف حسب الرصيف", en: "30 min – 1.5 hrs, by pier" },
      },
      {
        label: { tr: "Adada ulaşım", ar: "التنقّل في الجزيرة", en: "On the island" },
        value: { tr: "Bisiklet ve elektrikli taşıt", ar: "الدراجات والمركبات الكهربائية", en: "Bicycles and electric vehicles" },
      },
      {
        label: { tr: "En iyi mevsim", ar: "أفضل موسم", en: "Best season" },
        value: { tr: "Mayıs – haziran, eylül – ekim", ar: "مايو – يونيو، سبتمبر – أكتوبر", en: "May – June, September – October" },
      },
    ],
    seo: {
      title: { tr: "İstanbul Adalar Rehberi", ar: "دليل جزر الأميرات في إسطنبول", en: "Princes' Islands Guide, Istanbul" },
      description: {
        tr: "Adalara vapur Kabataş, Beşiktaş, Bostancı ve Maltepe'den kalkıyor — Eminönü'nden değil. Dört ada, araba yasağı ve bir güne neyin sığdığı.",
        ar: "عبّارات جزر الأميرات تنطلق من قبة طاش وبشيكتاش وبوستانجي ومالتبه — لا من أمينونو. أربع جزر، ومنع السيارات، وما يتّسع له يوم واحد.",
        en: "Ferries to the Princes' Islands leave from Kabataş, Beşiktaş, Bostancı and Maltepe — not Eminönü. Four islands, the car ban, what fits in a day.",
      },
    },
    faq: [
      {
        question: { tr: "Eminönü'nden adalara vapur var mı?", ar: "هل توجد عبّارة إلى الجزر من أمينونو؟", en: "Is there a ferry to the islands from Eminönü?" },
        answer: {
          tr: "Hayır, Eminönü'nden adalara doğrudan sefer yok. Çok sorulan bir soru, çünkü Eminönü İstanbul'un en bilinen vapur iskelesi — ama oradan kalkan hatlar Boğaz turu ile Üsküdar ve Kadıköy yönü. Adalar hattının Avrupa yakasındaki iskeleleri Kabataş ve Beşiktaş. Eminönü'nde ya da Sultanahmet'te kalıyorsanız T1 tramvayının son durağı zaten Kabataş; oradan adalar vapuruna aktarma yapılıyor.",
          ar: "لا، ليست هناك رحلة مباشرة إلى الجزر من أمينونو. والسؤال يتكرّر كثيراً لأن أمينونو أشهر رصيف عبّارات في إسطنبول — لكن الخطوط التي تنطلق منه هي جولة البوسفور واتجاه أسكودار وكاديكوي. أما رصيفا خط الجزر في الجانب الأوروبي فهما قبة طاش وبشيكتاش. وإن كنت نازلاً في أمينونو أو السلطان أحمد فإن المحطة الأخيرة لترام T1 هي قبة طاش أصلاً؛ ومنها يكون التحويل إلى عبّارة الجزر.",
          en: "No, there is no direct sailing to the islands from Eminönü. It is a common question, because Eminönü is Istanbul's best-known ferry pier — but the lines leaving from it are the Bosphorus cruise and the Üsküdar and Kadıköy direction. On the European side the islands line runs from Kabataş and Beşiktaş. If you are staying in Eminönü or Sultanahmet, the last stop of the T1 tram is Kabataş anyway, and you change there for the islands ferry.",
        },
      },
      {
        question: { tr: "Adalar İstanbul'dan ne kadar uzakta?", ar: "كم تبعد جزر الأميرات عن إسطنبول؟", en: "How far are the islands from Istanbul?" },
        answer: {
          tr: "Adalar Marmara Denizi'nde, kıyıdan 13 ile 25 kilometre arasında değişen mesafelerde. Karaya en yakın olanı Kınalıada, en uzaktakiler ise küçük ve yerleşim olmayan adacıklar. Ama pratikte önemli olan kilometre değil, hangi iskeleden kalktığınız: Anadolu yakasındaki Bostancı ve Kartal'dan geçiş yarım saat civarında, Kabataş'tan kalkan ve dört adaya birden uğrayan vapurda Büyükada'ya varış bir buçuk saati bulabiliyor.",
          ar: "الجزر في بحر مرمرة، على مسافات تتراوح بين 13 و25 كيلومتراً من الساحل. وأقربها إلى البرّ كنالي أدا، وأبعدها جُزيرات صغيرة غير مأهولة. لكن المهم عملياً ليس الكيلومترات بل الرصيف الذي تنطلق منه: فمن بوستانجي وكارتال في الجانب الآسيوي يكون العبور نحو نصف ساعة، أما العبّارة المنطلقة من قبة طاش والتي تمرّ بالجزر الأربع فقد يبلغ وصولها إلى بيوك أدا ساعةً ونصفاً.",
          en: "The islands lie in the Sea of Marmara, between 13 and 25 kilometres from the shore. Kınalıada is the closest to land; the farthest are small uninhabited islets. In practice, though, what matters is not the distance but which pier you leave from: from Bostancı or Kartal on the Asian side the crossing is around half an hour, while the ferry from Kabataş calls at all four islands and can take an hour and a half to reach Büyükada.",
        },
      },
      {
        question: { tr: "Bir günde kaç ada gezilebilir?", ar: "كم جزيرة يمكن زيارتها في يوم واحد؟", en: "How many islands can you see in a day?" },
        answer: {
          tr: "Rahat bir tempoda bir ada, sıkıştırırsanız iki. Vapur adalar arasında da çalışıyor ve geçişler kısa, ama her inip binmede tarife beklemek gerekiyor; iki adada geçen bir gün, günün önemli bir bölümünü iskelede beklemekle geçiriyor. İlk kez gelen misafirlerin çoğu doğrudan son durak Büyükada'ya gidiyor — en büyüğü ve görülecek şeyin en çok olduğu ada orası. Daha sakin bir gün isteyene Heybeliada ya da Burgazada daha iyi geliyor.",
          ar: "جزيرة واحدة بإيقاع مريح، واثنتان إن ضغطت البرنامج. والعبّارة تعمل بين الجزر أيضاً والمسافات بينها قصيرة، لكن كل نزول وصعود يستلزم انتظار موعد الرحلة؛ فاليوم الذي يمرّ على جزيرتين يقضي جزءاً كبيراً منه في الانتظار على الرصيف. ومعظم القادمين لأول مرة يذهبون مباشرة إلى المحطة الأخيرة بيوك أدا — فهي الأكبر وفيها أكثر ما يُرى. ومن يريد يوماً أهدأ تناسبه هيبلي أدا أو بورغاز أدا.",
          en: "One island at a comfortable pace, two if you push. Ferries also run between the islands and the hops are short, but every landing means waiting for the next departure, so a two-island day spends a good part of itself on the pier. Most first-time visitors go straight to the last stop, Büyükada — it is the largest and has the most to see. Anyone wanting a quieter day is better served by Heybeliada or Burgazada.",
        },
      },
    ],
    sections: [
      {
        heading: {
          tr: "Adalara nasıl gidilir: doğru iskele",
          ar: "كيف تصل إلى الجزر: الرصيف الصحيح",
          en: "Getting to the islands: the right pier",
        },
        body: {
          tr: "Adalara yalnız deniz yoluyla gidiliyor; karayolu bağlantısı yok, köprü yok. Bu yüzden gün, doğru vapur iskelesini seçmekle başlıyor.\n\nŞehir Hatları'nın adalar seferleri Avrupa yakasında Kabataş ve Beşiktaş'tan, Anadolu yakasında Bostancı, Maltepe, Pendik ve Tuzla'dan kalkıyor. Eminönü'nden adalara doğrudan sefer yok — bunu ayrıca yazıyoruz, çünkü en çok sorulan sorulardan biri. Eminönü, Boğaz turu ile Üsküdar ve Kadıköy hattının iskelesi.\n\nYolculuk süresi kalkış noktasına göre belirgin biçimde değişiyor. Anadolu yakasından, özellikle Bostancı ve Kartal'dan geçiş yarım saat civarında. Kabataş'tan kalkan vapur dört adaya birden uğradığı için Büyükada'ya varış bir buçuk saati bulabiliyor. Hızlı deniz otobüsleri bu süreyi kısaltıyor ama seferleri daha seyrek.\n\nSefer saatleri mevsime göre değişiyor ve kışın azalıyor; gitmeden bir gün önce güncel tarifeye bakmakta fayda var. Otelinize göre hangi iskelenin mantıklı olduğunu bize sorabilirsiniz: Sultanahmet'te kalan misafir için Kabataş, Kadıköy tarafında kalan için Bostancı, aynı geziyi bir saat kısaltan bir tercih.",
          ar: "لا يُوصل إلى الجزر إلا بحراً؛ فلا طريق برّياً ولا جسر. ولذلك يبدأ اليوم باختيار رصيف العبّارة الصحيح.\n\nرحلات الجزر لدى خطوط المدينة (شهير هاتلاري) تنطلق في الجانب الأوروبي من قبة طاش وبشيكتاش، وفي الجانب الآسيوي من بوستانجي ومالتبه وبنديك وتوزلا. ولا توجد رحلة مباشرة إلى الجزر من أمينونو — ونكتب هذا على حدة لأنه من أكثر ما يُسأل عنه. فأمينونو رصيف جولة البوسفور وخط أسكودار وكاديكوي.\n\nومدة الرحلة تختلف بوضوح بحسب نقطة الانطلاق. فمن الجانب الآسيوي، ولا سيّما من بوستانجي وكارتال، يكون العبور نحو نصف ساعة. أما العبّارة المنطلقة من قبة طاش فتمرّ بالجزر الأربع، فقد يبلغ وصولها إلى بيوك أدا ساعةً ونصفاً. والقوارب البحرية السريعة تختصر هذه المدة لكن رحلاتها أقلّ عدداً.\n\nومواعيد الرحلات تتغيّر بحسب الموسم وتقلّ في الشتاء؛ فمن المفيد مراجعة الجدول المحدَّث قبل الذهاب بيوم. ويمكنك أن تسألنا أيّ رصيف أنسب بحسب فندقك: فقبة طاش للنازل في السلطان أحمد، وبوستانجي للنازل في جهة كاديكوي — وهو اختيار يختصر الرحلة نفسها ساعةً كاملة.",
          en: "The islands can only be reached by sea; there is no road link and no bridge. So the day begins with choosing the right ferry pier.\n\nŞehir Hatları runs its island services from Kabataş and Beşiktaş on the European side, and from Bostancı, Maltepe, Pendik and Tuzla on the Asian side. There is no direct sailing to the islands from Eminönü — we write that separately, because it is one of the most frequent questions. Eminönü is the pier for the Bosphorus cruise and the Üsküdar and Kadıköy line.\n\nThe crossing time varies noticeably with the departure point. From the Asian side, particularly Bostancı and Kartal, it is around half an hour. The ferry from Kabataş calls at all four islands, so reaching Büyükada can take an hour and a half. Fast sea buses shorten that, but they run less often.\n\nTimetables change with the season and thin out in winter, so it is worth checking the current schedule the day before. You can ask us which pier makes sense for your hotel: Kabataş for a guest staying in Sultanahmet, Bostancı for one on the Kadıköy side — a choice that cuts an hour off the same trip."
        },
      },
      {
        heading: {
          tr: "Dört ada, dört ayrı karakter",
          ar: "أربع جزر، أربع شخصيات",
          en: "Four islands, four characters",
        },
        body: {
          tr: "Vapur sırayla dörde uğruyor: Kınalıada, Burgazada, Heybeliada ve son durak Büyükada.\n\nKınalıada karaya en yakın olanı ve en çıplak görüneni; ağaç örtüsü diğerlerine göre az, sahil yürüyüşü kısa. Yarım gün için yeterli, bütün bir gün için değil.\n\nBurgazada en sakini. Küçük bir meydan, birkaç balık lokantası ve kıyı boyunca uzanan bir yürüyüş yolu. Kalabalıktan uzak durmak isteyen misafirin adası.\n\nHeybeliada çam ormanıyla anılıyor. Deniz Lisesi'nin uzun beyaz binası vapurdan hemen görülüyor. Ada içi yürüyüş yolları burada daha gölgeli, bu da yaz aylarında ciddi bir fark.\n\nBüyükada en büyüğü — 5,4 kilometrekare — ve günübirlik gelenlerin çoğunun indiği yer. Ahşap köşkleri, çarşısı ve 203 metrelik Aya Yorgi tepesi burada. Tepeye çıkış yürüyerek yarım saat sürüyor ve son bölümü dik; yukarıdan Marmara'nın tamamı görünüyor.\n\nBeşinci bir ada olan Sedef Adası'na da sefer var ama çok seyrek; günübirlik program kurmaya uygun değil.",
          ar: "تمرّ العبّارة بالجزر الأربع بالترتيب: كنالي أدا، ثم بورغاز أدا، ثم هيبلي أدا، والمحطة الأخيرة بيوك أدا.\n\nكنالي أدا أقربها إلى البرّ وأكثرها انكشافاً؛ فغطاؤها الشجري أقلّ من سواها والمشي على ساحلها قصير. تكفي لنصف يوم لا ليوم كامل.\n\nوبورغاز أدا أهدؤها. ساحة صغيرة وبضعة مطاعم سمك وممشى يمتدّ على طول الشاطئ. هي جزيرة من يريد الابتعاد عن الزحام.\n\nوهيبلي أدا تُعرف بغابة الصنوبر. ومبنى الثانوية البحرية الأبيض الطويل يُرى من العبّارة مباشرة. ومسارات المشي داخل الجزيرة هنا أكثر ظلاً، وهذا فرق جوهري في أشهر الصيف.\n\nوبيوك أدا أكبرها — 5.4 كيلومتر مربع — وفيها ينزل معظم القادمين ليوم واحد. فهنا القصور الخشبية والسوق وتلّة آيا يورغي البالغة 203 أمتار. والصعود إلى التلّة سيراً يستغرق نصف ساعة وآخره شديد الانحدار؛ ومن الأعلى يظهر بحر مرمرة كلّه.\n\nوهناك جزيرة خامسة هي جزيرة صدف تصلها رحلات أيضاً لكنها متباعدة جداً؛ فهي لا تصلح لبناء برنامج يوم واحد.",
          en: "The ferry calls at four in turn: Kınalıada, Burgazada, Heybeliada, and Büyükada as the last stop.\n\nKınalıada is the closest to land and the barest-looking; it has less tree cover than the others and a short shoreline walk. Enough for half a day, not for a whole one.\n\nBurgazada is the quietest. A small square, a few fish restaurants and a path running along the shore. The island for a guest who wants to keep away from crowds.\n\nHeybeliada is known for its pine forest. The long white building of the Naval High School is visible straight from the ferry. The walking routes inland are shadier here, which matters a great deal in summer.\n\nBüyükada is the largest — 5.4 square kilometres — and where most day visitors get off. Its wooden mansions, its market street and the 203-metre Aya Yorgi hill are all here. The climb up takes half an hour on foot and the last stretch is steep; from the top the whole Sea of Marmara is in view.\n\nA fifth island, Sedef Adası, is also served, but very infrequently; it is not suited to building a day trip around."
        },
      },
      {
        heading: {
          tr: "Adalarda araba yok: ulaşım nasıl oluyor",
          ar: "لا سيارات في الجزر: كيف يكون التنقّل",
          en: "No cars on the islands: how you get around",
        },
        body: {
          tr: "Adalarda özel araç trafiği yasak. İzin verilen tek motorlu taşıtlar hizmet araçları: ambulans, itfaiye, çöp toplama.\n\nAda içi ulaşım üç şeyle yürüyor — yürümek, bisiklet ve elektrikli taşıtlar. Uzun yıllar adaların simgesi olan atlı faytonlar 2020'de ciddi bir at hastalığı sonrası kaldırıldı; yerlerini akülü elektrikli araçlar aldı. Bisiklet kiralayan dükkânlar iskelenin çevresinde yoğunlaşıyor.\n\nBunun pratik karşılığı şu: ada gezisi ayakta geçen bir gün. Büyükada'nın iç yolları eğimli ve tepeye doğru sertleşiyor. Yaz öğlelerinde gölge az, çeşme az.\n\nYürümekte zorlanan bir büyüğünüz varsa ya da bebek arabasıyla geliyorsanız planı buna göre kurmak gerekiyor. İskele çevresi, çarşı ve sahil bandı düz ve rahat; tepe kısmı değil. Elektrikli taşıtlar tam bu noktada işe yarıyor, ama yoğun günlerde sıra oluyor.\n\nYanınıza almanız gerekenler kısa bir liste: rahat ayakkabı, su, şapka ve güneş kremi. Adada market ve eczane var, fakat çarşı bölgesinde toplanmış durumda ve fiyatlar şehirdekinin üstünde. Tepeye çıkmadan önce suyunuzu almanız iyi olur.",
          ar: "حركة المركبات الخاصة ممنوعة في الجزر. والمركبات الآلية الوحيدة المسموح بها هي مركبات الخدمة: الإسعاف والإطفاء وجمع النفايات.\n\nويقوم التنقّل داخل الجزيرة على ثلاثة أشياء — المشي والدراجات والمركبات الكهربائية. أما العربات التي تجرّها الخيل والتي كانت رمز الجزر سنوات طويلة فقد أُلغيت سنة 2020 إثر مرض خيلي خطير؛ وحلّت محلّها مركبات كهربائية تعمل بالبطاريات. ومحال تأجير الدراجات تتركّز حول الرصيف.\n\nومقابل هذا عملياً: زيارة الجزيرة يوم يمضي على الأقدام. فطرق بيوك أدا الداخلية مائلة وتشتدّ كلما اتجهت نحو التلّة. وفي أظهار الصيف يقلّ الظلّ وتقلّ الينابيع.\n\nوإن كان معك كبير في السنّ يشقّ عليه المشي، أو كنت قادماً بعربة أطفال، فينبغي بناء البرنامج على ذلك. فمحيط الرصيف والسوق وشريط الساحل مستوٍ ومريح؛ أما جهة التلّة فلا. وهنا تحديداً تنفع المركبات الكهربائية، غير أن الطوابير تطول في الأيام المزدحمة.\n\nوما ينبغي حمله قائمة قصيرة: حذاء مريح وماء وقبعة وواقٍ من الشمس. وفي الجزيرة بقالات وصيدليات، لكنها مجتمعة في منطقة السوق وأسعارها أعلى من أسعار المدينة. ومن الأفضل أن تأخذ ماءك قبل الصعود إلى التلّة.",
          en: "Private vehicle traffic is banned on the islands. The only motor vehicles allowed are service ones: ambulances, fire engines, refuse collection.\n\nGetting around comes down to three things — walking, bicycles and electric vehicles. The horse-drawn phaetons that were the islands' emblem for many years were withdrawn in 2020 after a serious equine disease; battery-powered electric vehicles took their place. The bicycle rental shops cluster around the pier.\n\nWhat that means in practice: a visit to the islands is a day spent on your feet. Büyükada's inland roads are sloped and get harder as they climb. On summer middays there is little shade and few fountains.\n\nIf you have an older relative who finds walking difficult, or you are coming with a pushchair, the plan has to be built around that. The area near the pier, the market street and the shore strip are flat and easy; the hill is not. This is exactly where the electric vehicles help, though queues build on busy days.\n\nWhat to bring is a short list: comfortable shoes, water, a hat and sunscreen. There are shops and pharmacies on the island, but they are gathered in the market area and prices are above the city's. It is worth buying your water before starting up the hill."
        },
      },
      {
        heading: {
          tr: "Ne zaman gitmeli, gün nasıl kurulur",
          ar: "متى تذهب، وكيف يُبنى اليوم",
          en: "When to go, and how to shape the day",
        },
        body: {
          tr: "En iyi mevsim mayıs–haziran ile eylül–ekim. Hava yürüyüşe uygun, deniz ılık ve kalabalık temmuz–ağustostaki kadar değil.\n\nHafta sonu ile hafta içi arasındaki fark adalarda İstanbul'un başka hiçbir yerinde olmadığı kadar büyük. Yaz hafta sonlarında iskelelerde uzun kuyruklar oluşuyor, dönüş seferlerinde ayakta kalınabiliyor. Aynı gezi salı günü yapıldığında bambaşka bir gün oluyor.\n\nKışın adalar kapanmıyor ama tempo düşüyor: dükkânların bir kısmı kapalı, seferler seyrek, deniz rüzgârlı ve geçiş sarsıntılı olabiliyor. Sakinlik arayan için güzel, İstanbul'a ilk kez gelen için değil.\n\nGünü kurarken iki şey belirleyici. Birincisi erken çıkmak: sabahın ilk seferleriyle gidilen bir gün, öğleden sonra gidilen bir günün iki katı. İkincisi dönüş: son vapurun saatini gitmeden not almak gerekiyor, çünkü kaçırıldığında alternatif yok — karayolu bağlantısı olmadığı için adada gecelemek zorunda kalınıyor.\n\nGün için makul bir düzen şöyle: sabah erken vapur, öğleden önce Aya Yorgi tepesi (serinken), öğle yemeği çarşıda ya da sahilde, öğleden sonra bisikletle ya da elektrikli taşıtla ada turu, ikindi ışığında sahilde çay, son vapurdan bir önceki seferle dönüş. Son sefere bilerek yer bırakmak, kuyruk uzadığında elinizde tek yedek plan.",
          ar: "أفضل موسم هو مايو–يونيو وسبتمبر–أكتوبر. فالجوّ مناسب للمشي، والبحر دافئ، والزحام دون ما هو عليه في يوليو وأغسطس.\n\nوالفرق بين عطلة الأسبوع وأيام الأسبوع في الجزر أكبر منه في أي مكان آخر بإسطنبول. ففي عطل الصيف تطول الطوابير على الأرصفة وقد تقف واقفاً في رحلة العودة. والرحلة نفسها يوم الثلاثاء يوم آخر تماماً.\n\nوالجزر لا تُغلق شتاءً لكن إيقاعها يهبط: قسم من المحال مغلق، والرحلات متباعدة، والبحر عاصف وقد يكون العبور مضطرباً. جميل لمن يطلب الهدوء، لا لمن يزور إسطنبول أول مرة.\n\nويحكم بناءَ اليوم أمران. الأول الخروج باكراً: فاليوم الذي يبدأ بأولى رحلات الصباح ضِعف اليوم الذي يبدأ بعد الظهر. والثاني العودة: يجب تدوين موعد آخر عبّارة قبل الذهاب، فليس ثمّة بديل إن فاتت — إذ لا اتصال برّياً، فتضطرّ إلى المبيت في الجزيرة.\n\nوترتيب معقول لليوم: عبّارة الصباح الباكر، ثم تلّة آيا يورغي قبل الظهر حين يكون الجوّ لطيفاً، ثم الغداء في السوق أو على الساحل، ثم جولة في الجزيرة بالدراجة أو بمركبة كهربائية بعد الظهر، ثم شاي على الشاطئ في ضوء العصر، والعودة بالرحلة التي تسبق الأخيرة. وترك الرحلة الأخيرة احتياطاً هو خطتك البديلة الوحيدة إن طال الطابور.",
          en: "The best seasons are May–June and September–October. The weather suits walking, the sea is warm, and the crowds are not what they are in July and August.\n\nThe gap between a weekend and a weekday is wider on the islands than anywhere else in Istanbul. On summer weekends long queues form at the piers and you may stand all the way back. The same trip made on a Tuesday is an entirely different day.\n\nThe islands do not close in winter, but the pace drops: some shops are shut, sailings are sparse, the sea is windy and the crossing can be rough. Lovely for anyone seeking quiet — not for a first visit to Istanbul.\n\nTwo things decide how the day goes. First, leaving early: a day begun on the first morning sailings is worth twice one begun in the afternoon. Second, the return: note the time of the last ferry before you go, because there is no alternative if you miss it — with no road link, you would have to stay the night on the island.\n\nA sensible shape for the day: an early ferry, Aya Yorgi hill before noon while it is still cool, lunch in the market street or on the shore, an afternoon circuit by bicycle or electric vehicle, tea by the water in the late light, and the return on the sailing before the last one. Deliberately leaving the final departure spare is your only fallback if the queue grows."
        },
      },
      {
        heading: {
          tr: "Bizim hizmetimiz nerede başlıyor, nerede bitiyor",
          ar: "أين تبدأ خدمتنا وأين تنتهي",
          en: "Where our service begins and ends",
        },
        body: {
          tr: "Burada bir şeyi açıkça yazalım: adalarda özel araçla hizmet verilemiyor, çünkü araç trafiği yasak. Bizim işimiz vapur iskelesinde başlıyor ve orada bitiyor.\n\nUygulamada şöyle yürüyor: sizi otelinizden alıp konumunuza göre doğru iskeleye bırakıyoruz — Kabataş, Beşiktaş ya da Bostancı — ve dönüş vapurunun saatinde aynı iskelede karşılıyoruz. Aradaki süre size ait.\n\nBu, küçük çocukla ya da yaşlı bir yakınıyla gelen bir aile için sanıldığından büyük bir fark. Sıcak bir yaz sabahında Sultanahmet'ten Kabataş'a aktarmalı gitmekle otelin kapısından alınmak arasındaki mesafe, günün geri kalanının nasıl geçeceğini belirliyor.\n\nAdaları ayrı bir tur olarak satmıyoruz, çünkü satacak bir şey yok: vapur bileti herkesin İstanbulkart'la ödeyebileceği bir ücret ve adada rehberli bir programımız bulunmuyor. Böyle bir gün için size bir tur bedeli çıkarmak dürüst olmazdı.\n\nİstanbul programınızın bir gününü adalara ayırmak isterseniz planı ona göre kuruyoruz ve o günün transferini ayrıca ayarlıyoruz. Hangi iskelenin size yakın olduğunu, o gün hava ve deniz durumunun ne göründüğünü de önceden söylüyoruz — çünkü fırtınalı bir günde seferler iptal edilebiliyor ve programı bir gün kaydırmak, iskelede beklemekten iyidir.",
          ar: "لنكتب هنا أمراً بوضوح: لا يمكن تقديم خدمة بسيارة خاصة في الجزر، لأن حركة المركبات ممنوعة. فعملنا يبدأ عند رصيف العبّارة وينتهي عنده.\n\nوهو يجري عملياً هكذا: نأخذك من فندقك ونوصلك إلى الرصيف المناسب بحسب موقعك — قبة طاش أو بشيكتاش أو بوستانجي — ونستقبلك على الرصيف نفسه في موعد عبّارة العودة. والوقت بينهما لك.\n\nوهذا فرق أكبر مما يُظنّ لعائلة معها طفل صغير أو قريب مسنّ. ففي صباح صيفي حارّ، المسافة بين أن تنتقل من السلطان أحمد إلى قبة طاش بتحويلات وأن تُؤخذ من باب الفندق هي التي تحدّد كيف يمضي بقية اليوم.\n\nونحن لا نبيع الجزر جولةً مستقلة، لأنه ليس ثمّة ما يُباع: فتذكرة العبّارة أجرة يدفعها الجميع ببطاقة إسطنبول، وليس لنا في الجزيرة برنامج مصحوب بمرشد. وأن نضع لك ثمن جولة مقابل يوم كهذا أمر لا يكون أميناً.\n\nوإن أردت تخصيص يوم من برنامجك في إسطنبول للجزر بنينا الخطة على ذلك ورتّبنا نقل ذلك اليوم على حدة. ونخبرك مسبقاً أيّ رصيف أقرب إليك، وكيف تبدو حال الجوّ والبحر في ذلك اليوم — فالرحلات قد تُلغى في يوم عاصف، وتأجيل البرنامج يوماً خير من الانتظار على الرصيف.",
          en: "Let us put one thing plainly: we cannot provide a private-car service on the islands, because vehicle traffic is banned there. Our work begins at the ferry pier and ends there.\n\nIn practice it works like this: we collect you from your hotel and drop you at the right pier for where you are staying — Kabataş, Beşiktaş or Bostancı — and meet you at the same pier at the time of your return ferry. The hours in between are yours.\n\nFor a family travelling with a small child or an elderly relative, that is a bigger difference than it sounds. On a hot summer morning, the distance between changing trams from Sultanahmet to Kabataş and being picked up at the hotel door decides how the rest of the day goes.\n\nWe do not sell the islands as a separate tour, because there is nothing to sell: the ferry ticket is a fare anyone can pay with an İstanbulkart, and we run no guided programme on the island. Charging you a tour price for a day like that would not be honest.\n\nIf you want to give one day of your Istanbul programme to the islands, we build the plan around it and arrange that day's transfer separately. We will also tell you in advance which pier is nearest to you and how the weather and sea look for the day — sailings can be cancelled when it is stormy, and moving the plan by a day beats waiting at the pier."
        },
      },
    ],
  },
];

/**
 * Okuma süresi (dakika).
 *
 * Önceden her rehberde elle yazılı bir sayıydı ve tutunamıyordu: bir yazı
 * derinleştirildiğinde sayı olduğu yerde kalıyordu. Sonuçta aynı "6 dakika"
 * etiketi hem 380 kelimelik hem 1.038 kelimelik yazının altında duruyordu —
 * okuyucuya söylenen şey yanlıştı ve yanlışlığı her düzenlemede büyüyordu.
 *
 * Ölçü Arapça gövde: sitenin varsayılan dili o, ve üç dil arasında en uzun
 * metin de o. Dakikada 150 kelime, sessiz okuma hızının alt bandı; hızlı
 * okuyana abartılı görünmektense yavaş okuyan için doğru olsun diye böyle.
 * Alt sınır üç dakika, çünkü "1 dakika" etiketi yazıyı olduğundan hafif
 * gösteriyor.
 */
const DAKIKADA_KELIME = 150;

export function guideMinutes(guide: Guide) {
  const metin = [
    ...guide.sections.map((section) => `${section.heading.ar} ${section.body.ar}`),
    ...guide.faq.map((item) => `${item.question.ar} ${item.answer.ar}`),
  ].join(" ");
  const kelime = metin.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(kelime / DAKIKADA_KELIME));
}

export function guideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
