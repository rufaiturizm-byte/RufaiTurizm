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
    tursab: "",
    uetds: "",
    ibb: "",
    insurance: "",
  },

  /** Google işletme profili — yorum bölümündeki bağlantı için. */
  googleReviewsUrl: "",
} as const;
