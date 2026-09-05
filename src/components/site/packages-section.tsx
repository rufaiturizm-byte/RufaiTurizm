import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { packages } from "@/data/packages";
import type { Locale } from "@/i18n/routing";

/**
 * Çok günlük paket programları bölümü (rakip analizi, madde 1).
 *
 * `src/data/packages.ts` boşken hiç render edilmez — program ve fiyat
 * uydurmuyoruz. Fiyatı olmayan pakette tek çıkış yolu WhatsApp olduğu için
 * en güçlü düğme oraya konuyor (madde 17).
 */
export async function PackagesSection({ locale }: { locale: string }) {
  if (packages.length === 0) return null;

  const t = await getTranslations("packages");
  const tCommon = await getTranslations("common");
  const tTours = await getTranslations("tours");
  const tCta = await getTranslations("cta");
  const tEyebrow = await getTranslations("eyebrow");

  const lang = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading eyebrow={tEyebrow("packages")} title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((item) => {
          const name = item.name[lang] ?? item.name.tr;

          return (
            <article
              key={item.slug}
              className="flex flex-col overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <span
                  className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11.5px] font-bold text-white"
                  style={{ background: "var(--brand-night)" }}
                >
                  <CalendarDays className="size-3" aria-hidden="true" />
                  {item.days} {t("days")}
                </span>
                {item.discountPercent ? (
                  <span
                    className="absolute end-0 top-0 px-3.5 py-2 text-[13px] font-extrabold text-white"
                    style={{
                      background: "var(--brand-wa)",
                      borderEndStartRadius: "0.625rem",
                    }}
                  >
                    %{item.discountPercent}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15.5px] font-bold">{name}</h3>
                <div className="mt-2 flex flex-1 items-start gap-1.5 text-[13px] text-muted-foreground">
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0"
                    style={{ color: "var(--brand-gold-deep)" }}
                    aria-hidden="true"
                  />
                  {item.city[lang] ?? item.city.tr}
                </div>

                <div className="mt-3.5 min-h-[58px] border-t pt-3">
                  {item.priceUsdFrom ? (
                    <>
                      <div className="text-[11.5px] text-muted-foreground">
                        {tTours("from")}
                      </div>
                      <div
                        className="mt-0.5 text-[22px] font-extrabold"
                        style={{ color: "var(--brand-gold-deep)" }}
                      >
                        ${item.priceUsdFrom}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[15px] font-bold">
                        {tCommon("priceOnRequest")}
                      </div>
                      <div className="mt-1 text-[12.5px] text-muted-foreground">
                        {tCommon("contactForPrice")}
                      </div>
                    </>
                  )}
                </div>

                <WhatsAppLink
                  subject={name}
                  className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-md py-3 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--brand-wa)" }}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {tCta("bookNow")}
                </WhatsAppLink>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
