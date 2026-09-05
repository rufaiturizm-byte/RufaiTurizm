import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { tours } from "@/data/tours";

/**
 * Tur karşılaştırma tablosu ve fiyata dahil olanlar.
 *
 * Tur listesi beş kart gösteriyordu ve karşılaştırma yapmak için kartlar
 * arasında gidip gelmek gerekiyordu: hangisi daha uzun, hangisi daha ucuz,
 * hangisi hangi şehirde. Beş satırlık bir tablo bu üç soruyu tek bakışta
 * cevaplıyor — ve arama motoru için de kartların taşımadığı yapılandırılmış
 * bir metin oluyor.
 *
 * Altındaki iki sütun (dahil / dahil değil) rezervasyondan önceki en sık
 * soruyu karşılıyor. Metinler mesaj dosyalarında zaten vardı ama yalnız tur
 * DETAY sayfalarında kullanılıyordu; liste sayfasına gelen kişi fiyatın
 * neyi kapsadığını hiç görmüyordu.
 */
export async function TourCompare() {
  const t = await getTranslations("toursPage");
  const tTours = await getTranslations("tours");
  const tCommon = await getTranslations("common");
  const tIncluded = await getTranslations("included");
  const tNotIncluded = await getTranslations("notIncluded");
  const tEyebrow = await getTranslations("eyebrow");

  const includedKeys = ["guide", "pickup", "vehicle", "fixedPrice", "water", "parking"] as const;
  const notIncludedKeys = ["tickets", "lunch", "boat", "tips"] as const;

  const th = "px-4 py-3.5 text-start text-[11.5px] font-extrabold uppercase tracking-[0.12em]";
  const td = "px-4 py-4 text-[14px] align-middle";

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("tours")}
          title={t("compareTitle")}
          subtitle={t("compareSubtitle")}
          rule={false}
        />

        {/* Dar ekranda tablo kendi içinde yatay kayar; sayfa gövdesi kaymaz. */}
        {/* data-lenis-prevent: tablo yatay kayarken Lenis sayfayı
            oynatmasın, ikisi birbirini kilitliyordu. */}
        <div
          data-lenis-prevent
          className="overflow-x-auto surface-card"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr style={{ background: "var(--brand-night)", color: "var(--brand-gold-label)" }}>
                <th className={th}>{t("colTour")}</th>
                <th className={th}>{t("colCity")}</th>
                <th className={th}>{t("colDuration")}</th>
                <th className={th}>{t("colPrice")}</th>
                <th className={th}>{t("colHighlight")}</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => {
                const highlights = tTours.raw(`${tour.key}.highlights`) as string[];
                const href = {
                  pathname: "/tours/[slug]" as const,
                  params: { slug: tour.slug },
                };

                return (
                  <tr
                    key={tour.key}
                    className="not-first:border-t"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <td className={`${td} font-bold`}>
                      <Link
                        href={href}
                        className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                      >
                        {tTours(`${tour.key}.name`)}
                      </Link>
                    </td>
                    <td className={`${td} text-muted-foreground`}>{tTours(`${tour.key}.city`)}</td>
                    <td className={`${td} whitespace-nowrap tabular-nums`}>
                      {tour.durationHours} {t("hours")}
                    </td>
                    <td
                      className={`${td} whitespace-nowrap font-extrabold`}
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      €{tour.priceFrom}
                    </td>
                    <td className={`${td} text-muted-foreground`}>{highlights[0]}</td>
                    <td className={`${td} text-end`}>
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold"
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

        <p className="mt-4 text-[13px] text-muted-foreground">{t("priceNote")}</p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <SectionHeading
          title={t("whatsIncludedTitle")}
          subtitle={t("whatsIncludedSubtitle")}
          rule={false}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="p-7 surface-card">
            <h3 className="text-[16px] font-bold">{t("includedTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {includedKeys.map((key) => (
                <li key={key} className="flex items-start gap-3 text-[14px] leading-snug">
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--brand-wa)" }}
                    aria-hidden="true"
                  />
                  {tIncluded(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-7 surface-card">
            <h3 className="text-[16px] font-bold">{t("notIncludedTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {notIncludedKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 text-[14px] leading-snug text-muted-foreground"
                >
                  <X className="mt-0.5 size-4 shrink-0 opacity-60" aria-hidden="true" />
                  {tNotIncluded(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
