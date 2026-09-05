import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TrustBoxes } from "@/components/site/trust-stats";
import { RouteCoverage } from "@/components/site/route-coverage";
import { ClosingCta } from "@/components/site/transfer-sections";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { guides } from "@/data/guides";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "guidesPage" });

  return {
    title: t("title"),
    description: tMeta("guides"),
    alternates: alternatesFor("/guides", locale),
  };
}

/**
 * Seyahat rehberleri listesi.
 *
 * Sitenin arama motorundaki en büyük boşluğuydu: bütün sayfalar "biz ne
 * yapıyoruz" diye yazılmıştı ve hiçbiri misafirin seyahatten haftalar önce
 * sorduğu sorulara cevap vermiyordu. O sorular Arapça aranıyor ve bizi
 * hiçbir sonuçta göstermiyordu.
 */
export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("guidesPage");
  const tNav = await getTranslations("nav");
  const lang = locale as Locale;

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("guides"), url: getPathname({ locale, href: "/guides" }) },
        ]}
      />
      <ItemListSchema
        items={guides.map((guide) => ({
          name: guide.title[lang] ?? guide.title.tr,
          url: getPathname({
            locale,
            href: { pathname: "/guides/[slug]", params: { slug: guide.slug } },
          }),
        }))}
      />

      <PageHero
        image="/images/kizkulesi.jpg"
        imageAlt={locale === "ar" ? "برج الفتاة في إسطنبول" : "Kız Kulesi, İstanbul"}
        breadcrumb={`${tNav("home")} · ${tNav("guides")}`}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-20 sm:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("allGuides")} rule={false} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const title = guide.title[lang] ?? guide.title.tr;
            const href = {
              pathname: "/guides/[slug]" as const,
              params: { slug: guide.slug },
            };

            return (
              <article key={guide.slug} className="accent-card group flex flex-col overflow-hidden">
                <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-black"
                    style={{ boxShadow: "var(--shadow-e1)" }}
                  >
                    <Clock className="size-3" aria-hidden="true" />
                    {guide.minutes} {t("minutes")}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-[18px] font-semibold leading-snug">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {title}
                    </Link>
                  </h2>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                    {guide.excerpt[lang] ?? guide.excerpt.tr}
                  </p>

                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-bold"
                    style={{ color: "var(--brand-gold-deep)" }}
                  >
                    {t("readCta")}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <RouteCoverage locale={locale} />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["guides"]} />
      <CredentialsBand />
    </main>
  );
}
