import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { TourCompare } from "@/components/site/tour-compare";
import { RouteCoverage } from "@/components/site/route-coverage";
import { TrustBoxes } from "@/components/site/trust-stats";
import { ProcessSteps } from "@/components/site/process-steps";
import { CredentialsBand } from "@/components/site/credentials-band";
import { WhyUs } from "@/components/site/why-us";
import { FaqPreview } from "@/components/site/faq-preview";
import { ClosingCta } from "@/components/site/transfer-sections";
import { PackagesSection } from "@/components/site/packages-section";
import { tours } from "@/data/tours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "toursPage" });

  return {
    title: t("title"),
    description: tMeta("tours"),
    alternates: alternatesFor("/tours", locale),
  };
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("toursPage");
  const tNav = await getTranslations("nav");
  const tEyebrow = await getTranslations("eyebrow");
  const tTours = await getTranslations("tours");

  return (
    <main className="flex flex-1 flex-col">
      {/* Bu sayfada hiç yapısal veri yoktu: kırıntı yolu da, listenin bir
          koleksiyon olduğu bilgisi de eksikti. */}
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("tours"), url: getPathname({ locale, href: "/tours" }) },
        ]}
      />
      <ItemListSchema
        items={tours.map((tour) => ({
          name: tTours(`${tour.key}.name`),
          url: getPathname({
            locale,
            href: { pathname: "/tours/[slug]", params: { slug: tour.slug } },
          }),
        }))}
      />

      <PageHero
        image="/images/tours/istanbul.jpg"
        imageAlt={tTours("istanbul.name")}
        breadcrumb={`${tNav("home")} · ${tNav("tours")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/* Başlık sayfada bir kez geçiyor: üst bantta. Burada bölümün kendi
          adı ve giriş metni var — önceden ikisi de aynı başlık ve aynı alt
          başlıkla tekrarlanıyordu. */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-16 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("tours")}
          title={t("listTitle")}
          subtitle={t("intro")}
          rule={false}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.key} tour={tour} />
          ))}
        </div>
      </section>

      <TourCompare />

      <RouteCoverage locale={locale} />

      <PackagesSection locale={locale} />

      <WhyUs />

      <div className="pt-24">
        <ProcessSteps />
      </div>

      <FaqPreview />
      <ClosingCta locale={locale} />

      <CredentialsBand />
    </main>
  );
}
