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

/** Programın bir günü. */
export interface PackageDay {
  title: Text;
  body: Text;
}

export interface Package {
  slug: string;
  name: Text;
  city: Text;
  days: number;
  /** Kartta ve listede görünen tek satırlık tanıtım. */
  excerpt: Text;
  image: string;
  /** Gün gün program. */
  itinerary: PackageDay[];
  /** Fiyata dahil olanlar — anahtar `included.*` mesajlarından gelir. */
  includes: string[];
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
    days: 4,
    image: "/images/tours/istanbul.jpg",
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
  },
  {
    slug: "istanbul-bursa-6-gun",
    days: 6,
    image: "/images/tours/bursa.jpg",
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
  },
  {
    slug: "istanbul-sapanca-bursa-8-gun",
    days: 8,
    image: "/images/tours/sapanca.jpg",
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
  },
  {
    slug: "trabzon-karadeniz-5-gun",
    days: 5,
    image: "/images/tours/trabzon.jpg",
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
  },
];

export function packageBySlug(slug: string) {
  return packages.find((item) => item.slug === slug);
}
