import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock, PlaneLanding, Route as RouteIcon } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/site/json-ld";
import { TransferForm } from "@/components/site/transfer-form";
import { TrustBoxes } from "@/components/site/trust-stats";
import { VehicleList } from "@/components/site/vehicle-list";
import { RouteCoverage } from "@/components/site/route-coverage";
import { RelatedLinks } from "@/components/site/related-links";
import { CredentialsBand } from "@/components/site/credentials-band";
import { FaqPreview } from "@/components/site/faq-preview";
import { ClosingCta } from "@/components/site/transfer-sections";
import { WhatsAppLink } from "@/components/site/whatsapp-cta";
import { WhatsAppIcon } from "@/components/site/icons";
import { transferRoutes, transferRouteBySlug } from "@/data/transfer-routes";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return transferRoutes.map((route) => ({ route: route.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; route: string }>;
}): Promise<Metadata> {
  const { locale, route: slug } = await params;
  const route = transferRouteBySlug(slug);
  if (!route) return {};

  const lang = locale as Locale;
  const from = route.from[lang] ?? route.from.tr;
  const to = route.to[lang] ?? route.to.tr;

  return {
    title: `${from} → ${to}`,
    description: `${route.excerpt[lang] ?? route.excerpt.tr} ${route.distance[lang] ?? route.distance.tr}, ${route.duration[lang] ?? route.duration.tr}.`,
    openGraph: { images: [route.image] },
    alternates: alternatesFor({ pathname: "/transfer/[route]", params: { route: slug } }, locale),
  };
}

/**
 * Güzergâh sayfası.
 *
 * Transfer sayfası "havalimanı transferi" aramasını karşılıyor ama müşteri
 * çoğu zaman güzergâhı arıyor: "مطار اسطنبول الى تقسيم". Bu sayfalar o
 * aramaların indiği yer.
 *
 * Her güzergâhın kendi metni var; şablondan üretilmiş değiller. Anlatacak
 * ayrı şeyi olmayan bir güzergâh (mesafesi ve hikâyesi bir diğerinin aynısı
 * olan) bu listeye hiç girmiyor — bkz. `data/transfer-routes.ts`.
 */
export default async function TransferRoutePage({
  params,
}: {
  params: Promise<{ locale: string; route: string }>;
}) {
  const { locale, route: slug } = await params;
  setRequestLocale(locale);

  const route = transferRouteBySlug(slug);
  if (!route) notFound();

  const t = await getTranslations("routePage");
  const tNav = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const lang = locale as Locale;

  const from = route.from[lang] ?? route.from.tr;
  const to = route.to[lang] ?? route.to.tr;
  const title = `${from} → ${to}`;
  const others = transferRoutes.filter((item) => item.slug !== route.slug);

  const facts = [
    { icon: PlaneLanding, label: t("airport"), value: route.airport },
    { icon: RouteIcon, label: t("distance"), value: route.distance[lang] ?? route.distance.tr },
    { icon: Clock, label: t("duration"), value: route.duration[lang] ?? route.duration.tr },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: getPathname({ locale, href: "/" }) },
          { name: tNav("transfer"), url: getPathname({ locale, href: "/transfer" }) },
          {
            name: title,
            url: getPathname({
              locale,
              href: { pathname: "/transfer/[route]", params: { route: slug } },
            }),
          },
        ]}
      />

      <section className="relative isolate">
        <Image
          src={route.image}
          alt={to}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 scrim-x" />

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="text-[12.5px] text-white/60">
            {tNav("home")} · {tNav("transfer")}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.01em] text-white sm:text-[46px]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-white/78">
            {route.excerpt[lang] ?? route.excerpt.tr}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-5 sm:px-8">
        <TransferForm />
      </section>

      <div className="pt-12">
        <TrustBoxes />
      </div>

      <section className="mx-auto w-full max-w-3xl px-5 pt-20 pb-20 sm:px-8">
        <dl className="mb-14 grid gap-4 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="accent-card p-5">
              <dt className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                <Icon className="size-3.5" style={{ color: "var(--brand-gold-deep)" }} aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-2 text-[14.5px] font-bold leading-snug">{value}</dd>
            </div>
          ))}
        </dl>

        {route.sections.map((section, index) => (
          <section key={index} className={index > 0 ? "mt-14" : ""}>
            <h2 className="font-display text-[24px] font-semibold leading-snug sm:text-[28px]">
              {section.heading[lang] ?? section.heading.tr}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.95] text-foreground/85">
              {section.body[lang] ?? section.body.tr}
            </p>
          </section>
        ))}

        <p className="mt-10 text-[13px] leading-[1.8] text-muted-foreground">{t("note")}</p>

        <div className="mt-10 flex flex-col gap-5 p-7 accent-card sm:p-8">
          <h2 className="font-display text-[21px] font-semibold leading-snug">{t("ctaTitle")}</h2>
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
      </section>

      <VehicleList />

      {/* Diğer güzergâhlar — sayfalar arası bağ hem ziyaretçi hem tarama için */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
          {t("otherRoutes")}
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => {
            const itemTitle = `${item.from[lang] ?? item.from.tr} → ${item.to[lang] ?? item.to.tr}`;
            const href = {
              pathname: "/transfer/[route]" as const,
              params: { route: item.slug },
            };

            return (
              <article key={item.slug} className="accent-card group overflow-hidden">
                <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.to[lang] ?? item.to.tr}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute start-3 top-3 rounded-[0.4rem] px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                  >
                    {item.airport}
                  </span>
                </Link>
                <div className="p-5">
                  <h3 className="text-[14.5px] font-bold leading-snug">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {itemTitle}
                    </Link>
                  </h3>
                  <div className="mt-2 text-[12.5px] text-muted-foreground">
                    {item.duration[lang] ?? item.duration.tr}
                  </div>
                  <Link
                    href={href}
                    className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold"
                    style={{ color: "var(--brand-gold-deep)" }}
                  >
                    {t("distance")}: {item.distance[lang] ?? item.distance.tr}
                    <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <RouteCoverage locale={locale} />
      <FaqPreview />
      <ClosingCta locale={locale} />
      <RelatedLinks exclude={["transfer"]} />
      <CredentialsBand />
    </main>
  );
}
