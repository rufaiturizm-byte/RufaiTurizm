import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Check, Clock, Info, MapPin, MessageCircle, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, TouristTripSchema } from "@/components/site/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { CredentialsBand } from "@/components/site/credentials-band";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
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
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 94%, transparent) 0%, color-mix(in oklab, var(--brand-night) 62%, transparent) 55%, color-mix(in oklab, var(--brand-night) 30%, transparent) 100%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
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

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-[16px] leading-[1.9] text-foreground/85">{description}</p>
            <p className="mt-5 text-[15.5px] leading-[1.9] text-foreground/80">
              {t(`${tour.key}.long`)}
            </p>

            <h2 className="mt-10 text-[19px] font-bold">{tPage("programTitle")}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 text-[14.5px]"
                >
                  <MapPin
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-[19px] font-bold">{tPage("includedTitle")}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {(["guide", "pickup", "vehicle", "water", "parking", "fixedPrice"] as const).map(
                    (key) => (
                      <li key={key} className="flex items-start gap-3 text-[14.5px]">
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "var(--brand-gold-deep)" }}
                          aria-hidden="true"
                        />
                        {tIncluded(key)}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <h2 className="text-[19px] font-bold">{tPage("notIncludedTitle")}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {(["tickets", "lunch", "boat", "tips"] as const).map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-3 text-[14.5px] text-muted-foreground"
                    >
                      <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {tNotIncluded(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-xl border p-6">
              <h2 className="flex items-center gap-2.5 text-[16px] font-bold">
                <Info
                  className="size-4.5"
                  style={{ color: "var(--brand-gold-deep)" }}
                  aria-hidden="true"
                />
                {tPage("noteTitle")}
              </h2>
              <p className="mt-3 text-[14.5px] leading-[1.85] text-muted-foreground">
                {tPage("note")}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-6 lg:sticky lg:top-24">
            <div className="text-[12px] text-muted-foreground">{t("from")}</div>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span
                className="text-[32px] font-extrabold"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                €{tour.priceFrom}
              </span>
              <span className="text-[15px] text-muted-foreground">
                ≈ ${tour.priceUsdFrom}
              </span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {tPage("priceNote")}
            </p>

            <WhatsAppLink
              subject={name}
              className="mt-6 flex items-center justify-center gap-2.5 rounded-md py-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-wa)" }}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {tCta("bookNow")}
            </WhatsAppLink>

            <Link
              href="/tours"
              className="mt-3 flex items-center justify-center gap-2 rounded-md border py-3 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
            >
              {tCommon("backToTours")}
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionHeading eyebrow={tEyebrow("tours")} title={tPage("title")} subtitle={tPage("subtitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <TourCard key={item.key} tour={item} />
          ))}
        </div>
      </section>

      <CredentialsBand />
    </main>
  );
}
