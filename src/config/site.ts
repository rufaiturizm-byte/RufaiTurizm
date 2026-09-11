/** Site geneli sabitler. İletişim bilgileri tek yerden yönetilir. */
export const siteConfig = {
  url: "https://rufaiturizm.com",

  /** WhatsApp numarası — uluslararası biçim, sadece rakam (wa.me için). */
  whatsappNumber: "905416455263",

  /** Görüntülenen telefon numarası. */
  phoneDisplay: "+90 500 000 00 00",
  phoneHref: "+905000000000",

  email: "info@rufaiturizm.com",

  /*
   * Adres — kullanıcı tarafından verildi, TÜRSAB kaydıyla uyumlu.
   *
   * `street` bir süre boştu, yani sitede sokak adresi hiç yazmıyordu ve
   * şemadaki `PostalAddress` yalnız şehir + ülke taşıyordu. Yerel aramada
   * ve Google'ın işletme eşleştirmesinde ağırlığı olan alan tam adres.
   *
   * T.C. kaydında ilçe "EYÜP" olarak geçiyor; burada EYÜPSULTAN yazıyor
   * çünkü ilçenin güncel resmî adı o ve posta/harita sistemleri bu adı
   * kullanıyor. Posta kodu da kayıtta yok, burada var.
   *
   * TELEFON bilerek yer tutucu: TÜRSAB kaydındaki +90 212 562 96 20
   * numarasının hâlâ kullanımda olup olmadığı doğrulanmadı ve
   * `hasRealPhone` false olduğu sürece arama düğmesi hiç basılmıyor.
   * Ölü bir numara yayınlamak, olmayan bir belgeyi göstermekle aynı
   * cinsten bir hata.
   */
  address: {
    street: "Karadolap, Konfor Sk. No:1 D:7A",
    postalCode: "34220",
    district: "Eyüpsultan",
    city: "İstanbul",
    country: "TR",
  },

  social: {
    instagram: "https://www.instagram.com/rufaiistanbulturizm/",
    facebook: "",
    tiktok: "",
  },

  /**
   * Yasal belgeler — güven unsuru olarak gösterilir.
   *
   * Boş bırakılan belge sitede HİÇ görünmez: sahip olmadığımız bir belgeyi
   * "doğrulanmış" diye göstermek Ortadoğu pazarında en ağır güven kaybı.
   * Numara girildiği anda ana sayfadaki belge bandında yerini alır.
   */
  credentials: {
    /** TÜRSAB belge numarası — tursab.org.tr/acenta-arama üzerinden doğrulanabilir. */
    tursab: "12539",
    uetds: "",
    ibb: "",
    insurance: "",
  },

  /**
   * Şirketin kuruluş yılı.
   *
   * İki yerde kullanılıyor: ana sayfadaki "yıllık deneyim" rakamı ve
   * altbilgideki telif aralığı. İkisinde ayrı sabit tutmak, ilk
   * değişiklikte birinin unutulması demekti.
   */
  foundedYear: 2015,

  /**
   * GA4 ölçüm kimliği.
   *
   * Gizli bir değer DEĞİL: sayfanın kaynağında herkese görünür, o yüzden
   * env değişkeni değil config'te duruyor. Gizlenmesi gereken şey GA'nın
   * API anahtarları; bu ölçüm kimliği yalnız "veriyi hangi mülke yaz"
   * diyor.
   */
  ga4Id: "G-RK910BGB0G",

  /** Ticaret unvanı — TÜRSAB kaydında göründüğü biçim. */
  legalName: "RUFAİ İSTANBUL TURİZM",

  /** Belgenin herkese açık doğrulama adresi. */
  tursabVerifyUrl: "https://www.tursab.org.tr/acenta-arama",

  /**
   * Google işletme profili.
   *
   * Ana sayfadaki 4,9 puanı buraya bağlanıyor. Doğrulanamayan bir puan
   * Körfez pazarında güven kırar — müşteri kontrol eder, bulamazsa
   * rakamın tamamına şüpheyle bakar. Tıklanabilir olduğu anda aynı rakam
   * en güçlü güven sinyaline dönüşüyor.
   *
   * Kısa `share.google` bağlantısı işletmenin kendi paylaşım adresi.
   * Google Business Profile'ın "Paylaş" düğmesinden çıkan
   * `maps.app.goo.gl/...` biçimi daha kalıcıdır; eline geçince burayı
   * değiştirmek yeter, başka hiçbir yere dokunmak gerekmez.
   */
  googleReviewsUrl: "https://maps.app.goo.gl/StUizJ2R2H4KrfPs6",
} as const;

/**
 * Aranabilir bir telefon numarası girilmiş mi?
 *
 * Yer tutucu numara canlıda görünürse müşteri boş bir numarayı arar ve
 * güvenini kaybeder — hiç göstermemek daha dürüst.
 *
 * Denetim `phoneHref` üzerinden yapılır, `whatsappNumber` üzerinden DEĞİL:
 * ikisi ayrı alan ve WhatsApp numarasının girilmiş olması o hattın
 * aranabildiği anlamına gelmez. Önceki hali WhatsApp numarasına bakıyordu,
 * yani gerçek WhatsApp numarası girildiği anda sitede hâlâ yer tutucu olan
 * telefon numarası görünür hale gelecekti.
 */
export const hasRealPhone = !siteConfig.phoneHref.startsWith("+90500000");

/**
 * Google bağlantısı, işletme profilinin KENDİ adresi mi?
 *
 * Yapısal veride `sameAs`, "bu site ile şu kayıt aynı işletmedir" demektir
 * ve varlığın kendi sayfasını göstermelidir. Elimizdeki `share.google`
 * kısa bağlantısı bunu yapmıyor: takip edildiğinde bir Google ARAMA
 * sonucuna düşüyor, profil sayfasına değil. Arama sonucunu kimlik diye
 * yayınlamak yanlış bir iddia olur ve hiç yayınlamamaktan kötüdür.
 *
 * İnsan için bu bağlantı yine de iş görüyor (puanın altındaki bağlantı
 * durmaya devam ediyor); makineye verilen kimlik iddiası ise ancak
 * gerçek profil adresiyle yapılabilir.
 *
 * Google Business Profile → "Paylaş" düğmesinden çıkan
 * `maps.app.goo.gl/...` ya da doğrudan `google.com/maps/place/...`
 * adresi `googleReviewsUrl` alanına yazıldığı anda `sameAs`
 * kendiliğinden yayına giriyor; başka hiçbir yere dokunmak gerekmez.
 */
export const hasGoogleProfileUrl = /(?:maps\.app\.goo\.gl|google\.[a-z.]+\/maps\/place)/.test(
  siteConfig.googleReviewsUrl,
);

/**
 * Yapısal veride `sameAs` olarak yayınlanacak kimlik adresleri.
 *
 * NEDEN ÖNEMLİ. `sameAs`, Google'a "bu site şu hesapların sahibiyle aynı
 * varlıktır" der. Bu alan adının arama motorunda bir spam geçmişi var
 * (eski hosting hacklenmişti) ve hâlâ alakasız bir terimle anılıyor;
 * böyle bir durumda siteyi gerçek, doğrulanabilir bir işletmeye
 * bağlamak en ucuz güven sinyali. Sıfır backlink'i olan bir sitede
 * elimizdeki birkaç kimlik işaretinden biri.
 *
 * Boş alanlar eleniyor: var olmayan bir hesabı kimlik diye göstermek,
 * bu dosyanın telefon ve Google profilinde uyguladığı kuralın aynısıyla
 * çelişirdi — sahip olmadığımız hiçbir şeyi yayınlamıyoruz.
 */
export const socialProfiles = Object.values(siteConfig.social).filter(Boolean);

/**
 * Görüntülenecek tam adres, tek satır.
 *
 * Sitede adres iki yerde yazıyordu (iletişim kartı ve altbilgi) ve her
 * ikisi de yalnız `address.city` basıyordu — yani ziyaretçi "İstanbul"
 * görüyordu, adres değil. Bir seyahat acentesinde fiziksel adres, TÜRSAB
 * belgesinden sonraki en somut güven işareti: doğrulanabilir bir yer.
 *
 * Tek yerden üretiliyor çünkü iki çağrı yerinde elle yazmak, ilk
 * değişiklikte birinin unutulması demek — sitede bu hata daha önce
 * başka alanlarda yaşandı.
 *
 * Alanlar boş olabilir (sokak ve posta kodu bir süre boştu), o yüzden
 * boş parçalar eleniyor: ", , İstanbul" gibi bir çıktı olmasın.
 */
export const addressFull = [
  siteConfig.address.street,
  [siteConfig.address.postalCode, siteConfig.address.district]
    .filter(Boolean)
    .join(" "),
  siteConfig.address.city,
]
  .filter(Boolean)
  .join(", ");
