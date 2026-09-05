import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Bus,
  Car,
  CheckCircle2,
  Clock,
  Luggage,
  MapPin,
  MessageCircle,
  PlaneLanding,
  PlaneTakeoff,
  Route,
  ShieldCheck,
  Users,
  Baby,
  Languages,
  UserRoundX,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";

/**
 * Transfer sayfasının bölümleri.
 *
 * Düzen rakip (seentravels/tr/transfer) sayfasından alındı: hizmet tipleri →
 * araç kartları (görsel, kapasite, valiz, rozet ve her kartın altında
 * WhatsApp düğmesi) → neden biz → üç adım → kapsanan noktalar.
 */

export async function TransferTypes() {
  const t = await getTranslations("transferPage");

  const types = [
    { icon: PlaneLanding, n: "1" },
    { icon: PlaneTakeoff, n: "2" },
    { icon: Route, n: "3" },
    { icon: Clock, n: "4" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("typesTitle")} subtitle={t("typesSubtitle")} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {types.map(({ icon: Icon, n }) => (
          <div key={n} className="rounded-lg border bg-card p-6">
            <Icon
              className="size-7"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <h3 className="mt-4 text-[15.5px] font-bold">{t(`type${n}Title`)}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              {t(`type${n}Desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Filo. Vito kartı doğrulanmış iki fotoğrafı taşıyor; sedan ve Sprinter için
 * elimizde güvenilir kare olmadığından ikon paneli var. Kendi araç
 * fotoğraflarınız gelince public/images/fleet/ içine sedan.jpg ve
 * sprinter.jpg olarak koymak yeterli (bkz. aşağıdaki photo alanı).
 */
export async function FleetGrid() {
  const t = await getTranslations("fleet");
  const tPage = await getTranslations("transferPage");
  const tCta = await getTranslations("cta");

  const vehicles = [
    {
      key: "vito",
      icon: Car,
      badge: t("vitoBadge"),
      luggage: t("vitoLuggage"),
      photo: "/images/fleet/vito-interior.jpg",
      alt: t("interiorAlt"),
      featured: true,
    },
    {
      key: "sprinter",
      icon: Bus,
      badge: t("sprinterBadge"),
      luggage: t("sprinterLuggage"),
      photo: null,
      alt: "",
      featured: false,
    },
    {
      key: "sedan",
      icon: Car,
      badge: t("sedanBadge"),
      luggage: t("sedanLuggage"),
      photo: null,
      alt: "",
      featured: false,
    },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={tPage("fleetTitle")} subtitle={tPage("fleetSubtitle")} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => {
          const Icon = vehicle.icon;
          const name = t(`${vehicle.key}.name`);

          return (
            <article
              key={vehicle.key}
              className="flex flex-col overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-[16/10]">
                {vehicle.photo ? (
                  <Image
                    src={vehicle.photo}
                    alt={vehicle.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: "var(--brand-night)" }}
                  >
                    <Icon
                      className="size-14"
                      style={{ color: "var(--brand-gold)" }}
                      aria-hidden="true"
                    />
                  </div>
                )}
                <span
                  className="absolute start-3 top-3 rounded px-2.5 py-1 text-[11.5px] font-bold"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                >
                  {vehicle.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[16.5px] font-bold">{name}</h3>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden="true" />
                    {t(`${vehicle.key}.capacity`)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Luggage className="size-3.5" aria-hidden="true" />
                    {vehicle.luggage} {tPage("luggage")}
                  </span>
                </div>

                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                  {t(`${vehicle.key}.desc`)}
                </p>

                <WhatsAppLink
                  subject={name}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-md py-3 text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--brand-wa)" }}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {tCta("whatsapp")}
                </WhatsAppLink>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-[12.5px] text-muted-foreground">{t("stockNote")}</p>
    </section>
  );
}

export async function TransferWhy() {
  const t = await getTranslations("transferPage");

  const reasons = [
    { icon: PlaneLanding, n: "1" },
    { icon: Clock, n: "2" },
    { icon: ShieldCheck, n: "3" },
    { icon: Baby, n: "4" },
    { icon: Languages, n: "5" },
    { icon: UserRoundX, n: "6" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("whyTitle")} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ icon: Icon, n }) => (
          <div key={n} className="flex items-start gap-4 rounded-lg border bg-card p-5">
            <Icon
              className="mt-0.5 size-6 shrink-0"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-[14.5px] font-bold">{t(`why${n}Title`)}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
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

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("stepsTitle")} subtitle={t("stepsSubtitle")} />

      <ol className="grid gap-5 sm:grid-cols-3">
        {(["1", "2", "3"] as const).map((step) => (
          <li key={step} className="rounded-lg border bg-card p-6">
            <span
              className="flex size-9 items-center justify-center rounded-full text-[15px] font-extrabold"
              style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
            >
              {step}
            </span>
            <h3 className="mt-4 text-[15.5px] font-bold">{t(`s${step}Title`)}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
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
  const cities = t.raw("cities") as string[];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={t("citiesTitle")} subtitle={t("citiesSubtitle")} />

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
        <h2 className="text-[24px] font-bold text-white sm:text-[28px]">{t("ctaTitle")}</h2>
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
