import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";

/**
 * "Nasıl çalışıyoruz" — dört adım.
 *
 * Rakip analizinden (madde 11): karmaşık talebi olan müşteri, süreci
 * göremediği için vazgeçiyor. Adımları yazmak, WhatsApp'tan yazmanın
 * neye yol açacağını baştan belli ediyor.
 */
export async function ProcessSteps() {
  const t = await getTranslations("servicesPage");

  const steps = ["1", "2", "3", "4"] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("processTitle")} subtitle={t("processSubtitle")} />

      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step} className="relative rounded-lg border bg-card p-6">
            <span
              className="flex size-9 items-center justify-center rounded-full text-[15px] font-extrabold"
              style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
            >
              {step}
            </span>
            <h3 className="mt-4 text-[15.5px] font-bold">{t(`step${step}Title`)}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              {t(`step${step}Desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
