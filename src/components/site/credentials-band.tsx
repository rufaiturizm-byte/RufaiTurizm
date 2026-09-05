import { getTranslations } from "next-intl/server";
import { BadgeCheck, Check } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * "Resmî Belgeler ve Ruhsatlar" bandı (rakip analizi, madde 8 — en güçlü
 * güven unsuru). Altın zemin üzerinde koyu kartlar.
 *
 * Bilerek veriye bağlı: `siteConfig.credentials` içindeki numara boşsa o
 * belge kartı hiç basılmaz, hiçbiri yoksa bölümün tamamı görünmez. Sahip
 * olmadığımız bir belgeyi "doğrulanmış" diye göstermek, bu bölümün çözmeye
 * çalıştığı güven sorununun ta kendisini yaratır.
 */
export async function CredentialsBand() {
  const t = await getTranslations("credentials");
  const { credentials } = siteConfig;

  const items = [
    { no: credentials.tursab, title: t("tursab"), desc: t("tursabDesc") },
    { no: credentials.uetds, title: t("uetds"), desc: t("uetdsDesc") },
    { no: credentials.ibb, title: t("ibb"), desc: t("ibbDesc") },
    { no: credentials.insurance, title: t("insurance"), desc: t("insuranceDesc") },
  ].filter((item) => item.no.length > 0);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "var(--brand-gold)" }}>
      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2
            className="text-[12px] font-extrabold tracking-[0.18em]"
            style={{ color: "color-mix(in oklab, var(--brand-night) 78%, var(--brand-gold))" }}
          >
            {t("label")}
          </h2>
          <p
            className="text-[13.5px]"
            style={{ color: "color-mix(in oklab, var(--brand-night) 72%, var(--brand-gold))" }}
          >
            {t("tagline")}
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="relative flex flex-col gap-2 rounded-lg p-5"
              style={{ background: "var(--brand-night)" }}
            >
              <BadgeCheck
                className="absolute end-4 top-4 size-4"
                style={{ color: "var(--brand-gold)" }}
                aria-hidden="true"
              />
              <div className="pe-6 text-[15px] font-bold text-white">{item.title}</div>
              <div className="flex-1 text-[12.5px] leading-relaxed text-white/60">
                {item.desc}
              </div>
              <div className="text-[12.5px] font-semibold text-white/80">
                No: {item.no}
              </div>
              <div
                className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-bold tracking-[0.06em]"
                style={{ color: "var(--brand-gold)" }}
              >
                <Check className="size-3.5" aria-hidden="true" />
                {t("verified")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
