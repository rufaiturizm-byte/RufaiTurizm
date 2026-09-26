import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ExternalLink,
  MapPin,
  PlaneLanding,
  Star,
  TramFront,
  TriangleAlert,
} from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { GuideLink } from "@/components/site/guide-link";
import { hotelBySlug, hotelsWithPages } from "@/data/hotels";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return hotelsWithPages().map(({ hotel }) => ({ slug: hotel.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = hotelBySlug(slug);
  if (!entry) return {};

  const lang = locale as Locale;
  const t = await getTranslations({ locale, namespace: "hotelPage" });

  return {
    title: entry.hotel.name,
    description: t("metaDescription", {
      name: entry.hotel.name,
      district: entry.area.name[lang] ?? entry.area.name.tr,
    }),
    alternates: alternatesFor({ pathname: "/hotels/[slug]", params: { slug } }, locale),
  };
}

/**
 * Otel sayfası.
 *
 * NEDEN VAR. Körfez'den gelen misafir oteli adıyla arıyor —
 * "فندق سي في كي تقسيم إسطنبول" ayda 140, Raffles 210, Grand Aras 200.
 * Bu sorgularda rekabet düşük ve sitede karşılığı yalnız liste
 * sayfasındaki bir satırdı; bir satır o aramayı karşılamıyor.
 *
 * NE YAZIYOR. Yalnız doğrulanabilir şeyler: otelin resmî sitesinden
 * alınan olgular (adres, oda sayısı, açılış yılı, somut özellikler) ve
 * semtin zaten elimizde olan pratik bilgisi (ulaşım, havalimanı mesafesi,
 * neye dikkat edilmeli). Boş alan hiç basılmıyor — kaynakta yazmayan
 * bilgi burada da yok.
 *
 * NE YAZMIYOR. Fiyat, müsaitlik ve "en iyi/lüks" türü sıfatlar. İlk
 * ikisi tarihe göre değişiyor, üçüncüsünü doğrulayamayız.
 *
 * FOTOĞRAF SEMT FOTOĞRAFI. Otellerin görsel kullanım hakkı bizde değil;
 * kapakta bölgenin karesi var ve alt metni öyle söylüyor.
 *
 * Sayfa yalnız `slug` alanı dolu oteller için üretiliyor, yani birlikte
 * çalışılan on otel için. Listedeki diğer yirmi üç otel hakkında iki
 * cümleden fazlasını söyleyemeyiz; onlara sayfa açmak ince içerik olurdu.
 */
export default async function HotelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = hotelBySlug(slug);
  if (!entry) notFound();

  const { hotel, area } = entry;
  const lang = locale as Locale;
  const text = (value: { tr: string; ar: string; en: string }) => value[lang] ?? value.tr;

  const t = await getTranslations("hotelPage");
  const tHotels = await getTranslations("hotelsPage");
  const tTags = await getTranslations("hotelTags");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const areaName = text(area.name);
  const nearby = (area.hotels ?? []).filter((item) => item.slug && item.slug !== hotel.slug);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("hotels"), url: getPathname({ locale, href: "/hotels" }) },
          {
            name: hotel.name,
            url: getPathname({ locale, href: { pathname: "/hotels/[slug]", params: { slug } } }),
          },
        ]}
      />

      <PageHero
        image={area.image}
        /* Kapak otelin değil SEMTİN fotoğrafı ve alt metni bunu söylüyor. */
        imageAlt={areaName}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("hotels"), href: "/hotels" },
          { label: hotel.name },
        ]}
        title={hotel.name}
        subtitle={text(hotel.desc)}
      />

      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {hotel.stars ? (
            <p className="flex items-center gap-1">
              <span className="sr-only">{tHotels("starsLabel", { count: hotel.stars })}</span>
              {Array.from({ length: hotel.stars }, (_, i) => (
                <Star
                  key={i}
                  className="size-4"
                  style={{ fill: "var(--brand-gold)", color: "var(--brand-gold)" }}
                  aria-hidden="true"
                />
              ))}
            </p>
          ) : null}

          <h2 className="mt-4 font-display text-[26px] font-semibold">{t("factsTitle")}</h2>

          {/*
            Yalnız DOLU alanlar basılıyor. Bir otelin oda sayısı resmî
            sitesinde yazmıyorsa o satır hiç görünmüyor; "bilinmiyor"
            yazan bir satır sayfayı uzatır ama hiçbir şey anlatmaz.
          */}
          <dl
            className="mt-5 flex flex-col divide-y border-y"
            style={{ borderColor: "var(--hairline)" }}
          >
            {hotel.facts?.address ? (
              <Row icon={<MapPin className="size-4" aria-hidden="true" />} label={t("addressLabel")}>
                {hotel.facts.address}
              </Row>
            ) : null}
            {hotel.facts?.transit ? (
              <Row icon={<TramFront className="size-4" aria-hidden="true" />} label={t("transitLabel")}>
                {text(hotel.facts.transit)}
              </Row>
            ) : null}
            {hotel.facts?.rooms ? (
              <Row icon={<BedDouble className="size-4" aria-hidden="true" />} label={t("roomsLabel")}>
                {hotel.facts.rooms}
              </Row>
            ) : null}
            {hotel.facts?.opened ? (
              <Row
                icon={<CalendarDays className="size-4" aria-hidden="true" />}
                label={t("openedLabel")}
              >
                {hotel.facts.opened}
              </Row>
            ) : null}
            <Row icon={<MapPin className="size-4" aria-hidden="true" />} label={tNav("hotels")}>
              <Link
                href="/hotels"
                className="font-semibold"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                {areaName}
              </Link>
            </Row>
          </dl>

          {hotel.facts?.features?.length ? (
            <>
              <h3 className="mt-10 font-display text-[20px] font-semibold">{t("featuresLabel")}</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {hotel.facts.features.map((feature) => (
                  <li key={feature.tr} className="flex items-start gap-2.5 text-[14px] leading-[1.7]">
                    <Check
                      className="mt-1 size-4 shrink-0"
                      style={{ color: "var(--brand-gold-deep)" }}
                      aria-hidden="true"
                    />
                    {text(feature)}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <ul className="mt-8 flex flex-wrap gap-2">
            {hotel.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-muted-foreground"
                style={{ borderColor: "color-mix(in oklab, var(--brand-night) 12%, transparent)" }}
              >
                {tTags(tag)}
              </li>
            ))}
          </ul>

          {hotel.facts?.officialUrl ? (
            <p className="mt-6 text-[13.5px]">
              <a
                href={hotel.facts.officialUrl}
                rel="noopener nofollow"
                target="_blank"
                className="inline-flex items-center gap-2 font-semibold"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                {t("officialLabel")}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </p>
          ) : null}

          <p className="mt-4 text-[12.5px] leading-[1.7] text-muted-foreground">
            {t("sourceNote")}
          </p>
        </div>
      </section>

      {/* Semtin pratik bilgisi: liste sayfasında da var ama orada otuz üç
          otelin ortak arka planı; burada bu otelin adresinin ne demek
          olduğunu anlatıyor. */}
      <section className="section-y" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold">
            {t("areaTitle", { area: areaName })}
          </h2>
          <p className="measure mt-4 text-[15px] leading-[1.8]">{text(area.note)}</p>

          <div className="mt-8 flex flex-col gap-6">
            <Practical
              icon={<TramFront className="size-4" aria-hidden="true" />}
              label={tHotels("gettingAroundLabel")}
            >
              {text(area.practical.gettingAround)}
            </Practical>
            <Practical
              icon={<PlaneLanding className="size-4" aria-hidden="true" />}
              label={tHotels("airportLabel")}
            >
              {text(area.practical.airport)}
            </Practical>
            <Practical
              icon={<TriangleAlert className="size-4" aria-hidden="true" />}
              label={tHotels("watchOutLabel")}
            >
              {text(area.practical.watchOut)}
            </Practical>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold">{t("transferTitle")}</h2>
          <p className="measure mt-4 text-[15px] leading-[1.8]">{t("transferText")}</p>
          <Link
            href="/transfer"
            className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            {t("transferCta")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>

          <div
            className="mt-10 border p-6 sm:p-8"
            style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}
          >
            <h2 className="font-display text-[22px] font-semibold">{t("askTitle")}</h2>
            <p className="measure mt-3 text-[14.5px] leading-[1.8] text-muted-foreground">
              {t("askText")}
            </p>
            <WhatsAppLink
              subject={hotel.name}
              className="btn-wa mt-6 inline-flex items-center gap-2.5 rounded-[0.625rem] px-6 py-3.5 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>

          {nearby.length ? (
            <>
              <h2 className="mt-12 font-display text-[22px] font-semibold">{t("nearbyTitle")}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {nearby.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={{ pathname: "/hotels/[slug]", params: { slug: item.slug! } }}
                      className="inline-flex items-center gap-2 text-[14.5px] font-semibold"
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      {item.name}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="mt-10">
            <Link href="/hotels" className="text-[14px] font-semibold text-muted-foreground">
              {t("listCta")}
            </Link>
          </p>
        </div>
      </section>

      <TrustBoxes />
      <Band>
        <GuideLink slug="otel-secerken-nelere-bakmali" locale={locale} />
      </Band>
      <PageClosing locale={locale} exclude={["hotels"]} />
    </main>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
      style={{ borderColor: "var(--hairline)" }}
    >
      <dt className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground sm:w-44 sm:shrink-0">
        <span style={{ color: "var(--brand-gold-deep)" }}>{icon}</span>
        {label}
      </dt>
      <dd className="text-[14.5px] leading-[1.7]">{children}</dd>
    </div>
  );
}

function Practical({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
        <span style={{ color: "var(--brand-gold-deep)" }}>{icon}</span>
        {label}
      </h3>
      <p className="measure mt-2 text-[14.5px] leading-[1.8]">{children}</p>
    </div>
  );
}
