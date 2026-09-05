import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { TravelAgencySchema, WebSiteSchema } from "@/components/site/json-ld";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-boxes";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { CredentialsBand } from "@/components/site/credentials-band";
import { PackagesSection } from "@/components/site/packages-section";
import { Reviews } from "@/components/site/reviews";
import { ServicesOverview } from "@/components/site/services-overview";
import { WhyUs } from "@/components/site/why-us";
import { FaqPreview } from "@/components/site/faq-preview";
import { ClosingCta } from "@/components/site/transfer-sections";
import { DestinationsMarquee } from "@/components/site/destinations-marquee";
import { Reveal } from "@/components/site/reveal";
import { tours } from "@/data/tours";
import { siteConfig } from "@/config/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const tStats = await getTranslations("stats");
  const tHome2 = await getTranslations("home2");
  const tCta = await getTranslations("cta");
  const tToursPage = await getTranslations("toursPage");
  const tEyebrow = await getTranslations("eyebrow");

  /* Sayısal olanlar ekranda sayarak yükseliyor; TÜRSAB metin olarak kalıyor. */
  const stats = [
    { number: 12000, prefix: "+", decimals: 0, suffix: "", label: tStats("guestsLabel") },
    { number: 4.9, prefix: "", decimals: 1, suffix: " / 5", label: tStats("ratingLabel") },
    { number: 2015, prefix: "", decimals: 0, suffix: "", label: tStats("sinceLabel") },
    { text: "TÜRSAB", label: tStats("licenseLabel") },
  ];

  const featured = tours.slice(0, 4);

  return (
    <>
      <TravelAgencySchema locale={locale} name={tBrand("name")} description={t("hero.subtitle")} />
      <WebSiteSchema name={tBrand("name")} />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate">
          <Image
            src="/images/hero-ortakoy.jpg"
            alt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 92%, transparent) 0%, color-mix(in oklab, var(--brand-night) 55%, transparent) 42%, color-mix(in oklab, var(--brand-night) 18%, transparent) 100%)",
            }}
          />

          <div className="mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
            <div
              className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-sm"
              style={{
                borderColor: "color-mix(in oklab, var(--brand-gold) 55%, transparent)",
                background: "color-mix(in oklab, var(--brand-night) 45%, transparent)",
              }}
            >
              <ShieldCheck className="size-4" style={{ color: "var(--brand-gold)" }} aria-hidden="true" />
              <AnimatedShinyText className="text-[12px] font-semibold tracking-[0.08em] text-white/80">
                TÜRSAB{siteConfig.credentials.tursab ? ` · ${siteConfig.credentials.tursab}` : ""}
              </AnimatedShinyText>
            </div>

            <h1 className="mt-7 max-w-2xl font-display text-[42px] font-semibold leading-[1.14] tracking-[-0.01em] text-white sm:text-[64px]">
              {t("hero.title")}
            </h1>

            <p className="mt-5 max-w-lg text-[17px] leading-[1.8] text-white/80">
              {t("hero.subtitle")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <WhatsAppLink>
                <ShimmerButton
                  background="var(--brand-gold)"
                  shimmerColor="#ffffff"
                  shimmerDuration="3.5s"
                  borderRadius="8px"
                  className="px-7 py-4 text-[15px] font-bold"
                >
                  <span
                    className="inline-flex items-center gap-2.5"
                    style={{ color: "var(--brand-night)" }}
                  >
                    <MessageCircle className="size-[19px]" aria-hidden="true" />
                    {tCta("whatsapp")}
                  </span>
                </ShimmerButton>
              </WhatsAppLink>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-md border border-white/35 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {tHome2("allToursCta")}
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Transfer talep formu — hero'nun üstüne biner, seçimler WhatsApp mesajına dönüşür */}
        <section className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-5 sm:px-8">
          <TransferForm />
        </section>

        <section className="mt-12">
          <TrustBoxes />
        </section>

        {/* İstatistik şeridi — rakam öne çıkar, ikon yok */}
        <section className="border-b" style={{ background: "var(--brand-cream)" }}>
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                /* Ayırıcı çizgi sütun sayısını izler: iki sütunda her satırın
                   ikinci öğesinde, dört sütunda ilk öğe dışında hepsinde. */
                className="px-1 py-9 not-nth-[2n+1]:border-s nth-[n+3]:border-t sm:px-6 sm:py-12 lg:border-t-0 lg:not-first:border-s"
                style={{ borderColor: "color-mix(in oklab, var(--brand-night) 10%, transparent)" }}
              >
                <div className="text-[34px] font-extrabold leading-none tracking-[-0.02em] tabular-nums sm:text-[44px]">
                  {"text" in stat ? (
                    stat.text
                  ) : (
                    <>
                      {stat.prefix}
                      <NumberTicker value={stat.number} decimalPlaces={stat.decimals} />
                      {stat.suffix}
                    </>
                  )}
                </div>
                <div className="mt-3 text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <ServicesOverview />

        {/* Çok tercih edilen turlar — krem zemin, iki beyaz bölüm arasında ayrım */}
        <section style={{ background: "var(--brand-cream)" }}>
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeading
            eyebrow={tEyebrow("tours")}
            title={tHome2("popularTours")}
            subtitle={tToursPage("subtitle")}
            action={
              <Link
                href="/tours"
                className="inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
              >
                {tHome2("allToursCta")}
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            }
          />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((tour, index) => (
                <Reveal key={tour.key} delay={index * 0.08}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <PackagesSection locale={locale} />

        <DestinationsMarquee />

        <WhyUs subtitle={tHome2("vipText")} />

        {/* VIP transfer bandı */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <div className="relative isolate overflow-hidden rounded-xl">
            <Image
              src="/images/vito-black.jpg"
              alt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="-z-10 object-cover object-center"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to inline-end, color-mix(in oklab, var(--brand-night) 94%, transparent) 0%, color-mix(in oklab, var(--brand-night) 72%, transparent) 55%, transparent 100%)",
              }}
            />
            <div className="max-w-xl px-8 py-16 sm:px-12 sm:py-20">
              <h2 className="text-[27px] font-bold leading-snug text-white sm:text-[32px]">
                {tHome2("vipTitle")}
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.8] text-white/78">{tHome2("vipText")}</p>
              <WhatsAppLink
                subject={tHome2("vipTitle")}
                className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[14.5px] font-bold"
                style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
              >
                {tCta("whatsapp")}
              </WhatsAppLink>
            </div>
          </div>
        </section>
        <FaqPreview />
        <ClosingCta />
        <CredentialsBand />
        <Reviews />
      </main>
    </>
  );
}
