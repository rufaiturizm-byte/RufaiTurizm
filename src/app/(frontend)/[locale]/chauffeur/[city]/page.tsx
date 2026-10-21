import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Car, PlaneLanding } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema, FaqSchema } from "@/components/site/json-ld";
import { Band } from "@/components/site/band";
import { PageClosing } from "@/components/site/page-closing";
import { PageHero } from "@/components/site/page-hero";
import { ProseSection } from "@/components/site/prose-section";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { TrustBoxes } from "@/components/site/trust-stats";
import { VehicleList } from "@/components/site/vehicle-list";
import { chauffeurCities, chauffeurCityBySlug } from "@/data/chauffeur";
import { transferRouteBySlug } from "@/data/transfer-routes";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return chauffeurCities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const entry = chauffeurCityBySlug(city);
  if (!entry) return {};
  const lang = locale as Locale;

  return {
    title: entry.title[lang] ?? entry.title.tr,
    description: entry.intro[lang] ?? entry.intro.tr,
    alternates: alternatesFor({ pathname: "/chauffeur/[city]", params: { city } }, locale),
  };
}

/**
 * Şehir şehir şoförlü araç sayfası.
 *
 * NEDEN AYRI SAYFA. Hizmet sayfası "şoförlü Vito" diyor; misafir ise
 * "أنطاليا'da şoförlü araç" diye arıyor. İkisi aynı soru değil: ikincisi
 * o şehirdeki mesafeleri, yolu ve mevsimi soruyor.
 *
 * İÇERİK UYDURULMADI. Mesafeler ve süreler sitenin kendi güzergâh
 * verisinden, mevsim uyarıları paket programlarından geliyor. Fiyat
 * yazmıyor — tutar güne ve güzergâha göre değişiyor.
 *
 * Sayfa, aynı şehrin bölge sayfasına, havalimanı güzergâhlarına ve
 * günübirlik turuna bağlanıyor: üçü de aynı misafirin bir sonraki
 * sorusu ve hepsi zaten yazılı sayfalar.
 */
export default async function ChauffeurCityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  setRequestLocale(locale);

  const entry = chauffeurCityBySlug(city);
  if (!entry) notFound();

  const lang = locale as Locale;
  const text = (value: { tr: string; ar: string; en: string }) => value[lang] ?? value.tr;

  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const t = await getTranslations("chauffeur");
  const tRoutes = await getTranslations("transferPage");
  const tTours = await getTranslations("tours");

  const title = text(entry.title);
  const routes = entry.routeSlugs
    .map((slug) => transferRouteBySlug(slug))
    .filter((route): route is NonNullable<typeof route> => Boolean(route));

  return (
    <main id="main" className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("services"), url: getPathname({ locale, href: "/services" }) },
          {
            name: title,
            url: getPathname({
              locale,
              href: { pathname: "/chauffeur/[city]", params: { city } },
            }),
          },
        ]}
      />
      <FaqSchema
        items={entry.faq.map((item) => ({
          question: text(item.question),
          answer: text(item.answer),
        }))}
      />

      <PageHero
        image={entry.image}
        imageAlt={text(entry.name)}
        crumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("services"), href: "/services" },
          { label: title },
        ]}
        title={title}
        subtitle={text(entry.intro)}
      />

      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="flex flex-col gap-12">
            {entry.sections.map((section, i) => (
              <ProseSection
                key={section.heading.tr}
                title={text(section.heading)}
                body={text(section.body)}
                index={i}
                scale="run"
              />
            ))}
          </div>
        </div>
      </section>

      <VehicleList />

      {/* Havalimanı güzergâhları: aynı şehrin zaten yazılı sayfaları.
          Trabzon'da güzergâh sayfası yok, o yüzden blok hiç basılmıyor. */}
      {routes.length ? (
        <section className="section-y" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <h2 className="font-display text-[26px] font-semibold">{t("routesTitle")}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {routes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={{ pathname: "/transfer/[route]", params: { route: route.slug } }}
                    className="inline-flex items-center gap-2 text-[14.5px] font-semibold"
                    style={{ color: "var(--brand-gold-deep)" }}
                  >
                    <PlaneLanding className="size-4" aria-hidden="true" />
                    {text(route.from)} → {text(route.to)}
                    <span className="text-[13px] font-normal text-muted-foreground">
                      {text(route.duration)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14.5px]">
              <Link
                href="/transfer"
                className="inline-flex items-center gap-2 font-semibold"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                {tRoutes("title")}
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="font-display text-[26px] font-semibold">{t("faqTitle")}</h2>
          <dl className="mt-6 flex flex-col divide-y" style={{ borderColor: "var(--hairline)" }}>
            {entry.faq.map((item) => (
              <div key={item.question.tr} className="py-5">
                <dt className="text-[16px] font-semibold">{text(item.question)}</dt>
                <dd className="measure mt-2 text-[14.5px] leading-[1.8] text-muted-foreground">
                  {text(item.answer)}
                </dd>
              </div>
            ))}
          </dl>

          <div
            className="mt-10 border p-6 sm:p-8"
            style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}
          >
            <h2 className="font-display text-[22px] font-semibold">{t("askTitle")}</h2>
            <p className="measure mt-3 text-[14.5px] leading-[1.8] text-muted-foreground">
              {t("askText")}
            </p>
            <WhatsAppLink
              subject={title}
              className="btn-wa mt-6 inline-flex items-center gap-2.5 rounded-[0.625rem] px-6 py-3.5 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              {tCta("whatsapp")}
            </WhatsAppLink>
          </div>

          <div className="mt-10 flex flex-wrap gap-5 text-[14px] font-semibold">
            <Link
              href={{ pathname: "/destinations/[city]", params: { city: entry.destinationSlug } }}
              className="inline-flex items-center gap-2"
              style={{ color: "var(--brand-gold-deep)" }}
            >
              <Car className="size-4" aria-hidden="true" />
              {t("destinationLink", { city: text(entry.name) })}
            </Link>
            {entry.tourSlug ? (
              <Link
                href={{ pathname: "/tours/[slug]", params: { slug: entry.tourSlug } }}
                className="inline-flex items-center gap-2"
                style={{ color: "var(--brand-gold-deep)" }}
              >
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                {tTours(`${entry.slug}.name`)}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <TrustBoxes />
      <PageClosing locale={locale} exclude={["services"]} />
      <Band>
        <p className="text-[14px]">{t("bandNote")}</p>
      </Band>
    </main>
  );
}
