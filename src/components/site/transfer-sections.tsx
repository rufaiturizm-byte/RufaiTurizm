import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Baby,
  BadgeCheck,
  CalendarClock,
  Languages,
  Luggage,
  MapPin,
  MessageCircle,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Radar,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";

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
  const tCta = await getTranslations("cta");

  /*
   * Dört transfer tipi önce başlık + paragraf olarak alt alta duruyordu:
   * bölüm sayfada basılı bir belge gibi okunuyordu ve dördü birbirinden
   * ayırt edilmiyordu. Her tipin kendi fotoğrafı ve simgesi var artık —
   * "havalimanına bırakış" ile "emrinizde araç" arasındaki fark bir
   * bakışta anlaşılıyor.
   */
  const types = [
    { n: "1", icon: PlaneLanding, image: "/images/chauffeur.jpg" },
    { n: "2", icon: PlaneTakeoff, image: "/images/vito-black.jpg" },
    { n: "3", icon: Route, image: "/images/tours/sapanca.jpg" },
    { n: "4", icon: CalendarClock, image: "/images/fleet/vito-cockpit.jpg" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("transfer")}
        title={t("typesTitle")}
        subtitle={t("typesSubtitle")}
        rule={false}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {types.map(({ n, icon: Icon, image }, index) => (
          <article key={n} className="accent-card group flex flex-col overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={image}
                alt={t(`type${n}Title`)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 72%, transparent) 0%, transparent 62%)",
                }}
              />
              <span
                className={`absolute bottom-3 start-3 inline-flex size-10 items-center justify-center rounded-full ${
                  index % 2 === 1 ? "tile-sky" : ""
                }`}
                style={
                  index % 2 === 1
                    ? undefined
                    : { background: "var(--brand-gold)", color: "var(--brand-night)" }
                }
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[17.5px] font-semibold leading-snug">
                {t(`type${n}Title`)}
              </h3>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                {t(`type${n}Desc`)}
              </p>

              <WhatsAppLink
                subject={t(`type${n}Title`)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-[0.6rem] py-2.5 text-[12.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--brand-wa)" }}
              >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                {tCta("bookNow")}
              </WhatsAppLink>
            </div>
          </article>
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
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("fleet")}
        title={tPage("fleetTitle")}
        subtitle={tPage("fleetSubtitle")}
      />

      <article className="overflow-hidden surface-card">
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5"
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

  /* Altı gerekçe düz bir onay listesiydi; her birinin kendi simgesi ve
     kartı var artık. Simge kutuları altın ve gök mavisi arasında
     dönüşümlü: tek renk altı kez tekrarlanınca vurgu olmaktan çıkıyor. */
  const reasons = [
    { n: "1", icon: PlaneLanding },
    { n: "2", icon: Radar },
    { n: "3", icon: BadgeCheck },
    { n: "4", icon: Baby },
    { n: "5", icon: Languages },
    { n: "6", icon: ShieldCheck },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading eyebrow={tEyebrow("why")} title={t("whyTitle")} rule={false} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ n, icon: Icon }, index) => (
          <article key={n} className="accent-card p-6">
            <span
              className={`inline-flex size-12 items-center justify-center rounded-[0.8rem] ${
                index % 2 === 1 ? "tile-sky" : ""
              }`}
              style={
                index % 2 === 1
                  ? undefined
                  : {
                      background: "color-mix(in oklab, var(--brand-gold) 20%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--brand-gold) 42%, transparent)",
                      color: "var(--brand-gold-deep)",
                    }
              }
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>

            <h3 className="mt-4 text-[16px] font-bold">{t(`why${n}Title`)}</h3>
            <p className="mt-2 text-[13.5px] leading-[1.75] text-muted-foreground">
              {t(`why${n}Desc`)}
            </p>
          </article>
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
        rule={false}
      />

      {/* Rakamlar arasındaki kesik çizgi adımların SIRALI olduğunu söylüyor;
          üç ayrı kutu olarak dizildiklerinde bu bilgi kayboluyordu. */}
      <ol className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-8">
        {(["1", "2", "3"] as const).map((step, index) => (
          <li
            key={step}
            className={`relative text-center ${index < 2 ? "sm:step-link" : ""}`}
          >
            <span className="step-badge size-12 text-[18px] font-extrabold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-[16.5px] font-bold">{t(`s${step}Title`)}</h3>
            <p className="mx-auto mt-2.5 max-w-[19rem] text-[14px] leading-[1.75] text-muted-foreground">
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
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
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

/**
 * Sayfa sonu kapanış şeridi — tek ve net bir çıkış.
 *
 * Zemin önce düz laciverte ince altın noktalardan oluşan bir doku
 * eklenerek kurulmuştu. Doku boş bir dikdörtgenden iyiydi ama sayfanın
 * alt üçte biri (SSS, kapanış, belge bandı) tümüyle görselsiz kalıyordu:
 * ziyaretçi en önemli çağrıya, gideceği yeri bir kez daha görmeden
 * varıyordu. Artık altta Kız Kulesi var, üstünde okunurluğu koruyan
 * karartma ve aynı doku.
 */
export async function ClosingCta({ locale }: { locale?: string }) {
  const t = await getTranslations("home2");
  const tCta = await getTranslations("cta");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <div
        className="relative isolate flex flex-col items-center gap-5 overflow-hidden px-8 py-20 text-center"
        style={{
          backgroundColor: "var(--brand-night)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-e3)",
        }}
      >
        <Image
          src="/images/kizkulesi.jpg"
          alt={locale === "ar" ? "برج الفتاة عند الغروب" : "Gün batımında Kız Kulesi"}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="absolute inset-0 z-0 object-cover object-center"
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 90%, transparent) 0%, color-mix(in oklab, var(--brand-night) 72%, transparent) 48%, color-mix(in oklab, var(--brand-night) 58%, transparent) 100%)",
          }}
        />
        <div className="pattern-constellation absolute inset-0 z-10 opacity-50" />

        <span
          className="relative z-20 inline-flex size-14 items-center justify-center rounded-full border"
          style={{
            borderColor: "color-mix(in oklab, var(--brand-gold) 55%, transparent)",
            background: "color-mix(in oklab, var(--brand-gold) 14%, transparent)",
            color: "var(--brand-gold)",
          }}
        >
          <Plane className="size-6 -rotate-45" aria-hidden="true" />
        </span>

        <h2 className="relative z-20 font-display text-[28px] font-semibold leading-[1.12] text-white sm:text-[38px]">
          {t("ctaTitle")}
        </h2>
        <p className="relative z-20 max-w-lg text-[15px] leading-[1.8] text-white/75">{t("ctaText")}</p>

        <WhatsAppLink
          className="relative z-20 mt-3 inline-flex items-center gap-3 rounded-[0.8rem] px-8 py-4 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
          style={{
            background: "var(--brand-gold)",
            color: "var(--brand-night)",
            boxShadow: "var(--shadow-gold)",
          }}
        >
          <WhatsAppIcon className="size-5" />
          {tCta("whatsapp")}
        </WhatsAppLink>
      </div>
    </section>
  );
}
