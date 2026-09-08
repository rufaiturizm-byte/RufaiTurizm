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
 *
 * KARTLARDA FOTOĞRAF YOK. Elimizde üç araç fotoğrafı var, kart dörttü;
 * biri iki kez kullanılıyordu ve /transfer sayfasında aynı Vito karesi
 * beş yerde birden çıkıyordu — hemen üstteki araç listesi zaten aracın
 * galerisini gösteriyor. Dört kez aynı minibüsü göstermek bu kartların
 * söylediği şeye (dört ayrı yolculuk biçimi) hiçbir şey katmıyordu;
 * simge daha net anlatıyor. Araç fotoğrafları araç listesinde duruyor.
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
    },
    {
      icon: MapPin,
      title: t("u2Title"),
      desc: t("u2Desc"),
      meta: t("u2Meta"),
    },
    {
      icon: Route,
      title: t("u3Title"),
      desc: t("u3Desc"),
      meta: t("u3Meta"),
    },
    {
      icon: CalendarClock,
      title: t("u4Title"),
      desc: t("u4Desc"),
      meta: t("u4Meta"),
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
        {uses.map(({ icon: Icon, title, desc, meta }) => (
          <article
            key={title}
            className="reveal-rise group flex flex-col overflow-hidden surface-card surface-card-lift"
          >
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-[0.8rem]"
                  style={{ background: "var(--brand-night)", color: "var(--brand-gold)" }}
                >
                  <Icon className="size-[19px]" aria-hidden="true" />
                </span>
                <span
                  className="inline-flex items-center rounded-[0.4rem] px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-night)" }}
                >
                  {t("vito.name")}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[17.5px] font-semibold leading-snug">{title}</h3>
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
                className="btn-wa mt-3.5 inline-flex items-center justify-center gap-2 rounded-[0.6rem] py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
