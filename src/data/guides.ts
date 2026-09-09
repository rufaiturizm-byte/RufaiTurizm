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
  /** Okuma süresi (dakika) — listede gösterilir. */
  minutes: number;
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
    ],
  },
  {
    slug: "sabiha-gokcenden-istanbula-ulasim",
    topic: "arrival",
    image: "/images/places/bogaz-kopru.jpg",
    minutes: 6,
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
    ],
  },
  {
    slug: "sapanca-masukiye-rehberi",
    topic: "daytrips",
    image: "/images/places/sapanca-orman.jpg",
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
    ],
  },
  {
    slug: "trabzon-uzungol-karadeniz",
    topic: "daytrips",
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
    ],
  },
  {
    slug: "turkiyeye-ne-zaman-gitmeli",
    topic: "planning",
    image: "/images/places/bursa-kis.jpg",
    minutes: 7,
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
    ],
  },
  {
    slug: "arapca-konusan-sofor-ve-rehber",
    topic: "practical",
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
    ],
  },
  {
    slug: "bursa-uludag-gunubirlik",
    topic: "daytrips",
    image: "/images/places/bursa-koy-sokak.jpg",
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
    ],
  },
  {
    slug: "turkiyede-alisveris-rehberi",
    topic: "practical",
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
    ],
  },
  {
    slug: "istanbulda-helal-yemek-rehberi",
    topic: "practical",
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
    ],
  },
  {
    slug: "bogaz-turu-rehberi",
    topic: "daytrips",
    image: "/images/places/bogaz-vapur.jpg",
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
    topic: "practical",
    image: "/images/places/lale-bahce.jpg",
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
    ],
  },
  {
    slug: "istanbulda-uc-gun-programi",
    topic: "planning",
    image: "/images/places/tarihi-yarimada.jpg",
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
    ],
  },
  {
    slug: "istanbulda-toplu-tasima-rehberi",
    topic: "arrival",
    image: "/images/places/tramvay.jpg",
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
    ],
  },
  {
    slug: "istanbulda-hava-durumu-ve-giyim",
    topic: "planning",
    image: "/images/places/bogaz-yali.jpg",
    minutes: 6,
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
    topic: "practical",
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
    ],
  },
  {
    slug: "antalya-bolge-rehberi",
    topic: "daytrips",
    image: "/images/places/kemer.jpg",
    minutes: 6,
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
    ],
  },
  {
    slug: "bodrum-ege-rehberi",
    topic: "daytrips",
    image: "/images/places/bodrum-koy.jpg",
    minutes: 6,
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
          tr: "İki biçimi var. Günlük turlar sabah limandan kalkar, üç–dört koyda yüzme molası verir ve teknede öğle yemeği içerir; ekonomiktir ama başka misafirlerle paylaşılır. Özel tekne kiralamada saat ve güzergâh size aittir, aile mahremiyeti korunur. Hangisini istediğinizi rezervasyonda söylemeniz yeterli; ikisinde de mayo, havlu ve güneş koruması gerekir.",
          ar: "لها شكلان. الجولات اليومية تنطلق صباحاً من الميناء وتتوقف للسباحة في ثلاثة أو أربعة خلجان وتشمل الغداء على القارب؛ وهي اقتصادية لكنها مشتركة مع ضيوف آخرين. أما استئجار قارب خاص فالتوقيت والمسار لك وحدك وتُحفظ خصوصية العائلة. ويكفي أن تخبرنا عند الحجز بما تريد؛ وفي الحالتين يلزم ملابس بحر ومنشفة وواقٍ من الشمس.",
          en: "There are two forms. Day trips leave the harbour in the morning, stop to swim in three or four bays and include lunch on board; they are economical but shared with other guests. With a private charter the timing and route are yours and family privacy is kept. Just tell us which you want at booking; either way you need swimwear, a towel and sun protection.",
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
          tr: "Bodrum'da tatilin merkezinde tekne vardır. Günlük turlar üç–dört koyda yüzme molası verir ve öğle yemeğini teknede sunar; özel kiralamada saat ve güzergâh size aittir. Ege'nin suyu Akdeniz'e göre bir tık serindir; deniz haziranda ısınır, ağustosta en ılık halini alır ve ekim başına kadar girilebilir. Koyların çoğu kum değil çakıl ya da platformdur — deniz ayakkabısı işe yarar, özellikle çocuklarda.",
          ar: "القارب في قلب العطلة في بودروم. فالجولات اليومية تتوقف للسباحة في ثلاثة أو أربعة خلجان وتقدّم الغداء على متنها؛ وفي الاستئجار الخاص يكون التوقيت والمسار لك. وماء بحر إيجه أبرد قليلاً من المتوسط؛ يدفأ البحر في حزيران ويبلغ أدفأ حالاته في آب ويبقى صالحاً للسباحة حتى أوائل تشرين الأول. ومعظم الخلجان ليست رملية بل حصوية أو ذات منصات — وحذاء البحر مفيد، خاصة للأطفال.",
          en: "In Bodrum the boat is at the centre of the holiday. Day trips stop to swim in three or four bays and serve lunch on board; on a private charter the timing and route are yours. Aegean water is a touch cooler than the Mediterranean; the sea warms in June, peaks in August and stays swimmable into early October. Most bays are pebble or platform rather than sand — water shoes help, especially with children.",
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
    ],
  },
  {
    slug: "turkiyede-para-kart-ve-odeme",
    topic: "practical",
    image: "/images/places/kapalicarsi.jpg",
    minutes: 5,
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
    minutes: 5,
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
    image: "/images/places/levent.jpg",
    minutes: 4,
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
          tr: "Otel, restoran, kafe ve alışveriş merkezlerinde ücretsiz wifi neredeyse standart; şifreyi personelden istemek yeterli. Havalimanlarında ücretsiz wifi var ama bağlanmak için genellikle telefon numarasıyla doğrulama gerekiyor ve yurt dışı numarası her zaman kabul edilmiyor — inişte ilk mesajınızı atamamanızın sebebi genelde bu.\n\nMüzelerde, camilerde ve toplu taşımada güvenilir bir bağlantı beklemeyin. Şehirlerarası yolda, özellikle Karadeniz'in dağ kesimlerinde ve Toroslar'da şebeke zaman zaman kesiliyor; harita kullanıyorsanız güzergâhı çevrimdışı indirin.\n\nAracımızda wifi yok — bunu yazıyoruz çünkü sorulduğunda net bir cevap olsun. Şoförle iletişim WhatsApp üzerinden kuruluyor ve karşılama sırasında bağlantınız yoksa isimli tabelayla beklediğimiz için birbirimizi bulmak sorun olmuyor.",
          ar: "الواي فاي المجاني شبه قياسي في الفنادق والمطاعم والمقاهي والمولات؛ ويكفي طلب كلمة المرور من الموظفين. وفي المطارات يوجد واي فاي مجاني لكن الاتصال يتطلب عادةً تحققاً برقم هاتف، والرقم الأجنبي لا يُقبل دائماً — وهذا غالباً سبب عجزك عن إرسال أول رسالة عند الهبوط.\n\nولا تتوقع اتصالاً موثوقاً في المتاحف والمساجد والنقل العام. وعلى الطرق بين المدن، وخاصة في جبال البحر الأسود وطوروس، تنقطع الشبكة أحياناً؛ فإن كنت تستخدم الخرائط فحمّل المسار للاستخدام دون إنترنت.\n\nولا يوجد واي فاي في سيارتنا — ونكتب هذا ليكون الجواب واضحاً عند السؤال. والتواصل مع السائق يتم عبر واتساب، وإن لم يكن لديك اتصال عند الاستقبال فلن تكون مشكلة لأننا ننتظر بلافتة تحمل اسمك.",
          en: "Free wifi is almost standard in hotels, restaurants, cafés and malls; asking staff for the password is enough. Airports have free wifi, but connecting usually needs verification by phone number and a foreign number is not always accepted — that is generally why you cannot send your first message on landing.\n\nDo not expect a reliable connection in museums, mosques or on public transport. On intercity roads, especially in the mountains of the Black Sea and the Taurus, the network drops from time to time; if you are using maps, download the route for offline use.\n\nThere is no wifi in our vehicle — we write that down so the answer is clear when asked. Contact with the driver goes through WhatsApp, and if you have no connection at the meeting point it does not matter, because we wait with a name board.",
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
          tr: "Hayır, aracımızda wifi yok. Karşılamada bağlantınız olmasa da sorun çıkmıyor: geliş kapısında isimli tabelayla bekliyoruz, yani sizi bulmamız için internete ihtiyaç yok. Rezervasyon ve iletişim WhatsApp üzerinden yürüyor; otele vardığınızda oradaki wifi ile devam edebilirsiniz.",
          ar: "لا، لا يوجد واي فاي في سيارتنا. ولن تكون هناك مشكلة إن لم يكن لديك اتصال عند الاستقبال: فنحن ننتظر عند بوابة الوصول بلافتة تحمل اسمك، أي لا نحتاج إنترنت لنجدك. والحجز والتواصل يجريان عبر واتساب؛ وعند وصولك الفندق يمكنك المتابعة بواي فاي الفندق.",
          en: "No, there is no wifi in our vehicle. It does not matter if you have no connection at the meeting point: we wait at the arrivals gate with a name board, so no internet is needed for us to find you. Booking and contact run through WhatsApp; once at the hotel you can carry on with its wifi.",
        },
      },
    ],
  },
  {
    slug: "turkiyede-tatil-butcesi-nasil-kurulur",
    topic: "planning",
    image: "/images/places/galata-halic.jpg",
    minutes: 6,
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
    minutes: 6,
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
];

export function guideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
