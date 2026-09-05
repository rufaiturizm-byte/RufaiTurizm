import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BadgeCheck, Gauge, UserRound } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { WhatsAppLink } from "./whatsapp-cta";

/**
 * VIP transfer bandı.
 *
 * Sayfanın sonuna doğru gelen ikinci büyük çağrı. Fotoğraf sağda, metin
 * solda ve aralarında yatay bir gradyan var: aracın farları görünür kalıyor
 * ama başlık okunaklı bir zemin üzerinde duruyor. Alt sıradaki üç söz,
 * "lüks" iddiasını somut üç maddeye bağlıyor — iddia tek başına kalınca
 * inandırıcı olmuyor.
 */
export async function VipBand({ locale }: { locale: string }) {
  const t = await getTranslations("home2");
  const tCta = await getTranslations("cta");

  const features = [
    { icon: Gauge, title: t("vipF1Title"), desc: t("vipF1Desc") },
    { icon: UserRound, title: t("vipF2Title"), desc: t("vipF2Desc") },
    { icon: BadgeCheck, title: t("vipF3Title"), desc: t("vipF3Desc") },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <div
        className="relative isolate overflow-hidden"
        style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e3)" }}
      >
        <Image
          src="/images/vito-black.jpg"
          alt={locale === "ar" ? "سيارة فيتو VIP" : "VIP Vito aracı"}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          quality={60}
          className="-z-10 object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-10 scrim-x scrim-x-soft"
        />

        <div className="px-7 py-12 sm:px-12 sm:py-14">
          <div className="max-w-xl">
            <div
              className="eyebrow-rule mb-4 flex items-center text-[11px] font-extrabold uppercase tracking-[0.22em]"
              style={{ color: "var(--brand-gold)" }}
            >
              {t("vipEyebrow")}
            </div>

            <h2 className="max-w-[19ch] font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.015em] text-white sm:text-[38px]">
              {t("vipTitle")}
            </h2>
            <p className="mt-4 max-w-md text-[14.5px] leading-[1.8] text-white/72">
              {t("vipText")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <WhatsAppLink
                className="inline-flex items-center gap-2.5 rounded-[0.7rem] px-6 py-3.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
                style={{
                  background: "var(--brand-gold)",
                  color: "var(--brand-night)",
                  boxShadow: "var(--shadow-e2)",
                }}
              >
                <WhatsAppIcon className="size-4" />
                {tCta("whatsapp")}
              </WhatsAppLink>

              <WhatsAppLink
                subject={t("vipTitle")}
                className="inline-flex items-center gap-2.5 rounded-[0.7rem] border px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "color-mix(in oklab, white 32%, transparent)" }}
              >
                {tCta("bookNow")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>

          <div
            className="mt-11 grid gap-y-6 border-t pt-7 sm:grid-cols-3 sm:gap-x-8"
            style={{ borderColor: "color-mix(in oklab, white 16%, transparent)" }}
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 size-5 shrink-0"
                  style={{ color: "var(--brand-gold)" }}
                  aria-hidden="true"
                />
                <div>
                  <div className="text-[14px] font-bold text-white">{title}</div>
                  <div className="mt-1 text-[12.5px] leading-snug text-white/55">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
