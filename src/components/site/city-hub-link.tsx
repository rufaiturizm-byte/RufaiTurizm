import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { destinationBySlug } from "@/data/destinations";
import type { Locale } from "@/i18n/routing";

/**
 * Şehir merkezi sayfasına bağlanan şerit.
 *
 * NEDEN VAR. Bölge sayfaları açıldığında iç bağlantı tek yönlüydü:
 * /bolgeler/antalya turlara, paketlere ve güzergâhlara bağlanıyordu ama
 * onların hiçbiri geri dönmüyordu. Arama motoru bir sayfanın önemini
 * kendisine gelen bağlantılardan okuduğu için altı yeni sayfa, sitenin
 * en çok bağlantı alan sayfalarından (turlar, paketler) hiç pay almadan
 * duruyordu. Bu bileşen o yönü tersine çeviriyor: Antalya turunu okuyan
 * misafir "peki Antalya'da nerede kalınır" sorusunun cevabına buradan
 * gidiyor.
 *
 * Şehir bulunamazsa hiçbir şey basmıyor — veri eksikse sayfa bozulmasın.
 */
export async function CityHubLink({ city, locale }: { city: string; locale: string }) {
  const item = destinationBySlug(city);
  if (!item) return null;

  const t = await getTranslations("destinationsPage");
  const lang = locale as Locale;
  const name = item.name[lang] ?? item.name.tr;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <Link
        href={{ pathname: "/destinations/[city]", params: { city } }}
        className="group grid overflow-hidden sm:grid-cols-[minmax(0,1fr)_38%]"
        style={{
          borderRadius: "var(--radius-card)",
          background: "var(--surface)",
          boxShadow: "var(--edge-light), var(--shadow-e2)",
        }}
      >
        <div className="flex flex-col justify-center p-7 sm:p-9">
          <span
            className="text-[12.5px] font-bold"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            {t("hubEyebrow")}
          </span>
          <h2 className="mt-2.5 font-display text-[23px] font-semibold leading-snug sm:text-[27px]">
            {t("hubTitle", { city: name })}
          </h2>
          <p className="mt-3 max-w-xl text-[14.5px] leading-[1.8] text-muted-foreground">
            {item.tagline[lang] ?? item.tagline.tr}
          </p>
          <span
            className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            {t("hubCta", { city: name })}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Görsel mobilde gizli: 380 pikselde kart yükseklik kazanıyor ama
            hiçbir şey anlatmıyordu, metin ekranın altına iniyordu. */}
        <div className="relative hidden min-h-[190px] sm:block">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="38vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </section>
  );
}
