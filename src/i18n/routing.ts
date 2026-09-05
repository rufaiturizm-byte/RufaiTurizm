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
} as const;

export const routing = defineRouting({
  locales,
  // Ana pazar Ortadoğu: kök adres (rufaiturizm.com) Arapça açılır.
  defaultLocale: "ar",
  // Varsayılan dil ön ek almaz: "/" = ar, "/tr", "/en"
  localePrefix: "as-needed",
  pathnames,
});
