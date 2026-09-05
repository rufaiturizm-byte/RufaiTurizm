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

  /** Yasal belgeler — güven unsuru olarak gösterilir. */
  credentials: {
    tursab: "",
    uetds: "",
  },
} as const;
