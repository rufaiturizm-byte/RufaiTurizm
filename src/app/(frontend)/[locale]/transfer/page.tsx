import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { AssuranceBand } from "@/components/site/assurance-band";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-stats";
import { VehicleList } from "@/components/site/vehicle-list";
import { RouteCards } from "@/components/site/route-cards";
import { RouteCoverage } from "@/components/site/route-coverage";
import { PromoBanner } from "@/components/site/promo-banner";
import { GuideLink } from "@/components/site/guide-link";
import { FaqPreview } from "@/components/site/faq-preview";
import {
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
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("transfer"), url: getPathname({ locale, href: "/transfer" }) },
        ]}
      />

      <PageHero
        /* Kapak aracın dış çekimiydi; aynı kare aşağıda hem araç
           listesinde hem hizmet türü kartında duruyordu, yani sayfada üç
           kez. Havalimanı karesi hem tekil hem sayfanın konusuna yakın. */
        image="/images/places/havalimani.jpg"
        imageAlt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("transfer") },
        ]}
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

      <PromoBanner placement="transfer" locale={locale} />

      <VehicleList />

      {/*
        FleetUses buradan KALDIRILDI (hizmetler sayfasında duruyor).

        Hemen altındaki TransferTypes ile dört kartın üçü neredeyse
        kelimesi kelimesine aynı şeyi söylüyordu:
        "Geliş kapısında karşılama, bagaj yardımı ve doğrudan otele
        transfer" iki bölümde de vardı; "Bursa, Sapanca, Yalova" ve
        "saatlik ya da tam gün" cümleleri de öyle. Ziyaretçi aynı dört
        maddeyi arka arkaya iki kez okuyordu ve aynı Vito fotoğrafı
        sayfada beş yerde birden çıkıyordu.

        TransferTypes kalıyor çünkü fotoğrafları gerçek: kendi ofisimiz
        ve kendi araçlarımız. FleetUses'ın kareleri stoktu.
      */}
      <TransferTypes />

      {/* Tek bant: iki ayrı bant yan yana gelince alt ve üst kenarlıklar
          üst üste binip 2 piksellik bir çizgi bırakıyordu. */}
      <Band>
        <GuideLink slug="turkiyede-sim-kart-ve-internet" locale={locale} />
        <RouteCoverage locale={locale} />
        <TransferWhy />
        <TransferSteps />
      </Band>

      <AssuranceBand />

      <FaqPreview />
      <PageClosing locale={locale} exclude={["transfer"]} />
    </main>
  );
}
