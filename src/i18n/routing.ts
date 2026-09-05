import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "tr", "en"] as const;
export type Locale = (typeof locales)[number];

/** Sağdan sola yazılan diller. */
export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string) {
  return rtlLocales.includes(locale as Locale);
}

export const routing = defineRouting({
  locales,
  // Ana pazar Ortadoğu: kök adres (rufaiturizm.com) Arapça açılır.
  defaultLocale: "ar",
  // Varsayılan dil ön ek almaz: "/" = ar, "/tr", "/en"
  localePrefix: "as-needed",
});
