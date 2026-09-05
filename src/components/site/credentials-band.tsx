import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BadgeCheck, Check, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * "Resmî Belgeler ve Ruhsatlar" bandı (rakip analizi, madde 8 — en güçlü
 * güven unsuru). Altın zemin üzerinde koyu kartlar.
 *
 * Veriye bağlı: `siteConfig.credentials` içindeki numara boşsa o belge
 * kartı hiç basılmaz, hiçbiri yoksa bölümün tamamı görünmez. Sahip
 * olmadığımız bir belgeyi "doğrulanmış" diye göstermek, bu bölümün çözmeye
 * çalıştığı güven sorununun ta kendisini yaratır.
 *
 * TÜRSAB kartı ayrıca resmî kayda bağlantı verir: rozeti gösterip
 * doğrulatmamak, Ortadoğu pazarında rozetin kendisi kadar şüphe uyandırıyor.
 */
export async function CredentialsBand() {
  const t = await getTranslations("credentials");
  const { credentials } = siteConfig;

  const items = [
    {
      no: credentials.tursab,
      title: t("tursab"),
      desc: t("tursabDesc"),
      logo: "/brand/tursab.png",
      verifyUrl: siteConfig.tursabVerifyUrl,
    },
    { no: credentials.uetds, title: t("uetds"), desc: t("uetdsDesc"), logo: null, verifyUrl: "" },
    { no: credentials.ibb, title: t("ibb"), desc: t("ibbDesc"), logo: null, verifyUrl: "" },
    {
      no: credentials.insurance,
      title: t("insurance"),
      desc: t("insuranceDesc"),
      logo: null,
      verifyUrl: "",
    },
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

        <div
          className={`grid gap-3.5 sm:grid-cols-2 ${items.length > 2 ? "lg:grid-cols-4" : ""}`}
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="relative flex flex-col gap-3 rounded-lg p-5"
              style={{ background: "var(--brand-night)" }}
            >
              <BadgeCheck
                className="absolute end-4 top-4 size-4"
                style={{ color: "var(--brand-gold)" }}
                aria-hidden="true"
              />

              {item.logo ? (
                /* Amblem kırmızı-gri: altın bantta da lacivert kartta da
                   okunmuyor, o yüzden kendi beyaz kutusunda duruyor. */
                <span className="inline-flex w-fit rounded-md bg-white px-3.5 py-2.5">
                  <Image
                    src={item.logo}
                    alt={t("logoAlt")}
                    width={132}
                    height={33}
                    className="h-[26px] w-auto"
                  />
                </span>
              ) : (
                <div className="pe-6 text-[15px] font-bold text-white">{item.title}</div>
              )}

              <div className="flex-1 text-[12.5px] leading-relaxed text-white/60">
                {item.desc}
              </div>

              <div className="text-[12.5px] font-semibold text-white/85">
                {t("docNo")}: {item.no}
              </div>

              {item.verifyUrl ? (
                <a
                  href={item.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold tracking-[0.04em] underline-offset-4 hover:underline"
                  style={{ color: "var(--brand-gold)" }}
                >
                  {t("verifyCta")}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : (
                <div
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold tracking-[0.06em]"
                  style={{ color: "var(--brand-gold)" }}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {t("verified")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
