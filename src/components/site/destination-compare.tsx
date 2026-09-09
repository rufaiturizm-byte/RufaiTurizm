import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { ProseSection } from "./prose-section";
import { destinations } from "@/data/destinations";
import type { Locale } from "@/i18n/routing";

/**
 * Şehir karşılaştırma tablosu.
 *
 * Şehirler listesi altı büyük fotoğraf kartı gösteriyordu ve her kartta tek
 * satırlık bir tanıtım vardı. Ama bu sayfaya gelen kişinin sorusu tek bir
 * şehir değil, ikisi arasındaki SEÇİM: "Antalya mı Bodrum mu", "Trabzon'a
 * kaç gün gerekir". Kartlar arasında gidip gelerek bu karşılaştırma
 * yapılamıyordu; her cevap ayrı bir şehir sayfasının içindeydi.
 *
 * Beş eksen altı şehirde de aynı (destinations.ts'teki `compare`), çünkü
 * karşılaştırmayı mümkün kılan şey eksenlerin ortak olması. Şehirlerin
 * kendi `facts` alanları buna uygun değil: orada Antalya "sahil uzunluğu",
 * Bursa "kar mevsimi" yazıyor.
 *
 * Tablo aynı zamanda sayfanın metin hacmini de çözüyor — burası sitedeki
 * en az metinli sayfaydı (3.100 karakter; rehber listesi 11.500).
 */
export async function DestinationCompare({ locale }: { locale: string }) {
  const t = await getTranslations("destinationsPage");
  const tCommon = await getTranslations("common");
  const tEyebrow = await getTranslations("eyebrow");
  const lang = locale as Locale;

  const th = "px-4 py-3.5 text-start text-[11.5px] font-extrabold uppercase tracking-[0.12em]";
  const td = "px-4 py-4 text-[14px] align-middle";

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("destinations")}
          title={t("compareTitle")}
          subtitle={t("compareSubtitle")}
          rule={false}
        />

        {/*
          Dar ekranda tablo kendi içinde yatay kayar; sayfa gövdesi kaymaz.
          Metin ağırlıklı üç sütuna (nasıl gidilir / deniz / kime uyar) alt
          sınır verildi: nowrap taşıyan sütunlar tüm genişliği kapınca bu
          üçü 390px'te kelime kelime alt alta düşüyordu.
        */}
        <div
          className="scroll-x-hint overflow-x-auto surface-card"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <table className="w-full min-w-[1040px] border-collapse">
            <thead>
              <tr style={{ background: "var(--brand-night)", color: "var(--brand-gold-label)" }}>
                <th scope="col" className={th}>{t("colCity")}</th>
                <th scope="col" className={th}>{t("colReach")}</th>
                <th scope="col" className={th}>{t("colStay")}</th>
                <th scope="col" className={th}>{t("colSea")}</th>
                <th scope="col" className={th}>{t("colMonths")}</th>
                <th scope="col" className={th}>{t("colSuits")}</th>
                <th scope="col" className={th}>
                  <span className="sr-only">{tCommon("details")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((item) => {
                const href = {
                  pathname: "/destinations/[city]" as const,
                  params: { city: item.slug },
                };
                const pick = (field: keyof typeof item.compare) =>
                  item.compare[field][lang] ?? item.compare[field].tr;

                return (
                  <tr
                    key={item.slug}
                    className="not-first:border-t"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <td className={`${td} font-bold`}>
                      <Link
                        href={href}
                        className="inline-block py-1.5 transition-colors hover:text-[color:var(--brand-gold-deep)]"
                      >
                        {item.name[lang] ?? item.name.tr}
                      </Link>
                    </td>
                    <td className={`${td} min-w-[10.5rem] text-muted-foreground`}>{pick("reach")}</td>
                    <td className={`${td} whitespace-nowrap`}>{pick("stay")}</td>
                    <td className={`${td} min-w-[10.5rem] text-muted-foreground`}>{pick("sea")}</td>
                    <td className={`${td} whitespace-nowrap`}>{pick("months")}</td>
                    <td className={`${td} min-w-[10.5rem] text-muted-foreground`}>{pick("suits")}</td>
                    <td className={`${td} text-end`}>
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap py-1 text-[13px] font-semibold"
                        style={{ color: "var(--brand-gold-deep)" }}
                      >
                        {tCommon("details")}
                        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[12.5px] text-muted-foreground lg:hidden">{tCommon("swipeHint")}</p>
      </section>

      <ProseSection title={t("combineTitle")} body={t("combineText")} className="pb-20" />
    </>
  );
}
