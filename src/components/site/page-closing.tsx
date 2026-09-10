import type { ReactNode } from "react";
import { ClosingCta } from "./transfer-sections";
import { RelatedLinks } from "./related-links";
import { CredentialsBand } from "./credentials-band";

/**
 * Sayfanın kapanış bölümü — tek bir bant.
 *
 * SORUN ÖLÇÜLDÜ. Her sayfa aynı üç bloğu arka arkaya basıyordu (kapanış
 * çağrısı, "keşfetmeye devam", belge bandı) ve üçü de sayfa zemininde
 * duruyordu. Sayfa zemini zaten krem olduğu için bu blokların hiçbirinin
 * arkası yoktu: turlar sayfasında arka arkaya ON İKİ bölümün hiçbirinde
 * zemin, çizgi ya da ayırıcı yoktu. Sonuç, bittiği belli olmayan ve her
 * sayfada aynı biçimde bitmeyen bir sayfa.
 *
 * Üçü artık tek bir kum rengi bantta ve bant tam genişlikte. Bu, sayfaya
 * "burada bitti" diyen tek işaret — üç ayrı modül yerine bir kapanış anı.
 *
 * `extra` ile sayfaya özel bir blok (SSS önizlemesi gibi) bandın başına
 * girebiliyor; böylece o da aynı kapanışın parçası oluyor, dördüncü bir
 * yığın olmuyor.
 */
export async function PageClosing({
  locale,
  exclude,
  extra,
}: {
  locale?: string;
  /** "Keşfetmeye devam" listesinden düşürülecek sayfalar. */
  exclude?: Parameters<typeof RelatedLinks>[0]["exclude"];
  /** Bandın başına giren sayfaya özel blok. */
  extra?: ReactNode;
}) {
  return (
    <div
      className="section-band border-t"
      style={{ background: "var(--brand-sand)", borderColor: "var(--hairline)" }}
    >
      <div className="pt-20">
        {extra}
        <ClosingCta locale={locale} />
        <RelatedLinks exclude={exclude} />
        <CredentialsBand />
      </div>
    </div>
  );
}
