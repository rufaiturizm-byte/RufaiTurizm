import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ReadingProgress } from "@/components/site/scroll-helpers";
import { ArticleSchema, BreadcrumbSchema } from "@/components/site/json-ld";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TableOfContents } from "@/components/site/table-of-contents";
import { headingId } from "@/lib/heading-id";
import { RouteCoverage } from "@/components/site/route-coverage";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { guides, guideBySlug } from "@/data/guides";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};

  const lang = locale as Locale;

  return {
    title: guide.title[lang] ?? guide.title.tr,
    description: guide.excerpt[lang] ?? guide.excerpt.tr,
    openGraph: { images: [guide.image] },
    alternates: alternatesFor({ pathname: "/guides/[slug]", params: { slug } }, locale),
  };
}

/**
 * Rehber yazısı.
 *
 * Düzen bilerek dar ve tek sütun: bu sayfaya gelen kişi gezmeye değil
 * OKUMAYA geldi, kart ızgarası ve yan sütun dikkati böler. Yazının
 * sonundaki çağrı da satış değil devam: okuduğu programı bize kurdurma
 * teklifi.
 */
export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const t = await getTranslations("guidesPage");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tCta = await getTranslations("cta");
  const lang = locale as Locale;

  const title = guide.title[lang] ?? guide.title.tr;
  const excerpt = guide.excerpt[lang] ?? guide.excerpt.tr;
  const url = getPathname({
    locale,
    href: { pathname: "/guides/[slug]", params: { slug } },
  });

  const toc = guide.sections.map((section, index) => ({
    id: headingId(section.heading[lang] ?? section.heading.tr, index),
    label: section.heading[lang] ?? section.heading.tr,
  }));

  const others = guides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <ReadingProgress />
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("guides"), url: getPathname({ locale, href: "/guides" }) },
          { name: title, url },
        ]}
      />
      <ArticleSchema
        headline={title}
        description={excerpt}
        image={guide.image}
        url={url}
        locale={locale}
      />

      {/* Kapak */}
      <section className="relative isolate">
        <Image
          src={guide.image}
          alt={title}
          fill
          priority
          sizes="100vw"
          quality={60}
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 scrim-x" />

        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <Breadcrumbs
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("guides"), href: "/guides" },
              { label: title },
            ]}
          />
          <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.14] tracking-[-0.01em] text-white sm:text-[44px]">
            {title}
          </h1>
          <p className="mt-4 text-[16px] leading-[1.8] text-white/78">{excerpt}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-semibold text-white/70">
            <Clock className="size-4" aria-hidden="true" />
            {guide.minutes} {t("minutes")}
          </div>
        </div>
      </section>

      {/* Gövde */}
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_210px]">
        <article>
        {/* Hızlı bilgiler: rehberi baştan sona okumaya vakti olmayan kişi
            mesafeyi, süreyi ve mevsimi burada tek bakışta alıyor. */}
        <dl className="mb-14 grid gap-4 sm:grid-cols-3">
          {guide.facts.map((fact, index) => (
            <div key={index} className="accent-card p-5">
              <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                {fact.label[lang] ?? fact.label.tr}
              </dt>
              <dd className="mt-2 text-[14.5px] font-bold leading-snug">
                {fact.value[lang] ?? fact.value.tr}
              </dd>
            </div>
          ))}
        </dl>

        {guide.sections.map((section, index) => (
          <section key={index} className={index > 0 ? "mt-14" : ""}>
            <h2
              id={headingId(section.heading[lang] ?? section.heading.tr, index)}
              className="scroll-mt-28 font-display text-[24px] font-semibold leading-snug sm:text-[28px]"
            >
              {section.heading[lang] ?? section.heading.tr}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.95] text-foreground/85">
              {section.body[lang] ?? section.body.tr}
            </p>

            {section.image ? (
              <figure className="mt-7">
                <div
                  className="relative aspect-[16/9] overflow-hidden"
                  style={{
                    borderRadius: "var(--radius-card)",
                    boxShadow: "var(--shadow-e2)",
                  }}
                >
                  <Image
                    src={section.image}
                    alt={section.imageAlt?.[lang] ?? section.imageAlt?.tr ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
                {section.imageAlt ? (
                  <figcaption className="mt-3 text-[12.5px] text-muted-foreground">
                    {section.imageAlt[lang] ?? section.imageAlt.tr}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </section>
        ))}

        {/* Yazı sonu çağrısı */}
        <div
          className="mt-14 flex flex-col gap-5 p-7 accent-card sm:p-8"
          style={{ boxShadow: "var(--shadow-e2)" }}
        >
          <h2 className="font-display text-[21px] font-semibold leading-snug">
            {t("ctaTitle")}
          </h2>
          <p className="text-[14.5px] leading-[1.8] text-muted-foreground">{t("ctaText")}</p>
          <WhatsAppLink
            subject={title}
            className="inline-flex w-fit items-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--brand-gold)",
              color: "var(--brand-night)",
              boxShadow: "var(--shadow-gold)",
            }}
          >
            <WhatsAppIcon className="size-[18px]" />
            {tCta("whatsapp")}
          </WhatsAppLink>
        </div>
        </article>

        <TableOfContents items={toc} label={tCommon("contents")} />
      </div>

      {/* Diğer rehberler */}
      <section
        className="border-t"
        style={{ background: "var(--brand-cream)", borderColor: "var(--hairline)" }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
            {t("relatedTitle")}
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {others.map((item) => {
              const itemTitle = item.title[lang] ?? item.title.tr;
              const href = {
                pathname: "/guides/[slug]" as const,
                params: { slug: item.slug },
              };

              return (
                <article key={item.slug} className="accent-card group overflow-hidden">
                  <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={itemTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5">
                    <h3 className="font-display text-[17px] font-semibold leading-snug">
                      <Link
                        href={href}
                        className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                      >
                        {itemTitle}
                      </Link>
                    </h3>
                    <Link
                      href={href}
                      className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold"
                      style={{ color: "var(--brand-gold-deep)" }}
                    >
                      {t("readCta")}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <RouteCoverage locale={locale} />
      <RelatedLinks exclude={["guides"]} />
      <CredentialsBand />
    </main>
  );
}
