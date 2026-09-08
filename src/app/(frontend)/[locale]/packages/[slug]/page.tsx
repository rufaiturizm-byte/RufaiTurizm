import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarDays, Check, Info, MapPin, Sparkles } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BreadcrumbSchema, FaqSchema, TouristTripSchema } from "@/components/site/json-ld";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { AssuranceBand } from "@/components/site/assurance-band";
import { ClosingCta } from "@/components/site/transfer-sections";
import { CredentialsBand } from "@/components/site/credentials-band";
import { RelatedLinks } from "@/components/site/related-links";
import { CityHubLink } from "@/components/site/city-hub-link";
import { packages, packageBySlug, relatedPackages } from "@/data/packages";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return packages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = packageBySlug(slug);
  if (!item) return {};

  const lang = locale as Locale;

  return {
    title: item.name[lang] ?? item.name.tr,
    description: item.excerpt[lang] ?? item.excerpt.tr,
    openGraph: { images: [item.image] },
    alternates: alternatesFor({ pathname: "/packages/[slug]", params: { slug } }, locale),
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = packageBySlug(slug);
  if (!item) notFound();

  const t = await getTranslations("packages");
  const tNav = await getTranslations("nav");
  const tIncluded = await getTranslations("included");
  const tCommon = await getTranslations("common");
  const lang = locale as Locale;

  const name = item.name[lang] ?? item.name.tr;
  const excerpt = item.excerpt[lang] ?? item.excerpt.tr;
  /* Kaydırmalı: her paket listeye farklı bir yerden başlasın, yoksa
     dizinin sonundaki paketler hiç bağlantı almıyor. */
  const others = relatedPackages(item.slug);
  const faqItems = item.faq.map((entry) => ({
    question: entry.question[lang] ?? entry.question.tr,
    answer: entry.answer[lang] ?? entry.answer.tr,
  }));

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: t("title"), url: getPathname({ locale, href: "/packages" }) },
          {
            name,
            url: getPathname({ locale, href: { pathname: "/packages/[slug]", params: { slug } } }),
          },
        ]}
      />
      {/* Fiyat bilerek verilmiyor: sezona ve kişi sayısına göre değişiyor,
          sabit bir rakam sitenin "fiyat rezervasyonda netleşir" sözünü
          bozardı. Şema da fiyatsız geçerli. */}
      {/* Gün gün program şemaya da giriyor: sayfada zaten yazılı ama
          makineye verdiğimiz özet yalnız ad ve açıklamadan ibaretti. */}
      <TouristTripSchema
        name={name}
        description={excerpt}
        image={item.image}
        itinerary={item.itinerary.map((day) => day.title[lang] ?? day.title.tr)}
      />

      <section className="relative isolate">
        <Image
          src={item.image}
          alt={name}
          fill
          priority
          sizes="100vw"
          quality={60}
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 scrim-x" />
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Breadcrumbs
            items={[
              { label: tNav("home"), href: "/" },
              { label: t("title"), href: "/packages" },
              { label: name },
            ]}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold"
              style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
            >
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {item.days} {t("days")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80">
              <MapPin className="size-3.5" aria-hidden="true" />
              {item.city[lang] ?? item.city.tr}
            </span>
          </div>

          <h1 className="mt-4 max-w-2xl font-display text-[34px] font-semibold leading-[1.12] tracking-[-0.01em] text-white sm:text-[46px]">
            {name}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-white/78">{excerpt}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pt-20 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-[26px] font-semibold sm:text-[30px]">
              {t("itineraryTitle")}
            </h2>

            {/* Gün gün liste. Rakiplerin en güçlü olduğu yer burası: hazır
                program arayan misafir günlerin içini görmek istiyor. */}
            <ol className="mt-8 flex flex-col gap-5">
              {item.itinerary.map((day, index) => (
                <li key={index} className="accent-card flex gap-5 p-6">
                  <div className="flex shrink-0 flex-col items-center">
                    <span className="step-badge size-11 text-[14px] font-extrabold">
                      {index + 1}
                    </span>
                    <span className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                      {t("dayLabel")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-[18px] font-semibold leading-snug">
                      {day.title[lang] ?? day.title.tr}
                    </h3>
                    <p className="measure mt-2.5 text-[14.5px] leading-[1.85] text-foreground/80">
                      {day.body[lang] ?? day.body.tr}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 font-display text-[24px] font-semibold sm:text-[28px]">
              {t("includedTitle")}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {item.includes.map((key) => (
                <li key={key} className="flex items-start gap-3 text-[14.5px] leading-snug">
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  {tIncluded(key)}
                </li>
              ))}
            </ul>

            {/* Programa özel soru-cevap. Sorular /sss ve hizmet
                sayfalarındakilerle çakışmıyor, o yüzden FAQPage şeması
                burada da duruyor — sayfa başına tek şema kuralı bozulmadan. */}
            <h2 className="mt-14 font-display text-[24px] font-semibold sm:text-[28px]">
              {t("faqTitle")}
            </h2>
            <div className="mt-6">
              <FaqSchema items={faqItems} />
              <FaqAccordion items={faqItems} />
            </div>

            <div
              className="mt-8 flex items-start gap-4 rounded-[var(--radius-card)] border px-6 py-5"
              style={{
                background: "color-mix(in oklab, var(--brand-sky) 12%, transparent)",
                borderColor: "color-mix(in oklab, var(--brand-sky) 34%, transparent)",
              }}
            >
              <Sparkles
                className="mt-0.5 size-5 shrink-0"
                style={{ color: "var(--brand-gold-deep)" }}
                aria-hidden="true"
              />
              <div>
                <h3 className="text-[15px] font-bold">{t("flexTitle")}</h3>
                <p className="measure-wide mt-2 text-[14px] leading-[1.8] text-foreground/80">
                  {t("flexText")}
                </p>
              </div>
            </div>
          </div>

          <aside
            className="h-fit rounded-[var(--radius-card)] border p-6 lg:sticky lg:top-24"
            style={{
              background: "var(--surface)",
              borderColor: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
              boxShadow: "var(--shadow-panel-lift)",
            }}
          >
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              <Info className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
              {t("priceTitle")}
            </div>
            <div className="mt-2.5 text-[19px] font-bold leading-snug">
              {tCommon("priceOnRequest")}
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.8] text-muted-foreground">
              {t("priceText")}
            </p>

            <WhatsAppLink
              subject={name}
              className="btn-wa mt-6 flex items-center justify-center gap-2.5 rounded-[0.8rem] py-4 text-[15px] font-bold"
            >
              <WhatsAppIcon className="size-5" />
              {t("askPrice")}
            </WhatsAppLink>

            <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--hairline)" }}>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                {t("cityLabel")}
              </div>
              <div className="mt-1.5 text-[14px] font-semibold">
                {item.city[lang] ?? item.city.tr}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Diğer paketler */}
      <section
        className="border-t"
        style={{ background: "var(--brand-cream)", borderColor: "var(--hairline)" }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
            {t("relatedTitle")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {others.map((other) => {
              const otherName = other.name[lang] ?? other.name.tr;
              const href = {
                pathname: "/packages/[slug]" as const,
                params: { slug: other.slug },
              };
              return (
                <article key={other.slug} className="accent-card group flex flex-col overflow-hidden">
                  <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={other.image}
                      alt={otherName}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-[11.5px] font-bold text-muted-foreground">
                      {other.days} {t("days")}
                    </div>
                    <h3 className="mt-2 font-display text-[17px] font-semibold leading-snug">
                      <Link
                        href={href}
                        className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                      >
                        {otherName}
                      </Link>
                    </h3>
                    <Link
                      href={href}
                      className="mt-4 inline-flex w-fit items-center gap-2 py-1.5 text-[13px] font-bold"
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
        </div>
      </section>

      <CityHubLink city={item.destinationSlug} locale={locale} />
      <AssuranceBand />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["packages"]} />
      <CredentialsBand />
    </main>
  );
}
