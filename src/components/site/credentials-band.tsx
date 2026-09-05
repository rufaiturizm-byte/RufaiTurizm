import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Belge bandı (rakip analizi, madde 8 — en güçlü güven unsuru).
 *
 * Önceki hali altın zemin üzerinde dört koyu kartlık bir ızgaraydı: elimizde
 * tek belge varken dört kutuluk bir düzen kurmak, üçünün boş kalmasıyla
 * sonuçlanıyordu. Referanstaki düzen tek satır: solda çerçeveli belge
 * görseli, ortada belge bilgisi ve doğrulama bağlantısı, sağda ayırıcının
 * ardından sigorta sözü.
 *
 * Veriye bağlı: `siteConfig.credentials.tursab` boşsa bölüm hiç basılmaz.
 * Sahip olmadığımız bir belgeyi "doğrulanmış" diye göstermek, bu bölümün
 * çözmeye çalıştığı güven sorununun ta kendisini yaratır.
 */
export async function CredentialsBand() {
  const t = await getTranslations("credentials");
  const { credentials } = siteConfig;

  if (!credentials.tursab) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
      <div
        className="grid items-center gap-8 border px-6 py-7 sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:gap-10"
        style={{
          background: "var(--surface)",
          borderColor: "var(--hairline)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-e1)",
        }}
      >
        {/* Amblem kırmızı-gri: krem zeminde okunmuyor, o yüzden kendi
            altın çerçeveli beyaz kutusunda duruyor. */}
        <div
          className="flex w-fit items-center justify-center rounded-[0.7rem] border-4 bg-white px-6 py-5"
          style={{ borderColor: "color-mix(in oklab, var(--brand-gold) 62%, transparent)" }}
        >
          <Image
            src="/brand/tursab.png"
            alt={t("logoAlt")}
            width={176}
            height={44}
            className="h-[38px] w-auto"
          />
        </div>

        <div>
          <p className="max-w-md text-[15.5px] font-semibold leading-snug">{t("tursabDesc")}</p>
          <p className="mt-2.5 text-[14px] font-bold">
            {t("docNo")}: {credentials.tursab}
          </p>
          <a
            href={siteConfig.tursabVerifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[13.5px] font-semibold underline-offset-4 hover:underline"
            style={{ color: "var(--brand-gold-deep)" }}
          >
            {t("verifyCta")}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        <div
          className="flex items-center gap-4 border-t pt-6 lg:border-t-0 lg:border-s lg:ps-10 lg:pt-0"
          style={{ borderColor: "var(--hairline)" }}
        >
          <ShieldCheck
            className="size-8 shrink-0"
            style={{ color: "var(--brand-gold-deep)" }}
            aria-hidden="true"
          />
          <p className="max-w-[15rem] text-[14px] leading-[1.7] text-muted-foreground">
            {t("assurance")}
          </p>
        </div>
      </div>
    </section>
  );
}
