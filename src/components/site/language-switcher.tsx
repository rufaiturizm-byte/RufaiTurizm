"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = { ar: "AR", tr: "TR", en: "EN" };

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-0.5 rounded-md p-0.5"
      style={{ background: "var(--brand-night-2)" }}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace({ pathname, params } as never, { locale: l })}
          aria-current={l === locale ? "true" : undefined}
          className="rounded px-2.5 py-1 text-[12px] font-semibold transition-colors"
          style={
            l === locale
              ? { background: "var(--brand-gold)", color: "var(--brand-night)" }
              : { color: "rgba(255,255,255,0.55)" }
          }
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
