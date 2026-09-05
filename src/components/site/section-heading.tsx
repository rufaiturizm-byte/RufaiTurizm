import type { ReactNode } from "react";

/**
 * Bölüm başlığı.
 *
 * Önceki hali her bölümde aynı kalıbı tekrarlıyordu: soldaki altın çubuk +
 * başlık + alt başlık. Sekiz bölüm art arda gelince sayfa şablon gibi
 * okunuyordu. Şimdiki düzen editoryal: üstte küçük harf aralıklı etiket,
 * altında büyük ve sıkı başlık, sağda ince bir çizgiyle ayrılan eylem.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div className="mb-9">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div
              className="mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.22em]"
              style={{ color: "var(--brand-gold-deep)" }}
            >
              {eyebrow}
            </div>
          ) : null}

          <h2
            className={`text-[30px] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[38px] ${
              dark ? "text-white" : ""
            }`}
          >
            {title}
          </h2>

          {subtitle ? (
            <p
              className={`mt-3.5 text-[15px] leading-[1.75] ${
                dark ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {action}
      </div>

      <div
        className="mt-7 h-px w-full"
        style={{
          background: dark
            ? "color-mix(in oklab, white 16%, transparent)"
            : "color-mix(in oklab, var(--brand-night) 12%, transparent)",
        }}
      />
    </div>
  );
}
