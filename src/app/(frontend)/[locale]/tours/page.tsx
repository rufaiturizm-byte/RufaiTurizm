import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TourCard } from "@/components/site/tour-card";
import { TourCompare } from "@/components/site/tour-compare";
import { RouteCoverage } from "@/components/site/route-coverage";
import { TrustBoxes } from "@/components/site/trust-stats";
import { PromoBanner } from "@/components/site/promo-banner";
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
    <main id="main" className="flex flex-1 flex-col">
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
        /* Kapak İstanbul turunun kendi karesiydi; aynı fotoğraf hemen
           aşağıda tur kartı olarak da duruyordu. Kapalıçarşı bu sayfada
           başka hiçbir yerde geçmiyor. */
        image="/images/places/kapalicarsi.jpg"
        imageAlt={tTours("istanbul.name")}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("tours") },
        ]}
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

      <Band>
        <TourCompare />
      </Band>

      <PromoBanner placement="tours" locale={locale} />

      <RouteCoverage locale={locale} variant="compact" />

      <PackagesSection locale={locale} />

      <PageClosing locale={locale} exclude={["tours"]} />
    </main>
  );
}
