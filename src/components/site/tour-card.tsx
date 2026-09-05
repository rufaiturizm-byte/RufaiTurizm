import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "./whatsapp-cta";
import type { Tour } from "@/data/tours";

/**
 * Tur kartı.
 *
 * Rakip analizinden üç ekleme (madde 2, 4, 7): şehir rozeti, euro fiyatın
 * yanında USD karşılığı ve kartın kendi WhatsApp düğmesi. Kart sarmalayıcısı
 * bilerek <article>: WhatsApp düğmesi iç içe bağlantı olmasın diye başlık ve
 * düğme ayrı ayrı bağlantı.
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
          className="absolute start-3 top-3 rounded px-2.5 py-1 text-[11.5px] font-bold"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {t(`${tour.key}.city`)}
        </span>
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded bg-white/92 px-2.5 py-1 text-[11.5px] font-semibold text-black">
          <Clock className="size-3" aria-hidden="true" />
          {tour.durationHours} {tPage("hours")}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15.5px] font-bold">
          <Link href={href} className="transition-colors hover:text-[color:var(--brand-gold-deep)]">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
          {t(`${tour.key}.description`)}
        </p>

        <div className="mt-3.5 border-t pt-3">
          <div className="text-[11.5px] text-muted-foreground">{t("from")}</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span
              className="text-[21px] font-extrabold"
              style={{ color: "var(--brand-gold-deep)" }}
            >
              €{tour.priceFrom}
            </span>
            <span className="text-[13px] text-muted-foreground">
              ≈ ${tour.priceUsdFrom}
            </span>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2">
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-full border py-2.5 text-[13px] font-semibold transition-colors hover:bg-secondary"
          >
            {tCommon("details")}
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <WhatsAppLink
            subject={name}
            className="inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--brand-wa)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {tCta("bookNow")}
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
