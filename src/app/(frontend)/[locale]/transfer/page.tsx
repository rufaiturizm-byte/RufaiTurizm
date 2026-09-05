import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-stats";
import { VehicleList } from "@/components/site/vehicle-list";
import { RouteCards } from "@/components/site/route-cards";
import { FleetUses } from "@/components/site/fleet-uses";
import { RouteCoverage } from "@/components/site/route-coverage";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { FaqPreview } from "@/components/site/faq-preview";
import {
  ClosingCta,
  TransferSteps,
  TransferTypes,
  TransferWhy,
} from "@/components/site/transfer-sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "transferPage" });

  return {
    title: t("title"),
    description: tMeta("transfer"),
    alternates: alternatesFor("/transfer", locale),
  };
}

/**
 * Havalimanı transferi sayfası.
 *
 * Bu sayfa yoktu. Çevirileri (`transferPage.*`), bölümleri
 * (`transfer-sections.tsx` içindeki TransferTypes, TransferWhy,
 * TransferSteps) ve menü etiketi (`nav.transfer`) kodda yazılıydı ama rota
 * hiç açılmamıştı; bölümler yalnız hizmet detay sayfalarının içinde
 * görünüyordu. Oysa en çok aranan hizmet bu ve "havalimanı transfer"
 * araması bir bölüme değil kendi sayfasına inmeli.
 *
 * Akış: karşılama → form → HANGİ ARAÇ → hangi transfer tipi → nereden
 * nereye → neden biz → üç adım. Araç listesi bilerek başlarda: havalimanı
 * transferinde fiyattan sonraki ilk soru "hangi araçla geleceksiniz".
 */
export default async function TransferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("transferPage");
  const tNav = await getTranslations("nav");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("transfer"), url: getPathname({ locale, href: "/transfer" }) },
        ]}
      />

      <PageHero
        image="/images/vito-black.jpg"
        imageAlt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
        breadcrumb={`${tNav("home")} · ${tNav("transfer")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Form hemen altta: transfer sayfasına gelen kişi zaten ne istediğini
          biliyor, önce anlatıp sonra sormanın anlamı yok. */}
      <section className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-5 sm:px-8">
        <TransferForm />
      </section>

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-4 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("transfer")}
          title={t("title")}
          subtitle={t("intro")}
          rule={false}
        />
      </section>

      <RouteCards locale={locale} />

      <VehicleList />

      <FleetUses />

      <TransferTypes />

      <RouteCoverage locale={locale} />

      <TransferWhy />

      <TransferSteps />

      <FaqPreview />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["transfer"]} />
      <CredentialsBand />
    </main>
  );
}
