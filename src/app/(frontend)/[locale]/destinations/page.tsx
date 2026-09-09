import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, MapPin } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { TrustBoxes } from "@/components/site/trust-stats";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { PromoBanner } from "@/components/site/promo-banner";
import { ClosingCta } from "@/components/site/transfer-sections";
import { RelatedLinks } from "@/components/site/related-links";
import { CredentialsBand } from "@/components/site/credentials-band";
import { DestinationCompare } from "@/components/site/destination-compare";
import { destinations } from "@/data/destinations";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "destinationsPage" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

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
    description: tMeta("destinations"),
    alternates: alternatesFor("/destinations", locale),
  };
}

/**
 * Şehir merkezi listesi.
 *
 * Kartlar bilerek büyük ve fotoğraf ağırlıklı: bu sayfada ziyaretçi
 * okumaya değil SEÇMEYE geliyor ("Antalya mı Bodrum mu"), ve o seçim
 * büyük ölçüde görselle yapılıyor.
 */
export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("destinationsPage");
  const tNav = await getTranslations("nav");
  const lang = locale as Locale;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: t("title"), url: getPathname({ locale, href: "/destinations" }) },
        ]}
      />
      <ItemListSchema
        items={destinations.map((item) => ({
          name: item.name[lang] ?? item.name.tr,
          url: getPathname({
            locale,
            href: { pathname: "/destinations/[city]", params: { city: item.slug } },
          }),
        }))}
      />

      <PageHero
        image="/images/hero-ortakoy.jpg"
        imageAlt={t("title")}
        crumbs={[{ label: tNav("home"), href: "/" }, { label: t("title") }]}
        title={t("title")}
        subtitle={t("heroSubtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <h2 className="font-display text-[26px] font-semibold leading-snug sm:text-[32px] lg:sticky lg:top-28 lg:self-start">
            {t("introTitle")}
          </h2>
          <p className="measure text-[15.5px] leading-[1.95] text-foreground/85">{t("intro")}</p>
        </div>
      </section>

      <PromoBanner placement="destinations" locale={locale} />

      <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((item) => {
            const name = item.name[lang] ?? item.name.tr;
            const href = {
              pathname: "/destinations/[city]" as const,
              params: { city: item.slug },
            };

            return (
              <article
                key={item.slug}
                className="reveal-rise group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden"
                style={{
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-e2)",
                }}
              >
                <Image
                  src={item.image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="absolute inset-0 -z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Alt yarıya inen perde: başlık fotoğrafın üstünde okunur
                    kalmalı ama fotoğrafın tamamını da karartmamalı. */}
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 94%, transparent) 0%, color-mix(in oklab, var(--brand-night) 62%, transparent) 42%, color-mix(in oklab, var(--brand-night) 8%, transparent) 100%)",
                  }}
                />

                <div className="p-6">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: "var(--brand-gold-label)" }}
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {t("region")}
                  </span>
                  <h3 className="mt-2.5 font-display text-[26px] font-semibold leading-tight text-white">
                    <Link href={href} className="inline-block py-0.5">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {name}
                    </Link>
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.7] text-white/78">
                    {item.tagline[lang] ?? item.tagline.tr}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold"
                    style={{ color: "var(--brand-gold)" }}
                  >
                    {t("explore")}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <DestinationCompare locale={locale} />

      <ClosingCta locale={locale} />
      <RelatedLinks />
      <CredentialsBand />
    </main>
  );
}
