import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ArrowRightLeft,
  Building2,
  Camera,
  Crown,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading, SectionAction } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { Reveal } from "./reveal";
import { services, type ServiceKey } from "@/data/services";

/**
 * Ana sayfadaki hizmet özeti.
 *
 * Ana sayfa hizmetlerden hiç söz etmiyordu: menüde "Hizmetlerimiz" yazıyor
 * ama ana sayfaya inen ziyaretçi transferi, turu ve rezervasyonu hiç
 * görmeden aşağı kayıyordu. Kartlar kısa tutuldu; ayrıntı hizmet sayfasında.
 *
 * Fotoğrafın alt kenarına binen yuvarlak simge referanstan: dört fotoğraf
 * yan yana gelince hangisinin hangi hizmet olduğu okumadan anlaşılmıyordu,
 * simge o ayrımı bir bakışta veriyor.
 */

const ICONS: Record<ServiceKey, typeof Crown> = {
  vitoVip: Crown,
  transfer: ArrowRightLeft,
  tours: Camera,
  flightHotel: Building2,
};

export async function ServicesOverview() {
  const t = await getTranslations("services");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tPage = await getTranslations("servicesPage");
  const tEyebrow = await getTranslations("eyebrow");
  const tHome2 = await getTranslations("home2");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-24 pb-16 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("services")}
        title={t("title")}
        subtitle={t("subtitle")}
        rule={false}
        action={
          <Link href="/services">
            <SectionAction>
              {tPage("allServices")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </SectionAction>
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const name = t(`${service.key}.title`);
          const Icon = ICONS[service.key];
          const href = {
            pathname: "/services/[slug]" as const,
            params: { slug: service.slug },
          };

          return (
            <Reveal key={service.key} delay={index * 0.08} className="flex">
              <article className="group flex w-full flex-col overflow-hidden surface-card surface-card-lift">
                <div className="relative">
                  <Link href={href} className="relative block aspect-[16/11] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <span
                    className="absolute -bottom-6 start-5 inline-flex size-12 items-center justify-center rounded-full"
                    style={{
                      background: "var(--brand-night)",
                      color: "var(--brand-gold)",
                      boxShadow: "var(--shadow-e2)",
                    }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pt-10 pb-5">
                  <h3 className="font-display text-[18px] font-semibold leading-snug">
                    <Link
                      href={href}
                      className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                    >
                      {name}
                    </Link>
                  </h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                    {t(`${service.key}.description`)}
                  </p>

                  <div
                    className="mt-5 flex items-end justify-between gap-3 border-t pt-4"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <div>
                      {service.priceFrom ? (
                        <>
                          <div className="text-[17px] font-extrabold leading-none">
                            €{service.priceFrom}
                          </div>
                          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">
                            {t("priceFrom")}
                          </div>
                        </>
                      ) : (
                        <div className="max-w-[92px] text-[13px] font-bold leading-tight">
                          {tCommon("priceOnRequest")}
                        </div>
                      )}
                    </div>

                    <WhatsAppLink
                      subject={name}
                      className="inline-flex shrink-0 items-center gap-2 rounded-[0.6rem] px-3.5 py-2.5 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e1)" }}
                    >
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      {tCta("bookNow")}
                    </WhatsAppLink>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Fiyatı olmayan hizmet için tek çıkış yolu: kişiye özel teklif. */}
      <div
        className="mt-8 flex flex-col items-start gap-5 rounded-[var(--radius-card)] border px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--hairline)",
          boxShadow: "var(--shadow-e1)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
          >
            <PhoneCall className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display text-[17px] font-semibold">{tHome2("quoteTitle")}</div>
            <p className="mt-1 text-[13.5px] text-muted-foreground">{tHome2("quoteText")}</p>
          </div>
        </div>

        <WhatsAppLink
          subject={tHome2("quoteTitle")}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
          style={{
            background: "var(--brand-gold)",
            color: "var(--brand-night)",
            boxShadow: "var(--shadow-e1)",
          }}
        >
          {tHome2("quoteCta")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </WhatsAppLink>
      </div>
    </section>
  );
}
