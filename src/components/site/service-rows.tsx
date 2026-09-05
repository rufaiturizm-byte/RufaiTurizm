import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";
import { services } from "@/data/services";

/**
 * Hizmetler sayfasının gövdesi — dört büyük editoryal satır.
 *
 * Sayfa daha önce dört küçük yatay kart gösteriyordu ve her hizmet hakkında
 * TEK CÜMLE yazıyordu; ziyaretçi hizmetin ne olduğunu anlamak için detay
 * sayfasına gitmek zorundaydı. Oysa uzun metinler (`services.<key>.long`) ve
 * altı maddelik özellik listeleri (`.features`) mesaj dosyalarında zaten
 * yazılıydı — sadece detay sayfasında kullanılıyordu.
 *
 * Şimdi hepsi burada: sıra sıra, fotoğraf bir sağda bir solda. Sayfa dört
 * kartlık bir dizinden dört gerçek bölüme dönüşüyor, hem ziyaretçi hem
 * arama motoru için.
 */
export async function ServiceRows() {
  const t = await getTranslations("services");
  const tPage = await getTranslations("servicesPage");
  const tCommon = await getTranslations("common");
  const tCta = await getTranslations("cta");
  const tTours = await getTranslations("tours");

  return (
    <div className="flex flex-col">
      {services.map((service, index) => {
        const name = t(`${service.key}.title`);
        const features = t.raw(`${service.key}.features`) as string[];
        const href = {
          pathname: "/services/[slug]" as const,
          params: { slug: service.slug },
        };
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.key}
            id={service.slug}
            className="border-t first:border-t-0"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
              <div
                className={`relative aspect-[4/3] overflow-hidden ${flipped ? "lg:order-2" : ""}`}
                style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e2)" }}
              >
                <Image
                  src={service.image}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span
                  className="absolute start-4 top-4 rounded-[0.4rem] px-3 py-1.5 text-[11.5px] font-bold"
                  style={{
                    background: "var(--brand-gold)",
                    color: "var(--brand-night)",
                    boxShadow: "var(--shadow-e1)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={flipped ? "lg:order-1" : ""}>
                <h2 className="font-display text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] sm:text-[34px]">
                  {name}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.85] text-foreground/80">
                  {t(`${service.key}.long`)}
                </p>

                <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                      <Check
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: "var(--brand-gold-deep)" }}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-7 flex flex-wrap items-center gap-4 border-t pt-6"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <div className="me-2">
                    {service.priceFrom ? (
                      <>
                        <div className="text-[11.5px] text-muted-foreground">{tTours("from")}</div>
                        <div
                          className="text-[26px] font-extrabold leading-none"
                          style={{ color: "var(--brand-gold-deep)" }}
                        >
                          €{service.priceFrom}
                        </div>
                      </>
                    ) : (
                      <div className="text-[15.5px] font-bold">{tCommon("priceOnRequest")}</div>
                    )}
                  </div>

                  <WhatsAppLink
                    subject={name}
                    className="inline-flex items-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e1)" }}
                  >
                    <WhatsAppIcon className="size-[18px]" />
                    {tCta("bookNow")}
                  </WhatsAppLink>

                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-[0.7rem] border px-6 py-3.5 text-[14px] font-semibold transition-colors hover:bg-secondary"
                    style={{
                      borderColor: "color-mix(in oklab, var(--brand-night) 15%, transparent)",
                    }}
                  >
                    {tPage("featuresTitle")}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
