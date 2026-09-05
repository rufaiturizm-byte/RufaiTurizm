import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CredentialsBand } from "@/components/site/credentials-band";
import { TrustStats } from "@/components/site/trust-stats";
import { WhyUs } from "@/components/site/why-us";
import { ProcessSteps } from "@/components/site/process-steps";
import { RouteCoverage } from "@/components/site/route-coverage";
import { ClosingCta } from "@/components/site/transfer-sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
    description: tMeta("about"),
    alternates: alternatesFor("/about", locale),
  };
}

/**
 * Hakkımızda.
 *
 * Önceki hali altı paragrafı tek sütunda alt alta diziyordu: sayfanın
 * tamamı, üst banttan sonra, kesintisiz bir metin duvarıydı. "Hakkımızda"
 * sayfası güven sayfasıdır ve güven metinle değil, kanıtla kurulur —
 * rakamlar, belge, araç, hizmet verilen yerler.
 *
 * Şimdi metin ikiye bölünmüş (kimiz / misafirlerimize sözümüz), her biri
 * kendi fotoğrafıyla; aralarında istatistik şeridi, belge bandı ve kapsam
 * listesi var. Aynı metin, okunabilir hale gelmiş bir sayfada.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("about"), url: getPathname({ locale, href: "/about" }) },
        ]}
      />

      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={locale === "ar" ? "مسجد أورتاكوي ومضيق البوسفور" : "Ortaköy Camii ve Boğaz"}
        breadcrumb={`${tNav("home")} · ${tNav("about")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <TrustStats />

      {/* Kimiz — metin solda, fotoğraf sağda */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-24 pb-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t("storyEyebrow")}
              title={t("storyTitle")}
              rule={false}
            />
            <div className="flex flex-col gap-5 text-[15.5px] leading-[1.9] text-foreground/85">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>

          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            <Image
              src="/images/chauffeur.jpg"
              alt={t("title")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_30%]"
            />
          </div>
        </div>
      </section>

      {/* Sözümüz — fotoğraf solda, metin sağda */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div
            className="relative aspect-[4/3] overflow-hidden lg:order-1"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
          >
            <Image
              src="/images/fleet/vito-interior.jpg"
              alt={t("promiseTitle")}
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover"
            />
          </div>

          <div className="lg:order-2">
            <SectionHeading
              eyebrow={t("promiseEyebrow")}
              title={t("promiseTitle")}
              rule={false}
            />
            <div className="flex flex-col gap-5 text-[15.5px] leading-[1.9] text-foreground/85">
              <p>{t("p4")}</p>
              <p>{t("p5")}</p>
              <p>{t("p6")}</p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsBand />

      <WhyUs />

      <div className="pt-24">
        <ProcessSteps />
      </div>

      <RouteCoverage locale={locale} />

      <ClosingCta locale={locale} />
    </main>
  );
}
