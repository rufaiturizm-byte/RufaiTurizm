import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, TouristTripSchema } from "@/components/site/json-ld";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-boxes";
import { CredentialsBand } from "@/components/site/credentials-band";
import { ProcessSteps } from "@/components/site/process-steps";
import {
  ClosingCta,
  FleetGrid,
  ServiceCities,
  TransferSteps,
  TransferTypes,
  TransferWhy,
} from "@/components/site/transfer-sections";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { services, serviceBySlug } from "@/data/services";

/** Transfer formu yalnızca ulaşım hizmetlerinde anlamlı. */
const TRANSFER_SLUGS = new Set(["vito-vip", "transfer"]);

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "services" });

  return {
    title: t(`${service.key}.title`),
    description: t(`${service.key}.description`),
    openGraph: { images: [service.image] },
    alternates: alternatesFor({ pathname: "/services/[slug]", params: { slug } }, locale),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = serviceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const tPage = await getTranslations("servicesPage");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tTours = await getTranslations("tours");
  const tWhy = await getTranslations("whyUs");
  const tFleet = await getTranslations("fleet");

  const name = t(`${service.key}.title`);
  const description = t(`${service.key}.description`);
  const features = t.raw(`${service.key}.features`) as string[];
  const isTransfer = TRANSFER_SLUGS.has(service.slug);

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("services"), url: getPathname({ locale, href: "/services" }) },
          {
            name: name,
            url: getPathname({ locale, href: { pathname: "/services/[slug]", params: { slug } } }),
          },
        ]}
      />
      <TouristTripSchema
        name={name}
        description={description}
        image={service.image}
        price={service.priceFrom}
        currency={service.currency}
      />

      <section className="relative isolate">
        <Image
          src={service.image}
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
              "linear-gradient(to inline-end, color-mix(in oklab, var(--brand-night) 95%, transparent) 0%, color-mix(in oklab, var(--brand-night) 66%, transparent) 62%, color-mix(in oklab, var(--brand-night) 32%, transparent) 100%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-[12.5px] text-white/55">
            {tNav("home")} · {tNav("services")} · {name}
          </div>
          <h1 className="mt-3 max-w-2xl text-[32px] font-bold leading-tight text-white sm:text-[42px]">
            {name}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-white/78">
            {description}
          </p>
        </div>
      </section>

      {isTransfer ? (
        <>
          <section className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-5 sm:px-8">
            <TransferForm />
          </section>
          <section className="mt-12">
            <TrustBoxes />
          </section>
        </>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-[15.5px] leading-[1.9] text-foreground/85">
              {t(`${service.key}.long`)}
            </p>

            {service.slug === "vito-vip" ? (
              <div className="mt-8">
                <h2 className="text-[19px] font-bold">{tFleet("galleryTitle")}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    { src: "/images/fleet/vito-interior.jpg", alt: tFleet("interiorAlt") },
                    { src: "/images/fleet/vito-cockpit.jpg", alt: tFleet("cockpitAlt") },
                  ].map((photo) => (
                    <div
                      key={photo.src}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12.5px] text-muted-foreground">
                  {tFleet("stockNote")}
                </p>
              </div>
            ) : null}

            <h2 className="mt-10 text-[19px] font-bold">{tPage("featuresTitle")}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 text-[14.5px]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-[19px] font-bold">{tWhy("title")}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {(["arabicSupport", "fixedPrice", "family", "support"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <Check
                    className="mt-1 size-4 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-[14.5px] font-semibold">{tWhy(`${key}.title`)}</div>
                    <div className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                      {tWhy(`${key}.description`)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-6 lg:sticky lg:top-24">
            {service.priceFrom ? (
              <>
                <div className="text-[12px] text-muted-foreground">{tTours("from")}</div>
                <div
                  className="mt-1 text-[32px] font-extrabold"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  €{service.priceFrom}
                </div>
              </>
            ) : (
              <>
                <div className="text-[19px] font-bold">{tCommon("priceOnRequest")}</div>
                <div className="mt-1.5 text-[13.5px] text-muted-foreground">
                  {tCommon("contactForPrice")}
                </div>
              </>
            )}

            <WhatsAppLink
              subject={name}
              className="mt-6 flex items-center justify-center gap-2.5 rounded-md py-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-wa)" }}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {tCta("bookNow")}
            </WhatsAppLink>

            <Link
              href="/services"
              className="mt-3 flex items-center justify-center gap-2 rounded-md border py-3 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
            >
              {tCommon("backToServices")}
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      {isTransfer ? (
        <>
          <TransferTypes />
          <FleetGrid />
          <TransferWhy />
          <TransferSteps />
          <ServiceCities />
        </>
      ) : (
        <ProcessSteps />
      )}

      <ClosingCta />
      <CredentialsBand />
    </main>
  );
}
