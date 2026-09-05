import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CalendarClock, MapPin, PlaneLanding, Route } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WhatsAppLink } from "./whatsapp-cta";
import { WhatsAppIcon } from "./icons";

/**
 * Araç ve kullanım biçimleri — dört kart.
 *
 * Rakiplerin "Filomuz" bölümü dört farklı araç sınıfı gösteriyor (sedan,
 * minivan, sprinter, VIP). Bizim tek aracımız var ve olmayan bir filoyu
 * varmış gibi göstermek, bu bölümün kazandırdığı güvenin tamamını ilk
 * karşılamada geri veriyor.
 *
 * Onun yerine dördü de aynı Vito ama DÖRT FARKLI YOLCULUK BİÇİMİ: havalimanı
 * transferi, şehir turu, şehirlerarası, emrinizde araç. Müşteri zaten bunları
 * arıyor ("havalimanı transfer", "şoförlü araç kiralama") — araç sınıfı değil.
 * Kartın altındaki not aynı araç olduğunu açıkça söylüyor.
 */
export async function FleetUses() {
  const t = await getTranslations("fleet");
  const tCta = await getTranslations("cta");
  const tEyebrow = await getTranslations("eyebrow");

  const uses = [
    {
      icon: PlaneLanding,
      title: t("u1Title"),
      desc: t("u1Desc"),
      meta: t("u1Meta"),
      image: "/images/vito-black.jpg",
      alt: t("exteriorAlt"),
    },
    {
      icon: MapPin,
      title: t("u2Title"),
      desc: t("u2Desc"),
      meta: t("u2Meta"),
      image: "/images/fleet/vito-exterior.jpg",
      alt: t("exteriorAlt"),
    },
    {
      icon: Route,
      title: t("u3Title"),
      desc: t("u3Desc"),
      meta: t("u3Meta"),
      image: "/images/fleet/vito-interior.jpg",
      alt: t("interiorAlt"),
    },
    {
      icon: CalendarClock,
      title: t("u4Title"),
      desc: t("u4Desc"),
      meta: t("u4Meta"),
      image: "/images/fleet/vito-cockpit.jpg",
      alt: t("cockpitAlt"),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <SectionHeading
        eyebrow={tEyebrow("fleet")}
        title={t("useTitle")}
        subtitle={t("useSubtitle")}
        rule={false}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {uses.map(({ icon: Icon, title, desc, meta, image, alt }) => (
          <article
            key={title}
            className="group flex flex-col overflow-hidden surface-card surface-card-lift"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-[0.4rem] px-2.5 py-1 text-[11px] font-bold"
                style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
              >
                {t("vito.name")}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span
                className="mb-3 inline-flex size-10 items-center justify-center rounded-full"
                style={{ background: "var(--brand-night)", color: "var(--brand-gold)" }}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>

              <h3 className="font-display text-[17.5px] font-semibold leading-snug">{title}</h3>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.7] text-muted-foreground">
                {desc}
              </p>

              <div
                className="mt-4 border-t pt-3.5 text-[12px] font-semibold"
                style={{ borderColor: "var(--hairline)", color: "var(--brand-gold-deep)" }}
              >
                {meta}
              </div>

              <WhatsAppLink
                subject={title}
                className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-[0.6rem] py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--brand-wa)", boxShadow: "var(--shadow-e1)" }}
              >
                <WhatsAppIcon className="size-4" />
                {tCta("bookNow")}
              </WhatsAppLink>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-muted-foreground">{t("sameVehicleNote")}</p>
    </section>
  );
}
