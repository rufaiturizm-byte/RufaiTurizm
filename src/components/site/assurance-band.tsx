import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  CalendarX2,
  MoonStar,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { siteConfig } from "@/config/site";

/**
 * Rezervasyon güvenceleri.
 *
 * Sitedeki en güçlü güven unsurları SSS'in onuncu ve on birinci sırasında
 * gömülü duruyordu: ön ödeme istemiyoruz, 24 saat öncesine kadar ücretsiz
 * iptal. Körfez'den gelen bir aile için karar tam olarak bu iki cümlede
 * veriliyor — ilk kez çalışacağı, başka ülkedeki bir acenteye para
 * göndermeden rezervasyon yapabilmek. On ikinci soruya kadar okumayan
 * kişi bunu hiç görmüyordu.
 *
 * Altı maddenin hepsi ya UYDUĞUMUZ BİR KURAL ya da DOĞRULANABİLİR bir
 * kayıt. Geçmişe dair istatistik ya da "en iyi" türü sıfat bilerek yok:
 * bu bölümün işi iddia etmek değil, taahhüt etmek.
 *
 * Üçü ticari (ödeme, iptal, fiyat), ikisi kültürel (namaz ve helal yemek,
 * aile mahremiyeti), biri hukuki (TÜRSAB kaydı) — Körfez misafirinin
 * karar verirken sorduğu üç ayrı soru bunlar.
 */
export async function AssuranceBand() {
  const t = await getTranslations("assurance");

  const items = [
    { icon: Wallet, title: t("prepayTitle"), desc: t("prepayDesc") },
    { icon: CalendarX2, title: t("cancelTitle"), desc: t("cancelDesc") },
    { icon: BadgeCheck, title: t("priceTitle"), desc: t("priceDesc") },
    { icon: MoonStar, title: t("prayerTitle"), desc: t("prayerDesc") },
    { icon: Users, title: t("privacyTitle"), desc: t("privacyDesc") },
    {
      icon: ShieldCheck,
      title: t("licenseTitle"),
      desc: t("licenseDesc", { no: siteConfig.credentials.tursab }),
      href: siteConfig.tursabVerifyUrl,
      cta: t("verifyCta"),
    },
  ];

  return (
    <section
      className="relative isolate mt-4 overflow-hidden py-20"
      style={{ background: "var(--brand-night)" }}
    >
      <div className="pattern-constellation absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          tone="dark"
        />

        <div className="grid gap-px overflow-hidden lg:grid-cols-3"
          style={{
            background: "color-mix(in oklab, white 10%, transparent)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-e3)",
          }}
        >
          {items.map(({ icon: Icon, title, desc, ...rest }) => {
            const href = "href" in rest ? rest.href : undefined;
            const cta = "cta" in rest ? rest.cta : undefined;

            return (
              <div
                key={title}
                className="flex flex-col p-7"
                style={{ background: "var(--brand-night)" }}
              >
                <span className="icon-tile size-11" aria-hidden="true">
                  <Icon className="size-5" />
                </span>

                <h3 className="mt-5 text-[15.5px] font-bold leading-snug text-white">{title}</h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.8] text-white/62">{desc}</p>

                {href && cta ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center rounded-full border px-4 py-2 text-[12.5px] font-bold transition-colors hover:bg-white/8"
                    style={{
                      borderColor: "color-mix(in oklab, var(--brand-gold) 46%, transparent)",
                      color: "var(--brand-gold)",
                    }}
                  >
                    {cta}
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
