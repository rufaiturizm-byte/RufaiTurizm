import { getPathname } from "@/i18n/navigation";
import { locales, routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Sayfa başına canonical + hreflang üretir.
 *
 * Üç dilli bir sitede bu olmadan Google aynı içeriğin üç kopyasını ayrı
 * sayfa sanır ve hangisini sıralayacağına kendi karar verir. Yollar dile
 * göre değiştiği için (/turlar, /جولاتنا, /tours) adresleri elle yazmak
 * yerine next-intl'in kendi çözümleyicisinden alıyoruz — routing.ts
 * değişince buradaki adresler de kendiliğinden düzelir.
 */
export function alternatesFor(href: Href, locale: string) {
  const languages = Object.fromEntries(
    locales.map((item) => [item, `${siteConfig.url}${getPathname({ locale: item, href })}`]),
  ) as Record<(typeof locales)[number], string>;

  return {
    canonical: `${siteConfig.url}${getPathname({ locale: locale as (typeof locales)[number], href })}`,
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
