/**
 * Site geneli sabitler. İletişim bilgileri tek yerden yönetilir.
 * TODO: Gerçek numaralar geldiğinde güncellenecek.
 */
export const siteConfig = {
  url: "https://rufaiturizm.com",

  /** WhatsApp numarası — uluslararası biçim, sadece rakam (wa.me için). */
  whatsappNumber: "905000000000",

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

  /** Google işletme profili — yorum bölümündeki bağlantı için. */
  googleReviewsUrl: "",
} as const;

/**
 * Gerçek iletişim bilgisi girilmiş mi?
 *
 * Yer tutucu numara canlıda görünürse müşteri boş bir numarayı arar ve
 * güvenini kaybeder — hiç göstermemek daha dürüst. Numara girildiği anda
 * telefon satırları kendiliğinden geri gelir.
 */
export const hasRealPhone = !siteConfig.whatsappNumber.startsWith("90500000");

