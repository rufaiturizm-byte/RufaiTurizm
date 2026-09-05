import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Check, Clock, Info, MapPin, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, TouristTripSchema } from "@/components/site/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { RouteCoverage } from "@/components/site/route-coverage";
import { ProcessSteps } from "@/components/site/process-steps";
import { FaqPreview } from "@/components/site/faq-preview";
import { ClosingCta } from "@/components/site/transfer-sections";
import { tours, tourBySlug } from "@/data/tours";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = tourBySlug(slug);
  if (!tour) return {};

  const t = await getTranslations({ locale, namespace: "tours" });

  return {
    title: t(`${tour.key}.name`),
    description: t(`${tour.key}.description`),
    openGraph: { images: [tour.image] },
    alternates: alternatesFor({ pathname: "/tours/[slug]", params: { slug } }, locale),
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = tourBySlug(slug);
  if (!tour) notFound();

  const t = await getTranslations("tours");
  const tPage = await getTranslations("toursPage");
  const tNav = await getTranslations("nav");
  const tEyebrow = await getTranslations("eyebrow");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tIncluded = await getTranslations("included");
  const tNotIncluded = await getTranslations("notIncluded");

  const name = t(`${tour.key}.name`);
  const description = t(`${tour.key}.description`);
  const others = tours.filter((item) => item.key !== tour.key).slice(0, 4);
  const highlights = t.raw(`${tour.key}.highlights`) as string[];

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("tours"), url: getPathname({ locale, href: "/tours" }) },
          {
            name: name,
            url: getPathname({ locale, href: { pathname: "/tours/[slug]", params: { slug } } }),
          },
        ]}
      />
      <TouristTripSchema
        name={name}
        description={description}
        image={tour.image}
        price={tour.priceFrom}
        currency={tour.currency}
      />

      <section className="relative isolate">
        <Image
          src={tour.image}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 scrim-x" />
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-24">
          <div className="text-[12.5px] text-white/55">
            {tNav("home")} · {tNav("tours")} · {name}
          </div>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.12] tracking-[-0.01em] text-white sm:text-[50px]">
            {name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-bold"
              style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
            >
              <MapPin className="size-3.5" aria-hidden="true" />
              {t(`${tour.key}.city`)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-sm">
              <Clock className="size-3.5" aria-hidden="true" />
              {tour.durationHours} {tPage("hours")}
            </span>
          </div>
        </div>
      </section>

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/*
        Gövde. Önceki hali paragraf + onay işaretli düz listelerdi ve
        sayfanın tamamı tek renkti; turun programı, fiyata dahil olanlar ve
        notlar aynı ağırlıkta akıyordu. Şimdi program numaralı kartlarda,
        dahil/değil iki ayrı kartta ve rezervasyon kutusu altın çerçeveli.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-[17px] leading-[1.85] font-medium text-foreground/90">
              {description}
            </p>
            <p className="mt-5 text-[15.5px] leading-[1.95] text-foreground/80">
              {t(`${tour.key}.long`)}
            </p>

            <h2 className="mt-12 font-display text-[24px] font-semibold sm:text-[28px]">
              {tPage("programTitle")}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <li key={item} className="accent-card flex items-start gap-4 p-5">
                  <span className="step-badge size-9 shrink-0 text-[13px] font-extrabold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14.5px] leading-snug font-medium">{item}</span>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="accent-card p-6">
                <h2 className="text-[16px] font-bold">{tPage("includedTitle")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {(["guide", "pickup", "vehicle", "water", "parking", "fixedPrice"] as const).map(
                    (key) => (
                      <li key={key} className="flex items-start gap-3 text-[14px] leading-snug">
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "var(--brand-wa)" }}
                          aria-hidden="true"
                        />
                        {tIncluded(key)}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="accent-card p-6">
                <h2 className="text-[16px] font-bold">{tPage("notIncludedTitle")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {(["tickets", "lunch", "boat", "tips"] as const).map((key) => (
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

            <div
              className="mt-6 flex items-start gap-4 rounded-[var(--radius-card)] border px-6 py-5"
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
              <div>
                <h2 className="text-[15px] font-bold">{tPage("noteTitle")}</h2>
                <p className="mt-2 text-[13.5px] leading-[1.8]">{tPage("note")}</p>
              </div>
            </div>
          </div>

          {/* Rezervasyon kutusu */}
          <aside
            className="h-fit rounded-[var(--radius-card)] border p-6 lg:sticky lg:top-24"
            style={{
              background: "var(--surface)",
              borderColor: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
              boxShadow: "var(--shadow-e3)",
            }}
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("from")}
            </div>
            <div className="mt-1.5 flex items-baseline gap-2.5">
              <span
                className="text-[38px] font-extrabold leading-none"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                €{tour.priceFrom}
              </span>
              <span className="text-[15px] text-muted-foreground">≈ ${tour.priceUsdFrom}</span>
            </div>

            <dl
              className="mt-5 flex flex-col gap-3 border-t border-b py-5 text-[13.5px]"
              style={{ borderColor: "var(--hairline)" }}
            >
              <div className="flex items-center justify-between gap-4">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {tPage("colCity")}
                </dt>
                <dd className="font-bold">{t(`${tour.key}.city`)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {tPage("colDuration")}
                </dt>
                <dd className="font-bold tabular-nums">
                  {tour.durationHours} {tPage("hours")}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[12.5px] leading-[1.75] text-muted-foreground">
              {tPage("priceNote")}
            </p>

            <WhatsAppLink
              subject={name}
              className="mt-5 flex items-center justify-center gap-2.5 rounded-[0.8rem] py-4 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e2)" }}
            >
              <WhatsAppIcon className="size-5" />
              {tCta("bookNow")}
            </WhatsAppLink>

            <Link
              href="/tours"
              className="mt-3 flex items-center justify-center gap-2 rounded-[0.8rem] border py-3 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
              style={{ borderColor: "color-mix(in oklab, var(--brand-night) 15%, transparent)" }}
            >
              {tCommon("backToTours")}
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <RouteCoverage locale={locale} />

      <div className="pb-4">
        <ProcessSteps />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("tours")}
          title={tPage("listTitle")}
          rule={false}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <TourCard key={item.key} tour={item} />
          ))}
        </div>
      </section>

      <FaqPreview />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["tours"]} />
      <CredentialsBand />
    </main>
  );
}
