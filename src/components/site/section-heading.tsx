import type { ReactNode } from "react";

/**
 * Bölüm başlığı kalıbı: solda altın dikey çubuk, başlık, altında tek satır
 * açıklama, sağ uçta isteğe bağlı bağlantı. Rakiplerin her iki sitesinde de
 * aynı kalıp kullanılıyor (rakip analizi, madde 14).
 */
export function SectionHeading({
  title,
  subtitle,
  action,
  tone = "light",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex gap-3.5">
        <span
          className="w-1 shrink-0 rounded-sm"
          style={{ background: "var(--brand-gold)" }}
          aria-hidden="true"
        />
        <div>
          <h2
            className={`text-[26px] font-bold sm:text-[30px] ${dark ? "text-white" : ""}`}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className={`mt-2 text-[14.5px] ${dark ? "text-white/65" : "text-muted-foreground"}`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
