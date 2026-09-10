import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, ItemListSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { TrustBoxes } from "@/components/site/trust-stats";
import { guideMinutes, guides, guideTopics, guidesByTopic } from "@/data/guides";
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
    /* Arama sonucu başlığı; H1 sayfada `title` olarak kalıyor. */
    title: t("metaTitle"),
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
    <main id="main" className="flex flex-1 flex-col">
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
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("guides") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/*
        Konu seçici. On sekiz yazı tek ızgaradayken ziyaretçi aradığını
        ancak bütün başlıkları okuyarak buluyordu. Bunlar sayfa içi
        bağlantı — JavaScript gerektirmez, RTL'de de doğru çalışır.
      */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <SectionHeading title={t("allGuides")} rule={false} />

        <nav aria-label={t("allGuides")} className="-mt-4 flex flex-wrap gap-2.5">
          {guideTopics.map((topic) => (
            <a
              key={topic}
              href={`#${topic}`}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-secondary"
              style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
            >
              {t(`topic${topic.charAt(0).toUpperCase()}${topic.slice(1)}`)}
              <span className="text-[12px] tabular-nums text-muted-foreground">
                {guidesByTopic(topic).length}
              </span>
            </a>
          ))}
        </nav>
      </section>

      {/*
        Konu grupları dönüşümlü zeminde.
        Dört grup arka arkaya aynı krem zeminde duruyordu ve dizin
        sayfası tek bir uzun kart tarlası gibi okunuyordu — nerede
        "varış" bitip "planlama" başladığı yalnız başlıktan anlaşılıyordu.
        Bir atlayarak kum zemine alınınca dört grup dört bölüm oluyor.
      */}
      {guideTopics.map((topic, topicIndex) => {
        const bant = topicIndex % 2 === 1;
        const govde = (
      <section
        key={topic}
        id={topic}
        className={`mx-auto w-full max-w-7xl scroll-mt-24 px-5 sm:px-8 ${
          topicIndex === guideTopics.length - 1 ? "pt-14 pb-20" : bant ? "pt-2 pb-20" : "pt-14"
        }`}
      >
        <h2 className="mb-7 font-display text-[26px] font-semibold leading-snug sm:text-[30px]">
          {t(`topic${topic.charAt(0).toUpperCase()}${topic.slice(1)}`)}
        </h2>

        {/*
          Sütun sayısı kart sayısından türüyor. Üç sütunlu ızgarada dört
          kart olduğunda sonuncusu son satırda tek başına kalıp yanında
          iki sütunluk delik bırakıyordu ("varış" ve "planlama" konuları
          dörder yazı taşıyor). Dörtte iki sütun temiz bir 2×2 veriyor.
        */}
        <div
          className={`grid gap-5 sm:grid-cols-2 ${
            guidesByTopic(topic).length % 3 === 1 ? "lg:grid-cols-2" : "lg:grid-cols-3"
          }`}
        >
          {guidesByTopic(topic).map((guide) => {
            const title = guide.title[lang] ?? guide.title.tr;
            const href = {
              pathname: "/guides/[slug]" as const,
              params: { slug: guide.slug },
            };

            /*
              Dar ekranda kart yan yana düzene geçiyor: görsel solda dar
              bir şerit, metin sağda. Sebep ölçüldü — dikey kartta görsel
              tek başına 218 piksel ve yirmi sekiz kart 11.452 piksel
              tutuyordu, yani dizin sayfası mobilde 20 ekran. Yatay
              düzende kart 409'dan ~170 piksele iniyor ve sayfa taranabilir
              hale geliyor. 640 pikselden itibaren eski dikey kart geri
              geliyor.
            */
            return (
              <article
                key={guide.slug}
                className="reveal-rise accent-card group flex flex-row items-stretch overflow-hidden sm:flex-col"
              >
                <Link
                  href={href}
                  className="relative block w-[34%] shrink-0 self-stretch overflow-hidden sm:aspect-[16/10] sm:w-auto sm:self-auto"
                >
                  <Image
                    src={guide.image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 34vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Okuma süresi rozeti dar görselde sığmıyor; yalnız
                      dikey kartta gösteriliyor. */}
                  <span
                    className="absolute bottom-3 start-3 hidden items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-black sm:inline-flex"
                    style={{ boxShadow: "var(--shadow-e1)" }}
                  >
                    <Clock className="size-3" aria-hidden="true" />
                    {guideMinutes(guide)} {t("minutes")}
                  </span>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  {/* Konu başlığı h2 olduğu için kart başlıkları h3:
                      "Varış ve ulaşım" > "Havalimanından şehre" sıradüzeni. */}
                  <h3 className="font-display text-[18px] font-semibold leading-snug">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground sm:mt-2.5 sm:line-clamp-none">
                    {guide.excerpt[lang] ?? guide.excerpt.tr}
                  </p>

                  {/* Başlığın kendisi zaten bağ; dar kartta ikinci bir
                      "oku" satırı yalnız yer kaplıyor. */}
                  <Link
                    href={href}
                    className="mt-3 hidden py-1.5 items-center gap-2 text-[13.5px] font-bold sm:inline-flex"
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
        );
        return bant ? <Band key={topic}>{govde}</Band> : govde;
      })}
      <PageClosing locale={locale} exclude={["guides"]} />
    </main>
  );
}
