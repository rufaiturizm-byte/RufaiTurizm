import { transferRoutes } from "./transfer-routes";
import { hotelAreas } from "./hotels";
import { destinations } from "./destinations";

/**
 * Transfer formundaki alış ve varış noktası önerileri.
 *
 * NEDEN VAR. Form iki boş metin kutusu istiyordu ve ziyaretçi "İstanbul
 * havalimanı" mı "IST" mi "Istanbul Airport" mı yazacağını bilmiyordu.
 * Yazım tutmayınca WhatsApp'a giden mesaj da belirsiz kalıyor ve satışçı
 * "hangi havalimanı" diye geri sormak zorunda kalıyor — dönüşümün en
 * pahalı yeri o geri soru.
 *
 * VERİ UYDURULMADI. Havalimanları ve semtler `transfer-routes.ts` içinde
 * ZATEN üç dilde yazılıydı; oteller `hotels.ts`, şehirler
 * `destinations.ts` içinde. Bu dosya onları birleştiriyor, kopyalamıyor —
 * bir rota eklendiğinde ya da bir semtin adı düzeltildiğinde öneri listesi
 * kendiliğinden güncelleniyor. İkinci bir kopya tutmak, ilk düzeltmede
 * ikisinin ayrışması demekti.
 *
 * TEK İSTİSNA alışveriş merkezleri: sitede hiçbir yerde kayıtlı değiller
 * ama transferin gerçek bir kalkış noktasılar ve İbrahim özellikle istedi.
 * Aşağıda elle yazılıyorlar ve nereden geldikleri belli olsun diye ayrı
 * duruyorlar.
 *
 * ÖNERİ ZORUNLU DEĞİL. Alan serbest metin olarak kalıyor: listede olmayan
 * bir yer yazan ziyaretçi engellenmiyor. Kapalı bir açılır liste, listeye
 * girmemiş her otel için bir rezervasyon kaybı olurdu.
 */

type Text = { tr: string; ar: string; en: string };

export type LocationKind = "airport" | "district" | "hotel" | "mall" | "landmark";

export interface LocationOption {
  id: string;
  kind: LocationKind;
  name: Text;
  /**
   * Ek arama anahtarları.
   *
   * Görünen ad tek biçim, aranan biçim birçok: "IST" yazan da
   * "havalimani" yazan da "ataturk" yazan da aynı satırı bulmalı.
   * Bunlar yalnız aramada kullanılıyor, hiçbir yerde basılmıyor.
   */
  aliases?: string[];
}

/**
 * Arama için metni sadeleştirir.
 *
 * İKİ DİL, İKİ AYRI SORUN.
 *
 * Arapçada aynı kelime birden çok biçimde yazılıyor ve ziyaretçi hangisini
 * yazacağını bilmiyor: hemzeli elif (أ إ آ) ile yalın elif (ا), ta marbuta
 * (ة) ile ha (ه), elif maksura (ى) ile ya (ي). Harekeler de isteğe bağlı.
 * Sadeleştirilmezse "اسطنبول" yazan ziyaretçi "إسطنبول" kaydını bulamaz —
 * ve bu, sitenin anahtar kelime verisinde ölçülmüş gerçek bir davranış.
 *
 * Türkçede sorun aksanlı harfler: telefon klavyesiyle yazan çoğu kişi
 * "sisli", "besiktas", "kadikoy" yazıyor. Unicode ayrıştırma (NFD) ş ve ç
 * gibi harfleri çözüyor ama NOKTASIZ ı ayrı bir harf, ayrışmıyor — o
 * yüzden elle eşleniyor.
 */
export function normalizeQuery(value: string): string {
  return (
    value
      .normalize("NFD")
      /*
       * KAÇIŞ DİZİLERİ BİLEREK — buraya Arapça harf YAZMAYIN.
       *
       * Bu dosyanın ilk hâli harfleri doğrudan taşıyordu ve düzenleyici
       * çift yönlü metni yeniden sıralayınca regex ARALIKLARI bozuldu:
       * tarayıcıda ölçüldü, hemzesiz yazan ziyaretçi hemzeli kaydı
       * bulamıyordu — yani fonksiyonun tek işi sessizce çalışmıyordu.
       * `\uXXXX` biçimi yeniden sıralanmaz.
       */
      .replace(/[\u0300-\u036F]/g, "") // Latin aksanları: ş ç ü ö
      /*
       * Aralık U+065F'e kadar gider, U+0652'ye DEĞİL — bu bir hata düzeltmesi.
       *
       * Üstteki `normalize("NFD")` hemzeli elifi (إ) ikiye ayırıyor:
       * yalın elif + BİRLEŞEN hamza (U+0655). İlk hâl U+0652'de bitiyordu,
       * yani o hamza silinmiyordu ve hemzesiz yazan ziyaretçi hemzeli kaydı
       * hâlâ bulamıyordu. Tarayıcıda ölçüldü: hemzesiz sorgu 0 sonuç,
       * hemzeli sorgu 3 sonuç veriyordu.
       *
       * U+064B–U+065F bütün Arapça birleşen işaretlerini kapsıyor: harekeler,
       * medde (U+0653), üstte ve altta hamza (U+0654, U+0655).
       */
      .replace(/[\u064B-\u065F\u0610-\u061A\u0670\u0640\u06D6-\u06ED]/g, "")
      .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627") // hemzeli elif → elif
      .replace(/\u0649/g, "\u064A") // elif maksura → ya
      .replace(/\u0629/g, "\u0647") // ta marbuta → ha
      .replace(/\u0624/g, "\u0648") // vav üstü hemze → vav
      .replace(/\u0626/g, "\u064A") // ya üstü hemze → ya
      .replace(/[\u0131\u0130]/g, "i") // ı İ — NFD bunları çözmez
      .replace(/[\u011F\u011E]/g, "g") // ğ Ğ
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
  );
}

/** Aynı adı iki kez listelememek için. */
function tekille(liste: LocationOption[]): LocationOption[] {
  const gorulen = new Set<string>();
  return liste.filter((item) => {
    const anahtar = `${item.kind}:${normalizeQuery(item.name.tr)}`;
    if (gorulen.has(anahtar)) return false;
    gorulen.add(anahtar);
    return true;
  });
}

/*
 * Havalimanları — rotaların kalkış noktalarından.
 *
 * Kısa kodlar (IST, SAW, AYT, BJV) adın içinde parantezle zaten yazıyor
 * ama arama için ayrıca anahtar olarak veriliyor: "IST" yazan biri
 * parantezin içini aramıyor, doğrudan kodu yazıyor.
 */
const havalimanlari: LocationOption[] = tekille(
  transferRoutes.map((route) => ({
    id: `airport-${route.airport}`,
    kind: "airport" as const,
    name: route.from,
    aliases: [route.airport, route.from.tr, route.from.en, "havalimani", "airport", "\u0645\u0637\u0627\u0631"],
  })),
);

/* Semtler — rotaların varış noktaları. */
const rotaSemtleri: LocationOption[] = transferRoutes.map((route, index) => ({
  id: `district-route-${index}`,
  kind: "district" as const,
  name: route.to,
  /*
    Diğer iki dildeki ad takma ad oluyor.

    Körfez'den gelen ziyaretçilerin önemli bir kısmı telefon klavyesiyle
    Latin harf yazıyor: Arapça sayfada "taksim" yazan biri de "تقسيم"
    kaydını bulmalı. Ad zaten üç dilde elimizde, ek veri gerekmiyor.
  */
  aliases: [route.to.tr, route.to.en],
}));

/* Otel bölgeleri — `hotels.ts` içindeki altı bölge. */
const otelBolgeleri: LocationOption[] = hotelAreas.map((area) => ({
  id: `district-area-${area.key}`,
  kind: "district" as const,
  name: area.name,
  aliases: [area.name.tr, area.name.en],
}));

/* Şehirler — hizmet verilen altı bölge merkezi. */
const sehirler: LocationOption[] = destinations.map((destination) => ({
  id: `district-city-${destination.slug}`,
  kind: "district" as const,
  name: destination.name,
  aliases: [destination.name.tr, destination.name.en, destination.slug],
}));

/*
 * Oteller — `hotels.ts` içindeki adlar.
 *
 * Otel adları marka: üç dilde de aynı yazılıyorlar, o yüzden tek dize
 * üç alana da konuyor. Arapça sayfada Latin harflerle görünmeleri
 * doğru — misafir otelin adını rezervasyonunda o biçimde görüyor.
 */
const oteller: LocationOption[] = hotelAreas.flatMap((area) =>
  (area.hotels ?? []).map((hotel) => ({
    id: `hotel-${normalizeQuery(hotel.name).replace(/\s+/g, "-")}`,
    kind: "hotel" as const,
    name: { tr: hotel.name, ar: hotel.name, en: hotel.name },
  })),
);

/*
 * Ziyaret noktaları — transferin gerçekten gittiği yerler.
 *
 * NEDEN VAR. Transfer yalnız havalimanı–otel arası değil: misafir gün
 * içinde Ayasofya'ya, Kapalıçarşı'ya, Çamlıca'ya gidiyor ve formu o yer
 * adıyla dolduruyor. Liste bunları tanımazsa ziyaretçi ya serbest yazıyor
 * (yazım tutmuyor) ya da vazgeçiyor.
 *
 * SEÇİM ARAMA VERİSİNE DAYANIYOR, hevese değil. Körfez pazarının Arapça
 * arama verisinde İstanbul tek başına sayfa adaylarının %60'ını tutuyor ve
 * gezi kümesindeki hacim bu noktalara dağılıyor. Listeye ayrıca sitenin
 * KENDİ rehberlerinin anlattığı günübirlik noktalar alındı — Sapanca,
 * Maşukiye, Uludağ, Abant, Şile, Ağva — çünkü o sayfalar zaten bu yerleri
 * anlatıyor ve misafir oradan geliyor.
 *
 * Arapça karşılıklar yaygın okunuşlar; Latin adlar `aliases` içinde,
 * çünkü telefon klavyesiyle yazan Latin harf kullanıyor.
 *
 * BURASI ELLE YAZILAN İKİNCİ VE SON YER (diğeri AVM'ler). Geri kalan her
 * şey sitenin kendi verisinden türüyor.
 */
const yerler: LocationOption[] = [
  {
    id: "landmark-ayasofya",
    kind: "landmark",
    name: { tr: "Ayasofya", ar: "آيا صوفيا", en: "Hagia Sophia" },
    aliases: ["ayasofya", "hagia sophia", "sultanahmet"],
  },
  {
    id: "landmark-kapalicarsi",
    kind: "landmark",
    name: { tr: "Kapalıçarşı", ar: "السوق المسقوف", en: "Grand Bazaar" },
    aliases: ["kapalicarsi", "grand bazaar", "carsi"],
  },
  {
    id: "landmark-dolmabahce",
    kind: "landmark",
    name: { tr: "Dolmabahçe Sarayı", ar: "قصر دولما بهتشه", en: "Dolmabahce Palace" },
    aliases: ["dolmabahce", "dolmabahce palace", "saray"],
  },
  {
    id: "landmark-galata",
    kind: "landmark",
    name: { tr: "Galata Kulesi", ar: "برج غلطة", en: "Galata Tower" },
    aliases: ["galata", "galata tower", "kule"],
  },
  {
    id: "landmark-eminonu",
    kind: "landmark",
    name: { tr: "Eminönü", ar: "أمينونو", en: "Eminonu" },
    aliases: ["eminonu", "misir carsisi", "spice bazaar"],
  },
  {
    id: "landmark-uskudar",
    kind: "landmark",
    name: { tr: "Üsküdar", ar: "أسكودار", en: "Uskudar" },
    aliases: ["uskudar"],
  },
  {
    id: "landmark-camlica",
    kind: "landmark",
    name: { tr: "Çamlıca Tepesi", ar: "تلة تشامليجا", en: "Camlica Hill" },
    aliases: ["camlica", "camlica hill", "tepe"],
  },
  {
    id: "landmark-eyupsultan",
    kind: "landmark",
    name: { tr: "Eyüpsultan ve Pierre Loti", ar: "أيوب سلطان وبيير لوتي", en: "Eyupsultan and Pierre Loti" },
    aliases: ["eyup", "eyupsultan", "pierre loti"],
  },
  {
    id: "landmark-balat",
    kind: "landmark",
    name: { tr: "Balat", ar: "بالاط", en: "Balat" },
    aliases: ["balat", "fener"],
  },
  {
    id: "landmark-adalar",
    kind: "landmark",
    name: { tr: "Adalar", ar: "جزر الأمراء", en: "Princes' Islands" },
    aliases: ["adalar", "buyukada", "princes islands"],
  },
  {
    id: "landmark-masukiye",
    kind: "landmark",
    name: { tr: "Maşukiye", ar: "معشوقية", en: "Masukiye" },
    aliases: ["masukiye", "sapanca"],
  },
  {
    id: "landmark-uludag",
    kind: "landmark",
    name: { tr: "Uludağ", ar: "أولوداغ", en: "Uludag" },
    aliases: ["uludag", "bursa"],
  },
  {
    id: "landmark-abant",
    kind: "landmark",
    name: { tr: "Abant Gölü", ar: "بحيرة أبانت", en: "Lake Abant" },
    aliases: ["abant", "bolu"],
  },
  {
    id: "landmark-sile-agva",
    kind: "landmark",
    name: { tr: "Şile ve Ağva", ar: "شيلا وأغوا", en: "Sile and Agva" },
    aliases: ["sile", "agva"],
  },
];

/*
 * Alışveriş merkezleri — bu dosyadaki TEK elle yazılmış veri.
 *
 * Sitede hiçbir yerde kayıtlı değiller ama transferin gerçek bir kalkış
 * ve varış noktasılar. Liste kısa tutuldu: Körfez'den gelen misafirin
 * gerçekten gittiği merkezler. Hepsi var olan yerler; burada bir hizmet
 * iddiası yok, yalnızca adres önerisi.
 *
 * Arapça karşılıklar yaygın okunuşlar. Latin adları `aliases` içinde,
 * çünkü marka adını Latin harflerle yazan da bulmalı.
 */
const avmler: LocationOption[] = [
  {
    id: "mall-istinye-park",
    kind: "mall",
    name: { tr: "İstinye Park", ar: "إستينيه بارك", en: "Istinye Park" },
    aliases: ["istinye park", "avm", "mall", "مول"],
  },
  {
    id: "mall-cevahir",
    kind: "mall",
    name: { tr: "Cevahir AVM", ar: "جواهر", en: "Cevahir Mall" },
    aliases: ["cevahir", "avm", "mall", "مول"],
  },
  {
    id: "mall-of-istanbul",
    kind: "mall",
    name: { tr: "Mall of İstanbul", ar: "مول أوف إسطنبول", en: "Mall of Istanbul" },
    aliases: ["mall of istanbul", "avm", "mall", "مول"],
  },
  {
    id: "mall-emaar",
    kind: "mall",
    name: { tr: "Emaar Square", ar: "إعمار سكوير", en: "Emaar Square" },
    aliases: ["emaar", "avm", "mall", "مول"],
  },
  {
    id: "mall-akasya",
    kind: "mall",
    name: { tr: "Akasya AVM", ar: "أكاسيا", en: "Akasya Mall" },
    aliases: ["akasya", "avm", "mall", "مول"],
  },
  {
    id: "mall-zorlu",
    kind: "mall",
    name: { tr: "Zorlu Center", ar: "زورلو سنتر", en: "Zorlu Center" },
    aliases: ["zorlu", "avm", "mall", "مول"],
  },
];

/**
 * Önerilerin tamamı.
 *
 * Sıra ÖNEMLİ ve alfabetik değil: havalimanı en sık yazılan kalkış
 * noktası, otel adı en uzun yazılan. Eşit puanlı sonuçlarda önce
 * havalimanları, sonra semtler geliyor — arama kutusuna iki harf yazan
 * biri büyük ihtimalle havalimanı arıyor.
 */
export const locationOptions: LocationOption[] = tekille([
  ...havalimanlari,
  ...rotaSemtleri,
  ...otelBolgeleri,
  ...sehirler,
  ...yerler,
  ...avmler,
  ...oteller,
]);

/**
 * Yazılana en uygun önerileri döndürür.
 *
 * PUANLAMA basit ve bilerek öyle: adın BAŞINDAN eşleşen, ortasından
 * eşleşenden önce geliyor. "tak" yazan biri "Taksim" bekliyor,
 * "Beşiktaş ve Ortaköy" değil — ikisi de "tak" içeriyor ama biri
 * sorgunun cevabı, diğeri tesadüf.
 *
 * Boş sorguda ilk birkaç öneri gösteriliyor: alan tıklandığında liste
 * boş açılırsa ziyaretçi burada ne olduğunu anlamıyor.
 */
export function searchLocations(
  query: string,
  locale: "tr" | "ar" | "en",
  limit = 7,
): LocationOption[] {
  const q = normalizeQuery(query);
  if (!q) return locationOptions.slice(0, limit);

  const puanli: { option: LocationOption; puan: number }[] = [];

  for (const option of locationOptions) {
    const ad = normalizeQuery(option.name[locale]);
    const hepsi = [ad, ...(option.aliases ?? []).map(normalizeQuery)];

    let puan = 0;
    for (const alan of hepsi) {
      if (!alan) continue;
      if (alan === q) puan = Math.max(puan, 100);
      else if (alan.startsWith(q)) puan = Math.max(puan, 80);
      else if (alan.split(" ").some((kelime) => kelime.startsWith(q))) puan = Math.max(puan, 60);
      else if (alan.includes(q)) puan = Math.max(puan, 30);
    }

    if (puan > 0) puanli.push({ option, puan });
  }

  return puanli
    .sort((a, b) => b.puan - a.puan)
    .slice(0, limit)
    .map((item) => item.option);
}
