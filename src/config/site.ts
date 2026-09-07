/** Site geneli sabitler. İletişim bilgileri tek yerden yönetilir. */
export const siteConfig = {
  url: "https://rufaiturizm.com",

  /** WhatsApp numarası — uluslararası biçim, sadece rakam (wa.me için). */
  whatsappNumber: "905416455263",

  /** Görüntülenen telefon numarası. */
  phoneDisplay: "+90 500 000 00 00",
  phoneHref: "+905000000000",

  email: "info@rufaiturizm.com",

  address: {
    street: "",
    city: "İstanbul",
    country: "TR",
  },

  social: {
    instagram: "",
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
  googleReviewsUrl: "https://share.google/EdbOymjePUlTZVxoS",
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

