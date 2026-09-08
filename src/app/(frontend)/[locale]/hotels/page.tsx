import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Info,
  MapPin,
  PlaneLanding,
  TramFront,
  TriangleAlert,
} from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { RouteCoverage } from "@/components/site/route-coverage";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { ClosingCta } from "@/components/site/transfer-sections";
import { hotelAreas } from "@/data/hotels";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "hotelsPage" });

  return {
    title: t("title"),
    description: tMeta("hotels"),
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
  const tTags = await getTranslations("hotelTags");
  const lang = locale as Locale;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("hotels"), url: getPathname({ locale, href: "/hotels" }) },
        ]}
      />

      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("hotels") },
        ]}
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
          <p className="measure-wide text-[13.5px] leading-[1.8]">{t("disclaimer")}</p>
        </div>
      </section>

      {/*
        Semt semt.

        İlk hali ince yatay satırlardan bir dizindi: her otelin yanında
        yeşil bir düğme vardı ve on dört düğme sayfayı gürültüye
        çeviriyordu. Şimdi bölge TAM GENİŞLİKTE fotoğraflı bir bant —
        kitapta bölüm başlığı gibi — ve oteller ferah kartlar. Rezervasyon
        çağrısı her kartta değil, bölge başına bir tane: karar otel
        seçildikten sonra veriliyor.

        Otel fotoğrafımız olmadığı için kartın görseli tipografi: adın ilk
        harfi serif bir monogram olarak duruyor.
      */}
      <div className="flex flex-col">
        {hotelAreas.map((area, index) => {
          const name = area.name[lang] ?? area.name.tr;

          return (
            <section key={area.key} className="pt-16">
              {/* Bölüm bandı */}
              <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                <div
                  className="relative isolate overflow-hidden"
                  style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e2)" }}
                >
                  <Image
                    src={area.image}
                    alt={name}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="absolute inset-0 z-0 object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 93%, transparent) 0%, color-mix(in oklab, var(--brand-night) 62%, transparent) 48%, color-mix(in oklab, var(--brand-night) 16%, transparent) 100%)",
                    }}
                  />

                  <div className="relative z-20 flex flex-col justify-end gap-3 px-7 pt-20 pb-8 sm:px-10 sm:pt-24">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-display text-[30px] font-semibold leading-none tabular-nums"
                        style={{ color: "var(--brand-gold)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-6 w-px"
                        style={{ background: "color-mix(in oklab, white 28%, transparent)" }}
                      />
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-[0.2em]"
                        style={{ color: "var(--brand-gold-label)" }}
                      >
                        {area.hotels
                          ? `${area.hotels.length} ${t("hotelCount")}`
                          : `${area.subAreas?.length ?? 0} ${t("areaCount")}`}
                      </span>
                    </div>

                    <h2 className="max-w-2xl font-display text-[28px] font-semibold leading-[1.12] text-white sm:text-[38px]">
                      {name}
                    </h2>
                    <p className="measure text-[14.5px] leading-[1.8] text-white/75">
                      {area.note[lang] ?? area.note.tr}
                    </p>
                  </div>
                </div>
              </div>

              {/*
                Semtin pratik gerçeği. Bant "burası nasıl bir yer" diyor,
                kartlar "hangi otel" diyordu; aradaki asıl soru cevapsızdı:
                oraya nasıl gidilir, neyi göze almak gerekir, havalimanı ne
                kadar uzak. Ortadaki kart bilerek olumsuz — her semtin bir
                bedeli var, onu yazmayan liste satış broşürü olur.
              */}
              <div className="mx-auto w-full max-w-7xl px-5 pt-6 sm:px-8">
                <dl className="grid gap-4 sm:grid-cols-3">
                  {(
                    [
                      {
                        icon: TramFront,
                        label: t("gettingAroundLabel"),
                        value: area.practical.gettingAround,
                      },
                      {
                        icon: TriangleAlert,
                        label: t("watchOutLabel"),
                        value: area.practical.watchOut,
                      },
                      {
                        icon: PlaneLanding,
                        label: t("airportLabel"),
                        value: area.practical.airport,
                      },
                    ] as const
                  ).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="accent-card p-5">
                      <dt className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                        <Icon
                          className="size-3.5"
                          style={{ color: "var(--brand-gold-deep)" }}
                          aria-hidden="true"
                        />
                        {label}
                      </dt>
                      <dd className="mt-2.5 text-[13.5px] leading-[1.75]">
                        {value[lang] ?? value.tr}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Oteller */}
              {area.hotels ? (
              <div className="mx-auto w-full max-w-7xl px-5 pt-6 sm:px-8">
                {/*
                  Sütun sayısı kart sayısından türüyor: Taksim ve Boğaz
                  bölgelerinde dörder otel var ve üç sütunda sonuncusu
                  tek başına düşüyordu.
                */}
                <div
                  className={`grid gap-5 sm:grid-cols-2 ${
                    area.hotels.length % 3 === 1 ? "lg:grid-cols-2" : "lg:grid-cols-3"
                  }`}
                >
                  {area.hotels.map((hotel) => (
                    <article key={hotel.name} className="accent-card flex flex-col p-6">
                      <span
                        className="inline-flex size-14 items-center justify-center rounded-full font-display text-[24px] font-semibold"
                        style={{
                          background: "color-mix(in oklab, var(--brand-gold) 18%, transparent)",
                          border: "1px solid color-mix(in oklab, var(--brand-gold) 40%, transparent)",
                          color: "var(--brand-gold-deep)",
                        }}
                        aria-hidden="true"
                      >
                        {hotel.name.slice(0, 1)}
                      </span>

                      <h3 className="mt-5 font-display text-[19px] font-semibold leading-snug">
                        {hotel.name}
                      </h3>

                      <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-[1.7] text-muted-foreground">
                        <MapPin
                          className="mt-0.5 size-3.5 shrink-0"
                          style={{ color: "var(--brand-gold-deep)" }}
                          aria-hidden="true"
                        />
                        {hotel.desc[lang] ?? hotel.desc.tr}
                      </p>

                      {/* Etiketler konum ve yapı temelli; yıldız ya da
                          hizmet kalitesi iddiası taşımıyorlar. */}
                      <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                        {hotel.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border px-3 py-1.5 text-[11.5px] font-semibold"
                            style={{
                              background: "color-mix(in oklab, var(--brand-sky) 14%, transparent)",
                              borderColor: "color-mix(in oklab, var(--brand-sky) 32%, transparent)",
                            }}
                          >
                            {tTags(tag)}
                          </li>
                        ))}
                      </ul>

                      <WhatsAppLink
                        subject={`${hotel.name} — ${name}`}
                        className="mt-5 inline-flex items-center gap-2 border-t pt-4 text-[13px] font-bold"
                        style={{
                          borderColor: "var(--hairline)",
                          color: "var(--brand-gold-deep)",
                        }}
                      >
                        {t("askCta")}
                        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                      </WhatsAppLink>
                    </article>
                  ))}
                </div>
              </div>
              ) : null}

              {/*
                Sahil bölgelerinde otel kartı yerine alt bölge kartı.
                Antalya ve Bodrum'da misafirin asıl sorusu "hangi otel"
                değil "hangi bölge" — Kemer ile Alanya arasındaki fark
                havalimanına iki saat ve iki farklı tatil demek.
              */}
              {area.subAreas ? (
                <div className="mx-auto w-full max-w-7xl px-5 pt-6 sm:px-8">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {area.subAreas.map((sub) => {
                      const subName = sub.name[lang] ?? sub.name.tr;
                      return (
                        <article key={subName} className="reveal-rise accent-card flex flex-col p-6">
                          <span
                            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-bold"
                            style={{
                              background: "color-mix(in oklab, var(--brand-gold) 16%, transparent)",
                              border: "1px solid color-mix(in oklab, var(--brand-gold) 38%, transparent)",
                              color: "var(--brand-gold-deep)",
                            }}
                          >
                            <PlaneLanding className="size-3.5" aria-hidden="true" />
                            {sub.airport[lang] ?? sub.airport.tr}
                          </span>

                          <h3 className="mt-4 font-display text-[19px] font-semibold leading-snug">
                            {subName}
                          </h3>

                          <p className="mt-3 flex-1 text-[13.5px] leading-[1.75] text-muted-foreground">
                            {sub.desc[lang] ?? sub.desc.tr}
                          </p>

                          <WhatsAppLink
                            subject={`${subName} — ${name}`}
                            className="mt-5 inline-flex items-center gap-2 border-t pt-4 text-[13px] font-bold"
                            style={{
                              borderColor: "var(--hairline)",
                              color: "var(--brand-gold-deep)",
                            }}
                          >
                            {t("askAreaCta")}
                            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                          </WhatsAppLink>
                        </article>
                      );
                    })}
                  </div>

                  {/* Otel adı neden yok — sorulmadan cevaplanıyor. */}
                  <p className="measure mt-5 text-[13px] leading-[1.8] text-muted-foreground">
                    {t("subAreaNote")}
                  </p>

                  {/* Rehbere köprü: bu sayfa nerede kalınır, rehber gezi planı. */}
                  {area.guideSlug ? (
                    <Link
                      href={{ pathname: "/guides/[slug]", params: { slug: area.guideSlug } }}
                      className="mt-4 inline-flex items-center gap-2 py-1 text-[13.5px] font-bold"
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      {t("guideLink")}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              ) : null}


              {/* Bölge başına tek çağrı — otel listesi olsun olmasın. */}
              <div className="mx-auto w-full max-w-7xl px-5 pt-5 sm:px-8">
                <WhatsAppLink
                  subject={name}
                  className="btn-wa flex items-center justify-center gap-2.5 rounded-[0.7rem] py-3.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="size-[18px]" />
                  {name} — {tCta("bookNow")}
                </WhatsAppLink>
              </div>
            </section>
          );
        })}
      </div>

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
            className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.8rem] px-7 py-4 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
      <RelatedLinks exclude={["hotels"]} />
      <CredentialsBand />
    </main>
  );
}
