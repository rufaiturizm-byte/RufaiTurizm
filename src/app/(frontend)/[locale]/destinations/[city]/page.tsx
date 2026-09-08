import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock, MapPin, Route as RouteIcon } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { TrustBoxes } from "@/components/site/trust-stats";
import { BreadcrumbSchema, FaqSchema, TouristTripSchema } from "@/components/site/json-ld";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { PromoBanner } from "@/components/site/promo-banner";
import { ClosingCta } from "@/components/site/transfer-sections";
import { RelatedLinks } from "@/components/site/related-links";
import { CredentialsBand } from "@/components/site/credentials-band";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { headingId } from "@/lib/heading-id";
import { destinations, destinationBySlug } from "@/data/destinations";
import { tourBySlug } from "@/data/tours";
import { packageBySlug } from "@/data/packages";
import { guideBySlug } from "@/data/guides";
import { transferRouteBySlug } from "@/data/transfer-routes";
import { routeTitle } from "@/lib/route-title";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return destinations.map((item) => ({ city: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const item = destinationBySlug(city);
  if (!item) return {};
  const lang = locale as Locale;

  return {
    title: item.seo?.title?.[lang] ?? item.name[lang] ?? item.name.tr,
    description: item.seo?.description?.[lang] ?? item.tagline[lang] ?? item.tagline.tr,
    openGraph: { images: [item.image] },
    alternates: alternatesFor({ pathname: "/destinations/[city]", params: { city } }, locale),
  };
}

/**
 * Şehir merkezi sayfası.
 *
 * Rakiplerde her şehir için ayrı "turlar", "oteller" ve "programlar"
 * sayfası var. Biz altı şehir × üç hizmet = on sekiz ince sayfa yerine
 * altı DERİN sayfa yaptık: şehirde sunduğumuz her şey burada toplanıyor
 * ve ilgili sayfalara bağlanıyor (bkz. data/destinations.ts).
 */
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  setRequestLocale(locale);

  const item = destinationBySlug(city);
  if (!item) notFound();

  const t = await getTranslations("destinationsPage");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const tTours = await getTranslations("tours");
  const tToursPage = await getTranslations("toursPage");
  const lang = locale as Locale;

  const name = item.name[lang] ?? item.name.tr;
  const tagline = item.tagline[lang] ?? item.tagline.tr;
  const url = getPathname({ locale, href: { pathname: "/destinations/[city]", params: { city } } });

  const faqItems = item.faq.map((entry) => ({
    question: entry.question[lang] ?? entry.question.tr,
    answer: entry.answer[lang] ?? entry.answer.tr,
  }));

  const tour = item.tourSlug ? tourBySlug(item.tourSlug) : undefined;
  const pack = item.packageSlug ? packageBySlug(item.packageSlug) : undefined;
  const guides = item.guideSlugs.map(guideBySlug).filter((g) => g !== undefined);
  const routes = item.routeSlugs.map(transferRouteBySlug).filter((r) => r !== undefined);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: t("title"), url: getPathname({ locale, href: "/destinations" }) },
          { name, url },
        ]}
      />
      <TouristTripSchema
        name={name}
        description={item.intro[lang] ?? item.intro.tr}
        image={item.image}
        {...(tour ? { geo: { lat: tour.geo.lat, lng: tour.geo.lng, name } } : {})}
      />

      <PageHero
        image={item.image}
        imageAlt={name}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: t("title"), href: "/destinations" },
          { label: name },
        ]}
        title={name}
        subtitle={tagline}
      />

      <div className="pt-12">
        <TrustBoxes />
      </div>

      {/* Giriş + hızlı bilgiler */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        {/*
          Bilgi kartları tek sütun değil ikişerli.
          Tek sütunda dört kart alt alta 380 piksel tutuyordu, giriş
          paragrafı ise 220; sağ sütun bittiğinde solda 160 piksellik
          boş bir alan kalıyor, sayfa oraya bakınca yarım görünüyordu.
          İkişerli dizilişte iki sütunun boyu birbirine yakın.
        */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <p className="text-[17px] leading-[1.95] font-medium text-foreground/90">
            {item.intro[lang] ?? item.intro.tr}
          </p>

          <dl className="grid gap-3 self-start sm:grid-cols-2">
            {item.facts.map((fact) => (
              <div key={fact.label.tr} className="accent-card p-5">
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {fact.label[lang] ?? fact.label.tr}
                </dt>
                <dd className="mt-2 text-[14.5px] font-bold leading-snug">
                  {fact.value[lang] ?? fact.value.tr}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bölümler */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-8 sm:px-8">
        {item.sections.map((section, index) => {
          const heading = section.heading[lang] ?? section.heading.tr;
          return (
            <div key={index} className={index > 0 ? "mt-16" : ""}>
              <div
                className={`grid gap-8 lg:items-center lg:gap-14 ${
                  section.image ? "lg:grid-cols-2" : ""
                }`}
              >
                {/*
                  Görselsiz bölümde metin okuma genişliğiyle sınırlanıyor.
                  Görselli bölümde zaten yarım sütun, ama görselsizde
                  paragraf 1280 piksel boyunca uzuyordu: satır başına
                  yüz elli karakter, gözün satır sonundan bir sonrakinin
                  başına dönmesi zorlaşıyor. 68ch rahat okunan ölçü.
                */}
                <div className={section.image ? (index % 2 === 1 ? "lg:order-2" : "") : "max-w-[68ch]"}>
                  <h2
                    id={headingId(heading, index)}
                    className="scroll-mt-28 font-display text-[26px] font-semibold leading-snug sm:text-[32px]"
                  >
                    {heading}
                  </h2>
                  <p className="mt-5 text-[15.5px] leading-[1.95] text-foreground/85">
                    {section.body[lang] ?? section.body.tr}
                  </p>
                </div>

                {section.image ? (
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-card)",
                      boxShadow: "var(--shadow-e3)",
                    }}
                  >
                    <Image
                      src={section.image}
                      alt={section.imageAlt?.[lang] ?? section.imageAlt?.tr ?? heading}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>

      {/* Kampanya bandı — gerçek kampanya yokken hiç render edilmez */}
      <div className="pt-8">
        <PromoBanner placement={`destination:${item.slug}`} locale={locale} />
      </div>

      {/* Şehirde sunduklarımız */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
        <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
          {t("offerTitle", { city: name })}
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tour ? (
            <article className="accent-card group flex flex-col overflow-hidden">
              <Link
                href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
                className="relative block aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={tour.image}
                  alt={tTours(`${tour.key}.name`)}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {tNav("tours")}
                </span>
                <h3 className="mt-2 font-display text-[18px] font-semibold leading-snug">
                  <Link
                    href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
                    className="inline-block py-0.5 transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {tTours(`${tour.key}.name`)}
                  </Link>
                </h3>
                <div className="mt-2 flex flex-1 items-start gap-3 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {tour.durationHours} {tToursPage("hours")}
                  </span>
                </div>
              </div>
            </article>
          ) : null}

          {pack ? (
            <article className="accent-card group flex flex-col overflow-hidden">
              <Link
                href={{ pathname: "/packages/[slug]", params: { slug: pack.slug } }}
                className="relative block aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={pack.image}
                  alt={pack.name[lang] ?? pack.name.tr}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {tNav("packages")}
                </span>
                <h3 className="mt-2 font-display text-[18px] font-semibold leading-snug">
                  <Link
                    href={{ pathname: "/packages/[slug]", params: { slug: pack.slug } }}
                    className="inline-block py-0.5 transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {pack.name[lang] ?? pack.name.tr}
                  </Link>
                </h3>
                <div className="mt-2 flex-1 text-[13px] text-muted-foreground">
                  {pack.days} {t("days")}
                </div>
              </div>
            </article>
          ) : null}

          {guides.map((guide) => (
            <article key={guide.slug} className="accent-card group flex flex-col overflow-hidden">
              <Link
                href={{ pathname: "/guides/[slug]", params: { slug: guide.slug } }}
                className="relative block aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={guide.image}
                  alt={guide.title[lang] ?? guide.title.tr}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {tNav("guides")}
                </span>
                <h3 className="mt-2 font-display text-[18px] font-semibold leading-snug">
                  <Link
                    href={{ pathname: "/guides/[slug]", params: { slug: guide.slug } }}
                    className="inline-block py-0.5 transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {guide.title[lang] ?? guide.title.tr}
                  </Link>
                </h3>
              </div>
            </article>
          ))}
        </div>

        {/* Transfer güzergâhları — kart değil liste: bu sayfada dört tane
            daha kart göstermek bölümü kalabalıklaştırıyordu. */}
        {routes.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-display text-[19px] font-semibold">{t("routesTitle")}</h3>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {routes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={{ pathname: "/transfer/[route]", params: { route: route.slug } }}
                    className="group flex items-center justify-between gap-3 border-b py-3.5 text-[14px] font-semibold transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <RouteIcon
                        className="size-3.5 shrink-0"
                        style={{ color: "var(--brand-gold-deep)" }}
                        aria-hidden="true"
                      />
                      {routeTitle(
                        route.from[lang] ?? route.from.tr,
                        route.to[lang] ?? route.to.tr,
                        locale,
                      )}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      style={{ color: "var(--brand-gold-deep)" }}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.hotelAreaKeys?.length ? (
          <Link
            href="/hotels"
            className="mt-8 inline-flex items-center gap-2 py-1 text-[14px] font-bold"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            <MapPin className="size-4" aria-hidden="true" />
            {t("hotelsLink", { city: name })}
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        ) : null}
      </section>

      {/* Soru-cevap */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-14 pb-20 sm:px-8">
        <FaqSchema items={faqItems} />
        <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
          {t("faqTitle", { city: name })}
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <FaqAccordion items={faqItems} />

          <aside
            className="p-7 lg:sticky lg:top-24"
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-panel-lift)",
              border: "1px solid color-mix(in oklab, var(--brand-gold) 34%, transparent)",
            }}
          >
            <h3 className="font-display text-[19px] font-semibold leading-snug">
              {t("askTitle", { city: name })}
            </h3>
            <p className="mt-3 text-[13.5px] leading-[1.8] text-muted-foreground">
              {t("askText")}
            </p>
            <WhatsAppLink
              subject={name}
              className="btn-wa mt-6 flex items-center justify-center gap-2.5 rounded-[0.8rem] py-3.5 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-[18px]" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </aside>
        </div>
      </section>

      <ClosingCta locale={locale} />
      <RelatedLinks />
      <CredentialsBand />
    </main>
  );
}
