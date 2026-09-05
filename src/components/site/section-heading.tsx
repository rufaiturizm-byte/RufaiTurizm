import type { ReactNode } from "react";

/**
 * Bölüm başlığı.
 *
 * Düzen referans tasarımdan: üstte küçük harf aralıklı altın etiket ve onu
 * izleyen kısa çizgi, altında büyük serif başlık, yanında alt başlık, sağ
 * uçta ince çerçeveli eylem düğmesi. Etiketin yanındaki çizgi tek başına
 * sayfayı editoryal gösteren ayrıntı — sekiz bölümde de aynı hizada durur.
 */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  action,
  tone = "light",
  rule = true,
}: {
  eyebrow?: string;
  /** Etiketin başına konan küçük simge (SSS bölümündeki yıldız gibi). */
  eyebrowIcon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  /** Başlığın altındaki ayırıcı çizgi. */
  rule?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div
              className="eyebrow-rule mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em]"
              style={{ color: dark ? "var(--brand-gold)" : "var(--brand-gold-deep)" }}
            >
              {eyebrowIcon}
              {eyebrow}
            </div>
          ) : null}

          <h2
            className={`font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-[46px] ${
              dark ? "text-white" : ""
            }`}
          >
            {title}
          </h2>

          {subtitle ? (
            <p
              className={`mt-4 text-[15px] leading-[1.75] ${
                dark ? "text-white/62" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {action}
      </div>

      {rule ? (
        <div
          className="mt-8 h-px w-full"
          style={{
            background: dark
              ? "color-mix(in oklab, white 16%, transparent)"
              : "color-mix(in oklab, var(--brand-night) 11%, transparent)",
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * Bölüm başlıklarının sağındaki "Tüm turlar →" düğmesi. Referansta bu düğme
 * yumuşak köşeli bir dikdörtgen (hap değil) ve her bölümde birebir aynı.
 */
export function SectionAction({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <span
      className="inline-flex shrink-0 items-center gap-2.5 rounded-[0.7rem] border px-5 py-3 text-[13.5px] font-semibold transition-colors"
      style={
        dark
          ? { borderColor: "color-mix(in oklab, white 22%, transparent)", color: "#fff" }
          : { borderColor: "color-mix(in oklab, var(--brand-night) 16%, transparent)" }
      }
    >
      {children}
    </span>
  );
}
