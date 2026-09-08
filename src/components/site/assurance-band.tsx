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
    { icon: Wallet, title: t("prepayTitle"), desc: t("prepayDesc"), wide: true },
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
      wide: true,
    },
  ];

  return (
    <section
      className="relative isolate mt-4 overflow-hidden py-20"
      style={{ background: "var(--brand-night)" }}
    >
      <div className="aurora-veil -z-10" aria-hidden="true" />
      <div className="pattern-constellation absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          tone="dark"
        />

        {/*
          Altı madde tek bir ince çizgili ızgaradaydı: hepsi aynı düz
          lacivert hücrede, hiçbiri diğerinden öne çıkmıyor ve blok
          uzaktan tek bir gri kütle gibi okunuyordu. Oysa bunlar sayfanın
          en güçlü kartları.

          Artık her madde kendi kartında (`surface-card-dark` — globals.css'te
          yazılıydı ama sitede hiç kullanılmıyordu) ve TÜRSAB kaydı geniş
          duruyor: tek DOĞRULANABİLİR madde o, kalan beşi bizim
          taahhüdümüz. Doğrulama bağı da orada, yani en çok yer hak eden
          kart aynı zamanda tıklanabilir olanı.
        */}
        {/*
          DÖRT sütun, iki kart iki sütun geniş. Üç sütunda denendi ve
          tutmadı: altı maddeden biri geniş olunca yedi birim ediyor,
          üçe bölünmüyor ve son satırda boşluk kalıyordu. Dörtte
          2+1+1 ve 1+1+2 olarak tam oturuyor.

          Geniş olan ikisi rastgele seçilmedi. Bu bileşenin kendi
          notunda yazdığı gibi karar iki cümlede veriliyor: ön ödeme
          istemememiz (ticari) ve TÜRSAB kaydı (hukuki, tek
          DOĞRULANABİLİR madde — doğrulama bağı da onda).
        */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc, ...rest }) => {
            const href = "href" in rest ? rest.href : undefined;
            const cta = "cta" in rest ? rest.cta : undefined;
            const wide = "wide" in rest ? rest.wide : false;

            return (
              <div
                key={title}
                className={`reveal-rise surface-card-dark surface-card-dark-lift flex flex-col p-7 ${
                  wide ? "lg:col-span-2" : ""
                }`}
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
