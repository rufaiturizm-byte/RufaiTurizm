import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Banknote, Headphones, MessagesSquare, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BreadcrumbSchema, TouristTripSchema } from "@/components/site/json-ld";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-stats";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { ProcessSteps } from "@/components/site/process-steps";
import {
  ClosingCta,
  TransferSteps,
  TransferTypes,
  TransferWhy,
} from "@/components/site/transfer-sections";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { VehicleList } from "@/components/site/vehicle-list";
import { RouteCoverage } from "@/components/site/route-coverage";
import { FaqPreview } from "@/components/site/faq-preview";
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

  const name = t(`${service.key}.title`);
  const description = t(`${service.key}.description`);
  const features = t.raw(`${service.key}.features`) as string[];
  const isTransfer = TRANSFER_SLUGS.has(service.slug);

  return (
    <main id="main" className="flex flex-1 flex-col">
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
        <div className="absolute inset-0 -z-10 scrim-x" />
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-24">
          <Breadcrumbs
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("services"), href: "/services" },
              { label: name },
            ]}
          />
          <h1 className="mt-3 max-w-2xl font-display text-[34px] font-semibold leading-[1.12] tracking-[-0.01em] text-white sm:text-[48px]">
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

      {/*
        Gövde. Önceki hali paragraf + onay işaretli düz listelerdi:
        "neler dahil" ve "neden biz" aynı ağırlıkta akıyor, sayfada hiçbir
        şey öne çıkmıyordu. Şimdi özellikler numaralı kartlarda, gerekçeler
        simgeli kartlarda ve rezervasyon kutusu altın çerçeveli.

        Vito sayfasında basit üçlü galeri yerine araç listesi bileşeni
        kullanılıyor — kapasite, bagaj ve donanım orada zaten yazılı.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-[17px] leading-[1.85] font-medium text-foreground/90">
              {description}
            </p>
            <p className="mt-5 text-[15.5px] leading-[1.95] text-foreground/80">
              {t(`${service.key}.long`)}
            </p>

            <h2 className="mt-12 font-display text-[24px] font-semibold sm:text-[28px]">
              {tPage("featuresTitle")}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <li key={feature} className="accent-card flex items-start gap-4 p-5">
                  <span className="step-badge size-9 shrink-0 text-[13px] font-extrabold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14.5px] leading-snug font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-[24px] font-semibold sm:text-[28px]">
              {tWhy("title")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  { key: "arabicSupport", icon: MessagesSquare },
                  { key: "fixedPrice", icon: Banknote },
                  { key: "family", icon: Users },
                  { key: "support", icon: Headphones },
                ] as const
              ).map(({ key, icon: Icon }, index) => (
                <div key={key} className="accent-card p-5">
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-[0.75rem] ${
                      index % 2 === 1 ? "tile-sky" : ""
                    }`}
                    style={
                      index % 2 === 1
                        ? undefined
                        : {
                            background: "color-mix(in oklab, var(--brand-gold) 20%, transparent)",
                            border:
                              "1px solid color-mix(in oklab, var(--brand-gold) 42%, transparent)",
                            color: "var(--brand-gold-deep)",
                          }
                    }
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[15.5px] font-bold">{tWhy(`${key}.title`)}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.75] text-muted-foreground">
                    {tWhy(`${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside
            className="h-fit rounded-[var(--radius-card)] border p-6 lg:sticky lg:top-24"
            style={{
              background: "var(--surface)",
              borderColor: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
              boxShadow: "var(--shadow-e3)",
            }}
          >
            {service.priceFrom ? (
              <>
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {tTours("from")}
                </div>
                <div
                  className="mt-1.5 text-[38px] font-extrabold leading-none"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  €{service.priceFrom}
                </div>
              </>
            ) : (
              <>
                <div className="text-[20px] font-bold">{tCommon("priceOnRequest")}</div>
                <div className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {tCommon("contactForPrice")}
                </div>
              </>
            )}

            <WhatsAppLink
              subject={name}
              className="mt-6 flex items-center justify-center gap-2.5 rounded-[0.8rem] py-4 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e2)" }}
            >
              <WhatsAppIcon className="size-5" />
              {tCta("bookNow")}
            </WhatsAppLink>

            <Link
              href="/services"
              className="mt-3 flex items-center justify-center gap-2 rounded-[0.8rem] border py-3 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
              style={{ borderColor: "color-mix(in oklab, var(--brand-night) 15%, transparent)" }}
            >
              {tCommon("backToServices")}
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      {/* Araç bölümü ulaşım hizmetlerinde: eski FleetGrid'in yerini araç
          listesi aldı — kapasite, bagaj ve donanım orada zaten yazılı ve
          ikisi birlikte aynı aracı iki kez gösteriyordu. */}
      {isTransfer ? (
        <>
          <VehicleList />
          <TransferTypes />
          <TransferWhy />
          <TransferSteps />
        </>
      ) : (
        <ProcessSteps />
      )}

      <RouteCoverage locale={locale} />
      <FaqPreview />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["services"]} />
      <CredentialsBand />
    </main>
  );
}
