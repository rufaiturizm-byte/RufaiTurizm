import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TrustBoxes } from "@/components/site/trust-stats";
import { AssuranceBand } from "@/components/site/assurance-band";
import { ClosingCta } from "@/components/site/transfer-sections";
import { ProcessSteps } from "@/components/site/process-steps";
import { CredentialsBand } from "@/components/site/credentials-band";
import { PromoBanner } from "@/components/site/promo-banner";
import { RelatedLinks } from "@/components/site/related-links";
import { GuideLink } from "@/components/site/guide-link";
import { packages } from "@/data/packages";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "packages" });

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
    description: tMeta("packages"),
    alternates: alternatesFor("/packages", locale),
  };
}

/**
 * Paket programlar.
 *
 * Rakip analizinin en net bulgusu buydu: Arapça aramalarda ilk sırayı tutan
 * siteler ürünlerini "برنامج سياحي" olarak paketliyor, biz ise transfer,
 * tur ve oteli ayrı ayrı satıyorduk. Ziyaretçi bunları kendi zihninde
 * birleştirmek zorunda kalıyordu; bu sayfa o işi bizim yapmamız.
 */
export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("packages");
  const tNav = await getTranslations("nav");
  const lang = locale as Locale;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: t("title"), url: getPathname({ locale, href: "/packages" }) },
        ]}
      />
      <ItemListSchema
        items={packages.map((item) => ({
          name: item.name[lang] ?? item.name.tr,
          url: `${getPathname({ locale, href: { pathname: "/packages/[slug]", params: { slug: item.slug } } })}`,
        }))}
      />

      <PageHero
        image="/images/tours/istanbul.jpg"
        imageAlt={t("title")}
        crumbs={[{ label: tNav("home"), href: "/" }, { label: t("title") }]}
        title={t("title")}
        subtitle={t("heroSubtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/*
        Giriş. "Paket" kelimesi tek başına ne olduğunu anlatmıyor; asıl
        satan şey günlerin BİRBİRİNE GÖRE sıralanmış olması. Buradaki üç
        paragraf onu anlatıyor ve aynı zamanda sayfaya Arapça aramanın
        karşılığı olan gövde metnini veriyor.

        Düzen sayfanın geri kalanıyla aynı genişlikte (max-w-7xl).
        Önceki hali max-w-3xl idi: her bölümü kenardan kenara uzanan bir
        sayfanın ortasında dar, dayanaksız bir metin adası olarak
        duruyordu. Sitede max-w-3xl yalnız rehber YAZILARINDA kullanılıyor
        ve orada doğru — uzun metin için okuma genişliği. Burası liste
        sayfası; başlık solda, metin sağda iki sütun hem hizayı tutuyor
        hem okuma genişliğini koruyor.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <h2 className="font-display text-[26px] font-semibold leading-snug sm:text-[32px] lg:sticky lg:top-28 lg:self-start">
            {t("introTitle")}
          </h2>
          <div className="measure flex flex-col gap-4 text-[15.5px] leading-[1.95] text-foreground/85">
            <p>{t("intro1")}</p>
            <p>{t("intro2")}</p>
            <p>{t("intro3")}</p>
          </div>
        </div>
      </section>

      {/*
        Kaç gün seçmeli.
        Sayfadaki asıl karar bu: ziyaretçi dört, beş, altı ve sekiz günlük
        programlara bakıp birini seçiyor ama gün sayısının neye göre
        değiştiğini söyleyen bir yer yoktu. Bölüm her uzunluğun hangi
        soruya cevap olduğunu yazıyor — dördün tek şehir, altının ikinci
        şehri eklediğiniz ilk uzunluk olması gibi.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <h2 className="font-display text-[26px] font-semibold leading-snug sm:text-[32px] lg:sticky lg:top-28 lg:self-start">
            {t("chooseTitle")}
          </h2>
          <div className="measure flex flex-col gap-4 text-[15.5px] leading-[1.95] text-foreground/85">
            {t("chooseText")
              .split("\n\n")
              .map((paragraf, sira) => (
                <p key={sira}>{paragraf}</p>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-16 sm:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("listTitle")} subtitle={t("subtitle")} />

        <div className="grid gap-6 lg:grid-cols-2">
          {packages.map((item) => {
            const name = item.name[lang] ?? item.name.tr;
            const href = {
              pathname: "/packages/[slug]" as const,
              params: { slug: item.slug },
            };

            return (
              <article key={item.slug} className="reveal-rise accent-card group flex flex-col overflow-hidden">
                <Link href={href} className="relative block aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold"
                    style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                  >
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {item.days} {t("days")}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {item.city[lang] ?? item.city.tr}
                  </div>

                  {/* Liste kartı başlığı h3: bölümün kendi h2 başlığı
                      ("Hazır paket programlarımız") zaten üstünde. */}
                  <h3 className="mt-3 font-display text-[21px] font-semibold leading-snug sm:text-[24px]">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {name}
                    </Link>
                  </h3>

                  <p className="mt-3 flex-1 text-[14px] leading-[1.8] text-muted-foreground">
                    {item.excerpt[lang] ?? item.excerpt.tr}
                  </p>

                  <Link
                    href={href}
                    className="mt-5 inline-flex w-fit items-center gap-2 py-1.5 text-[13.5px] font-bold"
                    style={{ color: "var(--brand-gold-deep)" }}
                  >
                    {t("itineraryTitle")}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <PromoBanner placement="packages" locale={locale} />

      <GuideLink slug="turkiyede-tatil-butcesi-nasil-kurulur" locale={locale} />
      <ProcessSteps />
      <AssuranceBand />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["packages"]} />
      <CredentialsBand />
    </main>
  );
}
