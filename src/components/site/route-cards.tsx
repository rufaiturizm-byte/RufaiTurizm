import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock, Route as RouteIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { transferRoutes } from "@/data/transfer-routes";
import type { Locale } from "@/i18n/routing";
import { routeTitle } from "@/lib/route-title";

/**
 * Popüler güzergâh kartları.
 *
 * Güzergâh sayfaları yalnız sitemap'te dursa arama motoru onlara ulaşır ama
 * ziyaretçi ulaşamaz; iç bağlantısı olmayan sayfa sitenin bir parçası
 * sayılmaz. Bu blok transfer sayfasında ve ana sayfada duruyor.
 */
export async function RouteCards({
  locale,
  limit,
}: {
  locale: string;
  /**
   * Kaç kart gösterilecek.
   *
   * Güzergâh sayısı Antalya ve Bodrum eklenince yediden on üçe çıktı.
   * Transfer sayfasında hepsi anlamlı — ziyaretçi oraya zaten güzergâh
   * aramaya geliyor. Ana sayfada on üç kart, sayfanın geri kalanını
   * ezen bir blok olurdu; orada sekiz tane duruyor ve devamı transfer
   * sayfasında.
   */
  limit?: number;
}) {
  const t = await getTranslations("routePage");
  const tCommon = await getTranslations("common");
  const lang = locale as Locale;
  const shown = limit ? transferRoutes.slice(0, limit) : transferRoutes;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
      />

      {/*
        Telefonda iki sütun. Tek sütunda on dört kart 6.844 piksel
        tutuyordu — 844 piksellik bir ekranda sekiz ekran boyu, yalnız
        bu bölüm için. İki sütun bunu yarıya indiriyor ve altındaki
        bölümler (araçlar, sık sorulanlar) ulaşılabilir mesafeye geliyor.
      */}
      <div className="grid gap-3.5 grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {shown.map((route) => {
          const title = routeTitle(route.from[lang] ?? route.from.tr, route.to[lang] ?? route.to.tr, locale);
          const href = {
            pathname: "/transfer/[route]" as const,
            params: { route: route.slug },
          };

          return (
            <article key={route.slug} className="reveal-rise accent-card group flex flex-col overflow-hidden">
              <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={route.image}
                  /* Alan varsa o kullanılır: kartın fotoğrafı her zaman varış
                     noktasının kendisi değil (Taksim güzergâhında Boğaz
                     köprüsü, Belek'te Kaleiçi limanı). Alt metnin varış adını
                     tekrar etmesi hem yanlış oluyordu hem de ekran okuyucuya
                     hemen altındaki başlığı ikinci kez okutuyordu. */
                  alt={route.imageAlt?.[lang] ?? route.imageAlt?.tr ?? route.to[lang] ?? route.to.tr}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute start-3 top-3 rounded-[0.375rem] px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                >
                  {route.airport}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[17px] font-semibold leading-snug">
                  <Link
                    href={href}
                    className="inline-block py-0.5 transition-colors hover:text-[color:var(--brand-gold-deep)]"
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
                  className="mt-3 inline-flex py-1.5 items-center gap-2 text-[13px] font-bold"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  {/* Bu bağlantı TEK bir güzergâha gidiyor; önceki hali
                      "Tüm güzergâhlar" diyordu. On dört kartın hepsinde aynı
                      yanıltıcı metin vardı ve ekran okuyucu on dört farklı
                      sayfaya giden on dört "Tüm güzergâhlar" bağlantısı
                      duyuruyordu. */}
                  {tCommon("details")}
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
