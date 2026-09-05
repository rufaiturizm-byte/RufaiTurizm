import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  CalendarCheck,
  Languages,
  MessagesSquare,
  PlaneLanding,
  ShieldCheck,
  Smile,
  Star,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { siteConfig } from "@/config/site";

/**
 * Güven şeridi + istatistikler.
 *
 * Referans tasarımda bu ikisi ayrı bölüm değil, üst üste binmiş TEK bir
 * kart: koyu lacivert üst şerit ve altında açık zeminli rakam şeridi.
 * Ayrı iki tam genişlik bandı olarak durduklarında sayfa "şerit üstüne
 * şerit" gibi okunuyordu; tek kartta toplanınca transfer formunun devamı
 * gibi duruyor ve sayfanın üst yarısı tek bir blok halinde bitiyor.
 *
 * Rakamlar ekranda sayarak yükseliyor; TÜRSAB metin olarak kalıyor —
 * bir belge numarası "sayılacak" bir şey değil.
 */
/** Koyu zeminli dört söz. Ana sayfada rakamların üstünde, hizmet
 *  sayfalarında tek başına kullanılır. */
async function PromiseStrip() {
  const t = await getTranslations("trustBoxes");

  const promises = [
    { icon: PlaneLanding, title: t("airports"), desc: t("airportsDesc") },
    { icon: BadgeCheck, title: t("fixed"), desc: t("fixedDesc") },
    { icon: Languages, title: t("driver"), desc: t("driverDesc") },
    { icon: MessagesSquare, title: t("support"), desc: t("supportDesc") },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--brand-night)" }}>
      {promises.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          /* Ayırıcı çizgi sütun sayısını izler: tek sütunda üstte,
             iki sütunda yanda + ikinci satırda üstte, dörtte yalnız yanda. */
          className="flex items-center gap-4 px-6 py-6 not-first:border-t sm:not-first:border-t-0 sm:not-nth-[2n+1]:border-s sm:nth-[n+3]:border-t lg:nth-[n+3]:border-t-0 lg:not-first:border-s"
          style={{ borderColor: "color-mix(in oklab, white 9%, transparent)" }}
        >
          <span className="icon-tile size-11 shrink-0">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="text-[14.5px] font-bold leading-snug text-white">{title}</div>
            <div className="mt-1 text-[12.5px] leading-snug text-white/55">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Hizmet sayfalarındaki tek başına güven şeridi. */
export async function TrustBoxes() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
      <div
        className="overflow-hidden"
        style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e2)" }}
      >
        <PromiseStrip />
      </div>
    </section>
  );
}

export async function TrustStats() {
  const tStats = await getTranslations("stats");

  const stats = [
    {
      icon: Smile,
      prefix: "+",
      value: 12000,
      decimals: 0,
      suffix: "",
      label: tStats("guestsLabel"),
      desc: tStats("guestsDesc"),
    },
    {
      icon: Star,
      prefix: "",
      value: 4.9,
      decimals: 1,
      suffix: " / 5",
      label: tStats("ratingLabel"),
      desc: tStats("ratingDesc"),
    },
    {
      icon: CalendarCheck,
      prefix: "",
      value: 2015,
      decimals: 0,
      suffix: "",
      label: tStats("sinceLabel"),
      desc: tStats("sinceDesc"),
    },
    {
      icon: ShieldCheck,
      text: "TÜRSAB",
      label: tStats("licenseLabel"),
      desc: tStats("licenseDesc", { no: siteConfig.credentials.tursab }),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8">
      <div
        className="overflow-hidden"
        style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-e2)" }}
      >
        <PromiseStrip />

        {/* Alt şerit — rakamlar, açık zeminde */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: "var(--surface)" }}
        >
          {stats.map(({ icon: Icon, ...stat }) => (
            <div
              key={stat.label}
              className="flex items-start gap-4 px-6 py-9 not-first:border-t sm:not-first:border-t-0 sm:not-nth-[2n+1]:border-s sm:nth-[n+3]:border-t lg:nth-[n+3]:border-t-0 lg:not-first:border-s"
              style={{ borderColor: "var(--hairline)" }}
            >
              <span
                className="mt-1 inline-flex size-12 shrink-0 items-center justify-center rounded-full border"
                style={{
                  borderColor: "color-mix(in oklab, var(--brand-gold) 55%, transparent)",
                  background: "color-mix(in oklab, var(--brand-gold) 14%, transparent)",
                  color: "var(--brand-gold-deep)",
                }}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <div className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                  {"text" in stat ? (
                    stat.text
                  ) : (
                    <>
                      {stat.prefix}
                      <NumberTicker value={stat.value} decimalPlaces={stat.decimals} />
                      <span className="text-[24px] text-muted-foreground">{stat.suffix}</span>
                    </>
                  )}
                </div>
                <div
                  className="mt-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em]"
                  style={{ color: "var(--brand-gold-deep)" }}
                >
                  {stat.label}
                </div>
                <div className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">
                  {stat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
