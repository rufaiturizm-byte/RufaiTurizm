import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";

/**
 * "Nasıl çalışıyoruz" — dört adım.
 *
 * Kart yerine numara: adımlar çerçeveli kutulara konunca sayfadaki diğer
 * ızgaralardan ayrışmıyordu. Büyük rakam ve ince çizgi, sıralı bir süreç
 * olduğunu kutudan daha iyi anlatıyor.
 */
export async function ProcessSteps() {
  const t = await getTranslations("servicesPage");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("process")}
        title={t("processTitle")}
        subtitle={t("processSubtitle")}
        rule={false}
      />

      {/* Adımlar önce ince çizgi + soluk rakamla diziliydi ve sayfada düz
          bir metin bloğu gibi duruyordu. Rozet + kesik bağlantı çizgisi
          hem sırayı hem süreç olduğunu anlatıyor. */}
      <ol className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
        {(["1", "2", "3", "4"] as const).map((step, index) => (
          <li
            key={step}
            className={`relative text-center ${index < 3 ? "lg:step-link" : ""}`}
          >
            <span className="step-badge size-12 text-[18px] font-extrabold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-[16.5px] font-bold">{t(`step${step}Title`)}</h3>
            <p className="mx-auto mt-2.5 max-w-[17rem] text-[14px] leading-[1.75] text-muted-foreground">
              {t(`step${step}Desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
