/**
 * Hizmet verdiğimiz noktalar ve güzergâhlar.
 *
 * Bu liste süs değil, sayfanın arama motorundaki tutunma yüzeyi: müşteri
 * "havalimanından Taksim'e transfer" ya da "Sapanca turu" diye arıyor,
 * "hizmet bölgelerimiz" diye aramıyor. Semt ve destinasyon adları sayfada
 * geçmediği sürece o aramalarda görünmüyoruz (rakip seentravels'ın transfer
 * sayfasında en çok yer kaplayan bölüm bu).
 *
 * Fiyat BİLEREK yok. Rakip her güzergâha fiyat yazıyor; bizim elimizde
 * doğrulanmış bir fiyat listesi olmadan buraya rakam yazmak, sabit fiyat
 * sözünü ilk telefonda bozmak demek. Fiyat listesi geldiğinde her satıra
 * `priceFrom` eklenip kartlarda gösterilebilir.
 *
 * Adlar üç dilde burada duruyor; bir güzergâh eklemek üç ayrı JSON'a
 * dokunmayı gerektirmesin diye (paketlerdeki ile aynı yaklaşım).
 */

export interface RouteGroup {
  key: string;
  /** Grup kartının üstündeki fotoğraf. */
  image: string;
  /** Grubun başlığı — kalkış noktası ya da bölge. */
  title: { tr: string; ar: string; en: string };
  /** Kısa açıklama; grubun altında tek satır. */
  note: { tr: string; ar: string; en: string };
  /** Varış noktaları. */
  stops: { tr: string; ar: string; en: string }[];
}

export const routeGroups: RouteGroup[] = [
  {
    key: "ist",
    image: "/images/places/havalimani.jpg",
    title: {
      tr: "İstanbul Havalimanı (IST) transferleri",
      ar: "خدمة النقل من مطار إسطنبول (IST)",
      en: "Istanbul Airport (IST) transfers",
    },
    note: {
      tr: "Geliş kapısında isimli tabelayla karşılama, uçuş takibi dahil.",
      ar: "استقبال عند بوابة الوصول بلوحة تحمل اسمك، مع متابعة الرحلة.",
      en: "Meet and greet at arrivals with a name sign, flight tracking included.",
    },
    stops: [
      { tr: "Taksim", ar: "تقسيم", en: "Taksim" },
      { tr: "Sultanahmet", ar: "السلطان أحمد", en: "Sultanahmet" },
      { tr: "Şişli", ar: "شيشلي", en: "Sisli" },
      { tr: "Beşiktaş", ar: "بشكتاش", en: "Besiktas" },
      { tr: "Fatih", ar: "الفاتح", en: "Fatih" },
      { tr: "Beyoğlu", ar: "بيوغلو", en: "Beyoglu" },
      { tr: "Bakırköy", ar: "باكركوي", en: "Bakirkoy" },
      { tr: "Zeytinburnu", ar: "زيتين بورنو", en: "Zeytinburnu" },
      { tr: "Kadıköy", ar: "كاديكوي", en: "Kadikoy" },
      { tr: "Ataşehir", ar: "آتاشهير", en: "Atasehir" },
      { tr: "Üsküdar", ar: "أسكودار", en: "Uskudar" },
      { tr: "Ortaköy", ar: "أورتاكوي", en: "Ortakoy" },
    ],
  },
  {
    key: "saw",
    image: "/images/places/galata.jpg",
    title: {
      tr: "Sabiha Gökçen Havalimanı (SAW) transferleri",
      ar: "خدمة النقل من مطار صبيحة كوكجن (SAW)",
      en: "Sabiha Gokcen Airport (SAW) transfers",
    },
    note: {
      tr: "Anadolu yakası ve Avrupa yakası; gece varışlarında da hizmet.",
      ar: "الجانب الآسيوي والأوروبي؛ الخدمة متاحة أيضاً للوصول الليلي.",
      en: "Asian and European side; available for late-night arrivals too.",
    },
    stops: [
      { tr: "Kadıköy", ar: "كاديكوي", en: "Kadikoy" },
      { tr: "Ataşehir", ar: "آتاشهير", en: "Atasehir" },
      { tr: "Üsküdar", ar: "أسكودار", en: "Uskudar" },
      { tr: "Pendik", ar: "بنديك", en: "Pendik" },
      { tr: "Kartal", ar: "كارطال", en: "Kartal" },
      { tr: "Maltepe", ar: "مالتبه", en: "Maltepe" },
      { tr: "Taksim", ar: "تقسيم", en: "Taksim" },
      { tr: "Sultanahmet", ar: "السلطان أحمد", en: "Sultanahmet" },
      { tr: "Şişli", ar: "شيشلي", en: "Sisli" },
      { tr: "Beşiktaş", ar: "بشكتاش", en: "Besiktas" },
    ],
  },
  {
    key: "intercity",
    image: "/images/tours/sapanca.jpg",
    title: {
      tr: "Şehirlerarası transfer ve günübirlik turlar",
      ar: "النقل بين المدن والجولات اليومية",
      en: "Intercity transfers and day trips",
    },
    note: {
      tr: "Aynı araç ve aynı şoför gün boyu sizinle kalır.",
      ar: "السيارة نفسها والسائق نفسه يبقيان معك طوال اليوم.",
      en: "The same vehicle and the same chauffeur stay with you all day.",
    },
    stops: [
      { tr: "Bursa", ar: "بورصة", en: "Bursa" },
      { tr: "Uludağ", ar: "أولوداغ", en: "Uludag" },
      { tr: "Cumalıkızık", ar: "جوما لي كيزيك", en: "Cumalikizik" },
      { tr: "Sapanca", ar: "سبانجا", en: "Sapanca" },
      { tr: "Maşukiye", ar: "معشوقية", en: "Masukiye" },
      { tr: "Kartepe", ar: "كارتبه", en: "Kartepe" },
      { tr: "Yalova", ar: "يالوفا", en: "Yalova" },
      { tr: "Bolu", ar: "بولو", en: "Bolu" },
      { tr: "Abant", ar: "أبانت", en: "Abant" },
      { tr: "Şile", ar: "شيله", en: "Sile" },
      { tr: "Ağva", ar: "آغوا", en: "Agva" },
      { tr: "Polonezköy", ar: "قرية البولونيز", en: "Polonezkoy" },
    ],
  },
  {
    key: "other",
    image: "/images/places/uzungol.jpg",
    title: {
      tr: "Diğer şehirlerde transfer ve tur",
      ar: "النقل والجولات في مدن أخرى",
      en: "Transfers and tours in other cities",
    },
    note: {
      tr: "Uçuşla gidilen şehirlerde de karşılama ve araç hizmeti veriyoruz.",
      ar: "نوفّر الاستقبال وخدمة السيارة في المدن التي تُقصد جواً أيضاً.",
      en: "We also provide meet-and-greet and vehicles in cities reached by air.",
    },
    stops: [
      { tr: "Trabzon", ar: "طرابزون", en: "Trabzon" },
      { tr: "Uzungöl", ar: "أوزنجول", en: "Uzungol" },
      { tr: "Sümela Manastırı", ar: "دير سوميلا", en: "Sumela Monastery" },
      { tr: "Ayder Yaylası", ar: "هضبة آيدر", en: "Ayder Plateau" },
      { tr: "Rize", ar: "ريزه", en: "Rize" },
      { tr: "Bodrum", ar: "بودروم", en: "Bodrum" },
      { tr: "Gümbet", ar: "غومبيت", en: "Gumbet" },
      { tr: "Bitez", ar: "بيتيز", en: "Bitez" },
      { tr: "Yalıkavak", ar: "يالي كافاك", en: "Yalikavak" },
    ],
  },
];
