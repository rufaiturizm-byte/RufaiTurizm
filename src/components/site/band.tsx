import type { ReactNode } from "react";

/**
 * Bölüm bandı — sayfayı bölümlere ayıran zemin.
 *
 * NEDEN VAR. Sayfa zemini krem (`--background: var(--brand-cream)`) ve
 * bölümlerin neredeyse hiçbirinin kendi zemini yoktu. Ölçüm: turlar
 * sayfasında arka arkaya on iki bölümün hiçbirinde zemin, çizgi ya da
 * ayırıcı yoktu. Sayfa tek bir krem alanda yüzen bloklar dizisi gibi
 * duruyordu; nerede bir konunun bittiği, nerede yenisinin başladığı
 * görünmüyordu.
 *
 * Kullanım kuralı basit ve sayfalar arasında aynı: OKUNAN bölümler
 * (açıklama, karar metni) kum zeminde, GEZİLEN bölümler (kart listeleri,
 * ızgaralar) sayfa zemininde. Böylece bant süsleme değil, "burada
 * okuyacaksın" demenin yolu oluyor.
 *
 * Çocukların kendi alt boşluğu (`pb-*`) korunuyor; bant yalnız üst
 * boşluğu ve zemini veriyor.
 */
export function Band({
  children,
  tone = "sand",
  className = "",
}: {
  children: ReactNode;
  /** `sand`: kum zemin. `night`: koyu bant — sayfada en fazla bir kez. */
  tone?: "sand" | "night";
  className?: string;
}) {
  const gece = tone === "night";

  return (
    <div
      className={`border-y ${className}`}
      style={{
        background: gece ? "var(--brand-night)" : "var(--brand-sand)",
        borderColor: gece
          ? "color-mix(in oklab, white 8%, transparent)"
          : "var(--hairline)",
      }}
    >
      {/* Bölüm açılışı masaüstünde daha cömert: 80 piksel her yerde
          aynıyken sayfa "eşit aralıklı modüller" gibi okunuyordu. */}
      <div className="pt-20 sm:pt-28">{children}</div>
    </div>
  );
}
