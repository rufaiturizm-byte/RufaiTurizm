import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { Reveal } from "./reveal";
import { services } from "@/data/services";

/**
 * Ana sayfadaki hizmet özeti.
 *
 * Ana sayfa hizmetlerden hiç söz etmiyordu: menüde "Hizmetlerimiz" yazıyor
 * ama ana sayfaya inen ziyaretçi transferi, turu ve rezervasyonu hiç
 * görmeden aşağı kayıyordu. Kartlar kısa tutuldu; ayrıntı hizmet sayfasında.
 */
export async function ServicesOverview() {
  const t = await getTranslations("services");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tPage = await getTranslations("servicesPage");
  const tEyebrow = await getTranslations("eyebrow");

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("services")}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-secondary"
          >
            {tPage("allServices")}
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const name = t(`${service.key}.title`);
          const href = {
            pathname: "/services/[slug]" as const,
            params: { slug: service.slug },
          };

          return (
            <Reveal key={service.key} delay={index * 0.08} className="flex">
              <article className="group flex w-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
              <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15.5px] font-bold">
                  <Link
                    href={href}
                    className="transition-colors hover:text-[color:var(--brand-gold-deep)]"
                  >
                    {name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                  {t(`${service.key}.description`)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3.5">
                  <span className="text-[13px] font-semibold">
                    {service.priceFrom ? `€${service.priceFrom}` : tCommon("priceOnRequest")}
                  </span>
                  <WhatsAppLink
                    subject={name}
                    className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--brand-wa)" }}
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
    </section>
  );
}
