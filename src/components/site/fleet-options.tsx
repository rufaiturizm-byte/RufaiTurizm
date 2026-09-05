import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Bus, Car, MessageCircle, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";

/**
 * Araç seçenekleri.
 *
 * Vito öne çıkarılıyor: en çok tercih edilen araç ve elimizde gerçekten
 * gösterebileceğimiz kareler onun. Sprinter ve sedan için doğrulanmış
 * fotoğrafımız yok; kötü ya da yanıltıcı bir stok kare koymaktansa ikon
 * kartı olarak duruyorlar (refs/NOTLAR.md, madde 19). Kendi araç
 * fotoğraflarınız gelince public/images/fleet/ içindekileri değiştirmek
 * yeterli — kod aynı kalır.
 */
export async function FleetOptions() {
  const t = await getTranslations("fleet");
  const tPage = await getTranslations("servicesPage");
  const tCta = await getTranslations("cta");

  const others = [
    { key: "sprinter", icon: Bus },
    { key: "sedan", icon: Car },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={tPage("fleetTitle")} subtitle={tPage("fleetSubtitle")} />

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[280px]">
            <Image
              src="/images/fleet/vito-interior.jpg"
              alt={t("interiorAlt")}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative hidden aspect-[4/3] sm:block sm:aspect-auto sm:min-h-[280px]">
            <Image
              src="/images/fleet/vito-cockpit.jpg"
              alt={t("cockpitAlt")}
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <h3 className="text-[19px] font-bold">{t("vito.name")}</h3>
            <div className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {t("vito.capacity")}
            </div>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              {t("vito.desc")}
            </p>
          </div>
          <WhatsAppLink
            subject={t("vito.name")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-6 py-3 text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-wa)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {tCta("bookNow")}
          </WhatsAppLink>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {others.map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-start gap-4 rounded-lg border bg-card p-6">
            <Icon
              className="mt-0.5 size-7 shrink-0"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <div className="flex-1">
              <h3 className="text-[16px] font-bold">{t(`${key}.name`)}</h3>
              <div className="mt-1.5 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                <Users className="size-3.5" aria-hidden="true" />
                {t(`${key}.capacity`)}
              </div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {t(`${key}.desc`)}
              </p>
              <WhatsAppLink
                subject={t(`${key}.name`)}
                className="mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-wa)" }}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {tCta("bookNow")}
              </WhatsAppLink>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12.5px] text-muted-foreground">{t("stockNote")}</p>
    </section>
  );
}
