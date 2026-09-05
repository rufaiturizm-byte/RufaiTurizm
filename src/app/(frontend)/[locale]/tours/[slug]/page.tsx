import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Check, Clock, MapPin, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TouristTripSchema } from "@/components/site/json-ld";
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
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tIncluded = await getTranslations("included");

  const name = t(`${tour.key}.name`);
  const description = t(`${tour.key}.description`);
  const others = tours.filter((item) => item.key !== tour.key).slice(0, 4);

  return (
    <main className="flex flex-1 flex-col">
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
          <h1 className="mt-3 text-[34px] font-bold leading-tight text-white sm:text-[44px]">
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

            <h2 className="mt-10 text-[19px] font-bold">{tCommon("included")}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {(["guide", "pickup", "vehicle", "fixedPrice"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-[14.5px]">
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  {tIncluded(key)}
                </li>
              ))}
            </ul>
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
        <SectionHeading title={tPage("title")} subtitle={tPage("subtitle")} />
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
