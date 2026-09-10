import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-stats";
import { ServiceRows } from "@/components/site/service-rows";
import { FleetUses } from "@/components/site/fleet-uses";
import { RouteCoverage } from "@/components/site/route-coverage";
import { WhyUs } from "@/components/site/why-us";
import { FaqPreview } from "@/components/site/faq-preview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "servicesPage" });

  return {
    /*
       Arama sonucu başlığı, sayfa etiketi DEĞİL.
       Önceki hali t("title") idi, yani H1 ile aynı: "النقل من المطار",
       "جولاتنا السياحية". İkisi ayrı iş yapıyor — H1 sayfada okunan
       etiket, <title> arama sonucunda tıklanan satır. Sonuç 31-36
       karakterlik, şehir adı bile içermeyen başlıklardı; kimse
       "havalimanı transferi" diye şehirsiz aramıyor. Rehberlerde ve
       şehir sayfalarında bu ayrım seo.title ile zaten yapılıyordu.
    */
    title: t("metaTitle"),
    description: tMeta("services"),
    alternates: alternatesFor("/services", locale),
  };
}

/**
 * Hizmetler sayfası.
 *
 * Önceki mimarisinin üç sorunu vardı. Bir: "Hizmetlerimiz" başlığı aynı alt
 * başlıkla sayfada İKİ KEZ geçiyordu (üst bantta ve bölüm başlığında). İki:
 * sayfa dört hizmeti anlatıyor ama en üstte havalimanı transfer formuyla
 * açılıyordu — uçak bileti için gelen ziyaretçi önce alakasız bir form
 * görüyordu. Üç: her hizmet hakkında tek cümle vardı, oysa uzun metinler ve
 * altı maddelik özellik listeleri mesaj dosyalarında yazılı duruyordu.
 *
 * Yeni akış içerikten güvene doğru gidiyor: hizmetler tek tek anlatılıyor,
 * sonra araç, sonra hizmet verilen noktalar (arama motoru için de asıl
 * yüzey burası), sonra neden biz ve süreç. Form artık en sonda, ziyaretçi
 * neyi rezerve edeceğini bildikten sonra.
 */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");
  const tNav = await getTranslations("nav");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("services"), url: getPathname({ locale, href: "/services" }) },
        ]}
      />

      <PageHero
        /* Kapak aracın dış çekimiydi ama "Vito VIP Araç Hizmeti" kartı
           da aynı kareyi taşıyor; sayfa açılır açılmaz aynı fotoğraf iki
           kez görünüyordu. Boğaz köprüsü dört hizmetin ortak zemini. */
        image="/images/places/bogaz-kopru.jpg"
        imageAlt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("services") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/* Giriş paragrafı artık başlıksız ortada asılı değil: bölümün kendi
          etiketi ve başlığı var, altında dört hizmet sırayla geliyor. */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <SectionHeading
          eyebrow={tEyebrow("services")}
          title={t("offerTitle")}
          subtitle={t("intro")}
          rule={false}
        />
      </section>

      <ServiceRows />

      <Band>
        <FleetUses />
        <RouteCoverage locale={locale} variant="compact" />
      </Band>

      <WhyUs />

      {/* Form en sonda: ziyaretçi neyi rezerve edeceğini bildikten sonra. */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <TransferForm />
      </section>

      <FaqPreview />
      <PageClosing locale={locale} exclude={["services"]} />
    </main>
  );
}
