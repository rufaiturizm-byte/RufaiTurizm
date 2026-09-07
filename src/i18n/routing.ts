import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "tr", "en"] as const;
export type Locale = (typeof locales)[number];

/** Sağdan sola yazılan diller. */
export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string) {
  return rtlLocales.includes(locale as Locale);
}

/**
 * Dile göre URL yolları. Arapça ana pazar olduğu için bölüm adları da
 * Arapça — arama motorunda Arapça sorgularla eşleşmeyi güçlendirir.
 * Detay sayfalarının slug'ları (vito-vip, istanbul gibi) her dilde aynıdır.
 */
export const pathnames = {
  "/": "/",
  "/services": {
    ar: "/خدماتنا",
    tr: "/hizmetler",
    en: "/services",
  },
  "/services/[slug]": {
    ar: "/خدماتنا/[slug]",
    tr: "/hizmetler/[slug]",
    en: "/services/[slug]",
  },
  "/tours": {
    ar: "/جولاتنا",
    tr: "/turlar",
    en: "/tours",
  },
  "/tours/[slug]": {
    ar: "/جولاتنا/[slug]",
    tr: "/turlar/[slug]",
    en: "/tours/[slug]",
  },
  "/about": {
    ar: "/من-نحن",
    tr: "/hakkimizda",
    en: "/about",
  },
  "/contact": {
    ar: "/تواصل-معنا",
    tr: "/iletisim",
    en: "/contact",
  },
  "/faq": {
    ar: "/الاسئلة-الشائعة",
    tr: "/sikca-sorulan-sorular",
    en: "/faq",
  },
  /*
   * Transfer kendi sayfasını hak ediyor: en çok aranan hizmet bu ve
   * "havalimanı transfer" araması hizmetler sayfasının içindeki bir
   * bölüme değil, doğrudan bir sayfaya inmeli. Çeviriler (transferPage.*)
   * ve bölümleri (transfer-sections.tsx) zaten yazılıydı, eksik olan
   * yalnızca rotaydı.
   */
  "/transfer": {
    ar: "/النقل-من-المطار",
    tr: "/transfer",
    en: "/transfer",
  },
  /*
   * Güzergâh sayfaları. Müşteri "havalimanı transferi" diye değil
   * "مطار اسطنبول الى تقسيم" diye arıyor; transfer sayfası bu aramaların
   * hepsini tek başına karşılayamaz. Beş güzergâh var, 43 değil: şablondan
   * üretilmiş 43 sayfa ince içerik olurdu (bkz. data/transfer-routes.ts).
   */
  "/transfer/[route]": {
    ar: "/النقل-من-المطار/[route]",
    tr: "/transfer/[route]",
    en: "/transfer/[route]",
  },
  /*
   * Seyahat rehberleri. Hizmet sayfaları "biz ne yapıyoruz" diye yazılır;
   * misafir ise seyahatten haftalar önce SORU arar ("مطار اسطنبول كيف اروح
   * للفندق"). Rakiplerin blog/rehber bölümüyle tuttuğu yüzey burası.
   */
  "/guides": {
    ar: "/أدلة-السفر",
    tr: "/seyahat-rehberi",
    en: "/travel-guides",
  },
  "/guides/[slug]": {
    ar: "/أدلة-السفر/[slug]",
    tr: "/seyahat-rehberi/[slug]",
    en: "/travel-guides/[slug]",
  },
  /* Konaklama: "otel rezervasyonu" hizmetimizin arama karşılığı burada. */
  "/hotels": {
    ar: "/فنادق-إسطنبول",
    tr: "/oteller",
    en: "/hotels",
  },
} as const;

export const routing = defineRouting({
  locales,
  // Ana pazar Ortadoğu: kök adres (rufaiturizm.com) Arapça açılır.
  defaultLocale: "ar",
  // Varsayılan dil ön ek almaz: "/" = ar, "/tr", "/en"
  localePrefix: "as-needed",
  /*
   * Tarayıcı diline göre otomatik yönlendirme KAPALI.
   *
   * Açıkken kök adres ziyaretçinin `Accept-Language` başlığına bakıyor ve
   * Türkçe ya da İngilizce tercih eden herkesi 307 ile /tr veya /en'e
   * atıyordu. İki sorunu vardı:
   *
   * 1. Marka adresi tutarsızdı — rufaiturizm.com kimde hangi dilde
   *    açılacağı ziyaretçinin tarayıcı ayarına kalmıştı. Ana pazar Körfez
   *    olan bir sitede kök adres her zaman Arapça açılmalı.
   * 2. Tarayıcısı Türkçe olan bir Körfez misafiri (Türkiye'de aldığı
   *    telefonda ya da Türkçe arayüzlü cihazda) Arapça siteyi hiç
   *    görmeden Türkçeye düşüyordu.
   *
   * Dil değiştirici üst menüde sabit duruyor; isteyen tek tıkla geçiyor.
   */
  localeDetection: false,
  pathnames,
});
