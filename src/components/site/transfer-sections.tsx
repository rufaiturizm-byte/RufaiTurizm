import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Check,
  CheckCircle2,
  Luggage,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";

/**
 * Transfer sayfasının bölümleri.
 *
 * Akış rakip (seentravels/tr/transfer) sayfasından alındı: hizmet tipleri →
 * araç → neden biz → üç adım → kapsanan noktalar. Görsel dil bize ait:
 * bölümler çerçeveli kart ızgarası değil, ince çizgi ve büyük rakamla
 * kuruluyor — sekiz bölüm üst üste aynı kutuya girince sayfa şablon gibi
 * okunuyordu.
 */

export async function TransferTypes() {
  const t = await getTranslations("transferPage");
  const tEyebrow = await getTranslations("eyebrow");

  const types = ["1", "2", "3", "4"] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("transfer")}
        title={t("typesTitle")}
        subtitle={t("typesSubtitle")}
      />

      <div className="grid gap-x-12 sm:grid-cols-2">
        {types.map((n, index) => (
          <div
            key={n}
            className="py-7"
            style={{
              borderTop:
                index > 1
                  ? "1px solid color-mix(in oklab, var(--brand-night) 12%, transparent)"
                  : undefined,
            }}
          >
            <h3 className="text-[18px] font-bold tracking-[-0.01em]">{t(`type${n}Title`)}</h3>
            <p className="mt-2.5 max-w-md text-[14px] leading-[1.8] text-muted-foreground">
              {t(`type${n}Desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function FleetGrid() {
  const t = await getTranslations("fleet");
  const tPage = await getTranslations("transferPage");
  const tCta = await getTranslations("cta");
  const tEyebrow = await getTranslations("eyebrow");

  const photos = [
    { src: "/images/fleet/vito-exterior.jpg", alt: t("exteriorAlt") },
    { src: "/images/fleet/vito-interior.jpg", alt: t("interiorAlt") },
    { src: "/images/fleet/vito-cockpit.jpg", alt: t("cockpitAlt") },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("fleet")}
        title={tPage("fleetTitle")}
        subtitle={tPage("fleetSubtitle")}
      />

      <article className="overflow-hidden rounded-xl border bg-card">
        <div className="grid gap-px sm:grid-cols-3" style={{ background: "var(--border)" }}>
          {photos.map((photo, index) => (
            <div
              key={photo.src}
              className={`relative aspect-[4/3] ${index > 0 ? "hidden sm:block" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              {index === 0 ? (
                <span
                  className="absolute start-3 top-3 rounded px-2.5 py-1 text-[11.5px] font-bold"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                >
                  {t("vitoBadge")}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <h3 className="text-[20px] font-bold">{t("vito.name")}</h3>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden="true" />
                {t("vito.capacity")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Luggage className="size-3.5" aria-hidden="true" />
                {t("vitoLuggage")} {tPage("luggage")}
              </span>
            </div>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
              {t("vito.desc")}
            </p>
          </div>

          <WhatsAppLink
            subject={t("vito.name")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-wa)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {tCta("whatsapp")}
          </WhatsAppLink>
        </div>
      </article>

      <p className="mt-4 text-[12.5px] text-muted-foreground">{t("stockNote")}</p>
    </section>
  );
}

export async function TransferWhy() {
  const t = await getTranslations("transferPage");
  const tEyebrow = await getTranslations("eyebrow");

  const reasons = ["1", "2", "3", "4", "5", "6"] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading eyebrow={tEyebrow("why")} title={t("whyTitle")} />

      <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((n, index) => (
          <div
            key={n}
            className="flex gap-4 py-6"
            style={{
              borderTop:
                index > 0
                  ? "1px solid color-mix(in oklab, var(--brand-night) 12%, transparent)"
                  : undefined,
            }}
          >
            <Check
              className="mt-1 size-4 shrink-0"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-[15px] font-bold">{t(`why${n}Title`)}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.75] text-muted-foreground">
                {t(`why${n}Desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function TransferSteps() {
  const t = await getTranslations("transferPage");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("process")}
        title={t("stepsTitle")}
        subtitle={t("stepsSubtitle")}
      />

      <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
        {(["1", "2", "3"] as const).map((step, index) => (
          <li
            key={step}
            className="pt-6"
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
            <h3 className="mt-4 text-[16px] font-bold">{t(`s${step}Title`)}</h3>
            <p className="mt-2.5 text-[14px] leading-[1.75] text-muted-foreground">
              {t(`s${step}Desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export async function ServiceCities() {
  const t = await getTranslations("transferPage");
  const tEyebrow = await getTranslations("eyebrow");
  const cities = t.raw("cities") as string[];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("cities")}
        title={t("citiesTitle")}
        subtitle={t("citiesSubtitle")}
      />

      <div className="flex flex-wrap gap-2.5">
        {cities.map((city) => (
          <span
            key={city}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13.5px] font-medium"
          >
            <MapPin
              className="size-3.5"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}

/** Sayfa sonu kapanış şeridi — tek ve net bir çıkış. */
export async function ClosingCta() {
  const t = await getTranslations("home2");
  const tCta = await getTranslations("cta");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <div
        className="flex flex-col items-center gap-5 rounded-xl px-8 py-12 text-center"
        style={{ background: "var(--brand-night)" }}
      >
        <CheckCircle2
          className="size-8"
          style={{ color: "var(--brand-gold)" }}
          aria-hidden="true"
        />
        <h2 className="font-display text-[26px] font-semibold leading-[1.15] text-white sm:text-[34px]">{t("ctaTitle")}</h2>
        <p className="max-w-lg text-[15px] leading-[1.8] text-white/70">{t("ctaText")}</p>
        <WhatsAppLink
          className="mt-2 inline-flex items-center gap-2.5 rounded-md px-8 py-4 text-[15px] font-bold"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          {tCta("whatsapp")}
        </WhatsAppLink>
      </div>
    </section>
  );
}
