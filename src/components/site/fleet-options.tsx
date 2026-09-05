import { getTranslations } from "next-intl/server";
import { Bus, Car, MessageCircle, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";

/**
 * Araç seçenekleri.
 *
 * Bilerek fotoğrafsız: elimizde yalnız bir aracın fotoğrafı var, aynı
 * fotoğrafı üç kez koymak ya da stok görsel kullanmak sahip olmadığımız
 * bir filoyu ima eder. Kendi araç fotoğraflarınız geldiğinde kartlara
 * görsel eklenir (refs/NOTLAR.md, madde 19).
 */
export async function FleetOptions() {
  const t = await getTranslations("fleet");
  const tPage = await getTranslations("servicesPage");
  const tCta = await getTranslations("cta");

  const items = [
    { key: "vito", icon: Car },
    { key: "sprinter", icon: Bus },
    { key: "sedan", icon: Car },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
      <SectionHeading title={tPage("fleetTitle")} subtitle={tPage("fleetSubtitle")} />

      <div className="grid gap-5 sm:grid-cols-3">
        {items.map(({ key, icon: Icon }) => (
          <div key={key} className="flex flex-col rounded-lg border bg-card p-6">
            <Icon
              className="size-8"
              style={{ color: "var(--brand-gold-deep)" }}
              aria-hidden="true"
            />
            <h3 className="mt-4 text-[16.5px] font-bold">{t(`${key}.name`)}</h3>
            <div className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {t(`${key}.capacity`)}
            </div>
            <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              {t(`${key}.desc`)}
            </p>
            <WhatsAppLink
              subject={t(`${key}.name`)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-wa)" }}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {tCta("bookNow")}
            </WhatsAppLink>
          </div>
        ))}
      </div>
    </section>
  );
}
