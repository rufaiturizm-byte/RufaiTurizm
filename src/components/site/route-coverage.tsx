import { getTranslations } from "next-intl/server";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { routeGroups } from "@/data/routes";
import type { Locale } from "@/i18n/routing";

/**
 * Hizmet verdiğimiz noktalar.
 *
 * Sayfanın arama motorundaki tutunma yüzeyi. Önceki hali tek bir çip
 * dizisiydi ve on şehir adı taşıyordu; müşteri ise "havalimanından
 * Taksim'e transfer" diye arıyor. Semtler ve destinasyonlar gruplu
 * yazılınca hem o aramalarla eşleşiyoruz hem de ziyaretçi kendi
 * gideceği yeri listede görüyor — kapsamı iddia etmek yerine gösteriyoruz.
 *
 * Her çip WhatsApp'a gidiyor ve mesajın içine kendi adını yazıyor:
 * "Taksim" çipine dokunan kişi konuşmaya "Taksim" yazılı başlıyor.
 */
export async function RouteCoverage({ locale }: { locale: string }) {
  const t = await getTranslations("routes");
  const tCta = await getTranslations("cta");
  const lang = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {routeGroups.map((group) => {
          const title = group.title[lang] ?? group.title.tr;

          return (
            <article
              key={group.key}
              className="flex flex-col p-6 surface-card sm:p-7"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--brand-night)", color: "var(--brand-gold)" }}
                >
                  <MapPin className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-[18px] font-semibold leading-snug">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">
                    {group.note[lang] ?? group.note.tr}
                  </p>
                </div>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.stops.map((stop) => {
                  const name = stop[lang] ?? stop.tr;
                  return (
                    <li key={name}>
                      <WhatsAppLink
                        subject={`${title} — ${name}`}
                        className="inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-secondary"
                        style={{
                          borderColor: "color-mix(in oklab, var(--brand-night) 13%, transparent)",
                        }}
                      >
                        {name}
                      </WhatsAppLink>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>

      <div
        className="mt-6 flex flex-col items-start gap-4 rounded-[var(--radius-card)] border px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: "color-mix(in oklab, var(--brand-gold) 12%, transparent)",
          borderColor: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
        }}
      >
        <p className="max-w-2xl text-[13.5px] leading-[1.7]">{t("priceNote")}</p>
        <WhatsAppLink
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.7rem] px-5 py-3 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
        >
          {tCta("whatsapp")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </WhatsAppLink>
      </div>
    </section>
  );
}
