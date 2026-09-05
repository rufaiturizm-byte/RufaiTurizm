import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MapPinned } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Link } from "@/i18n/navigation";
import { tours } from "@/data/tours";

/**
 * Destinasyon şeridi.
 *
 * Önce kayan bir yazı şeridiydi. Şehir adları tek başına akarken bant
 * sayfada bir ayraçtan ibaretti; oysa burası ziyaretçinin "nerelere
 * gidiyorlar" sorusunun cevabını aldığı yer ve elimizde o şehirlerin
 * fotoğrafları duruyor. Fotoğraflı kartlarda hem kapsam görünüyor hem
 * kartlar tıklanabilir: şerit artık tur sayfalarına giden bir yol.
 *
 * Kartlar iki kez basılıyor (Marquee `repeat`) — tek turda şerit ekranı
 * dolduramayıp boşluk bırakıyordu.
 */
export async function DestinationsMarquee() {
  const t = await getTranslations("tours");
  const tPage = await getTranslations("transferPage");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <section
      className="overflow-hidden border-y py-12"
      style={{
        background: "var(--brand-night)",
        borderColor: "color-mix(in oklab, white 8%, transparent)",
      }}
    >
      <div className="mx-auto mb-8 flex max-w-7xl items-center gap-3 px-5 sm:px-8">
        <span className="icon-tile size-10 shrink-0" aria-hidden="true">
          <MapPinned className="size-[18px]" />
        </span>
        <div
          className="eyebrow-rule flex items-center text-[11px] font-extrabold uppercase tracking-[0.22em]"
          style={{ color: "var(--brand-gold-label)" }}
        >
          {tEyebrow("cities")}
        </div>
        <span className="ms-auto hidden text-[13.5px] text-white/55 sm:block">
          {tPage("citiesSubtitle")}
        </span>
      </div>

      <div className="marquee-fade">
        <Marquee pauseOnHover repeat={3} className="[--duration:46s] [--gap:1.25rem]">
          {tours.map((tour) => (
            <Link
              key={tour.key}
              href={{ pathname: "/tours/[slug]", params: { slug: tour.slug } }}
              className="group relative block h-[176px] w-[280px] shrink-0 overflow-hidden"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <Image
                src={tour.image}
                alt={t(`${tour.key}.name`)}
                fill
                sizes="280px"
                /* Kartlar CSS ile kaydırılıyor, sayfa kaydırılmıyor: tembel
                   yükleme gözlemcisi dönüşümle gelen kartlarda güvenilir
                   tetiklenmiyor ve kart boş bir dikdörtgen olarak geçiyordu.
                   Beş ayrı dosya var, üçü tekrarlanıyor — maliyeti yok. */
                loading="eager"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--brand-night) 88%, transparent) 0%, color-mix(in oklab, var(--brand-night) 30%, transparent) 46%, transparent 100%)",
                }}
              />
              <div className="absolute inset-x-4 bottom-3.5">
                <div className="font-display text-[20px] font-semibold text-white">
                  {t(`${tour.key}.city`)}
                </div>
                <div
                  className="mt-0.5 text-[11.5px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--brand-gold-label)" }}
                >
                  {t(`${tour.key}.name`)}
                </div>
              </div>
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
