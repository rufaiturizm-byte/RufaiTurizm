import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
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
  const t = await getTranslations({ locale, namespace: "toursPage" });

  return {
    title: t("title"),
    description: t("subtitle"),
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
      <PageHero
        image="/images/tours/istanbul.jpg"
        imageAlt={tTours("istanbul.name")}
        breadcrumb={`${tNav("home")} · ${tNav("tours")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <p className="max-w-3xl text-[15.5px] leading-[1.9] text-foreground/85">
          {t("intro")}
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={tEyebrow("tours")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour) => (
            <TourCard key={tour.key} tour={tour} />
          ))}
        </div>
      </section>

      <PackagesSection locale={locale} />

      <WhyUs />
      <FaqPreview />
      <ClosingCta locale={locale} />

      <CredentialsBand />
    </main>
  );
}
