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
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("process")}
        title={t("processTitle")}
        subtitle={t("processSubtitle")}
      />

      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {(["1", "2", "3", "4"] as const).map((step, index) => (
          <li
            key={step}
            className="pt-6 lg:ps-8 lg:pt-0"
            style={{
              borderTop: "2px solid color-mix(in oklab, var(--brand-gold) 45%, transparent)",
            }}
          >
            <span
              className="text-[34px] font-extrabold leading-none tabular-nums"
              style={{ color: "color-mix(in oklab, var(--brand-night) 16%, transparent)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-[16px] font-bold">{t(`step${step}Title`)}</h3>
            <p className="mt-2.5 text-[14px] leading-[1.75] text-muted-foreground">
              {t(`step${step}Desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
