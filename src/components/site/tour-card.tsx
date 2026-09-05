import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "./whatsapp-cta";
import type { Tour } from "@/data/tours";

/**
 * Tur kartı.
 *
 * Fiyat bloğu referanstaki düzende: küçük "Başlangıç fiyatı" satırı, altında
 * altın renkli büyük rakam ve yanında ikincil rakam. İkincil rakam bizde
 * USD karşılığı — Körfez müşterisi dolarla düşünüyor (rakip analizi, madde 4).
 * Turun `priceListFrom` alanı doldurulursa aynı yerde üstü çizili liste
 * fiyatı görünür; boşken hiç basılmaz, çünkü sürekli duran sahte bir
 * "indirimden önceki fiyat" güveni kırar.
 *
 * Kart sarmalayıcısı bilerek <article>: WhatsApp düğmesi iç içe bağlantı
 * olmasın diye başlık ve düğme ayrı ayrı bağlantı.
 */
export async function TourCard({ tour }: { tour: Tour }) {
  const t = await getTranslations("tours");
  const tPage = await getTranslations("toursPage");
  const tCommon = await getTranslations("common");
  const tCta = await getTranslations("cta");

  const name = t(`${tour.key}.name`);
  const href = { pathname: "/tours/[slug]" as const, params: { slug: tour.slug } };

  return (
    <article className="group flex flex-col overflow-hidden surface-card surface-card-lift">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute start-3 top-3 rounded-[0.4rem] px-2.5 py-1 text-[11.5px] font-bold"
          style={{
            background: "var(--brand-gold)",
            color: "var(--brand-night)",
            boxShadow: "var(--shadow-e1)",
          }}
        >
          {t(`${tour.key}.city`)}
        </span>
        <span
          className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-black"
          style={{ boxShadow: "var(--shadow-e1)" }}
        >
          <Clock className="size-3" aria-hidden="true" />
          {tour.durationHours} {tPage("hours")}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] font-semibold leading-snug">
          <Link href={href} className="transition-colors hover:text-[color:var(--brand-gold-deep)]">
            {name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
          {t(`${tour.key}.description`)}
        </p>

        <div className="mt-4 border-t pt-3.5" style={{ borderColor: "var(--hairline)" }}>
          <div className="text-[11.5px] text-muted-foreground">{t("from")}</div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span
              className="text-[24px] font-extrabold leading-none"
              style={{ color: "var(--brand-gold-deep)" }}
            >
              €{tour.priceFrom}
            </span>
            {tour.priceListFrom ? (
              <span className="text-[14px] text-muted-foreground line-through">
                €{tour.priceListFrom}
              </span>
            ) : (
              <span className="text-[14px] text-muted-foreground">≈ ${tour.priceUsdFrom}</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-[0.6rem] border py-3 text-[13px] font-semibold transition-colors hover:bg-secondary"
            style={{ borderColor: "color-mix(in oklab, var(--brand-night) 15%, transparent)" }}
          >
            {tCommon("details")}
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <WhatsAppLink
            subject={name}
            className="inline-flex items-center justify-center gap-2 rounded-[0.6rem] py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e1)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {tCta("bookNow")}
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
