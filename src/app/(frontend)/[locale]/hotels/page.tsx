import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BedDouble, Info, MapPin } from "lucide-react";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { RouteCoverage } from "@/components/site/route-coverage";
import { CredentialsBand } from "@/components/site/credentials-band";
import { ClosingCta } from "@/components/site/transfer-sections";
import { hotelAreas } from "@/data/hotels";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotelsPage" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/hotels", locale),
  };
}

/**
 * Otel rehberi.
 *
 * "Uçak bileti ve otel rezervasyonu" dört hizmetimizden biriydi ama sitede
 * tek cümleyle geçiyordu; oysa Körfez'den gelen misafirin uçak biletinden
 * sonraki ilk sorusu "nerede kalayım". Sayfa o soruyu semt semt cevaplıyor.
 *
 * Liste bilerek "anlaşmalı otellerimiz" DEĞİL diye kuruldu ve bunu sayfada
 * açıkça yazıyor: olmayan bir ortaklığı ima etmek, sitenin geri kalanında
 * kurmaya çalıştığımız güveni ilk rezervasyonda bozar. Aynı sebeple fiyat,
 * yıldız ve müsaitlik yok — üçü de doğrulayamadığımız bilgiler.
 *
 * Fotoğraflar SEMT fotoğrafı ve öyle etiketleniyor: o otellerin görsel
 * kullanım hakkına sahip değiliz, başka bir fotoğrafı otelin fotoğrafı
 * gibi göstermek olmaz.
 */
export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hotelsPage");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const lang = locale as Locale;

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("hotels"), url: getPathname({ locale, href: "/hotels" }) },
        ]}
      />

      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
        breadcrumb={`${tNav("home")} · ${tNav("hotels")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/* Ne olduğunu ve ne OLMADIĞINI baştan söyleyen not */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8">
        <div
          className="flex items-start gap-4 rounded-[var(--radius-card)] border px-6 py-5"
          style={{
            background: "color-mix(in oklab, var(--brand-sky) 12%, transparent)",
            borderColor: "color-mix(in oklab, var(--brand-sky) 34%, transparent)",
          }}
        >
          <Info
            className="mt-0.5 size-5 shrink-0"
            style={{ color: "var(--brand-night)" }}
            aria-hidden="true"
          />
          <p className="text-[13.5px] leading-[1.8]">{t("disclaimer")}</p>
        </div>
      </section>

      {/* Semt semt */}
      <div className="flex flex-col">
        {hotelAreas.map((area, index) => {
          const name = area.name[lang] ?? area.name.tr;
          const flipped = index % 2 === 1;

          return (
            <section key={area.key} className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
                <div className={flipped ? "lg:order-2" : ""}>
                  <div
                    className="relative aspect-[4/3] overflow-hidden lg:sticky lg:top-24"
                    style={{
                      borderRadius: "var(--radius-card)",
                      boxShadow: "var(--shadow-e2)",
                    }}
                  >
                    <Image
                      src={area.image}
                      alt={name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 80%, transparent) 0%, transparent 58%)",
                      }}
                    />
                    <div className="absolute inset-x-5 bottom-4">
                      <div
                        className="text-[10.5px] font-extrabold uppercase tracking-[0.18em]"
                        style={{ color: "var(--brand-gold-label)" }}
                      >
                        {t("areaEyebrow")}
                      </div>
                      <div className="mt-1 font-display text-[21px] font-semibold text-white">
                        {name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={flipped ? "lg:order-1" : ""}>
                  <SectionHeading
                    eyebrow={`${area.hotels.length} ${t("hotelCount")}`}
                    title={name}
                    subtitle={area.note[lang] ?? area.note.tr}
                    rule={false}
                  />

                  <ul className="flex flex-col gap-3.5">
                    {area.hotels.map((hotel) => (
                      <li key={hotel.name}>
                        <div className="accent-card flex flex-wrap items-center gap-x-5 gap-y-3 p-5">
                          <span
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full"
                            style={{ background: "var(--brand-night)", color: "var(--brand-gold)" }}
                          >
                            <BedDouble className="size-[18px]" aria-hidden="true" />
                          </span>

                          <div className="min-w-[12rem] flex-1">
                            <div className="text-[15.5px] font-bold leading-snug">{hotel.name}</div>
                            <div className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-muted-foreground">
                              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                              {hotel.desc[lang] ?? hotel.desc.tr}
                            </div>
                          </div>

                          <WhatsAppLink
                            subject={`${hotel.name} — ${name}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-[0.6rem] px-4 py-2.5 text-[12.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
                            style={{ background: "var(--brand-wa)" }}
                          >
                            <WhatsAppIcon className="size-3.5" />
                            {t("askCta")}
                          </WhatsAppLink>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p className="mx-auto mt-8 w-full max-w-7xl px-5 text-[12.5px] text-muted-foreground sm:px-8">
        {t("photoNote")}
      </p>

      {/* Yardım bloğu */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-14 pb-20 sm:px-8">
        <div
          className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] px-7 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10"
          style={{ background: "var(--brand-night)", boxShadow: "var(--shadow-e3)" }}
        >
          <div className="max-w-xl">
            <h2 className="font-display text-[24px] font-semibold leading-snug text-white sm:text-[28px]">
              {t("helpTitle")}
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.8] text-white/70">{t("helpText")}</p>
          </div>

          <WhatsAppLink
            subject={t("title")}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.8rem] px-7 py-4 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--brand-gold)",
              color: "var(--brand-night)",
              boxShadow: "var(--shadow-gold)",
            }}
          >
            {tCta("whatsapp")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </section>

      <RouteCoverage locale={locale} />
      <ClosingCta locale={locale} />
      <CredentialsBand />
    </main>
  );
}
