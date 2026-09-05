import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-boxes";
import { CredentialsBand } from "@/components/site/credentials-band";
import { ProcessSteps } from "@/components/site/process-steps";
import { ClosingCta, FleetGrid } from "@/components/site/transfer-sections";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { services } from "@/data/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/services", locale),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");
  const tServices = await getTranslations("services");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tTours = await getTranslations("tours");

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        image="/images/vito-black.jpg"
        imageAlt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
        breadcrumb={`${tNav("home")} · ${tNav("services")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Transfer talep formu — seçimler WhatsApp mesajına dönüşür */}
      <section className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-5 sm:px-8">
        <TransferForm />
      </section>

      <section className="mt-12">
        <TrustBoxes />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8">
        <p className="max-w-3xl text-[15.5px] leading-[1.9] text-foreground/85">
          {t("intro")}
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service) => {
            const name = tServices(`${service.key}.title`);
            const href = {
              pathname: "/services/[slug]" as const,
              params: { slug: service.slug },
            };

            return (
              <article
                key={service.key}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg sm:flex-row"
              >
                <Link
                  href={href}
                  className="relative block h-48 shrink-0 overflow-hidden sm:h-auto sm:w-52"
                >
                  <Image
                    src={service.image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[16.5px] font-bold">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {name}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    {tServices(`${service.key}.description`)}
                  </p>

                  <div className="mt-4 border-t pt-3">
                    {service.priceFrom ? (
                      <>
                        <div className="text-[11.5px] text-muted-foreground">
                          {tTours("from")}
                        </div>
                        <div className="mt-0.5 text-[20px] font-extrabold" style={{ color: "var(--brand-gold-deep)" }}>
                          €{service.priceFrom}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[15px] font-bold">
                          {tCommon("priceOnRequest")}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                          {tCommon("contactForPrice")}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={href}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-[13px] font-semibold transition-colors hover:bg-secondary"
                    >
                      {tCommon("details")}
                      <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                    <WhatsAppLink
                      subject={name}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ background: "var(--brand-wa)" }}
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      {tCta("bookNow")}
                    </WhatsAppLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <ProcessSteps />
      <FleetGrid />
      <ClosingCta />

      <CredentialsBand />
    </main>
  );
}
