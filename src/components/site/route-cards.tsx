import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock, Route as RouteIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { transferRoutes } from "@/data/transfer-routes";
import type { Locale } from "@/i18n/routing";

/**
 * Popüler güzergâh kartları.
 *
 * Güzergâh sayfaları yalnız sitemap'te dursa arama motoru onlara ulaşır ama
 * ziyaretçi ulaşamaz; iç bağlantısı olmayan sayfa sitenin bir parçası
 * sayılmaz. Bu blok transfer sayfasında ve ana sayfada duruyor.
 */
export async function RouteCards({ locale }: { locale: string }) {
  const t = await getTranslations("routePage");
  const lang = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {transferRoutes.map((route) => {
          const title = `${route.from[lang] ?? route.from.tr} → ${route.to[lang] ?? route.to.tr}`;
          const href = {
            pathname: "/transfer/[route]" as const,
            params: { route: route.slug },
          };

          return (
            <article key={route.slug} className="accent-card group flex flex-col overflow-hidden">
              <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={route.image}
                  alt={route.to[lang] ?? route.to.tr}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute start-3 top-3 rounded-[0.4rem] px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                >
                  {route.airport}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[17px] font-semibold leading-snug">
                  <Link
                    href={href}
                    className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {title}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                  {route.excerpt[lang] ?? route.excerpt.tr}
                </p>

                <div
                  className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3.5 text-[12.5px] text-muted-foreground"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RouteIcon className="size-3.5" aria-hidden="true" />
                    {route.distance[lang] ?? route.distance.tr}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {route.duration[lang] ?? route.duration.tr}
                  </span>
                </div>

                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  {t("allRoutes")}
                  <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
